using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using Dapper;

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
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetStockLevelsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<List<StockLevelDto>> Handle(GetStockLevelsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT 
                s.ProductId, 
                p.Name as ProductName, 
                SUBSTRING(CAST(p.Id AS CHAR(36)), 1, 8) as Barcode, 
                s.QuantityOnHand, 
                s.AvailableQuantity, 
                s.LastRestockedAt
            FROM StockLevels s
            JOIN Products p ON s.ProductId = p.Id
            WHERE s.StoreId = @CompanyId
        ";

        var result = await connection.QueryAsync<StockLevelDto>(sql, new { CompanyId = companyId.ToString() });
        return result.ToList();
    }
}
