using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Products.Queries.GetProductBatches;

public record ProductBatchDto(Guid Id, Guid ProductId, string BatchNumber, DateTime MfgDate, DateTime ExpiryDate, int StockQuantity);

public record GetProductBatchesQuery(Guid ProductId) : IRequest<List<ProductBatchDto>>;

public class GetProductBatchesQueryHandler : IRequestHandler<GetProductBatchesQuery, List<ProductBatchDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProductBatchesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductBatchDto>> Handle(GetProductBatchesQuery request, CancellationToken cancellationToken)
    {
        var batches = await _context.ProductBatches
            .Where(b => b.ProductId == request.ProductId && b.IsActive && b.StockQuantity > 0)
            .OrderBy(b => b.ExpiryDate)
            .Select(b => new ProductBatchDto(
                b.Id,
                b.ProductId,
                b.BatchNumber,
                b.MfgDate,
                b.ExpiryDate,
                b.StockQuantity
            ))
            .ToListAsync(cancellationToken);

        return batches;
    }
}
