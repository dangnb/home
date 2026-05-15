using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Infrastructure.Data;
using SalesManagement.Domain.Entities;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.WMS.Commands;

public record ApproveTransactionCommand(Guid TransactionId) : IRequest<bool>;

public class ApproveTransactionCommandHandler : IRequestHandler<ApproveTransactionCommand, bool>
{
    private readonly ApplicationDbContext _db;

    public ApproveTransactionCommandHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<bool> Handle(ApproveTransactionCommand request, CancellationToken cancellationToken)
    {
        using var transaction = await _db.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var inventoryTransaction = await _db.InventoryTransactions
                .Include(t => t.Details)
                .FirstOrDefaultAsync(t => t.Id == request.TransactionId && t.Status == TransactionStatus.DRAFT, cancellationToken);

            if (inventoryTransaction == null) 
                throw new Exception("Không tìm thấy phiếu hoặc phiếu đã được duyệt/huỷ.");

            var warehouseId = inventoryTransaction.WarehouseId;
            var isOutbound = inventoryTransaction.Type == TransactionType.OUT;

            foreach (var detail in inventoryTransaction.Details)
            {
                var changeQty = isOutbound ? -detail.Quantity : detail.Quantity;

                var stockBalance = await _db.StockBalances
                    .FirstOrDefaultAsync(sb => sb.WarehouseId == warehouseId && sb.ProductId == detail.ProductId, cancellationToken);
                
                if (stockBalance == null)
                {
                    if (isOutbound) throw new Exception($"Sản phẩm {detail.ProductId} không có sẵn trong kho.");
                    
                    stockBalance = new StockBalance 
                    { 
                        Id = Guid.NewGuid(), WarehouseId = warehouseId, ProductId = detail.ProductId, Quantity = 0 
                    };
                    await _db.StockBalances.AddAsync(stockBalance, cancellationToken);
                }

                if (isOutbound && stockBalance.Quantity < detail.Quantity)
                    throw new Exception("Số lượng tồn không đủ để xuất.");

                // Cập nhật tồn
                stockBalance.Quantity += changeQty;

                // Ghi thẻ kho
                var ledger = new StockLedger
                {
                    Id = Guid.NewGuid(),
                    WarehouseId = warehouseId,
                    ProductId = detail.ProductId,
                    TransactionId = inventoryTransaction.Id,
                    ChangeQuantity = changeQty,
                    BalanceAfter = stockBalance.Quantity,
                    CreatedAt = DateTime.UtcNow
                };
                await _db.StockLedgers.AddAsync(ledger, cancellationToken);
            }

            inventoryTransaction.Status = TransactionStatus.COMPLETED;

            await _db.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return true;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
