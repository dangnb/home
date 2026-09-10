using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Lịch sử biến động / Lệnh điều động công tác nhân sự
/// </summary>
public class EmployeeJobHistory : BaseEntity, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long EmployeeId { get; private set; }
    public string? DecisionNumber { get; private set; }
    public TransferChangeType ChangeType { get; private set; }
    public long? OldDepartmentId { get; private set; }
    public long? NewDepartmentId { get; private set; }
    public string? OldJobTitle { get; private set; }
    public string? NewJobTitle { get; private set; }
    public long? OldManagerId { get; private set; }
    public long? NewManagerId { get; private set; }
    public DateOnly EffectiveDate { get; private set; }
    public string? Note { get; private set; }

    public TransferApprovalStatus ApprovalStatus { get; private set; } = TransferApprovalStatus.PENDING_APPROVAL;
    public long? ApproverId { get; private set; }
    public DateTime? ApprovedAt { get; private set; }
    public string? RejectionReason { get; private set; }

    // Multi-Step Approval Workflow (5 Steps)
    public int CurrentStep { get; private set; } = 1;

    // Step 1: Quản lý bộ phận cũ
    public string CurrentManagerStatus { get; private set; } = "PENDING";
    public string? CurrentManagerNote { get; private set; }
    public DateTime? CurrentManagerApprovedAt { get; private set; }

    // Step 2: Quản lý bộ phận mới
    public string NewManagerStatus { get; private set; } = "PENDING";
    public string? NewManagerNote { get; private set; }
    public DateTime? NewManagerApprovedAt { get; private set; }

    // Step 3: Phòng HR
    public string HrStatus { get; private set; } = "PENDING";
    public string? HrNote { get; private set; }
    public DateTime? HrApprovedAt { get; private set; }

    // Step 4: Ban Giám Đốc
    public string DirectorStatus { get; private set; } = "PENDING";
    public string? DirectorNote { get; private set; }
    public DateTime? DirectorApprovedAt { get; private set; }

    // Step 5: Nhân viên Tiếp nhận & Xác nhận
    public string EmployeeAckStatus { get; private set; } = "PENDING";
    public string? EmployeeAckNote { get; private set; }
    public DateTime? EmployeeAcknowledgedAt { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual EmployeeProfile Employee { get; private set; } = null!;
    public virtual Department? OldDepartment { get; private set; }
    public virtual Department? NewDepartment { get; private set; }
    public virtual User? Approver { get; private set; }
    #endregion

    protected EmployeeJobHistory()
    {
    }

    public static EmployeeJobHistory Create(
        long tenantId,
        long employeeId,
        string? decisionNumber,
        TransferChangeType changeType,
        long? oldDepartmentId,
        long? newDepartmentId,
        string? oldJobTitle,
        string? newJobTitle,
        long? oldManagerId,
        long? newManagerId,
        DateOnly effectiveDate,
        string? note = null,
        TransferApprovalStatus approvalStatus = TransferApprovalStatus.PENDING_APPROVAL)
    {
        if (employeeId <= 0)
            throw new DomainException("Mã nhân sự không hợp lệ.");

        return new EmployeeJobHistory
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            DecisionNumber = decisionNumber?.Trim().ToUpper(),
            ChangeType = changeType,
            OldDepartmentId = oldDepartmentId,
            NewDepartmentId = newDepartmentId,
            OldJobTitle = oldJobTitle?.Trim(),
            NewJobTitle = newJobTitle?.Trim(),
            OldManagerId = oldManagerId,
            NewManagerId = newManagerId,
            EffectiveDate = effectiveDate,
            Note = note?.Trim(),
            ApprovalStatus = approvalStatus,
            CreatedAt = DateTime.UtcNow
        };
    }

    public bool ApproveStep(int step, long reviewerId, string? note)
    {
        if (reviewerId <= 0)
            throw new DomainException("Mã người phê duyệt không hợp lệ.");

        if (ApprovalStatus == TransferApprovalStatus.REJECTED || ApprovalStatus == TransferApprovalStatus.CANCELLED)
            throw new DomainException($"Không thể phê duyệt lệnh điều động ở trạng thái '{ApprovalStatus}'.");

        var now = DateTime.UtcNow;
        bool isDirectorApproved = false;

        switch (step)
        {
            case 1:
                CurrentManagerStatus = "APPROVED";
                CurrentManagerNote = note?.Trim();
                CurrentManagerApprovedAt = now;
                CurrentStep = 2;
                break;
            case 2:
                NewManagerStatus = "APPROVED";
                NewManagerNote = note?.Trim();
                NewManagerApprovedAt = now;
                CurrentStep = 3;
                break;
            case 3:
                HrStatus = "APPROVED";
                HrNote = note?.Trim();
                HrApprovedAt = now;
                CurrentStep = 4;
                break;
            case 4:
                DirectorStatus = "APPROVED";
                DirectorNote = note?.Trim();
                DirectorApprovedAt = now;
                ApprovalStatus = TransferApprovalStatus.APPROVED;
                ApproverId = reviewerId;
                ApprovedAt = now;
                CurrentStep = 5; // Tiến tới bước Nhân viên xác nhận
                isDirectorApproved = true;
                break;
            default:
                throw new DomainException($"Cấp phê duyệt {step} không hợp lệ.");
        }

        UpdatedAt = now;
        return isDirectorApproved;
    }

    public void AcknowledgeByEmployee(long employeeId, string? note)
    {
        if (EmployeeId != employeeId)
            throw new DomainException("Chỉ nhân viên được điều động mới có thể xác nhận lệnh này.");

        if (ApprovalStatus != TransferApprovalStatus.APPROVED)
            throw new DomainException("Chỉ có thể xác nhận lệnh điều động đã được Ban Giám đốc phê duyệt.");

        EmployeeAckStatus = "ACKNOWLEDGED";
        EmployeeAckNote = note?.Trim();
        EmployeeAcknowledgedAt = DateTime.UtcNow;
        CurrentStep = 6; // Hoàn tất toàn bộ quy trình
        UpdatedAt = DateTime.UtcNow;
    }

    public void Approve(long approverId)
    {
        ApproveStep(4, approverId, "Phê duyệt trực tiếp từ Ban Giám Đốc");
    }

    public void Reject(long approverId, string reason)
    {
        if (approverId <= 0)
            throw new DomainException("Mã người từ chối không hợp lệ.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new DomainException("Vui lòng nhập lý do từ chối lệnh điều động.");

        if (ApprovalStatus == TransferApprovalStatus.APPROVED || ApprovalStatus == TransferApprovalStatus.CANCELLED)
            throw new DomainException($"Không thể từ chối lệnh điều động đã ở trạng thái '{ApprovalStatus}'.");

        ApprovalStatus = TransferApprovalStatus.REJECTED;
        ApproverId = approverId;
        RejectionReason = reason.Trim();
        ApprovedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (ApprovalStatus == TransferApprovalStatus.APPROVED)
            throw new DomainException("Không thể hủy lệnh điều động đã được phê duyệt.");

        ApprovalStatus = TransferApprovalStatus.CANCELLED;
        UpdatedAt = DateTime.UtcNow;
    }
}

