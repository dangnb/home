using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Auth.Queries;

public record UserDto(Guid Id, string Username, string FullName, string Email, bool IsActive, IEnumerable<string> Roles);

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
                    userEntry = user with { Roles = new List<string>() };
                    userDict.Add(userEntry.Id, userEntry);
                }

                if (!string.IsNullOrEmpty(role))
                {
                    ((List<string>)userEntry.Roles).Add(role);
                }

                return userEntry;
            },
            splitOn: "RoleName"
        );

        return userDict.Values;
    }
}
