using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.Sales.Commands;

public record ApproveSalesOrderCommand(Guid SalesOrderId, Guid WarehouseId) : IRequest<bool>;

public class ApproveSalesOrderCommandHandler : IRequestHandler<ApproveSalesOrderCommand, bool>
{
    private readonly IApplicationDbContext _db;
    public ApproveSalesOrderCommandHandler(IApplicationDbContext db) => _db = db;

    public async Task<bool> Handle(ApproveSalesOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _db.SalesOrders.Include(o => o.Details)
                        .FirstOrDefaultAsync(o => o.Id == request.SalesOrderId, cancellationToken);
        
        if (order == null || order.Status != OrderStatus.DRAFT) 
            throw new Exception("Order not found or already processed.");

        order.Status = OrderStatus.APPROVED;

        // Generate WMS Outbound Transaction
        var transaction = new InventoryTransaction
        {
            Id = Guid.NewGuid(),
            Code = $"OUT-{order.Code}",
            Type = TransactionType.OUT,
            WarehouseId = request.WarehouseId,
            Note = $"Auto-generated for Sales Order {order.Code}",
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
