using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.PurchaseOrders.DTOs;
using TapHoa.Domain.Enums;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.PurchaseOrders.Commands;

public record UpdatePurchaseOrderStatusCommand(Guid Id, UpdatePurchaseOrderStatusDto Dto) : IRequest<bool>;

public class UpdatePurchaseOrderStatusCommandHandler : IRequestHandler<UpdatePurchaseOrderStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdatePurchaseOrderStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdatePurchaseOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var po = await _context.PurchaseOrders
            .Include(p => p.PurchaseOrderDetails)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (po == null) return false;

        // Allow amount paid update if provided
        if (request.Dto.AmountPaid.HasValue)
        {
            po.UpdateAmountPaid(request.Dto.AmountPaid.Value);
        }

        // Handle Status Change
        if (po.Status != request.Dto.Status)
        {
            if (request.Dto.Status == PurchaseOrderStatus.Completed && po.Status != PurchaseOrderStatus.Completed)
            {
                // When Completed: 
                // 1. Create Inbound InventoryTransaction
                var txCode = $"TX-IN-{DateTime.UtcNow:yyyyMMddHHmmss}";
                var tx = new InventoryTransaction(
                    txCode,
                    TransactionType.Inbound,
                    po.Id.ToString(),
                    _currentUserService.UserId ?? "System",
                    $"Nhập hàng từ đơn mua hàng {po.OrderCode}"
                );

                foreach (var detail in po.PurchaseOrderDetails)
                {
                    tx.AddLine(detail.ProductId, detail.Quantity, detail.CostPrice);

                    // Update StockLevel
                    var stockLevel = await _context.StockLevels
                        .FirstOrDefaultAsync(s => s.ProductId == detail.ProductId, cancellationToken);
                    
                    if (stockLevel == null)
                    {
                        stockLevel = new StockLevel(detail.ProductId, po.CompanyId);
                        _context.StockLevels.Add(stockLevel);
                    }
                    stockLevel.IncreaseStock(detail.Quantity, detail.CostPrice);
                }
                
                _context.InventoryTransactions.Add(tx);

                // 2. Create Supplier Debt if AmountPaid < TotalAmount
                if (po.AmountPaid < po.TotalAmount)
                {
                    var debtAmount = po.TotalAmount - po.AmountPaid;
                    var debt = await _context.SupplierDebts
                        .Include(d => d.Supplier)
                        .FirstOrDefaultAsync(d => d.SupplierId == po.SupplierId, cancellationToken);

                    if (debt == null)
                    {
                        var supplier = await _context.Suppliers.FindAsync(po.SupplierId);
                        debt = new SupplierDebt(po.SupplierId, supplier?.FullName ?? "Unknown Supplier", supplier?.PhoneNumber);
                        _context.SupplierDebts.Add(debt);
                    }

                    debt.AddDebt(debtAmount);

                    var debtTx = SupplierDebtTransaction.CreateDebt(
                        po.SupplierId,
                        debtAmount,
                        $"Nợ từ đơn mua hàng {po.OrderCode}"
                    );
                    _context.SupplierDebtTransactions.Add(debtTx);
                }
            }
            
            po.UpdateStatus(request.Dto.Status);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
