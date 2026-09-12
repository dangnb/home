using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Assets.Queries;

public class AssetDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal CurrentValue { get; set; }
    public long? AssigneeId { get; set; }
    public string? AssigneeName { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AssetSummaryDto
{
    public int TotalAssets { get; set; }
    public int AvailableAssets { get; set; }
    public int InUseAssets { get; set; }
    public int MaintenanceAssets { get; set; }
    public decimal TotalAssetValue { get; set; }
}

public class GetAssetsQuery : IRequest<object>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Keyword { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; }
    public long? AssigneeUserId { get; set; }
}

public class GetAssetsQueryHandler : IRequestHandler<GetAssetsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetAssetsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetAssetsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE a.tenant_id = @TenantId AND a.status != 'DISPOSED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (a.asset_code LIKE @Keyword OR a.name LIKE @Keyword OR a.serial_number LIKE @Keyword OR u.full_name LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "ALL")
        {
            whereClause += " AND a.category = @Category";
            parameters.Add("Category", request.Category.Trim().ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND a.status = @Status";
            parameters.Add("Status", request.Status.Trim().ToUpper());
        }

        if (request.AssigneeUserId.HasValue && request.AssigneeUserId.Value > 0)
        {
            whereClause += " AND a.assignee_id = @AssigneeUserId";
            parameters.Add("AssigneeUserId", request.AssigneeUserId.Value);
        }

        // 1. Get Summary Stats via Dapper
        var summarySql = $@"
            SELECT 
                COUNT(*) AS TotalAssets,
                SUM(CASE WHEN a.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS AvailableAssets,
                SUM(CASE WHEN a.status = 'IN_USE' THEN 1 ELSE 0 END) AS InUseAssets,
                SUM(CASE WHEN a.status = 'MAINTENANCE' THEN 1 ELSE 0 END) AS MaintenanceAssets,
                COALESCE(SUM(a.current_value), 0) AS TotalAssetValue
            FROM assets a
            LEFT JOIN users u ON a.assignee_id = u.id
            {whereClause}";

        var summary = await connection.QueryFirstOrDefaultAsync<AssetSummaryDto>(summarySql, parameters) ?? new AssetSummaryDto();

        // 2. Get Total Count
        var countSql = $@"
            SELECT COUNT(*) 
            FROM assets a
            LEFT JOIN users u ON a.assignee_id = u.id
            {whereClause}";

        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        // 3. Get Data List
        var page = request.Page > 0 ? request.Page : 1;
        var pageSize = request.PageSize > 0 && request.PageSize <= 500 ? request.PageSize : 20;
        var offset = (page - 1) * pageSize;

        parameters.Add("Limit", pageSize);
        parameters.Add("Offset", offset);

        var dataSql = $@"
            SELECT 
                a.id AS Id,
                a.tenant_id AS TenantId,
                a.asset_code AS AssetCode,
                a.name AS Name,
                a.category AS Category,
                a.serial_number AS SerialNumber,
                a.purchase_date AS PurchaseDate,
                a.purchase_price AS PurchasePrice,
                a.current_value AS CurrentValue,
                a.assignee_id AS AssigneeId,
                u.full_name AS AssigneeName,
                a.status AS Status,
                a.created_at AS CreatedAt
            FROM assets a
            LEFT JOIN users u ON a.assignee_id = u.id
            {whereClause}
            ORDER BY a.created_at DESC
            LIMIT @Limit OFFSET @Offset";

        var data = (await connection.QueryAsync<AssetDto>(dataSql, parameters)).ToList();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        return new
        {
            success = true,
            summary,
            data,
            pagination = new
            {
                totalCount,
                page,
                pageSize,
                totalPages
            }
        };
    }
}
