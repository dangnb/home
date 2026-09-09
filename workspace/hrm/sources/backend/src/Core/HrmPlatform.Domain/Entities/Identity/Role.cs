using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Vai trò người dùng (TenantId = null với vai trò toàn cục hệ thống)
/// </summary>
public class Role : BaseEntity, IMayHaveTenant
{
    /// <summary>
    /// TenantId (null nếu là vai trò hệ thống như SUPER_ADMIN, TENANT_ADMIN mặc định)
    /// </summary>
    public long? TenantId { get; set; }

    /// <summary>
    /// Mã vai trò (SUPER_ADMIN, TENANT_ADMIN, HR_MANAGER, EMPLOYEE...)
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Tên hiển thị vai trò
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Mô tả chi tiết chức năng vai trò
    /// </summary>
    public string? Description { get; set; }

    #region Navigation Properties
    public virtual Tenant? Tenant { get; set; }
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new HashSet<RolePermission>();
    public virtual ICollection<UserRole> UserRoles { get; set; } = new HashSet<UserRole>();
    #endregion
}
