using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using HrmPlatform.Domain.Enums;
using MediatR;

namespace HrmPlatform.Application.Features.SystemCatalogs.Queries;

// ============================================================
// DTO
// ============================================================
public class SystemCatalogDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string CatalogType { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsSystemDefault { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// ============================================================
// Query — Lấy danh sách theo CatalogType (có thể lọc theo status)
// ============================================================
public class GetSystemCatalogsQuery : IRequest<List<SystemCatalogDto>>
{
    public string CatalogType { get; set; } = string.Empty;
    public bool ActiveOnly { get; set; } = true;
}

public class GetSystemCatalogsQueryHandler : IRequestHandler<GetSystemCatalogsQuery, List<SystemCatalogDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetSystemCatalogsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<List<SystemCatalogDto>> Handle(GetSystemCatalogsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE sc.tenant_id = @TenantId AND sc.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.CatalogType))
        {
            whereClause += " AND sc.catalog_type = @CatalogType";
            parameters.Add("CatalogType", request.CatalogType.Trim().ToUpperInvariant());
        }

        if (request.ActiveOnly)
        {
            whereClause += " AND sc.status = 'ACTIVE'";
        }

        var sql = $@"
            SELECT
                sc.id            AS Id,
                sc.tenant_id     AS TenantId,
                sc.catalog_type  AS CatalogType,
                sc.code          AS Code,
                sc.name          AS Name,
                sc.description   AS Description,
                sc.sort_order    AS SortOrder,
                sc.is_system_default AS IsSystemDefault,
                sc.status        AS Status,
                sc.created_at    AS CreatedAt,
                sc.updated_at    AS UpdatedAt
            FROM system_catalogs sc
            {whereClause}
            ORDER BY sc.sort_order ASC, sc.name ASC";

        var result = await connection.QueryAsync<SystemCatalogDto>(sql, parameters);
        return result.AsList();
    }
}

// ============================================================
// Query — Lấy tất cả các loại danh mục dưới dạng phân nhóm (cho Admin UI)
// ============================================================
public class GetAllSystemCatalogsGroupedQuery : IRequest<Dictionary<string, List<SystemCatalogDto>>> { }

public class GetAllSystemCatalogsGroupedQueryHandler : IRequestHandler<GetAllSystemCatalogsGroupedQuery, Dictionary<string, List<SystemCatalogDto>>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetAllSystemCatalogsGroupedQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<Dictionary<string, List<SystemCatalogDto>>> Handle(GetAllSystemCatalogsGroupedQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT
                sc.id            AS Id,
                sc.tenant_id     AS TenantId,
                sc.catalog_type  AS CatalogType,
                sc.code          AS Code,
                sc.name          AS Name,
                sc.description   AS Description,
                sc.sort_order    AS SortOrder,
                sc.is_system_default AS IsSystemDefault,
                sc.status        AS Status,
                sc.created_at    AS CreatedAt,
                sc.updated_at    AS UpdatedAt
            FROM system_catalogs sc
            WHERE sc.tenant_id = @TenantId
              AND sc.status != 'DELETED'
            ORDER BY sc.catalog_type ASC, sc.sort_order ASC, sc.name ASC";

        var all = await connection.QueryAsync<SystemCatalogDto>(sql, new { TenantId = tenantId });

        return all
            .GroupBy(x => x.CatalogType)
            .ToDictionary(g => g.Key, g => g.ToList());
    }
}
