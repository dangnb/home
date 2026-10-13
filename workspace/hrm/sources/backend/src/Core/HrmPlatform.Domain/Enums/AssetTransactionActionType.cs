namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Loại giao dịch tài sản (Cấp phát, Thu hồi, Điều chuyển)
/// </summary>
public enum AssetTransactionActionType
{
    ALLOCATE = 1,  // Cấp phát tài sản cho nhân viên
    RECOVER = 2,   // Thu hồi tài sản về kho
    TRANSFER = 3   // Điều chuyển tài sản giữa các nhân viên / phòng ban
}
