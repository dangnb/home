namespace HrmPlatform.Domain.Common;

/// <summary>
/// Hợp đồng đánh dấu thực thể ghi nhận thông tin kiểm toán (Audit Trail)
/// </summary>
public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    long? CreatedBy { get; set; }
    DateTime? UpdatedAt { get; set; }
    long? UpdatedBy { get; set; }
}
