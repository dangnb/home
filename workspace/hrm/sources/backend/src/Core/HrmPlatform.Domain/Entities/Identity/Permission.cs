using HrmPlatform.Domain.Common;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Quyền hạn truy cập các tính năng / API theo từng Module
/// </summary>
public class Permission : BaseEntity
{
    /// <summary>
    /// Module chức năng (TENANT, USER, ROLE, DEPARTMENT, EMPLOYEE, ATTENDANCE, LEAVE)
    /// </summary>
    public string Module { get; set; } = string.Empty;

    /// <summary>
    /// Mã quyền hạn duy nhất (Format: MODULE.ACTION, vd: EMPLOYEE.CREATE)
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Tên mô tả ngắn gọn quyền hạn
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Mô tả chi tiết phạm vi quyền hạn
    /// </summary>
    public string? Description { get; set; }

    #region Navigation Properties
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new HashSet<RolePermission>();
    #endregion
}
