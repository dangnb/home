using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Roles;

public record GetRolesQuery() : IRequest<List<RoleDto>>;

public class RoleQueriesHandler : IRequestHandler<GetRolesQuery, List<RoleDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public RoleQueriesHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, Name, Description, Permissions
            FROM Roles
        ";
        var roles = await connection.QueryAsync<RoleDto>(sql);
        return roles.ToList();
    }
}
