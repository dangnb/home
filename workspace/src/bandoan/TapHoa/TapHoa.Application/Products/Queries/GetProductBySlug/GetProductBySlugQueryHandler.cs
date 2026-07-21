using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetProductBySlug;

public class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDto?>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetProductBySlugQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ProductDto?> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT p.*, c.Name AS CategoryName, s.FullName AS SupplierName 
            FROM Products p 
            LEFT JOIN Categories c ON p.CategoryId = c.Id 
            LEFT JOIN Suppliers s ON p.SupplierId = s.Id 
            WHERE p.Slug = @Slug AND p.IsDeleted = 0;
        ";
        var product = await connection.QuerySingleOrDefaultAsync<ProductDto>(sql, new { request.Slug });
        if (product != null)
        {
            var unitsSql = "SELECT * FROM ProductUnits WHERE ProductId = @Id";
            var units = await connection.QueryAsync<ProductUnitDto>(unitsSql, new { product.Id });
            product.Units = units.ToList();
        }
        return product;
    }
}
