using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetProductById;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetProductByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT * FROM Products WHERE Id = @Id;
            SELECT * FROM ProductUnits WHERE ProductId = @Id;
        ";
        using var multi = await connection.QueryMultipleAsync(sql, new { request.Id });
        var product = await multi.ReadSingleOrDefaultAsync<ProductDto>();
        if (product != null)
        {
            var units = await multi.ReadAsync<ProductUnitDto>();
            product.Units = units.ToList();
        }
        return product;
    }
}
