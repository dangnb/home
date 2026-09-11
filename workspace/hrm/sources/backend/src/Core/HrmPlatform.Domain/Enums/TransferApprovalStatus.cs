namespace HrmPlatform.Domain.Enums;

/// <summary>
/// Trạng thái phê duyệt lệnh điều động nhân sự
/// </summary>
public enum TransferApprovalStatus
{
    /// <summary>
    /// Bản nháp
    /// </summary>
    DRAFT = 1,

    /// <summary>
    /// Chờ phê duyệt (Đã trình ký)
    /// </summary>
    PENDING_APPROVAL = 2,

    /// <summary>
    /// Đã phê duyệt (Chính thức có hiệu lực và đồng bộ hồ sơ)
    /// </summary>
    APPROVED = 3,

    /// <summary>
    /// Từ chối duyệt
    /// </summary>
    REJECTED = 4,

    /// <summary>
    /// Đã hủy đề xuất
    /// </summary>
    CANCELLED = 5
}
