using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Roles.Queries;

public class RoleDetailDto
{
    public long Id { get; set; }
    public long? TenantId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "ACTIVE";
    public int TotalUsers { get; set; }
    public bool IsSystemRole { get; set; }
    public List<long> PermissionIds { get; set; } = new();
    public List<string> PermissionCodes { get; set; } = new();
    public List<string> PermissionNames { get; set; } = new();
}

public class GetRolesWithDetailsQuery : IRequest<ApiResponseDto<List<RoleDetailDto>>>
{
}

public class GetRolesWithDetailsQueryHandler : IRequestHandler<GetRolesWithDetailsQuery, ApiResponseDto<List<RoleDetailDto>>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetRolesWithDetailsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ApiResponseDto<List<RoleDetailDto>>> Handle(GetRolesWithDetailsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        var currentTenantId = _currentUserService.TenantId;

        // 1. Lấy danh sách Roles (vai trò hệ thống toàn cục tenant_id IS NULL hoặc vai trò riêng của tenant)
        const string rolesSql = @"
            SELECT 
                r.id AS Id,
                r.tenant_id AS TenantId,
                r.code AS Code,
                r.name AS Name,
                r.description AS Description,
                r.status AS Status,
                COUNT(DISTINCT ur.user_id) AS TotalUsers
            FROM roles r
            LEFT JOIN user_roles ur ON r.id = ur.role_id AND (ur.tenant_id IS NULL OR ur.tenant_id = @TenantId)
            WHERE (r.tenant_id IS NULL OR r.tenant_id = @TenantId)
            GROUP BY r.id, r.tenant_id, r.code, r.name, r.description, r.status
            ORDER BY r.id ASC;
        ";

        var roles = (await connection.QueryAsync<RoleDetailDto>(rolesSql, new { TenantId = currentTenantId })).ToList();

        // Đánh dấu IsSystemRole (SUPER_ADMIN, TENANT_ADMIN, HR_MANAGER, EMPLOYEE)
        var systemCodes = new HashSet<string>(new[] { "SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "EMPLOYEE" }, System.StringComparer.OrdinalIgnoreCase);

        // 2. Lấy toàn bộ phân quyền của các roles này
        const string rolePermissionsSql = @"
            SELECT 
                rp.role_id AS RoleId,
                p.id AS PermissionId,
                p.code AS PermissionCode,
                p.name AS PermissionName
            FROM role_permissions rp
            INNER JOIN permissions p ON rp.permission_id = p.id
            ORDER BY p.module ASC, p.id ASC;
        ";

        var rolePermissions = (await connection.QueryAsync<(long RoleId, long PermissionId, string PermissionCode, string PermissionName)>(rolePermissionsSql)).ToList();
        var permissionsByRole = rolePermissions.GroupBy(rp => rp.RoleId).ToDictionary(g => g.Key, g => g.ToList());

        foreach (var role in roles)
        {
            role.IsSystemRole = role.TenantId == null || systemCodes.Contains(role.Code);
            if (permissionsByRole.TryGetValue(role.Id, out var perms))
            {
                role.PermissionIds = perms.Select(p => p.PermissionId).ToList();
                role.PermissionCodes = perms.Select(p => p.PermissionCode).ToList();
                role.PermissionNames = perms.Select(p => p.PermissionName).ToList();
            }
        }

        return ApiResponseDto<List<RoleDetailDto>>.Ok(roles);
    }
}
