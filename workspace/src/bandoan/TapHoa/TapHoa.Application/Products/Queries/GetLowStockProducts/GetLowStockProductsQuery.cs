using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetLowStockProducts;

public record GetLowStockProductsQuery : IRequest<IEnumerable<ProductDto>>;

public class GetLowStockProductsQueryHandler : IRequestHandler<GetLowStockProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLowStockProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _context.Products
            .Include(p => p.CategoryObj)
            .Include(p => p.SupplierObj)
            .Where(p => p.StockQuantity <= p.MinStockLevel)
            .OrderBy(p => p.StockQuantity - p.MinStockLevel)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            CategoryName = p.CategoryObj?.Name,
            SupplierName = p.SupplierObj?.Name,
            CostPrice = p.CostPrice,
            WholesalePrice = p.WholesalePrice,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            MinStockLevel = p.MinStockLevel,
            MaxStockLevel = p.MaxStockLevel,
            Unit = p.Unit,
            Barcode = p.Barcode,
            MainImageUrl = p.MainImageUrl,
            Status = p.Status
        });
    }
}
