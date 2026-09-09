namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái hoạt động chung của các thực thể trong hệ thống
/// </summary>
public enum EntityStatus
{
    ACTIVE = 1,
    INACTIVE = 2,
    LOCKED = 3,
    DELETED = 4
}
