using System;
using System.Collections.Generic;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể Dự án - đại diện toàn bộ vòng đời dự án từ Lead đến Nghiệm thu
/// </summary>
public class Project : BaseEntity, ITenantScopedEntity
{
    public long TenantId { get; set; }

    /// <summary>Mã dự án tự sinh, định dạng DPA-[YEAR]-[SEQ]</summary>
    public string Code { get; private set; } = string.Empty;

    /// <summary>Tên dự án</summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>Tên khách hàng / tổ chức</summary>
    public string CustomerName { get; private set; } = string.Empty;

    /// <summary>Người đầu mối liên hệ bên khách hàng</summary>
    public string? CustomerContactName { get; private set; }

    /// <summary>Số điện thoại liên hệ khách hàng</summary>
    public string? CustomerPhone { get; private set; }

    /// <summary>Email liên hệ khách hàng</summary>
    public string? CustomerEmail { get; private set; }

    /// <summary>ID nhân viên kinh doanh phụ trách</summary>
    public long SalesUserId { get; private set; }

    /// <summary>ID phòng kinh doanh phụ trách</summary>
    public long SalesDepartmentId { get; private set; }

    /// <summary>ID Lead Kỹ thuật / PM được phân công (nullable cho đến khi phân công)</summary>
    public long? TechLeadUserId { get; private set; }

    /// <summary>ID phòng kỹ thuật thực hiện</summary>
    public long? TechDepartmentId { get; private set; }

    /// <summary>Loại hợp đồng / mô hình dự án</summary>
    public ProjectType ProjectType { get; private set; } = ProjectType.FIXED_PRICE;

    /// <summary>Trạng thái kinh doanh (Sales Pipeline)</summary>
    public ProjectSalesStatus SalesStatus { get; private set; } = ProjectSalesStatus.LEAD;

    /// <summary>Trạng thái kỹ thuật / triển khai</summary>
    public ProjectTechStatus TechStatus { get; private set; } = ProjectTechStatus.NOT_APPLICABLE;

    /// <summary>Mức độ ưu tiên dự án</summary>
    public ProjectPriority Priority { get; private set; } = ProjectPriority.MEDIUM;

    /// <summary>Giá trị báo giá ban đầu (VNĐ)</summary>
    public decimal? QuotedValue { get; private set; }

    /// <summary>Giá trị hợp đồng chính thức (VNĐ) - điền khi CONTRACT_SIGNED</summary>
    public decimal? ContractValue { get; private set; }

    /// <summary>Ngày ký hợp đồng</summary>
    public DateOnly? ContractSignedDate { get; private set; }

    /// <summary>Tên file hợp đồng đính kèm (tham chiếu tên file)</summary>
    public string? ContractFileRef { get; private set; }

    /// <summary>Số tháng bảo hành sau nghiệm thu (0 = không bảo hành)</summary>
    public int WarrantyMonths { get; private set; } = 0;

    /// <summary>Ngày kết thúc bảo hành (tính từ ActualEndDate + WarrantyMonths)</summary>
    public DateOnly? WarrantyEndDate { get; private set; }

    /// <summary>Ngày bắt đầu triển khai kỹ thuật dự kiến</summary>
    public DateOnly? PlannedStartDate { get; private set; }

    /// <summary>Deadline bàn giao dự kiến</summary>
    public DateOnly? PlannedEndDate { get; private set; }

    /// <summary>Ngày thực tế bắt đầu triển khai kỹ thuật</summary>
    public DateOnly? ActualStartDate { get; private set; }

    /// <summary>Ngày thực tế nghiệm thu / bàn giao hoàn tất</summary>
    public DateOnly? ActualEndDate { get; private set; }

    /// <summary>Tiến độ tổng thể tự động tính dựa trên Task (0-100%)</summary>
    public int OverallProgressPercent { get; private set; } = 0;

    /// <summary>Mô tả phạm vi dự án, yêu cầu tổng quan</summary>
    public string? Description { get; private set; }

