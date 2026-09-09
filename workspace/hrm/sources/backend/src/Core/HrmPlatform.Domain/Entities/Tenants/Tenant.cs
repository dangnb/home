using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;

namespace HrmPlatform.Domain.Entities.Tenants;

/// <summary>
/// Đại diện cho tổ chức hoặc doanh nghiệp thuê bao hệ thống (Tenant)
/// </summary>
public class Tenant : BaseEntity
{
    /// <summary>
    /// Mã định danh duy nhất của tenant (vd: VNG, FPT, VIETTEL)
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Tên đầy đủ của tổ chức / doanh nghiệp
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email liên hệ đại diện doanh nghiệp
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Số điện thoại liên hệ
    /// </summary>
    public string? Phone { get; set; }

    #region Navigation Properties
    public virtual ICollection<User> Users { get; set; } = new HashSet<User>();
    public virtual ICollection<Role> Roles { get; set; } = new HashSet<Role>();
    public virtual ICollection<Department> Departments { get; set; } = new HashSet<Department>();
    public virtual ICollection<Attendance> Attendances { get; set; } = new HashSet<Attendance>();
    public virtual ICollection<LeaveRequest> LeaveRequests { get; set; } = new HashSet<LeaveRequest>();
    #endregion
}
