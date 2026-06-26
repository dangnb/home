using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public record GetStockLevelsQuery : IRequest<List<StockLevelDto>>;

public class StockLevelDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = default!;
    public string Barcode { get; set; } = default!;
    public int QuantityOnHand { get; set; }
    public int AvailableQuantity { get; set; }
    public DateTime LastRestockedAt { get; set; }
}

public class GetStockLevelsQueryHandler : IRequestHandler<GetStockLevelsQuery, List<StockLevelDto>>
{
    private readonly IApplicationDbContext _context;

    public GetStockLevelsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<StockLevelDto>> Handle(GetStockLevelsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _context.CurrentCompanyId;
        
        var query = from s in _context.StockLevels
                    join p in _context.Products on s.ProductId equals p.Id
                    where s.StoreId == companyId
                    select new StockLevelDto
                    {
                        ProductId = s.ProductId,
                        ProductName = p.Name,
                        Barcode = p.Id.ToString().Substring(0, 8).ToUpper(), // Mocking barcode for UI using ID prefix
                        QuantityOnHand = s.QuantityOnHand,
                        AvailableQuantity = s.AvailableQuantity,
                        LastRestockedAt = s.LastRestockedAt
                    };

        return await query.ToListAsync(cancellationToken);
    }
}
