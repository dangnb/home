namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Bảng liên kết Many-to-Many giữa Role và Permission
/// </summary>
public class RolePermission
{
    public long RoleId { get; set; }
    public long PermissionId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long? CreatedBy { get; set; }

    #region Navigation Properties
    public virtual Role Role { get; set; } = null!;
    public virtual Permission Permission { get; set; } = null!;
    #endregion
}
