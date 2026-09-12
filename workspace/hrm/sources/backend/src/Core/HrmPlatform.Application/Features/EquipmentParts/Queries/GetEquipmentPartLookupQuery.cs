using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.EquipmentParts.Queries;

public class EquipmentPartLookupDto
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = "Cái";
    public int StockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? Specifications { get; set; }
}

public class GetEquipmentPartLookupQuery : IRequest<List<EquipmentPartLookupDto>>
{
    public string? Keyword { get; set; }
    public int Limit { get; set; } = 100;
}

public class GetEquipmentPartLookupQueryHandler : IRequestHandler<GetEquipmentPartLookupQuery, List<EquipmentPartLookupDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEquipmentPartLookupQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<List<EquipmentPartLookupDto>> Handle(GetEquipmentPartLookupQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE p.tenant_id = @TenantId AND p.status = 'ACTIVE'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (p.code LIKE @Keyword OR p.name LIKE @Keyword OR p.specifications LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        var limit = request.Limit < 1 ? 100 : request.Limit;
        parameters.Add("Limit", limit);

        var sql = $@"
            SELECT 
                p.id AS Id,
                p.code AS Code,
                p.name AS Name,
                p.category AS Category,
                p.unit AS Unit,
                p.stock_quantity AS StockQuantity,
                p.unit_price AS UnitPrice,
                p.specifications AS Specifications
            FROM equipment_parts p
            {whereClause}
            ORDER BY p.name ASC
            LIMIT @Limit";

        var items = await connection.QueryAsync<EquipmentPartLookupDto>(sql, parameters);
        return items.ToList();
    }
}
