using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Quản lý Quyết định Khen thưởng và Kỷ luật của Nhân sự
/// </summary>
public class RewardDiscipline : BaseEntity<RewardDisciplineStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long EmployeeId { get; private set; }
    public RewardDisciplineType Type { get; private set; }
    public RewardDisciplineCategory Category { get; private set; }
    public string Title { get; private set; } = null!;
    public string? DecisionNumber { get; private set; }
    public DateOnly DecisionDate { get; private set; }
    public DateOnly EffectiveDate { get; private set; }
    public decimal Amount { get; private set; }
    public string? Reason { get; private set; }
    public string? AttachmentUrl { get; private set; }

    public long? ApproverId { get; private set; }
    public DateTime? ApprovedAt { get; private set; }
    public string? RejectionReason { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual EmployeeProfile Employee { get; private set; } = null!;
    public virtual User? Approver { get; private set; }
    #endregion

    protected RewardDiscipline()
    {
    }

    /// <summary>
    /// Khởi tạo quyết định khen thưởng / kỷ luật mới
    /// </summary>
    public static RewardDiscipline Create(
        long tenantId,
        long employeeId,
        RewardDisciplineType type,
        RewardDisciplineCategory category,
        string title,
        DateOnly decisionDate,
        DateOnly effectiveDate,
        decimal amount,
        string? decisionNumber = null,
        string? reason = null,
        string? attachmentUrl = null,
        RewardDisciplineStatus status = RewardDisciplineStatus.APPROVED)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (employeeId <= 0)
            throw new DomainException("Vui lòng chọn nhân viên áp dụng.");

        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Tiêu đề quyết định thưởng/phạt không được để trống.");

        if (amount < 0)
            throw new DomainException("Số tiền thưởng/phạt không được là số âm.");

        return new RewardDiscipline
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            Type = type,
            Category = category,
            Title = title.Trim(),
            DecisionNumber = decisionNumber?.Trim(),
            DecisionDate = decisionDate,
            EffectiveDate = effectiveDate,
            Amount = amount,
            Reason = reason?.Trim(),
            AttachmentUrl = attachmentUrl?.Trim(),
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Cập nhật thông tin quyết định
    /// </summary>
    public void Update(
        RewardDisciplineType type,
        RewardDisciplineCategory category,
        string title,
        DateOnly decisionDate,
        DateOnly effectiveDate,
        decimal amount,
        string? decisionNumber = null,
        string? reason = null,
        string? attachmentUrl = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Tiêu đề quyết định thưởng/phạt không được để trống.");

        if (amount < 0)
            throw new DomainException("Số tiền thưởng/phạt không được là số âm.");

        Type = type;
        Category = category;
        Title = title.Trim();
        DecisionNumber = decisionNumber?.Trim();
        DecisionDate = decisionDate;
        EffectiveDate = effectiveDate;
        Amount = amount;
        Reason = reason?.Trim();
        AttachmentUrl = attachmentUrl?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Phê duyệt quyết định
    /// </summary>
    public void Approve(long approverId)
    {
        if (approverId <= 0)
            throw new DomainException("Mã người phê duyệt không hợp lệ.");

        if (Status == RewardDisciplineStatus.CANCELLED)
            throw new DomainException("Không thể phê duyệt quyết định đã bị hủy.");

        Status = RewardDisciplineStatus.APPROVED;
        ApproverId = approverId;
        ApprovedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Từ chối quyết định
    /// </summary>
    public void Reject(long approverId, string reason)
    {
        if (approverId <= 0)
            throw new DomainException("Mã người từ chối không hợp lệ.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new DomainException("Vui lòng nhập lý do từ chối quyết định.");

        if (Status == RewardDisciplineStatus.APPROVED || Status == RewardDisciplineStatus.CANCELLED)
            throw new DomainException($"Không thể từ chối quyết định ở trạng thái '{Status}'.");

        Status = RewardDisciplineStatus.REJECTED;
        ApproverId = approverId;
        RejectionReason = reason.Trim();
        ApprovedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Hủy bỏ quyết định
    /// </summary>
    public void Cancel()
    {
        if (Status == RewardDisciplineStatus.APPROVED)
            throw new DomainException("Không thể hủy quyết định đã phê duyệt.");

        Status = RewardDisciplineStatus.CANCELLED;
        UpdatedAt = DateTime.UtcNow;
    }
}
