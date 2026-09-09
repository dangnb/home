using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Users.Queries;

public class GetUserByIdQuery : IRequest<ApiResponseDto<UserDto>>
{
    public long Id { get; set; }
}

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, ApiResponseDto<UserDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetUserByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ApiResponseDto<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        const string sql = @"
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
            WHERE u.id = @Id AND u.status != 'DELETED'
            LIMIT 1;
        ";

        var user = await connection.QueryFirstOrDefaultAsync<UserDto>(sql, new { Id = request.Id });

        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.Id);
        }

        return ApiResponseDto<UserDto>.Ok(user);
    }
}
