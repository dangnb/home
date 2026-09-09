using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Gán vai trò (Role) cho người dùng (User) theo phạm vi Tenant
/// </summary>
public class UserRole : BaseEntity, IMayHaveTenant
{
    public long UserId { get; set; }
    public long RoleId { get; set; }
    public long? TenantId { get; set; }

    #region Navigation Properties
    public virtual User User { get; set; } = null!;
    public virtual Role Role { get; set; } = null!;
    public virtual Tenant? Tenant { get; set; }
    #endregion
}
