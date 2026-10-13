using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Yêu cầu đơn xin nghỉ phép của nhân viên
/// </summary>
public class LeaveRequest : BaseEntity<LeaveRequestStatus>, ITenantScopedEntity
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; private set; }
    public LeaveType LeaveType { get; private set; } = LeaveType.ANNUAL;
    public DateOnly StartDate { get; private set; }
    public DateOnly EndDate { get; private set; }
    public string? Reason { get; private set; }
    public Guid? ApproverId { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User User { get; private set; } = null!;
    public virtual User? Approver { get; private set; }
    #endregion

    protected LeaveRequest()
    {
    }

    /// <summary>
    /// Factory Method khởi tạo đơn xin nghỉ phép mới
    /// </summary>
    public static LeaveRequest Create(
        Guid tenantId,
        Guid userId,
        LeaveType leaveType,
        DateOnly startDate,
        DateOnly endDate,
        string? reason = null)
    {
        if (userId == Guid.Empty)
            throw new DomainException("UserId không hợp lệ (phải lớn hơn 0).");

        if (endDate < startDate)
            throw new DomainException("Ngày kết thúc nghỉ phép không thể diễn ra trước ngày bắt đầu.");

        return new LeaveRequest
        {
            TenantId = tenantId,
            UserId = userId,
            LeaveType = leaveType,
            StartDate = startDate,
            EndDate = endDate,
            Reason = reason?.Trim(),
            Status = LeaveRequestStatus.PENDING,
            CreatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Phê duyệt đơn xin nghỉ
    /// </summary>
    public void Approve(Guid approverId)
    {
        if (approverId == Guid.Empty)
            throw new DomainException("ApproverId không hợp lệ.");

        if (Status != LeaveRequestStatus.PENDING)
            throw new DomainException($"Không thể phê duyệt đơn nghỉ phép đang ở trạng thái '{Status}'.");

        ApproverId = approverId;
        Status = LeaveRequestStatus.APPROVED;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Từ chối đơn xin nghỉ
    /// </summary>
    public void Reject(Guid approverId, string? reason = null)
    {
        if (approverId == Guid.Empty)
            throw new DomainException("ApproverId không hợp lệ.");

        if (Status != LeaveRequestStatus.PENDING)
            throw new DomainException($"Không thể từ chối đơn nghỉ phép đang ở trạng thái '{Status}'.");

        ApproverId = approverId;
        Status = LeaveRequestStatus.REJECTED;
        if (!string.IsNullOrWhiteSpace(reason))
        {
            Reason = string.IsNullOrWhiteSpace(Reason) ? $"Lý do từ chối: {reason.Trim()}" : $"{Reason} | Lý do từ chối: {reason.Trim()}";
        }
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Hủy đơn xin nghỉ
    /// </summary>
    public void Cancel()
    {
        if (Status != LeaveRequestStatus.PENDING)
            throw new DomainException($"Chỉ có thể hủy đơn xin nghỉ đang ở trạng thái chờ duyệt (PENDING).");

        Status = LeaveRequestStatus.CANCELLED;
        UpdatedAt = DateTime.UtcNow;
    }
}
