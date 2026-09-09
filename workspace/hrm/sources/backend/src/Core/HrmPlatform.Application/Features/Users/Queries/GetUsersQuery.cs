using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Users.Queries;

public class UserDto
{
    public long Id { get; set; }
    public long? TenantId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public long? RoleId { get; set; }
    public string? RoleCode { get; set; }
    public string? RoleName { get; set; }
}

public class GetUsersQuery : IRequest<PaginatedResultDto<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Search { get; set; }
    public string? RoleCode { get; set; }
    public string? Status { get; set; }
}

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PaginatedResultDto<UserDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetUsersQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId;
        var offset = Math.Max(0, (request.Page - 1) * request.PageSize);

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE u.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("Limit", request.PageSize);
        parameters.Add("Offset", offset);

        if (tenantId.HasValue && !_currentUserService.IsSuperAdmin)
        {
            whereClause += " AND (u.tenant_id = @TenantId OR u.tenant_id IS NULL)";
            parameters.Add("TenantId", tenantId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "All")
        {
            whereClause += " AND u.status = @Status";
            parameters.Add("Status", request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.RoleCode) && request.RoleCode != "All")
        {
            whereClause += " AND r.code = @RoleCode";
            parameters.Add("RoleCode", request.RoleCode);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            whereClause += " AND (u.full_name LIKE @Search OR u.username LIKE @Search OR u.email LIKE @Search OR u.phone LIKE @Search)";
            parameters.Add("Search", $"%{request.Search.Trim()}%");
        }

        var countSql = $@"
            SELECT COUNT(DISTINCT u.id) 
            FROM users u
            LEFT JOIN (
                SELECT user_id, MIN(role_id) as role_id 
                FROM user_roles 
                WHERE status != 'DELETED' 
                GROUP BY user_id
            ) ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            {whereClause};
        ";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var dataSql = $@"
            SELECT 
                u.id AS Id, 
                u.tenant_id AS TenantId, 
                u.username AS Username, 
                u.email AS Email, 
                u.full_name AS FullName, 
                u.phone AS Phone, 
                u.status AS Status, 
                u.created_at AS CreatedAt, 
                u.updated_at AS UpdatedAt,
                r.id AS RoleId, 
                r.code AS RoleCode, 
                r.name AS RoleName
            FROM users u
            LEFT JOIN (
                SELECT user_id, MIN(role_id) as role_id 
                FROM user_roles 
                WHERE status != 'DELETED' 
                GROUP BY user_id
            ) ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            {whereClause}
            ORDER BY u.id ASC
            LIMIT @Limit OFFSET @Offset;
        ";

        var items = (await connection.QueryAsync<UserDto>(dataSql, parameters)).ToList();
        return PaginatedResultDto<UserDto>.Create(items, totalCount, request.Page, request.PageSize);
    }
}
