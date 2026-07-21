using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Orders.Commands;

public record ApproveOrderCommand(Guid OrderId) : IRequest<bool>;

public class ApproveOrderCommandHandler : IRequestHandler<ApproveOrderCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ApproveOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ApproveOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
            throw new DomainException("Đơn hàng không tồn tại.");

        if (order.Status != OrderStatus.Pending)
            throw new DomainException("Chỉ có thể duyệt đơn hàng đang ở trạng thái Chờ duyệt (Pending).");

        order.Complete(order.TotalAmount); // Mark as completed and paid (for COD, we assume paid when completed, or we can handle delivery separately. For this phase, Complete = Approved & Processed).

        // Deduct inventory & Create InventoryTransaction
        var invTx = new InventoryTransaction($"TXO-{order.OrderCode}", TransactionType.Outbound, order.OrderCode, _currentUserService.UserName ?? "System", "Xuất kho bán hàng Web");
        invTx.SetPaymentDetails(order.TotalAmount, customerId: order.CustomerId);
        
        foreach(var detail in order.OrderDetails)
        {
            invTx.AddLine(detail.ProductId, detail.Quantity, detail.UnitPrice);

            var stockLevel = await _context.StockLevels
                .FirstOrDefaultAsync(x => x.ProductId == detail.ProductId, cancellationToken);
            
            if (stockLevel != null)
            {
                stockLevel.DecreaseStock(detail.Quantity);
            }

            // Update product stock cache
            var product = await _context.Products.FindAsync(new object[] { detail.ProductId }, cancellationToken);
            if (product != null)
            {
                product.UpdateStockCache(product.StockQuantity - detail.Quantity);
            }
        }

        invTx.SubmitForApproval();
        invTx.Approve(_currentUserService.UserName ?? "System");

        _context.InventoryTransactions.Add(invTx);

        // Accumulate Loyalty Points for customer
        if (order.CustomerId.HasValue && order.PaymentMethod != PaymentMethod.Debt)
        {
            var customer = await _context.Customers.FindAsync(new object[] { order.CustomerId.Value }, cancellationToken);
            if (customer != null)
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
        }

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
