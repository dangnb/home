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
    public string? PhoneNumber { get; set; }
    public string? CitizenId { get; set; }
    public string? Address { get; set; }
    public List<string> Roles { get; set; } = new();
}

public record GetUsersQuery() : IRequest<IEnumerable<UserDto>>;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<UserDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetUsersQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");

        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT u.Id, u.Username, u.FullName, u.Email, u.IsActive, u.PhoneNumber, u.CitizenId, u.Address, r.Name as RoleName
            FROM Users u
            LEFT JOIN UserRoles ur ON u.Id = ur.UsersId
            LEFT JOIN Roles r ON ur.RolesId = r.Id
            WHERE u.CompanyId = @CompanyId";

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
            new { CompanyId = companyId.ToString() },
            splitOn: "RoleName"
        );

        return userDict.Values;
    }
}
