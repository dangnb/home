using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;

namespace HrmPlatform.Domain.Entities.Audit;

/// <summary>
/// Nhật ký kiểm toán ghi lại tất cả các thay đổi dữ liệu trên hệ thống
/// </summary>
public class AuditLog : IMayHaveTenant
{
    public long Id { get; set; }

    /// <summary>
    /// TenantId phát sinh hành động kiểm toán (null nếu là super admin toàn cục)
    /// </summary>
    public long? TenantId { get; set; }

    /// <summary>
    /// ID người dùng thực hiện hành động
    /// </summary>
    public long? UserId { get; set; }

    /// <summary>
    /// Loại hành động: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT...
    /// </summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>
    /// Tên bảng / Entity bị tác động
    /// </summary>
    public string EntityName { get; set; } = string.Empty;

    /// <summary>
    /// Khóa chính hoặc mã định danh của bản ghi bị tác động
    /// </summary>
    public string EntityId { get; set; } = string.Empty;

    /// <summary>
    /// Dữ liệu trước khi sửa đổi (JSON)
    /// </summary>
    public string? OldData { get; set; }

    /// <summary>
    /// Dữ liệu sau khi sửa đổi (JSON)
    /// </summary>
    public string? NewData { get; set; }

    /// <summary>
    /// Địa chỉ IP của client gửi yêu cầu
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// Trạng thái ghi nhận log (SUCCESS, FAILED...)
    /// </summary>
    public string Status { get; set; } = "SUCCESS";

    /// <summary>
    /// Thời điểm thực hiện hành vi
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    #region Navigation Properties
    public virtual Tenant? Tenant { get; set; }
    public virtual User? User { get; set; }
    #endregion
}
