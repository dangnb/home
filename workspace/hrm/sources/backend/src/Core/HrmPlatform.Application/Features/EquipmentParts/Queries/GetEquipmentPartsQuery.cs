using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.EquipmentParts.Queries;

public class EquipmentPartDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = "Cái";
    public int StockQuantity { get; set; }
    public int MinStockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalValue { get; set; }
    public string? Specifications { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsLowStock { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EquipmentPartSummaryDto
{
    public int TotalParts { get; set; }
    public int TotalStockQuantity { get; set; }
    public int LowStockParts { get; set; }
    public decimal TotalStockValue { get; set; }
}

public class GetEquipmentPartsQuery : IRequest<object>
{
    public string? Keyword { get; set; }
    public string? Category { get; set; }
    public bool? LowStockOnly { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetEquipmentPartsQueryHandler : IRequestHandler<GetEquipmentPartsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEquipmentPartsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetEquipmentPartsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE p.tenant_id = @TenantId AND p.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (p.code LIKE @Keyword OR p.name LIKE @Keyword OR p.specifications LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "ALL")
        {
            whereClause += " AND p.category = @Category";
            parameters.Add("Category", request.Category.Trim().ToUpper());
        }

        if (request.LowStockOnly == true)
        {
            whereClause += " AND p.stock_quantity <= p.min_stock_quantity";
        }

        // Summary Query
        var summarySql = $@"
            SELECT 
                COUNT(*) AS TotalParts,
                COALESCE(SUM(p.stock_quantity), 0) AS TotalStockQuantity,
                SUM(CASE WHEN p.stock_quantity <= p.min_stock_quantity THEN 1 ELSE 0 END) AS LowStockParts,
                COALESCE(SUM(p.stock_quantity * p.unit_price), 0) AS TotalStockValue
            FROM equipment_parts p
            {whereClause}";

        var summary = await connection.QueryFirstOrDefaultAsync<EquipmentPartSummaryDto>(summarySql, parameters) 
                      ?? new EquipmentPartSummaryDto();

        // Total Count
        var countSql = $"SELECT COUNT(*) FROM equipment_parts p {whereClause}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        // Data Query
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize;
        var offset = (page - 1) * pageSize;
        parameters.Add("Limit", pageSize);
        parameters.Add("Offset", offset);

        var dataSql = $@"
            SELECT 
                p.id AS Id,
                p.tenant_id AS TenantId,
                p.code AS Code,
                p.name AS Name,
                p.category AS Category,
                p.unit AS Unit,
                p.stock_quantity AS StockQuantity,
                p.min_stock_quantity AS MinStockQuantity,
                p.unit_price AS UnitPrice,
                (p.stock_quantity * p.unit_price) AS TotalValue,
                p.specifications AS Specifications,
                p.status AS Status,
                CASE WHEN p.stock_quantity <= p.min_stock_quantity THEN 1 ELSE 0 END AS IsLowStock,
                p.created_at AS CreatedAt
            FROM equipment_parts p
            {whereClause}
            ORDER BY p.created_at DESC
            LIMIT @Limit OFFSET @Offset";

        var items = (await connection.QueryAsync<EquipmentPartDto>(dataSql, parameters)).ToList();

        return new
        {
            data = items,
            summary = summary,
            pagination = new
            {
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        };
    }
}
