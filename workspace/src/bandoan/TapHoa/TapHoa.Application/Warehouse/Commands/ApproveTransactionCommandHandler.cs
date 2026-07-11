using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
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

            if (transaction.Type == TapHoa.Domain.Enums.TransactionType.Inbound || 
                (transaction.Type == TapHoa.Domain.Enums.TransactionType.Adjustment && line.Quantity > 0))
            {
                if (stockLevel == null)
                {
                    stockLevel = new StockLevel(line.ProductId, currentCompanyId, null, line.ProductBatchId);
                    _context.StockLevels.Add(stockLevel);
                }

                var absQuantity = Math.Abs(line.Quantity);
                stockLevel.IncreaseStock(absQuantity, line.UnitCost);
                if (product != null) product.UpdateStockCache(product.StockQuantity + absQuantity);
                if (batch != null) batch.AddStock(absQuantity);
            }
            else if (transaction.Type == TapHoa.Domain.Enums.TransactionType.Outbound || 
                     transaction.Type == TapHoa.Domain.Enums.TransactionType.Wastage ||
                     (transaction.Type == TapHoa.Domain.Enums.TransactionType.Adjustment && line.Quantity < 0))
            {
                if (stockLevel == null)
                    throw new DomainException($"Vật tư {product?.Name ?? line.ProductId.ToString()} chưa có trong kho hoặc lô không hợp lệ.");

                var absQuantity = Math.Abs(line.Quantity);
                stockLevel.DecreaseStock(absQuantity);
                if (product != null) product.UpdateStockCache(product.StockQuantity - absQuantity);
                if (batch != null) batch.RemoveStock(absQuantity);
            }
        }

        // NOTE: Single SaveChangesAsync at the end for atomicity — 
        // stock changes and debt records are committed together.

        // Auto-create debt if AmountPaid < TotalAmount
        decimal totalAmount = transaction.Lines.Sum(l => l.Quantity * l.UnitCost);
        decimal debtAmount = totalAmount - transaction.AmountPaid;

        if (debtAmount > 0)
        {
            if (transaction.Type == TapHoa.Domain.Enums.TransactionType.Inbound && transaction.SupplierId.HasValue)
            {
                var supplierDebt = await _context.SupplierDebts.FirstOrDefaultAsync(d => d.SupplierId == transaction.SupplierId.Value, cancellationToken);
                if (supplierDebt == null)
                {
                    var supplier = await _context.Suppliers.FindAsync(new object[] { transaction.SupplierId.Value }, cancellationToken);
                    if (supplier != null)
                    {
                        supplierDebt = SupplierDebt.Create(supplier.Id, supplier.FullName, supplier.PhoneNumber);
                        _context.SupplierDebts.Add(supplierDebt);
                    }
                }
                
                if (supplierDebt != null)
                {
                    supplierDebt.AddDebt(debtAmount);
                    var debtTransaction = SupplierDebtTransaction.CreateDebt(transaction.SupplierId.Value, debtAmount, "Nợ từ phiếu nhập: " + transaction.Code);
                    _context.SupplierDebtTransactions.Add(debtTransaction);
                }
            }
            else if (transaction.Type == TapHoa.Domain.Enums.TransactionType.Outbound && transaction.CustomerId.HasValue)
            {
                var customerDebt = await _context.CustomerDebts.FirstOrDefaultAsync(d => d.CustomerId == transaction.CustomerId.Value, cancellationToken);
                if (customerDebt == null)
                {
                    var customer = await _context.Customers.FindAsync(new object[] { transaction.CustomerId.Value }, cancellationToken);
                    if (customer != null)
                    {
                        customerDebt = CustomerDebt.Create(customer.Id, customer.FullName, customer.PhoneNumber);
                        _context.CustomerDebts.Add(customerDebt);
                    }
                }

                if (customerDebt != null)
                {
                    customerDebt.AddDebt(debtAmount);
                    var debtTransaction = CustomerDebtTransaction.CreateDebt(transaction.CustomerId.Value, debtAmount, "Nợ từ phiếu xuất: " + transaction.Code);
                    _context.CustomerDebtTransactions.Add(debtTransaction);
                }
            }
        }

        // Single atomic save for all changes (stock + debt)
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
