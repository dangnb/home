using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Roles.Queries;

public class GetRoleByIdQuery : IRequest<ApiResponseDto<RoleDetailDto>>
{
    public long Id { get; set; }
}

public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, ApiResponseDto<RoleDetailDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetRoleByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ApiResponseDto<RoleDetailDto>> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        const string roleSql = @"
            SELECT 
                r.id AS Id,
                r.tenant_id AS TenantId,
                r.code AS Code,
                r.name AS Name,
                r.description AS Description,
                r.status AS Status,
                COUNT(DISTINCT ur.user_id) AS TotalUsers
            FROM roles r
            LEFT JOIN user_roles ur ON r.id = ur.role_id
            WHERE r.id = @Id
            GROUP BY r.id, r.tenant_id, r.code, r.name, r.description, r.status;
        ";

        var role = await connection.QueryFirstOrDefaultAsync<RoleDetailDto>(roleSql, new { request.Id });
        if (role == null)
            throw new NotFoundException("Không tìm thấy vai trò với ID đã cho.");

        var systemCodes = new HashSet<string>(new[] { "SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "EMPLOYEE" }, System.StringComparer.OrdinalIgnoreCase);
        role.IsSystemRole = role.TenantId == null || systemCodes.Contains(role.Code);

        const string permsSql = @"
            SELECT 
                p.id AS PermissionId,
                p.code AS PermissionCode,
                p.name AS PermissionName
            FROM role_permissions rp
            INNER JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = @RoleId
            ORDER BY p.module ASC, p.id ASC;
        ";

        var perms = (await connection.QueryAsync<(long PermissionId, string PermissionCode, string PermissionName)>(permsSql, new { RoleId = request.Id })).ToList();
        role.PermissionIds = perms.Select(p => p.PermissionId).ToList();
        role.PermissionCodes = perms.Select(p => p.PermissionCode).ToList();
        role.PermissionNames = perms.Select(p => p.PermissionName).ToList();

        return ApiResponseDto<RoleDetailDto>.Ok(role);
    }
}
