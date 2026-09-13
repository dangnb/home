using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Assets.Queries;

public class AssetDepreciationDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public int PeriodMonth { get; set; }
    public int PeriodYear { get; set; }
    public decimal DepreciatedAmount { get; set; }
    public decimal RemainingValue { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GetAssetDepreciationsQuery : IRequest<object>
{
    public Guid? AssetId { get; set; }
    public int? Year { get; set; }
}

public class GetAssetDepreciationsQueryHandler : IRequestHandler<GetAssetDepreciationsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetAssetDepreciationsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetAssetDepreciationsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE d.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.AssetId.HasValue && request.AssetId.Value != Guid.Empty)
        {
            whereClause += " AND d.asset_id = @AssetId";
            parameters.Add("AssetId", request.AssetId.Value);
        }

        if (request.Year.HasValue)
        {
            whereClause += " AND d.period_year = @Year";
            parameters.Add("Year", request.Year.Value);
        }

        var sql = $@"
            SELECT 
                d.id AS Id,
                d.asset_id AS AssetId,
                a.asset_code AS AssetCode,
                a.name AS AssetName,
                d.period_month AS PeriodMonth,
                d.period_year AS PeriodYear,
                d.depreciated_amount AS DepreciatedAmount,
                d.remaining_value AS RemainingValue,
                d.created_at AS CreatedAt
            FROM asset_depreciations d
            INNER JOIN assets a ON d.asset_id = a.id
            {whereClause}
            ORDER BY d.period_year DESC, d.period_month DESC";

        var data = (await connection.QueryAsync<AssetDepreciationDto>(sql, parameters)).ToList();

        return new
        {
            success = true,
            data
        };
    }
}
