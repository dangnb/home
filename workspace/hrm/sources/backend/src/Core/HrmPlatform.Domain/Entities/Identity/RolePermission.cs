using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Bảng liên kết Many-to-Many giữa Role và Permission
/// </summary>
public class RolePermission
{
    public Guid RoleId { get; private set; }
    public Guid PermissionId { get; private set; }

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public Guid? CreatedBy { get; private set; }

    #region Navigation Properties
    public virtual Role Role { get; private set; } = null!;
    public virtual Permission Permission { get; private set; } = null!;
    #endregion

    protected RolePermission()
    {
    }

    public static RolePermission Create(Guid roleId, Guid permissionId, Guid? createdBy = null)
    {
        if (roleId == Guid.Empty)
            throw new DomainException("RoleId không hợp lệ.");

        if (permissionId == Guid.Empty)
            throw new DomainException("PermissionId không hợp lệ.");

        return new RolePermission
        {
            RoleId = roleId,
            PermissionId = permissionId,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };
    }
}
