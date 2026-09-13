using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể Phiếu báo hỏng & sửa chữa bảo trì tài sản
/// </summary>
public class MaintenanceTicket : BaseEntity<MaintenanceTicketStatus>, ITenantScopedEntity
{
    public Guid TenantId { get; set; }
    public Guid AssetId { get; private set; }
    public Guid ReportedBy { get; private set; }
    public Guid? TechnicianId { get; private set; }
    public string IssueDescription { get; private set; } = string.Empty;
    public string? ResolutionNotes { get; private set; }
    public decimal RepairCost { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual Asset Asset { get; private set; } = null!;
    public virtual User Reporter { get; private set; } = null!;
    public virtual User? Technician { get; private set; }
    #endregion

    protected MaintenanceTicket() { }

    public static MaintenanceTicket Create(
        Guid tenantId,
        Guid assetId,
        Guid reportedBy,
        string issueDescription)
    {
        if (assetId == Guid.Empty)
            throw new DomainException("AssetId không hợp lệ.");

        if (reportedBy == Guid.Empty)
            throw new DomainException("Người báo hỏng không hợp lệ.");

        if (string.IsNullOrWhiteSpace(issueDescription))
            throw new DomainException("Mô tả sự cố hỏng hóc không được để trống.");

        return new MaintenanceTicket
        {
            TenantId = tenantId,
            AssetId = assetId,
            ReportedBy = reportedBy,
            IssueDescription = issueDescription.Trim(),
            Status = MaintenanceTicketStatus.OPEN,
            RepairCost = 0,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void AssignTechnician(Guid technicianId)
    {
        if (technicianId == Guid.Empty)
            throw new DomainException("ID kỹ thuật viên không hợp lệ.");

        TechnicianId = technicianId;
        if (Status == MaintenanceTicketStatus.OPEN)
        {
            Status = MaintenanceTicketStatus.IN_PROGRESS;
        }
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProgress(string? resolutionNotes, decimal repairCost, MaintenanceTicketStatus newStatus)
    {
        if (repairCost < 0)
            throw new DomainException("Chi phí sửa chữa không được âm.");

        ResolutionNotes = resolutionNotes?.Trim();
        RepairCost = repairCost;
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Resolve(string resolutionNotes, decimal repairCost)
    {
        if (string.IsNullOrWhiteSpace(resolutionNotes))
            throw new DomainException("Cần nhập chi tiết phương án khắc phục.");

        if (repairCost < 0)
            throw new DomainException("Chi phí sửa chữa không được âm.");

        ResolutionNotes = resolutionNotes.Trim();
        RepairCost = repairCost;
        Status = MaintenanceTicketStatus.RESOLVED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = MaintenanceTicketStatus.CANCELLED;
        UpdatedAt = DateTime.UtcNow;
    }
}
