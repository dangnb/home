using System.Text.RegularExpressions;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Tài khoản người dùng hệ thống (SuperAdmin có TenantId = null)
/// </summary>
public class User : BaseEntity, IMayHaveTenant
{
    private static readonly Regex EmailRegex = new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    /// <summary>
    /// ID của doanh nghiệp (Null đối với SuperAdmin)
    /// </summary>
    public long? TenantId { get; set; }

    /// <summary>
    /// Tên đăng nhập duy nhất
    /// </summary>
    public string Username { get; private set; } = string.Empty;

    /// <summary>
    /// Địa chỉ email duy nhất
    /// </summary>
    public string Email { get; private set; } = string.Empty;

    /// <summary>
    /// Mật khẩu đã được băm (BCrypt / Argon2)
    /// </summary>
    public string PasswordHash { get; private set; } = string.Empty;

    /// <summary>
    /// Họ và tên người dùng
    /// </summary>
    public string FullName { get; private set; } = string.Empty;

    /// <summary>
    /// Số điện thoại
    /// </summary>
    public string? Phone { get; private set; }

    #region Navigation Properties
    public virtual Tenant? Tenant { get; private set; }
    public virtual EmployeeProfile? EmployeeProfile { get; private set; }
    public virtual ICollection<UserToken> Tokens { get; private set; } = new HashSet<UserToken>();
    public virtual ICollection<UserRole> UserRoles { get; private set; } = new HashSet<UserRole>();
    public virtual ICollection<Attendance> Attendances { get; private set; } = new HashSet<Attendance>();
    public virtual ICollection<LeaveRequest> LeaveRequests { get; private set; } = new HashSet<LeaveRequest>();
    #endregion

    /// <summary>
    /// Constructor bảo vệ dành cho Entity Framework Core
    /// </summary>
    protected User()
    {
    }

    /// <summary>
    /// Factory Method tạo User mới đảm bảo trạng thái hợp lệ ngay từ đầu
    /// </summary>
    public static User Create(
        long? tenantId,
        string username,
        string email,
        string passwordHash,
        string fullName,
        string? phone = null)
    {
        if (tenantId.HasValue && tenantId.Value <= 0)
            throw new DomainException("TenantId không hợp lệ (phải lớn hơn 0).");

        if (string.IsNullOrWhiteSpace(username))
            throw new DomainException("Tên đăng nhập không được để trống.");

        var cleanUsername = username.Trim().ToLowerInvariant();
        if (cleanUsername.Length < 3 || cleanUsername.Length > 100)
            throw new DomainException("Tên đăng nhập phải có độ dài từ 3 đến 100 ký tự.");

        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email người dùng không được để trống.");

        var cleanEmail = email.Trim().ToLowerInvariant();
        if (!EmailRegex.IsMatch(cleanEmail))
            throw new DomainException($"Email '{email}' không đúng định dạng.");

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new DomainException("Mật khẩu băm (PasswordHash) không được để trống.");

        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("Họ và tên người dùng không được để trống.");

        var user = new User
        {
            TenantId = tenantId,
            Username = cleanUsername,
            Email = cleanEmail,
            PasswordHash = passwordHash,
            FullName = fullName.Trim(),
            Phone = phone?.Trim(),
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };

        return user;
    }

    /// <summary>
    /// Cập nhật thông tin cá nhân và liên hệ
    /// </summary>
    public void UpdateProfile(string fullName, string? phone = null)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("Họ và tên không được để trống.");

        FullName = fullName.Trim();
        Phone = phone?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Cập nhật địa chỉ email
    /// </summary>
    public void UpdateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email không được để trống.");

        var cleanEmail = email.Trim().ToLowerInvariant();
        if (!EmailRegex.IsMatch(cleanEmail))
            throw new DomainException($"Email '{email}' không đúng định dạng.");

        Email = cleanEmail;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Cập nhật tổng thể thông tin người dùng
    /// </summary>
    public void UpdateDetails(string fullName, string email, string? phone = null)
    {
        UpdateProfile(fullName, phone);
        UpdateEmail(email);
    }

    /// <summary>
    /// Đổi mật khẩu
    /// </summary>
    public void ChangePassword(string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new DomainException("Mật khẩu mới không được để trống.");

        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Khóa tài khoản
    /// </summary>
    public void LockAccount()
    {
        Status = EntityStatus.LOCKED;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Mở khóa tài khoản
    /// </summary>
    public void UnlockAccount()
    {
        Status = EntityStatus.ACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Tạm ngừng hoạt động
    /// </summary>
    public void Deactivate()
    {
        Status = EntityStatus.INACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Kích hoạt lại tài khoản
    /// </summary>
    public void Activate()
    {
        Status = EntityStatus.ACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Xóa mềm tài khoản
    /// </summary>
    public void Delete()
    {
        Status = EntityStatus.DELETED;
        UpdatedAt = DateTime.UtcNow;
    }
}
