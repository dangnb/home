using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Users.Queries;

public class RoleDto
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class GetRolesQuery : IRequest<ApiResponseDto<List<RoleDto>>>
{
}

public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, ApiResponseDto<List<RoleDto>>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetRolesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ApiResponseDto<List<RoleDto>>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        const string sql = "SELECT id AS Id, code AS Code, name AS Name, description AS Description FROM roles ORDER BY id ASC;";
        var roles = (await connection.QueryAsync<RoleDto>(sql)).ToList();

        return ApiResponseDto<List<RoleDto>>.Ok(roles);
    }
}