    /// <summary>Ghi chú nội bộ (chỉ xem nội bộ công ty)</summary>
    public string? InternalNote { get; private set; }

    /// <summary>Lý do hủy / thua thầu (khi CLOSED_LOST)</summary>
    public string? CancelledReason { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User SalesUser { get; private set; } = null!;
    public virtual ICollection<ProjectMilestone> Milestones { get; private set; } = new List<ProjectMilestone>();
    public virtual ICollection<ProjectTask> Tasks { get; private set; } = new List<ProjectTask>();
    public virtual ICollection<ProjectMember> Members { get; private set; } = new List<ProjectMember>();
    #endregion

    protected Project() { }

    public static Project Create(
        long tenantId,
        string code,
        string name,
        string customerName,
        long salesUserId,
        long salesDepartmentId,
        ProjectType projectType,
        ProjectPriority priority,
        string? customerContactName = null,
        string? customerPhone = null,
        string? customerEmail = null,
        decimal? quotedValue = null,
        DateOnly? plannedStartDate = null,
        DateOnly? plannedEndDate = null,
        string? description = null,
        string? internalNote = null)
    {
        if (tenantId <= 0) throw new DomainException("TenantId không hợp lệ.");
        if (string.IsNullOrWhiteSpace(code)) throw new DomainException("Mã dự án không được để trống.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Tên dự án không được để trống.");
        if (string.IsNullOrWhiteSpace(customerName)) throw new DomainException("Tên khách hàng không được để trống.");
        if (salesUserId <= 0) throw new DomainException("Nhân viên kinh doanh phụ trách không hợp lệ.");

        return new Project
        {
            TenantId = tenantId,
            Code = code.Trim().ToUpper(),
            Name = name.Trim(),
            CustomerName = customerName.Trim(),
            CustomerContactName = customerContactName?.Trim(),
            CustomerPhone = customerPhone?.Trim(),
            CustomerEmail = customerEmail?.Trim(),
            SalesUserId = salesUserId,
            SalesDepartmentId = salesDepartmentId,
            ProjectType = projectType,
            Priority = priority,
            QuotedValue = quotedValue,
            PlannedStartDate = plannedStartDate,
            PlannedEndDate = plannedEndDate,
            Description = description?.Trim(),
            InternalNote = internalNote?.Trim(),
            SalesStatus = ProjectSalesStatus.LEAD,
            TechStatus = ProjectTechStatus.NOT_APPLICABLE,
            CreatedAt = DateTime.UtcNow
        };
    }

    /// <summary>Cập nhật thông tin chung dự án</summary>
    public void UpdateInfo(
        string name,
        string customerName,
        string? customerContactName,
        string? customerPhone,
        string? customerEmail,
        ProjectType projectType,
        ProjectPriority priority,
        decimal? quotedValue,
        DateOnly? plannedStartDate,
        DateOnly? plannedEndDate,
        string? description,
        string? internalNote)
    {
        if (SalesStatus is ProjectSalesStatus.CLOSED_WON or ProjectSalesStatus.CLOSED_LOST)
            throw new DomainException("Không thể chỉnh sửa dự án đã kết thúc (WON/LOST).");

        Name = name.Trim();
        CustomerName = customerName.Trim();
        CustomerContactName = customerContactName?.Trim();
        CustomerPhone = customerPhone?.Trim();
        CustomerEmail = customerEmail?.Trim();
        ProjectType = projectType;
        Priority = priority;
        QuotedValue = quotedValue;
        PlannedStartDate = plannedStartDate;
        PlannedEndDate = plannedEndDate;
        Description = description?.Trim();
        InternalNote = internalNote?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Chuyển trạng thái KD lên bước tiếp theo (Sales Pipeline)</summary>
    public void AdvanceSalesStatus(ProjectSalesStatus newStatus, string? note = null)
    {
        if (SalesStatus is ProjectSalesStatus.CLOSED_WON or ProjectSalesStatus.CLOSED_LOST)
            throw new DomainException("Dự án đã kết thúc, không thể thay đổi trạng thái kinh doanh.");

        SalesStatus = newStatus;

        // Khi ký hợp đồng → kỹ thuật bắt đầu chờ phân công
        if (newStatus == ProjectSalesStatus.CONTRACT_SIGNED)
            TechStatus = ProjectTechStatus.PENDING_ASSIGNMENT;

        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Ký hợp đồng — điền đủ thông tin bắt buộc</summary>
    public void SignContract(
        decimal contractValue,
        DateOnly contractSignedDate,
        string? contractFileRef,
        int warrantyMonths,
        DateOnly? plannedStartDate,
        DateOnly? plannedEndDate)
    {
        if (contractValue <= 0) throw new DomainException("Giá trị hợp đồng phải lớn hơn 0.");

        ContractValue = contractValue;
        ContractSignedDate = contractSignedDate;
        ContractFileRef = contractFileRef?.Trim();
        WarrantyMonths = warrantyMonths < 0 ? 0 : warrantyMonths;
        if (plannedStartDate.HasValue) PlannedStartDate = plannedStartDate;
        if (plannedEndDate.HasValue) PlannedEndDate = plannedEndDate;

        SalesStatus = ProjectSalesStatus.CONTRACT_SIGNED;
        TechStatus = ProjectTechStatus.PENDING_ASSIGNMENT;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Phân công Team Kỹ thuật</summary>
    public void AssignTechTeam(long techLeadUserId, long? techDepartmentId)
    {
        if (TechStatus != ProjectTechStatus.PENDING_ASSIGNMENT)
            throw new DomainException("Dự án không ở trạng thái chờ phân công kỹ thuật.");

        TechLeadUserId = techLeadUserId;
        TechDepartmentId = techDepartmentId;
        TechStatus = ProjectTechStatus.PLANNING;
        ActualStartDate = DateOnly.FromDateTime(DateTime.UtcNow);
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Cập nhật trạng thái kỹ thuật</summary>
    public void UpdateTechStatus(ProjectTechStatus newTechStatus)
    {
        if (TechStatus == ProjectTechStatus.NOT_APPLICABLE)
            throw new DomainException("Dự án chưa được bàn giao cho kỹ thuật.");

        TechStatus = newTechStatus;

        if (newTechStatus == ProjectTechStatus.COMPLETED)
        {
            ActualEndDate = DateOnly.FromDateTime(DateTime.UtcNow);
            SalesStatus = ProjectSalesStatus.CLOSED_WON;

            if (WarrantyMonths > 0)
            {
                WarrantyEndDate = ActualEndDate.Value.AddMonths(WarrantyMonths);
                TechStatus = ProjectTechStatus.WARRANTY;
            }
        }

        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Tự động cập nhật tiến độ tổng thể dựa trên Tasks</summary>
    public void RecalculateProgress(IEnumerable<ProjectTask> tasks)
    {
        var taskList = tasks as ProjectTask[] ?? System.Linq.Enumerable.ToArray(tasks);
        if (!taskList.Any())
        {
            OverallProgressPercent = 0;
            return;
        }

        decimal totalWeight = 0;
        decimal weightedProgress = 0;

        foreach (var task in taskList)
        {
            var weight = task.EstimatedHours > 0 ? task.EstimatedHours : 1m;
            totalWeight += weight;
            weightedProgress += task.ProgressPercent * weight;
        }

        OverallProgressPercent = totalWeight > 0
            ? (int)Math.Round(weightedProgress / totalWeight)
            : 0;

        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Hủy / đánh dấu thua thầu</summary>
    public void CloseLost(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new DomainException("Vui lòng nhập lý do thua thầu / hủy dự án.");

        SalesStatus = ProjectSalesStatus.CLOSED_LOST;
        CancelledReason = reason.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
