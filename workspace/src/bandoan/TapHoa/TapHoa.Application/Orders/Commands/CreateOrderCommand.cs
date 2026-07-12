using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Orders.Commands;

public record OrderItemDto(Guid ProductId, int Quantity, decimal UnitPrice);

public record CreateOrderCommand(
    Guid? CustomerId,
    List<OrderItemDto> Items,
    decimal DiscountAmount,
    Guid? PromotionId,
    decimal AmountPaid,
    PaymentMethod PaymentMethod,
    string? Notes,
    int PointsToUse = 0
) : IRequest<Guid>;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("Đơn hàng phải có ít nhất 1 sản phẩm.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0.");
            item.RuleFor(i => i.UnitPrice).GreaterThanOrEqualTo(0).WithMessage("Đơn giá không hợp lệ.");
        });
    }
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Generate OrderCode — use IgnoreQueryFilters to prevent duplicates with soft-deleted records
        var orderCount = await _context.Orders.IgnoreQueryFilters().CountAsync(cancellationToken);
        var orderCode = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{(orderCount + 1):D4}";

        var order = new Order(
            orderCode,
            request.CustomerId,
            request.PaymentMethod,
            _currentUserService.UserName ?? "System",
            request.Notes ?? ""
        );

        foreach (var item in request.Items)
        {
            order.AddDetail(item.ProductId, item.Quantity, item.UnitPrice);
        }

        // Validate Promotion before applying
        if (request.PromotionId.HasValue)
        {
            var promotion = await _context.Promotions.FindAsync(new object[] { request.PromotionId.Value }, cancellationToken);
            if (promotion == null)
                throw new DomainException("Khuyến mãi không tồn tại.");
            if (!promotion.IsActive)
                throw new DomainException("Khuyến mãi đã ngừng hoạt động.");
            if (promotion.StartDate.HasValue && DateTime.UtcNow < promotion.StartDate.Value)
                throw new DomainException("Khuyến mãi chưa bắt đầu.");
            if (promotion.EndDate.HasValue && DateTime.UtcNow > promotion.EndDate.Value)
                throw new DomainException("Khuyến mãi đã hết hạn.");
            if (promotion.MinOrderAmount > 0 && order.SubTotal < promotion.MinOrderAmount)
                throw new DomainException($"Đơn hàng chưa đạt giá trị tối thiểu {promotion.MinOrderAmount:N0}₫ để áp dụng khuyến mãi.");
        }

        order.ApplyDiscount(request.DiscountAmount, request.PromotionId);

        Customer? customer = null;
        if (request.CustomerId.HasValue)
        {
            customer = await _context.Customers.FindAsync(new object[] { request.CustomerId.Value }, cancellationToken);
            if (customer != null && request.PointsToUse > 0)
            {
                customer.UsePoints(request.PointsToUse);
                decimal pointDiscount = request.PointsToUse * 100m; // 1 point = 100 VND
                order.ApplyPoints(request.PointsToUse, pointDiscount);
            }
        }

        order.Complete(request.AmountPaid);

        _context.Orders.Add(order);

        // Deduct inventory & Create InventoryTransaction
        var invTx = new InventoryTransaction($"TXO-{orderCode}", TransactionType.Outbound, orderCode, _currentUserService.UserName ?? "System", "Xuất kho bán hàng POS");
        invTx.SetPaymentDetails(request.AmountPaid, customerId: request.CustomerId);
        
        foreach(var item in request.Items)
        {
            invTx.AddLine(item.ProductId, item.Quantity, item.UnitPrice);

            var stockLevel = await _context.StockLevels
                .FirstOrDefaultAsync(x => x.ProductId == item.ProductId, cancellationToken);
            
            if (stockLevel != null)
            {
                stockLevel.DecreaseStock(item.Quantity);
            }

            // Update product stock cache
            var product = await _context.Products.FindAsync(new object[] { item.ProductId }, cancellationToken);
            if (product != null)
            {
                product.UpdateStockCache(product.StockQuantity - item.Quantity);
            }
        }

        invTx.SubmitForApproval();
        invTx.Approve(_currentUserService.UserName ?? "System");

        _context.InventoryTransactions.Add(invTx);

        // Handle Customer Debt
        if (request.PaymentMethod == PaymentMethod.Debt && request.CustomerId.HasValue && customer != null)
        {
            var customerDebt = await _context.CustomerDebts
                    .FirstOrDefaultAsync(x => x.CustomerId == request.CustomerId.Value, cancellationToken);
                
                if (customerDebt == null)
                {
                    customerDebt = new CustomerDebt(request.CustomerId.Value, customer!.FullName, customer.PhoneNumber);
                    _context.CustomerDebts.Add(customerDebt);
                }

                customerDebt.AddDebt(order.TotalAmount);
                var debtTx = CustomerDebtTransaction.CreateDebt(request.CustomerId.Value, order.TotalAmount, $"Nợ đơn hàng {orderCode}");
                _context.CustomerDebtTransactions.Add(debtTx);
        }

        // Accumulate Loyalty Points for customer (1 point per 10,000₫ spent)
        if (customer != null && request.PaymentMethod != PaymentMethod.Debt)
        {
            decimal multiplier = customer.Tier switch
            {
                CustomerTier.Platinum => 2.0m,
                CustomerTier.Gold => 1.5m,
                CustomerTier.Silver => 1.2m,
                _ => 1.0m
            };

            var pointsEarned = (int)(order.TotalAmount / 10000m * multiplier);
            if (pointsEarned > 0)
            {
                customer.AddPoints(pointsEarned);
                order.SetPointsEarned(pointsEarned);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return order.Id;
    }
}

