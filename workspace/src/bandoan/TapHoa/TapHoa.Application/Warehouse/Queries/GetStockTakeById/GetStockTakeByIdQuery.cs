using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Warehouse.Queries.GetStockTakeById;

public record GetStockTakeByIdQuery(Guid Id) : IRequest<StockTakeDetailDto>;

public class StockTakeDetailDto
{
    public Guid Id { get; set; }
    public string DocumentNo { get; set; } = string.Empty;
    public StockTakeStatus Status { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public List<StockTakeLineDto> Lines { get; set; } = new();
}

public class StockTakeLineDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int ExpectedQuantity { get; set; }
    public int? ActualQuantity { get; set; }
    public int Difference { get; set; }
    public string? Reason { get; set; }
}

public class GetStockTakeByIdQueryHandler : IRequestHandler<GetStockTakeByIdQuery, StockTakeDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetStockTakeByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StockTakeDetailDto> Handle(GetStockTakeByIdQuery request, CancellationToken cancellationToken)
    {
        var stockTake = await _context.StockTakes
            .Include(x => x.Lines)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (stockTake == null)
            throw new KeyNotFoundException($"StockTake with ID {request.Id} not found");

        var productIds = stockTake.Lines.Select(l => l.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .AsNoTracking()
            .ToDictionaryAsync(p => p.Id, cancellationToken);

        var dto = new StockTakeDetailDto
        {
            Id = stockTake.Id,
            DocumentNo = stockTake.DocumentNo,
            Status = stockTake.Status,
            Notes = stockTake.Notes,
            CreatedDate = stockTake.CreatedDate.GetValueOrDefault(),
            CreatedBy = stockTake.CreatedBy ?? "System",
            Lines = stockTake.Lines.Select(l =>
            {
                var product = products.TryGetValue(l.ProductId, out var p) ? p : null;
                return new StockTakeLineDto
                {
                    Id = l.Id,
                    ProductId = l.ProductId,
                    ProductName = product?.Name ?? "Unknown Product",
                    SKU = product?.Barcode ?? "N/A",
                    ExpectedQuantity = l.ExpectedQuantity,
                    ActualQuantity = l.ActualQuantity,
                    Difference = l.Difference,
                    Reason = l.Reason
                };
            }).ToList()
        };

        return dto;
    }
}
