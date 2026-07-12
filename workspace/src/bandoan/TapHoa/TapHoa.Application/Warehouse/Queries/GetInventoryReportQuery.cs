using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public record GetInventoryReportQuery(DateTime FromDate, DateTime ToDate) : IRequest<InventoryReportSummary>;

public class InventoryReportDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = default!;
    public string? Barcode { get; set; }
    public string Unit { get; set; } = default!;
    public int OpeningStock { get; set; }
    public int TotalInbound { get; set; }
    public int TotalOutbound { get; set; }
    public int TotalWastage { get; set; }
    public int TotalAdjustment { get; set; }
    public int ClosingStock { get; set; }
    public decimal AverageCost { get; set; }
    public decimal InventoryValue { get; set; }
    public int ReorderPoint { get; set; }
}

public class InventoryReportSummary
{
    public int TotalSku { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public int LowStockCount { get; set; }
    public int OutOfStockCount { get; set; }
    public List<InventoryReportDto> Items { get; set; } = new();
}

public class GetInventoryReportQueryHandler : IRequestHandler<GetInventoryReportQuery, InventoryReportSummary>
{
    private readonly IApplicationDbContext _context;

    public GetInventoryReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryReportSummary> Handle(GetInventoryReportQuery request, CancellationToken cancellationToken)
    {
        var companyId = _context.CurrentCompanyId;
        var fromDate = request.FromDate.Date;
        var toDate = request.ToDate.Date.AddDays(1); // Include the entire last day

        // 1. Get current stock levels for all products
        var stockLevels = await (
            from s in _context.StockLevels
            join p in _context.Products on s.ProductId equals p.Id
            where s.StoreId == companyId
            select new
            {
                s.ProductId,
                ProductName = p.Name,
                p.Barcode,
                Unit = p.Unit,
                s.QuantityOnHand,
                s.AvailableQuantity,
                s.MovingAverageCost,
                s.ReorderPoint
            }
        ).ToListAsync(cancellationToken);

        // 2. Get all completed transaction lines grouped by product and type
        //    within the period
        var transactionsInPeriod = await (
            from tl in _context.InventoryTransactionLines
            join t in _context.InventoryTransactions on tl.TransactionId equals t.Id
            where t.Status == TransactionStatus.Completed
                  && t.ApprovedAt >= fromDate
                  && t.ApprovedAt < toDate
            group new { tl, t } by new { tl.ProductId, t.Type } into g
            select new
            {
                g.Key.ProductId,
                g.Key.Type,
                TotalQuantity = g.Sum(x => x.tl.Quantity)
            }
        ).ToListAsync(cancellationToken);

        // 3. Get all completed transaction lines AFTER the period (to calculate opening stock)
        //    We need transactions from toDate to "now" to reverse-calculate from current stock
        var transactionsAfterPeriod = await (
            from tl in _context.InventoryTransactionLines
            join t in _context.InventoryTransactions on tl.TransactionId equals t.Id
            where t.Status == TransactionStatus.Completed
                  && t.ApprovedAt >= toDate
            group new { tl, t } by new { tl.ProductId, t.Type } into g
            select new
            {
                g.Key.ProductId,
                g.Key.Type,
                TotalQuantity = g.Sum(x => x.tl.Quantity)
            }
        ).ToListAsync(cancellationToken);

        // 4. Build report items
        var items = new List<InventoryReportDto>();

        foreach (var stock in stockLevels)
        {
            var productId = stock.ProductId;

            // Movement in period
            int inboundInPeriod = transactionsInPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Inbound)
                .Sum(x => x.TotalQuantity);

            int outboundInPeriod = transactionsInPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Outbound)
                .Sum(x => x.TotalQuantity);

            int wastageInPeriod = transactionsInPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Wastage)
                .Sum(x => x.TotalQuantity);

            int adjustmentInPeriod = transactionsInPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Adjustment)
                .Sum(x => x.TotalQuantity);

            // Movement after period (to derive closing stock at end of period)
            int inboundAfter = transactionsAfterPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Inbound)
                .Sum(x => x.TotalQuantity);

            int outboundAfter = transactionsAfterPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Outbound)
                .Sum(x => x.TotalQuantity);

            int wastageAfter = transactionsAfterPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Wastage)
                .Sum(x => x.TotalQuantity);

            int adjustmentAfter = transactionsAfterPeriod
                .Where(x => x.ProductId == productId && x.Type == TransactionType.Adjustment)
                .Sum(x => x.TotalQuantity);

            // Closing stock at end of period = Current stock - net movement after period
            // For Inbound: adds stock -> reverse = subtract
            // For Outbound/Wastage: Quantity is stored as positive, but represents decrease
            // For Adjustment: can be positive (increase) or negative (decrease)
            int closingStock = stock.QuantityOnHand - inboundAfter + outboundAfter + wastageAfter - adjustmentAfter;

            // Opening stock = Closing stock - net movement in period
            int openingStock = closingStock - inboundInPeriod + outboundInPeriod + wastageInPeriod - adjustmentInPeriod;

            var avgCost = stock.MovingAverageCost;

            items.Add(new InventoryReportDto
            {
                ProductId = productId,
                ProductName = stock.ProductName,
                Barcode = stock.Barcode ?? stock.ProductId.ToString().Substring(0, 8).ToUpper(),
                Unit = stock.Unit,
                OpeningStock = openingStock,
                TotalInbound = inboundInPeriod,
                TotalOutbound = outboundInPeriod,
                TotalWastage = wastageInPeriod,
                TotalAdjustment = adjustmentInPeriod,
                ClosingStock = closingStock,
                AverageCost = avgCost,
                InventoryValue = closingStock * avgCost,
                ReorderPoint = stock.ReorderPoint
            });
        }

        var summary = new InventoryReportSummary
        {
            TotalSku = items.Count,
            TotalInventoryValue = items.Sum(i => i.InventoryValue),
            LowStockCount = items.Count(i => i.ClosingStock > 0 && i.ClosingStock <= i.ReorderPoint),
            OutOfStockCount = items.Count(i => i.ClosingStock <= 0),
            Items = items.OrderBy(i => i.ProductName).ToList()
        };

        return summary;
    }
}
