using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Tenants;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Tài khoản người dùng hệ thống (SuperAdmin có TenantId = null)
/// </summary>
public class User : BaseEntity, IMayHaveTenant
{
    /// <summary>
    /// ID của doanh nghiệp (Null đối với SuperAdmin)
    /// </summary>
    public long? TenantId { get; set; }

    /// <summary>
    /// Tên đăng nhập duy nhất
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Địa chỉ email duy nhất
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Mật khẩu đã được băm (BCrypt / Argon2)
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Họ và tên người dùng
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Số điện thoại
    /// </summary>
    public string? Phone { get; set; }

    #region Navigation Properties
    public virtual Tenant? Tenant { get; set; }
    public virtual EmployeeProfile? EmployeeProfile { get; set; }
    public virtual ICollection<UserToken> Tokens { get; set; } = new HashSet<UserToken>();
    public virtual ICollection<UserRole> UserRoles { get; set; } = new HashSet<UserRole>();
    public virtual ICollection<Attendance> Attendances { get; set; } = new HashSet<Attendance>();
    public virtual ICollection<LeaveRequest> LeaveRequests { get; set; } = new HashSet<LeaveRequest>();
    #endregion
}
