namespace HrmPlatform.Domain.Common;

/// <summary>
/// Lớp cơ sở tổng quát cho các thực thể có kiểm toán (Audit Trail) với enum Status tùy biến
/// </summary>
/// <typeparam name="TStatus">Kiểu enum trạng thái của thực thể</typeparam>
public abstract class BaseEntity<TStatus> : IAuditableEntity
    where TStatus : struct, Enum
{
    /// <summary>
    /// Định danh duy nhất (Khóa chính)
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    /// Trạng thái hoạt động của thực thể
    /// </summary>
    public TStatus Status { get; set; } = default;

    /// <summary>
    /// Thời điểm khởi tạo bản ghi
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Người tạo bản ghi (FK -> users.id)
    /// </summary>
    public long? CreatedBy { get; set; }

    /// <summary>
    /// Thời điểm cập nhật bản ghi gần nhất
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Người cập nhật bản ghi gần nhất (FK -> users.id)
    /// </summary>
    public long? UpdatedBy { get; set; }
}

/// <summary>
/// Lớp cơ sở tiêu chuẩn cho thực thể nghiệp vụ kế thừa EntityStatus (ACTIVE, INACTIVE, LOCKED, DELETED)
/// và hỗ trợ Soft Delete
/// </summary>
public abstract class BaseEntity : BaseEntity<Enums.EntityStatus>, ISoftDeletable
{
    protected BaseEntity()
    {
        Status = Enums.EntityStatus.ACTIVE;
    }
}
