using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetProducts;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetProductsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT 
                p.Id, p.Name, p.CategoryId, c.Name AS CategoryName,
                p.SupplierId, s.FullName AS SupplierName,
                p.MainImageUrl, p.CostPrice, p.WholesalePrice, p.Price, 
                p.StockQuantity, p.MinStockLevel, p.MaxStockLevel, p.Unit, p.Barcode, p.Status,
                p.AdditionalImages,
                pu.* 
            FROM Products p
            LEFT JOIN Categories c ON p.CategoryId = c.Id
            LEFT JOIN Suppliers s ON p.SupplierId = s.Id
            LEFT JOIN ProductUnits pu ON p.Id = pu.ProductId
            WHERE p.IsDeleted = 0 AND p.CompanyId = @CompanyId
        ";
        
        var productDictionary = new Dictionary<Guid, ProductDto>();

        var products = await connection.QueryAsync<ProductDto, ProductUnitDto, ProductDto>(
            sql,
            (product, unit) =>
            {
                if (!productDictionary.TryGetValue(product.Id, out var currentProduct))
                {
                    currentProduct = product;
                    currentProduct.Units = new List<ProductUnitDto>();
                    productDictionary.Add(currentProduct.Id, currentProduct);
                }

                if (unit != null)
                {
                    currentProduct.Units.Add(unit);
                }

                return currentProduct;
            },
            new { CompanyId = companyId.ToString() },
            splitOn: "Id"
        );

        return productDictionary.Values;
    }
}
