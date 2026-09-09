using System.Text.RegularExpressions;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Tenants;

/// <summary>
/// Đại diện cho tổ chức hoặc doanh nghiệp thuê bao hệ thống (Tenant)
/// </summary>
public class Tenant : BaseEntity
{
    private static readonly Regex EmailRegex = new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    /// <summary>
    /// Mã định danh duy nhất của tenant (vd: VNG, FPT, VIETTEL)
    /// </summary>
    public string Code { get; private set; } = string.Empty;

    /// <summary>
    /// Tên đầy đủ của tổ chức / doanh nghiệp
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Email liên hệ đại diện doanh nghiệp
    /// </summary>
    public string Email { get; private set; } = string.Empty;

    /// <summary>
    /// Số điện thoại liên hệ
    /// </summary>
    public string? Phone { get; private set; }

    #region Navigation Properties
    public virtual ICollection<User> Users { get; private set; } = new HashSet<User>();
    public virtual ICollection<Role> Roles { get; private set; } = new HashSet<Role>();
    public virtual ICollection<Department> Departments { get; private set; } = new HashSet<Department>();
    public virtual ICollection<Attendance> Attendances { get; private set; } = new HashSet<Attendance>();
    public virtual ICollection<LeaveRequest> LeaveRequests { get; private set; } = new HashSet<LeaveRequest>();
    #endregion

    /// <summary>
    /// Constructor bảo vệ dành riêng cho Entity Framework Core
    /// </summary>
    protected Tenant()
    {
    }

    /// <summary>
    /// Factory Method khởi tạo Tenant đảm bảo tính toàn vẹn dữ liệu
    /// </summary>
    public static Tenant Create(string code, string name, string email, string? phone = null)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã Tenant không được để trống.");

        if (code.Trim().Length < 2 || code.Trim().Length > 50)
            throw new DomainException("Mã Tenant phải có độ dài từ 2 đến 50 ký tự.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên Tenant không được để trống.");

        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email liên hệ của Tenant không được để trống.");

        var cleanEmail = email.Trim().ToLowerInvariant();
        if (!EmailRegex.IsMatch(cleanEmail))
            throw new DomainException($"Email '{email}' không đúng định dạng.");

        var tenant = new Tenant
        {
            Code = code.Trim().ToUpperInvariant(),
            Name = name.Trim(),
            Email = cleanEmail,
            Phone = phone?.Trim(),
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };

        return tenant;
    }

    /// <summary>
    /// Cập nhật thông tin chi tiết của Tenant
    /// </summary>
    public void UpdateDetails(string name, string email, string? phone = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên Tenant không được để trống.");

        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email liên hệ của Tenant không được để trống.");

        var cleanEmail = email.Trim().ToLowerInvariant();
        if (!EmailRegex.IsMatch(cleanEmail))
            throw new DomainException($"Email '{email}' không đúng định dạng.");

        Name = name.Trim();
        Email = cleanEmail;
        Phone = phone?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        Status = EntityStatus.INACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        Status = EntityStatus.ACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Delete()
    {
        Status = EntityStatus.DELETED;
        UpdatedAt = DateTime.UtcNow;
    }
}
