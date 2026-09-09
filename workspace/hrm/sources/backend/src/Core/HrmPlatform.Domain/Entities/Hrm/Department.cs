using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Đại diện cho phòng ban / bộ phận trực thuộc Tenant
/// </summary>
public class Department : BaseEntity, ITenantScopedEntity
{
    /// <summary>
    /// Định danh Tenant sở hữu phòng ban
    /// </summary>
    public long TenantId { get; set; }

    /// <summary>
    /// Tên phòng ban (vd: Phòng Kỹ thuật, Ban Giám đốc, Phòng Nhân sự)
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Mã định danh phòng ban duy nhất trong phạm vi Tenant (vd: IT, HR, BOD)
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// ID người dùng giữ vị trí Trưởng phòng (nullable)
    /// </summary>
    public long? ManagerId { get; set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual User? Manager { get; set; }
    public virtual ICollection<EmployeeProfile> Employees { get; set; } = new HashSet<EmployeeProfile>();
    #endregion
}
