using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Warehouse.Queries;

public record LowStockProductDto(Guid ProductId, string ProductName, int AvailableQuantity, int ReorderPoint, string Unit);

public class GetLowStockProductsQuery : IRequest<IEnumerable<LowStockProductDto>>
{
}

public class GetLowStockProductsQueryHandler : IRequestHandler<GetLowStockProductsQuery, IEnumerable<LowStockProductDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetLowStockProductsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<LowStockProductDto>> Handle(GetLowStockProductsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT p.Id as ProductId, p.Name as ProductName, s.AvailableQuantity, s.ReorderPoint, p.Unit
            FROM StockLevels s
            JOIN Products p ON p.Id = s.ProductId
            WHERE s.AvailableQuantity <= s.ReorderPoint AND p.IsDeleted = 0
            ORDER BY s.AvailableQuantity ASC
        ";

        return await connection.QueryAsync<LowStockProductDto>(sql);
    }
}
