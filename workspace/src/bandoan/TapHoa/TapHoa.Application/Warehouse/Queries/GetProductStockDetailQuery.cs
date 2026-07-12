using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public record GetProductStockDetailQuery(Guid ProductId) : IRequest<ProductStockDetailDto>;

public class ProductStockDetailDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = default!;
    public string? Barcode { get; set; }
    public string Unit { get; set; } = default!;
    public int CurrentStock { get; set; }
    public decimal AverageCost { get; set; }
    public decimal TotalValue { get; set; }
    public int ReorderPoint { get; set; }
    public List<StockMovementDto> Movements { get; set; } = new();
}

public class StockMovementDto
{
    public Guid TransactionId { get; set; }
    public string TransactionCode { get; set; } = default!;
    public string TypeName { get; set; } = default!;
    public TransactionType Type { get; set; }
    public string StatusName { get; set; } = default!;
    public DateTime Date { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public string? ReferenceId { get; set; }
    public string? Notes { get; set; }
    public string CreatedBy { get; set; } = default!;
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public decimal LineTotal { get; set; }
    public int RunningBalance { get; set; } // Tồn kho tại thời điểm này
}

public class GetProductStockDetailQueryHandler : IRequestHandler<GetProductStockDetailQuery, ProductStockDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetProductStockDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductStockDetailDto> Handle(GetProductStockDetailQuery request, CancellationToken cancellationToken)
    {
        var companyId = _context.CurrentCompanyId;

        // 1. Get product info
        var product = await _context.Products
            .Where(p => p.Id == request.ProductId)
            .Select(p => new { p.Id, p.Name, p.Barcode, p.Unit })
            .FirstOrDefaultAsync(cancellationToken);

        if (product == null)
            throw new Exception($"Product {request.ProductId} not found.");

        // 2. Get current stock level
        var stockLevel = await _context.StockLevels
            .Where(s => s.ProductId == request.ProductId && s.StoreId == companyId)
            .FirstOrDefaultAsync(cancellationToken);

        // 3. Get ALL completed transaction lines for this product, oldest first
        var movements = await (
            from tl in _context.InventoryTransactionLines
            join t in _context.InventoryTransactions on tl.TransactionId equals t.Id
            where tl.ProductId == request.ProductId
                  && t.Status == TransactionStatus.Completed
            orderby t.ApprovedAt ?? t.CreatedAt ascending
            select new
            {
                t.Id,
                t.Code,
                t.Type,
                t.Status,
                t.CreatedAt,
                t.ApprovedAt,
                t.ReferenceId,
                t.Notes,
                t.CreatedBy,
                tl.Quantity,
                tl.UnitCost
            }
        ).ToListAsync(cancellationToken);

        // 4. Calculate running balance
        int runningBalance = 0;
        var movementDtos = new List<StockMovementDto>();

        foreach (var m in movements)
        {
            // Inbound/Adjustment(+) increase, Outbound/Wastage decrease
            int delta;
            switch (m.Type)
            {
                case TransactionType.Inbound:
                    delta = m.Quantity;
                    break;
                case TransactionType.Outbound:
                case TransactionType.Wastage:
                    delta = -m.Quantity;
                    break;
                case TransactionType.Adjustment:
                    delta = m.Quantity; // Can be positive or negative
                    break;
                default:
                    delta = m.Quantity;
                    break;
            }

            runningBalance += delta;

            movementDtos.Add(new StockMovementDto
            {
                TransactionId = m.Id,
                TransactionCode = m.Code,
                Type = m.Type,
                TypeName = GetTypeName(m.Type),
                StatusName = m.Status.ToString(),
                Date = m.CreatedAt,
                ApprovedDate = m.ApprovedAt,
                ReferenceId = m.ReferenceId,
                Notes = m.Notes,
                CreatedBy = m.CreatedBy,
                Quantity = m.Quantity,
                UnitCost = m.UnitCost,
                LineTotal = m.Quantity * m.UnitCost,
                RunningBalance = runningBalance
            });
        }

        // Reverse so newest is first in the list
        movementDtos.Reverse();

        return new ProductStockDetailDto
        {
            ProductId = product.Id,
            ProductName = product.Name,
            Barcode = product.Barcode,
            Unit = product.Unit,
            CurrentStock = stockLevel?.QuantityOnHand ?? 0,
            AverageCost = stockLevel?.MovingAverageCost ?? 0,
            TotalValue = (stockLevel?.QuantityOnHand ?? 0) * (stockLevel?.MovingAverageCost ?? 0),
            ReorderPoint = stockLevel?.ReorderPoint ?? 0,
            Movements = movementDtos
        };
    }

    private static string GetTypeName(TransactionType type) => type switch
    {
        TransactionType.Inbound => "Nhập kho",
        TransactionType.Outbound => "Xuất kho",
        TransactionType.Wastage => "Hủy/Hỏng",
        TransactionType.Adjustment => "Điều chỉnh",
        TransactionType.Transfer => "Chuyển kho",
        _ => type.ToString()
    };
}
