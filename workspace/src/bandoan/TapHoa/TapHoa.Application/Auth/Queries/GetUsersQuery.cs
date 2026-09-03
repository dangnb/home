using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Auth.Queries;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; } = new();
}

public record GetUsersQuery() : IRequest<IEnumerable<UserDto>>;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<UserDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetUsersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT u.Id, u.Username, u.FullName, u.Email, u.IsActive, r.Name as RoleName
            FROM Users u
            LEFT JOIN UserRoles ur ON u.Id = ur.UsersId
            LEFT JOIN Roles r ON ur.RolesId = r.Id";

        var userDict = new Dictionary<Guid, UserDto>();

        await connection.QueryAsync<UserDto, string, UserDto>(
            sql,
            (user, role) =>
            {
                if (!userDict.TryGetValue(user.Id, out var userEntry))
                {
                    userEntry = user;
                    userDict.Add(userEntry.Id, userEntry);
                }

                if (!string.IsNullOrEmpty(role) && !userEntry.Roles.Contains(role))
                {
                    userEntry.Roles.Add(role);
                }

                return userEntry;
            },
            splitOn: "RoleName"
        );

        return userDict.Values;
    }
}
