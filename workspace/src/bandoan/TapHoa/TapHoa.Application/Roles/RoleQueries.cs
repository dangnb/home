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
            SELECT Id, Name, Description, Permissions as PermissionsJson
            FROM Roles
        ";
        var roles = await connection.QueryAsync<RoleEntityTemp>(sql);
        
        var result = new List<RoleDto>();
        foreach(var role in roles)
        {
            var dto = new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description
            };
            
            if (!string.IsNullOrEmpty(role.PermissionsJson))
            {
                try
                {
                    var perms = System.Text.Json.JsonSerializer.Deserialize<List<string>>(role.PermissionsJson);
                    if (perms != null) dto.Permissions = perms;
                }
                catch { }
            }
            result.Add(dto);
        }
        
        return result;
    }
    
    private class RoleEntityTemp 
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PermissionsJson { get; set; } = string.Empty;
    }
}
