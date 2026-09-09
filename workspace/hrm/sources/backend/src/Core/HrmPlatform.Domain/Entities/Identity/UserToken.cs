using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Identity;

/// <summary>
/// Quản lý phiên đăng nhập và Refresh Token
/// </summary>
public class UserToken
{
    public long Id { get; set; }

    public long UserId { get; private set; }

    /// <summary>
    /// Chuỗi băm của Refresh Token bảo mật
    /// </summary>
    public string TokenHash { get; private set; } = string.Empty;

    /// <summary>
    /// Thông tin thiết bị (User-Agent / App Client)
    /// </summary>
    public string? DeviceInfo { get; private set; }

    /// <summary>
    /// Địa chỉ IP đăng nhập
    /// </summary>
    public string? IpAddress { get; private set; }

    /// <summary>
    /// Thời điểm hết hạn của Token
    /// </summary>
    public DateTime ExpiresAt { get; private set; }

    /// <summary>
    /// Thời điểm bị thu hồi / đăng xuất
    /// </summary>
    public DateTime? RevokedAt { get; private set; }

    /// <summary>
    /// Trạng thái hoạt động của Token (ACTIVE, REVOKED, EXPIRED)
    /// </summary>
    public UserTokenStatus Status { get; private set; } = UserTokenStatus.ACTIVE;

    /// <summary>
    /// Thời điểm tạo Token
    /// </summary>
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    #region Navigation Properties
    public virtual User User { get; private set; } = null!;
    #endregion

    protected UserToken()
    {
    }

    /// <summary>
    /// Factory Method khởi tạo UserToken
    /// </summary>
    public static UserToken Create(
        long userId,
        string tokenHash,
        DateTime expiresAt,
        string? deviceInfo = null,
        string? ipAddress = null)
    {
        if (userId <= 0)
            throw new DomainException("UserId không hợp lệ.");

        if (string.IsNullOrWhiteSpace(tokenHash))
            throw new DomainException("TokenHash không được để trống.");

        if (expiresAt <= DateTime.UtcNow)
            throw new DomainException("Thời điểm hết hạn của token phải ở trong tương lai.");

        return new UserToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            DeviceInfo = deviceInfo?.Trim(),
            IpAddress = ipAddress?.Trim(),
            Status = UserTokenStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Revoke()
    {
        Status = UserTokenStatus.REVOKED;
        RevokedAt = DateTime.UtcNow;
    }
}
