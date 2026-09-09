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
    public long UserId { get; private set; }
    public long RoleId { get; private set; }
    public long? TenantId { get; set; }

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
    public static UserRole Create(long userId, long roleId, long? tenantId = null)
    {
        if (userId <= 0)
            throw new DomainException("UserId không hợp lệ (phải lớn hơn 0).");

        if (roleId <= 0)
            throw new DomainException("RoleId không hợp lệ (phải lớn hơn 0).");

        if (tenantId.HasValue && tenantId.Value <= 0)
            throw new DomainException("TenantId không hợp lệ (phải lớn hơn 0).");

        return new UserRole
        {
            UserId = userId,
            RoleId = roleId,
            TenantId = tenantId,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void ChangeRole(long newRoleId)
    {
        if (newRoleId <= 0)
            throw new DomainException("RoleId mới không hợp lệ.");

        RoleId = newRoleId;
        UpdatedAt = DateTime.UtcNow;
    }
}
