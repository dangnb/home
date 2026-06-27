using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Warehouse.Commands;

public class ApproveTransactionCommandHandler : IRequestHandler<ApproveTransactionCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ApproveTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ApproveTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _context.InventoryTransactions
            .Include(t => t.Lines)
            .FirstOrDefaultAsync(t => t.Id == request.TransactionId, cancellationToken);

        if (transaction == null)
            throw new DomainException("Transaction not found.");

        if (transaction.Status == TapHoa.Domain.Enums.TransactionStatus.Completed)
            throw new DomainException("Transaction is already completed.");

        if (transaction.Status == TapHoa.Domain.Enums.TransactionStatus.Cancelled)
            throw new DomainException("Transaction is cancelled.");

        // Fast-track workflow for Draft -> PendingApproval -> Completed
        if (transaction.Status == TapHoa.Domain.Enums.TransactionStatus.Draft)
            transaction.SubmitForApproval();

        if (transaction.Status == TapHoa.Domain.Enums.TransactionStatus.PendingApproval)
            transaction.Approve(request.ApprovedBy);

        var currentCompanyId = _context.CurrentCompanyId;

        // Apply physical stock movements
        foreach (var line in transaction.Lines)
        {
            // Find existing stock level for this Product + Location + Batch
            var stockLevel = await _context.StockLevels
                .FirstOrDefaultAsync(s => s.ProductId == line.ProductId 
                                     && s.StoreId == currentCompanyId
                                     && s.BatchId == line.ProductBatchId, cancellationToken);

            var product = await _context.Products.FindAsync(new object[] { line.ProductId }, cancellationToken);
            var batch = line.ProductBatchId.HasValue 
                ? await _context.ProductBatches.FindAsync(new object[] { line.ProductBatchId.Value }, cancellationToken) 
                : null;

            if (transaction.Type == TapHoa.Domain.Enums.TransactionType.Inbound)
            {
                if (stockLevel == null)
                {
                    stockLevel = new StockLevel(line.ProductId, currentCompanyId, null, line.ProductBatchId);
                    _context.StockLevels.Add(stockLevel);
                }

                stockLevel.IncreaseStock(line.Quantity, line.UnitCost);
                if (product != null) product.UpdateStockCache(product.StockQuantity + line.Quantity);
                if (batch != null) batch.AddStock(line.Quantity);
            }
            else if (transaction.Type == TapHoa.Domain.Enums.TransactionType.Outbound)
            {
                if (stockLevel == null)
                    throw new DomainException($"Vật tư {product?.Name ?? line.ProductId.ToString()} chưa có trong kho hoặc lô không hợp lệ.");

                stockLevel.DecreaseStock(line.Quantity);
                if (product != null) product.UpdateStockCache(product.StockQuantity - line.Quantity);
                if (batch != null) batch.RemoveStock(line.Quantity);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
