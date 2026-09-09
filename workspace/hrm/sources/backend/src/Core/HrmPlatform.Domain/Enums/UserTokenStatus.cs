namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái phiên đăng nhập / token của người dùng
/// </summary>
public enum UserTokenStatus
{
    ACTIVE = 1,
    REVOKED = 2,
    EXPIRED = 3
}
