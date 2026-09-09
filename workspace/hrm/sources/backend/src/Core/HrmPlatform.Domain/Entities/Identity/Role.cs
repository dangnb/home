using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

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
    public string Code { get; private set; } = string.Empty;

    /// <summary>
    /// Tên hiển thị vai trò
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Mô tả chi tiết chức năng vai trò
    /// </summary>
    public string? Description { get; private set; }

    #region Navigation Properties
    public virtual Tenant? Tenant { get; private set; }
    public virtual ICollection<RolePermission> RolePermissions { get; private set; } = new HashSet<RolePermission>();
    public virtual ICollection<UserRole> UserRoles { get; private set; } = new HashSet<UserRole>();
    #endregion

    protected Role()
    {
    }

    /// <summary>
    /// Factory Method khởi tạo Vai trò mới
    /// </summary>
    public static Role Create(string code, string name, string? description = null, long? tenantId = null)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã vai trò không được để trống.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên vai trò không được để trống.");

        if (tenantId.HasValue && tenantId.Value <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        return new Role
        {
            Code = code.Trim().ToUpperInvariant(),
            Name = name.Trim(),
            Description = description?.Trim(),
            TenantId = tenantId,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên vai trò không được để trống.");

        Name = name.Trim();
        Description = description?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
