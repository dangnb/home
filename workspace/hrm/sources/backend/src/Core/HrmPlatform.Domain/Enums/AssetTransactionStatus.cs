namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái phê duyệt giao dịch tài sản
/// </summary>
public enum AssetTransactionStatus
{
    PENDING = 1,   // Chờ phê duyệt
    APPROVED = 2,  // Đã phê duyệt và thực thi bàn giao/thu hồi
    REJECTED = 3   // Từ chối phê duyệt
}
