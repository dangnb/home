using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Quản lý phiên đăng nhập và Refresh Token
/// </summary>
public class UserToken
{
    public long Id { get; set; }

    public long UserId { get; set; }

    /// <summary>
    /// Chuỗi băm của Refresh Token bảo mật
    /// </summary>
    public string TokenHash { get; set; } = string.Empty;

    /// <summary>
    /// Thông tin thiết bị (User-Agent / App Client)
    /// </summary>
    public string? DeviceInfo { get; set; }

    /// <summary>
    /// Địa chỉ IP đăng nhập
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// Thời điểm hết hạn của Token
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Thời điểm bị thu hồi / đăng xuất
    /// </summary>
    public DateTime? RevokedAt { get; set; }

    /// <summary>
    /// Trạng thái hoạt động của Token (ACTIVE, REVOKED, EXPIRED)
    /// </summary>
    public UserTokenStatus Status { get; set; } = UserTokenStatus.ACTIVE;

    /// <summary>
    /// Thời điểm tạo Token
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    #region Navigation Properties
    public virtual User User { get; set; } = null!;
    #endregion
}
