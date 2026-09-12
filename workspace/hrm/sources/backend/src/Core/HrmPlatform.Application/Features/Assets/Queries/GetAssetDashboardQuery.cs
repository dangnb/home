using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Assets.Queries;

public class AssetDashboardReportDto
{
    public long TenantId { get; set; }
    public int TotalAssets { get; set; }
    public int AvailableCount { get; set; }
    public int InUseCount { get; set; }
    public int MaintenanceCount { get; set; }
    public int BrokenCount { get; set; }
    public int DisposedCount { get; set; }
    public decimal TotalCurrentValue { get; set; }
    public decimal TotalPurchasePrice { get; set; }
    public double UtilizationRatePercent { get; set; }
    public double IdleRatePercent { get; set; }
}

public class GetAssetDashboardQuery : IRequest<AssetDashboardReportDto>
{
}

public class GetAssetDashboardQueryHandler : IRequestHandler<GetAssetDashboardQuery, AssetDashboardReportDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetAssetDashboardQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<AssetDashboardReportDto> Handle(GetAssetDashboardQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                @TenantId AS TenantId,
                COUNT(id) AS TotalAssets,
                SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) AS AvailableCount,
                SUM(CASE WHEN status = 'IN_USE' THEN 1 ELSE 0 END) AS InUseCount,
                SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) AS MaintenanceCount,
                SUM(CASE WHEN status = 'BROKEN' THEN 1 ELSE 0 END) AS BrokenCount,
                SUM(CASE WHEN status = 'DISPOSED' THEN 1 ELSE 0 END) AS DisposedCount,
                COALESCE(SUM(current_value), 0) AS TotalCurrentValue,
                COALESCE(SUM(purchase_price), 0) AS TotalPurchasePrice
            FROM assets
            WHERE tenant_id = @TenantId";

        var result = await connection.QueryFirstOrDefaultAsync<AssetDashboardReportDto>(sql, new { TenantId = tenantId }) 
            ?? new AssetDashboardReportDto { TenantId = tenantId };

        if (result.TotalAssets > 0)
        {
            result.UtilizationRatePercent = Math.Round((double)result.InUseCount / result.TotalAssets * 100, 2);
            result.IdleRatePercent = Math.Round((double)result.AvailableCount / result.TotalAssets * 100, 2);
        }

        return result;
    }
}
