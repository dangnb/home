using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Trạng thái xử lý phiếu sửa chữa IT
/// </summary>
public static class EquipmentRepairStatus
{
    public const string PENDING = "PENDING";
    public const string IN_PROGRESS = "IN_PROGRESS";
    public const string COMPLETED = "COMPLETED";
    public const string UNREPAIRABLE = "UNREPAIRABLE";
    public const string CANCELLED = "CANCELLED";
}

/// <summary>
/// Mức độ ưu tiên sự cố báo hỏng
/// </summary>
public static class EquipmentRepairPriority
{
    public const string LOW = "LOW";
    public const string MEDIUM = "MEDIUM";
    public const string HIGH = "HIGH";
    public const string URGENT = "URGENT";
}

/// <summary>
/// Thực thể Phiếu Yêu Cầu Báo Hỏng & Sửa Chữa Thiết Bị IT (Equipment Repair Request)
/// </summary>
public class EquipmentRepair : BaseEntity, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public string Code { get; private set; } = string.Empty;
    public long EquipmentId { get; private set; }
    public long ReporterUserId { get; private set; }
    public DateTime ReportedDate { get; private set; }
    public string IssueDescription { get; private set; } = string.Empty;
    public string Priority { get; private set; } = EquipmentRepairPriority.MEDIUM;
    
    public long? TechnicianUserId { get; private set; }
    public DateTime? AssignedDate { get; private set; }
    
    public string RepairStatus { get; private set; } = EquipmentRepairStatus.PENDING;
    public string? ActualError { get; private set; }
    public string? SolutionDetail { get; private set; }
    public string? ReplacedParts { get; private set; }
    public decimal RepairCost { get; private set; } = 0;
    
    public DateTime? StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public string? Note { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual Equipment Equipment { get; private set; } = null!;
    public virtual User ReporterUser { get; private set; } = null!;
    public virtual User? TechnicianUser { get; private set; }
    #endregion

    protected EquipmentRepair() { }

    public static EquipmentRepair Create(
        long tenantId,
        string code,
        long equipmentId,
        long reporterUserId,
        string issueDescription,
        string priority = EquipmentRepairPriority.MEDIUM,
        string? note = null,
        long? createdBy = null)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã phiếu sửa chữa không được để trống.");

        if (equipmentId <= 0)
            throw new DomainException("Trang thiết bị không hợp lệ.");

        if (reporterUserId <= 0)
            throw new DomainException("Người báo hỏng không hợp lệ.");

        if (string.IsNullOrWhiteSpace(issueDescription))
            throw new DomainException("Mô tả sự cố không được để trống.");

        var repair = new EquipmentRepair
        {
            TenantId = tenantId,
            Code = code.Trim().ToUpper(),
            EquipmentId = equipmentId,
            ReporterUserId = reporterUserId,
            ReportedDate = DateTime.UtcNow,
            IssueDescription = issueDescription.Trim(),
            Priority = string.IsNullOrWhiteSpace(priority) ? EquipmentRepairPriority.MEDIUM : priority.Trim().ToUpper(),
            Note = note?.Trim(),
            CreatedBy = createdBy
        };

        repair.RepairStatus = EquipmentRepairStatus.PENDING;
        return repair;
    }

    public void AssignTechnician(long technicianUserId, long performedBy)
    {
        if (technicianUserId <= 0)
            throw new DomainException("Kỹ thuật viên IT không hợp lệ.");

        TechnicianUserId = technicianUserId;
        AssignedDate = DateTime.UtcNow;
        UpdatedBy = performedBy;
        UpdatedAt = DateTime.UtcNow;

        if (RepairStatus == EquipmentRepairStatus.PENDING)
        {
            RepairStatus = EquipmentRepairStatus.IN_PROGRESS;
            StartedAt = DateTime.UtcNow;
        }
    }

    public void UpdateProgress(
        string status,
        string? actualError,
        string? solutionDetail,
        string? replacedParts,
        decimal? repairCost,
        string? note,
        long performedBy)
    {
        if (string.IsNullOrWhiteSpace(status))
            throw new DomainException("Trạng thái xử lý không được để trống.");

        var newStatus = status.Trim().ToUpper();

        if (actualError != null)
            ActualError = actualError.Trim();

        if (solutionDetail != null)
            SolutionDetail = solutionDetail.Trim();

        if (replacedParts != null)
            ReplacedParts = replacedParts.Trim();

        if (repairCost.HasValue && repairCost.Value >= 0)
            RepairCost = repairCost.Value;

        if (note != null)
            Note = note.Trim();

        UpdatedBy = performedBy;
        UpdatedAt = DateTime.UtcNow;

        if (newStatus == EquipmentRepairStatus.IN_PROGRESS && RepairStatus == EquipmentRepairStatus.PENDING)
        {
            StartedAt ??= DateTime.UtcNow;
        }
        else if (newStatus == EquipmentRepairStatus.COMPLETED || newStatus == EquipmentRepairStatus.UNREPAIRABLE)
        {
            CompletedAt = DateTime.UtcNow;
        }

        RepairStatus = newStatus;
    }
}
