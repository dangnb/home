using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Entities.Identity;
using TapHoa.Domain.Interfaces;
using TapHoa.Infrastructure.Data;

namespace TapHoa.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        var lowerUsername = username.ToLower();
        return await _dbSet.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Username.ToLower() == lowerUsername, cancellationToken);
    }

    public async Task<User?> GetUserWithRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet.Include(u => u.Roles)
                           .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }
}

public class RoleRepository : BaseRepository<Role>, IRoleRepository
{
    public RoleRepository(AppDbContext context) : base(context) { }

    public async Task<Role?> GetByNameAsync(string roleName, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.Name == roleName, cancellationToken);
    }

    public async Task<Role?> GetRoleWithPermissionsAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.Id == roleId, cancellationToken);
    }
}
