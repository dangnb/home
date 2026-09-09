using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Exceptions;

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
    public long? UserId { get; private set; }

    /// <summary>
    /// Loại hành động: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT...
    /// </summary>
    public string Action { get; private set; } = string.Empty;

    /// <summary>
    /// Tên bảng / Entity bị tác động
    /// </summary>
    public string EntityName { get; private set; } = string.Empty;

    /// <summary>
    /// Khóa chính hoặc mã định danh của bản ghi bị tác động
    /// </summary>
    public string EntityId { get; private set; } = string.Empty;

    /// <summary>
    /// Dữ liệu trước khi sửa đổi (JSON)
    /// </summary>
    public string? OldData { get; private set; }

    /// <summary>
    /// Dữ liệu sau khi sửa đổi (JSON)
    /// </summary>
    public string? NewData { get; private set; }

    /// <summary>
    /// Địa chỉ IP của client gửi yêu cầu
    /// </summary>
    public string? IpAddress { get; private set; }

    /// <summary>
    /// Trạng thái ghi nhận log (SUCCESS, FAILED...)
    /// </summary>
    public string Status { get; private set; } = "SUCCESS";

    /// <summary>
    /// Thời điểm thực hiện hành vi
    /// </summary>
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    #region Navigation Properties
    public virtual Tenant? Tenant { get; private set; }
    public virtual User? User { get; private set; }
    #endregion

    protected AuditLog()
    {
    }

    /// <summary>
    /// Factory Method khởi tạo bản ghi Audit Log
    /// </summary>
    public static AuditLog Create(
        string action,
        string entityName,
        string entityId,
        long? tenantId = null,
        long? userId = null,
        string? oldData = null,
        string? newData = null,
        string? ipAddress = null,
        string status = "SUCCESS")
    {
        if (string.IsNullOrWhiteSpace(action))
            throw new DomainException("Hành động kiểm toán (Action) không được để trống.");

        if (string.IsNullOrWhiteSpace(entityName))
            throw new DomainException("Tên thực thể (EntityName) không được để trống.");

        if (string.IsNullOrWhiteSpace(entityId))
            throw new DomainException("Mã thực thể (EntityId) không được để trống.");

        return new AuditLog
        {
            Action = action.Trim().ToUpperInvariant(),
            EntityName = entityName.Trim(),
            EntityId = entityId.Trim(),
            TenantId = tenantId,
            UserId = userId,
            OldData = oldData,
            NewData = newData,
            IpAddress = ipAddress?.Trim(),
            Status = string.IsNullOrWhiteSpace(status) ? "SUCCESS" : status.Trim().ToUpperInvariant(),
            CreatedAt = DateTime.UtcNow
        };
    }
}
