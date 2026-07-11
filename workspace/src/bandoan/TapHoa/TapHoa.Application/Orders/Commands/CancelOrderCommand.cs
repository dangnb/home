using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Orders.Commands;

public record CancelOrderCommand(Guid OrderId) : IRequest<bool>;

public class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CancelOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
            throw new DomainException("Đơn hàng không tồn tại.");

        // Cancel the order (domain logic validates status)
        order.Cancel();

        // Reverse inventory: restore stock for each item
        foreach (var detail in order.OrderDetails)
        {
            var stockLevel = await _context.StockLevels
                .FirstOrDefaultAsync(x => x.ProductId == detail.ProductId, cancellationToken);

            if (stockLevel != null)
            {
                // Restore stock — use current MovingAverageCost since we don't track original cost
                stockLevel.IncreaseStock(detail.Quantity, stockLevel.MovingAverageCost);
            }

            // Update product stock cache
            var product = await _context.Products.FindAsync(new object[] { detail.ProductId }, cancellationToken);
            if (product != null)
            {
                product.UpdateStockCache(product.StockQuantity + detail.Quantity);
            }
        }

        // Reverse debt if payment method was Debt
        if (order.PaymentMethod == PaymentMethod.Debt && order.CustomerId.HasValue)
        {
            var customerDebt = await _context.CustomerDebts
                .FirstOrDefaultAsync(x => x.CustomerId == order.CustomerId.Value, cancellationToken);

            if (customerDebt != null && customerDebt.TotalDebt >= order.TotalAmount)
            {
                customerDebt.PayDebt(order.TotalAmount);

                var reversalTx = Domain.Entities.CustomerDebtTransaction.CreatePayment(
                    order.CustomerId.Value,
                    order.TotalAmount,
                    $"Hoàn nợ do hủy đơn {order.OrderCode}"
                );
                _context.CustomerDebtTransactions.Add(reversalTx);
            }
        }

        // Reverse loyalty points if applicable
        if (order.CustomerId.HasValue && order.PaymentMethod != PaymentMethod.Debt)
        {
            var customer = await _context.Customers.FindAsync(new object[] { order.CustomerId.Value }, cancellationToken);
            if (customer != null)
            {
                var pointsToRevoke = (int)(order.TotalAmount / 10000);
                if (pointsToRevoke > 0 && customer.LoyaltyPoints >= pointsToRevoke)
                {
                    customer.UsePoints(pointsToRevoke);
                }
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
