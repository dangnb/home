using TapHoa.Domain.Entities.Identity;

namespace TapHoa.Domain.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User?> GetUserWithRolesAsync(int userId, CancellationToken cancellationToken = default);
}

public interface IRoleRepository : IBaseRepository<Role>
{
    Task<Role?> GetByNameAsync(string roleName, CancellationToken cancellationToken = default);
    Task<Role?> GetRoleWithPermissionsAsync(int roleId, CancellationToken cancellationToken = default);
}
