using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Gán vai trò (Role) cho người dùng (User) theo phạm vi Tenant
/// </summary>
public class UserRole : BaseEntity, IMayHaveTenant
{
    public Guid UserId { get; private set; }
    public Guid RoleId { get; private set; }
    public Guid? TenantId { get; set; }

    #region Navigation Properties
    public virtual User User { get; private set; } = null!;
    public virtual Role Role { get; private set; } = null!;
    public virtual Tenant? Tenant { get; private set; }
    #endregion

    protected UserRole()
    {
    }

    /// <summary>
    /// Factory Method tạo liên kết User - Role
    /// </summary>
    public static UserRole Create(Guid userId, Guid roleId, Guid? tenantId = null)
    {
        if (userId == Guid.Empty)
            throw new DomainException("UserId không hợp lệ.");

        if (roleId == Guid.Empty)
            throw new DomainException("RoleId không hợp lệ.");

        if (tenantId.HasValue && tenantId.Value == Guid.Empty)
            throw new DomainException("TenantId không hợp lệ.");

        return new UserRole
        {
            UserId = userId,
            RoleId = roleId,
            TenantId = tenantId,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void ChangeRole(Guid newRoleId)
    {
        if (newRoleId == Guid.Empty)
            throw new DomainException("RoleId mới không hợp lệ.");

        RoleId = newRoleId;
        UpdatedAt = DateTime.UtcNow;
    }
}
