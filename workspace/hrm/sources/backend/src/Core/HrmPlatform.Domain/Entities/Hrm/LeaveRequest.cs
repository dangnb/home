using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Yêu cầu đơn xin nghỉ phép của nhân viên
/// </summary>
public class LeaveRequest : BaseEntity<LeaveRequestStatus>, ITenantScopedEntity
{
    public LeaveRequest()
    {
        Status = LeaveRequestStatus.PENDING;
    }

    /// <summary>
    /// ID Tenant
    /// </summary>
    public long TenantId { get; set; }

    /// <summary>
    /// ID User người gửi đơn xin nghỉ
    /// </summary>
    public long UserId { get; set; }

    /// <summary>
    /// Hình thức nghỉ phép (ANNUAL: Phép năm, SICK: Ốm đau, UNPAID: Nghỉ không lương)
    /// </summary>
    public LeaveType LeaveType { get; set; } = LeaveType.ANNUAL;

    /// <summary>
    /// Ngày bắt đầu nghỉ
    /// </summary>
    public DateOnly StartDate { get; set; }

    /// <summary>
    /// Ngày kết thúc nghỉ
    /// </summary>
    public DateOnly EndDate { get; set; }

    /// <summary>
    /// Lý do xin nghỉ phép
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// ID người duyệt đơn (FK -> User)
    /// </summary>
    public long? ApproverId { get; set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual User? Approver { get; set; }
    #endregion
}
