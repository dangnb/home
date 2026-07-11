using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Orders.Commands;

public record OrderItemDto(Guid ProductId, int Quantity, decimal UnitPrice);

public record CreateOrderCommand(
    Guid? CustomerId,
    List<OrderItemDto> Items,
    decimal DiscountAmount,
    Guid? PromotionId,
    decimal AmountPaid,
    PaymentMethod PaymentMethod,
    string? Notes
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
        // Generate OrderCode
        var orderCount = await _context.Orders.CountAsync(cancellationToken);
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

        order.ApplyDiscount(request.DiscountAmount, request.PromotionId);
        order.Complete(request.AmountPaid);

        _context.Orders.Add(order);

        // Deduct inventory & Create InventoryTransaction
        var invTx = new InventoryTransaction($"TXO-{orderCode}", TransactionType.Outbound, orderCode, _currentUserService.UserName ?? "System", "Xuất kho bán hàng POS");
        invTx.SetPaymentDetails(request.AmountPaid, customerId: request.CustomerId);
        
        foreach(var item in request.Items)
        {
            invTx.AddLine(item.ProductId, item.Quantity, item.UnitPrice);

            // Deduct stock (simplified logic without batch handling for now)
            var stockLevel = await _context.StockLevels
                .FirstOrDefaultAsync(x => x.ProductId == item.ProductId, cancellationToken);
            
            if (stockLevel != null)
            {
                stockLevel.DecreaseStock(item.Quantity);
            }
        }

        invTx.SubmitForApproval();
        invTx.Approve(_currentUserService.UserName ?? "System");

        _context.InventoryTransactions.Add(invTx);

        // Handle Customer Debt
        if (request.PaymentMethod == PaymentMethod.Debt && request.CustomerId.HasValue)
        {
            var customer = await _context.Customers.FindAsync(new object[] { request.CustomerId.Value }, cancellationToken);
            if (customer != null)
            {
                var customerDebt = await _context.CustomerDebts
                    .FirstOrDefaultAsync(x => x.CustomerId == request.CustomerId.Value, cancellationToken);
                
                if (customerDebt == null)
                {
                    customerDebt = new CustomerDebt(request.CustomerId.Value, customer.FullName, customer.PhoneNumber);
                    _context.CustomerDebts.Add(customerDebt);
                }

                customerDebt.AddDebt(order.TotalAmount);
                var debtTx = CustomerDebtTransaction.CreateDebt(request.CustomerId.Value, order.TotalAmount, $"Nợ đơn hàng {orderCode}");
                _context.CustomerDebtTransactions.Add(debtTx);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return order.Id;
    }
}
