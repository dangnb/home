namespace HrmPlatform.Application.Common.Interfaces;

/// <summary>
/// Cung cấp thông tin phiên làm việc hiện tại của người dùng (User & Tenant context)
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// ID tài khoản người dùng đang đăng nhập
    /// </summary>
    long? UserId { get; }

    /// <summary>
    /// ID Tenant của người dùng đang thao tác
    /// </summary>
    long? TenantId { get; }

    /// <summary>
    /// Cho biết người dùng hiện tại có phải là Super Administrator toàn cục không
    /// </summary>
    bool IsSuperAdmin { get; }

    /// <summary>
    /// Cho biết yêu cầu hiện tại đã được xác thực danh tính chưa
    /// </summary>
    bool IsAuthenticated { get; }

    /// <summary>
    /// Địa chỉ IP của client gửi yêu cầu
    /// </summary>
    string? IpAddress { get; }
}
