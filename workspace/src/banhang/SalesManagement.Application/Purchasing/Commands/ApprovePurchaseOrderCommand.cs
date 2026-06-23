using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.Purchasing.Commands;

public record ApprovePurchaseOrderCommand(Guid PurchaseOrderId, Guid WarehouseId) : IRequest<bool>;

public class ApprovePurchaseOrderCommandHandler : IRequestHandler<ApprovePurchaseOrderCommand, bool>
{
    private readonly IApplicationDbContext _db;
    public ApprovePurchaseOrderCommandHandler(IApplicationDbContext db) => _db = db;

    public async Task<bool> Handle(ApprovePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _db.PurchaseOrders.Include(o => o.Details)
                        .FirstOrDefaultAsync(o => o.Id == request.PurchaseOrderId, cancellationToken);
        
        if (order == null || order.Status != OrderStatus.DRAFT) 
            throw new Exception("Order not found or already processed.");

        order.Status = OrderStatus.APPROVED;

        // Generate WMS Inbound Transaction
        var transaction = new InventoryTransaction
        {
            Id = Guid.NewGuid(),
            Code = $"IN-{order.Code}",
            Type = TransactionType.IN,
            WarehouseId = request.WarehouseId,
            Note = $"Auto-generated for Purchase Order {order.Code}",
            Status = TransactionStatus.DRAFT,
            CreatedBy = Guid.Empty,
            CreatedAt = DateTime.UtcNow,
            Details = order.Details.Select(d => new TransactionDetail
            {
                Id = Guid.NewGuid(),
                ProductId = d.ProductId,
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice
            }).ToList()
        };
        await _db.InventoryTransactions.AddAsync(transaction, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }
}
