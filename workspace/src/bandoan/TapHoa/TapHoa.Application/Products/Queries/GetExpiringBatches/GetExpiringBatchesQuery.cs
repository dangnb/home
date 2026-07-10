using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Products.Queries.GetExpiringBatches;

public record ExpiringBatchDto(
    Guid BatchId, 
    Guid ProductId, 
    string ProductName, 
    string? ProductBarcode,
    string BatchNumber, 
    DateTime MfgDate, 
    DateTime ExpiryDate, 
    int StockQuantity,
    int DaysUntilExpiry);

public record GetExpiringBatchesQuery(int DaysThreshold = 30) : IRequest<List<ExpiringBatchDto>>;

public class GetExpiringBatchesQueryHandler : IRequestHandler<GetExpiringBatchesQuery, List<ExpiringBatchDto>>
{
    private readonly IApplicationDbContext _context;

    public GetExpiringBatchesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ExpiringBatchDto>> Handle(GetExpiringBatchesQuery request, CancellationToken cancellationToken)
    {
        var thresholdDate = DateTime.UtcNow.AddDays(request.DaysThreshold);

        var batchesFromDb = await _context.ProductBatches
            .Include(b => b.Product)
            .Where(b => b.IsActive && b.StockQuantity > 0 && b.ExpiryDate <= thresholdDate)
            .OrderBy(b => b.ExpiryDate)
            .ToListAsync(cancellationToken);

        var batches = batchesFromDb
            .Select(b => new ExpiringBatchDto(
                b.Id,
                b.ProductId,
                b.Product.Name,
                b.Product.Barcode,
                b.BatchNumber,
                b.MfgDate,
                b.ExpiryDate,
                b.StockQuantity,
                (b.ExpiryDate - DateTime.UtcNow).Days
            ))
            .ToList();

        return batches;
    }
}
