using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Roles.Queries;

public class PermissionDto
{
    public long Id { get; set; }
    public string Module { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "ACTIVE";
    public int AssignedRolesCount { get; set; }
}

public class GetPermissionsQuery : IRequest<ApiResponseDto<List<PermissionDto>>>
{
    public string? Module { get; set; }
    public string? Search { get; set; }
}

public class GetPermissionsQueryHandler : IRequestHandler<GetPermissionsQuery, ApiResponseDto<List<PermissionDto>>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetPermissionsQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ApiResponseDto<List<PermissionDto>>> Handle(GetPermissionsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                p.id AS Id,
                p.module AS Module,
                p.code AS Code,
                p.name AS Name,
                p.description AS Description,
                p.status AS Status,
                COUNT(rp.role_id) AS AssignedRolesCount
            FROM permissions p
            LEFT JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE 1=1
        ";

        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(request.Module) && request.Module != "ALL")
        {
            sql += " AND p.module = @Module";
            parameters.Add("Module", request.Module.Trim().ToUpperInvariant());
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            sql += " AND (p.name LIKE @Search OR p.code LIKE @Search OR p.description LIKE @Search)";
            parameters.Add("Search", $"%{request.Search.Trim()}%");
        }

        sql += " GROUP BY p.id, p.module, p.code, p.name, p.description, p.status ORDER BY p.module ASC, p.id ASC;";

        var permissions = (await connection.QueryAsync<PermissionDto>(sql, parameters)).ToList();

        return ApiResponseDto<List<PermissionDto>>.Ok(permissions);
    }
}
