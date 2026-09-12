using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Hạng mục / Milestone trong dự án — gắn với đợt thanh toán theo tiến độ
/// </summary>
public class ProjectMilestone : BaseEntity
{
    public long ProjectId { get; private set; }

    /// <summary>Tiêu đề hạng mục (VD: "Thiết kế UI/UX", "Phát triển Backend API")</summary>
    public string Title { get; private set; } = string.Empty;

    /// <summary>Mô tả chi tiết deliverable của hạng mục</summary>
    public string? Description { get; private set; }

    /// <summary>Thứ tự sắp xếp hạng mục</summary>
    public int SortOrder { get; private set; } = 0;

    /// <summary>Deadline hoàn thành hạng mục</summary>
    public DateOnly? DueDate { get; private set; }

    /// <summary>Trạng thái hạng mục</summary>
    public ProjectMilestoneStatus MilestoneStatus { get; private set; } = ProjectMilestoneStatus.PENDING;

    /// <summary>Tỷ lệ thanh toán đính kèm milestone này (%)</summary>
    public decimal PaymentPercent { get; private set; } = 0;

    /// <summary>Giá trị thanh toán theo milestone (VNĐ)</summary>
    public decimal PaymentAmount { get; private set; } = 0;

    /// <summary>Đã thu tiền milestone này chưa</summary>
    public bool IsPaymentReceived { get; private set; } = false;

    /// <summary>Ngày milestone thực sự hoàn thành</summary>
    public DateOnly? CompletedDate { get; private set; }

    #region Navigation
    public virtual Project Project { get; private set; } = null!;
    #endregion

    protected ProjectMilestone() { }

    public static ProjectMilestone Create(
        long projectId,
        string title,
        string? description,
        DateOnly? dueDate,
        decimal paymentPercent,
        decimal paymentAmount,
        int sortOrder = 0)
    {
        if (projectId <= 0) throw new DomainException("ProjectId không hợp lệ.");
        if (string.IsNullOrWhiteSpace(title)) throw new DomainException("Tiêu đề hạng mục không được để trống.");

        return new ProjectMilestone
        {
            ProjectId = projectId,
            Title = title.Trim(),
            Description = description?.Trim(),
            DueDate = dueDate,
            PaymentPercent = paymentPercent,
            PaymentAmount = paymentAmount,
            SortOrder = sortOrder,
            MilestoneStatus = ProjectMilestoneStatus.PENDING,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string title, string? description, DateOnly? dueDate, decimal paymentPercent, decimal paymentAmount, int sortOrder)
    {
        if (MilestoneStatus == ProjectMilestoneStatus.COMPLETED)
            throw new DomainException("Không thể chỉnh sửa hạng mục đã hoàn thành.");

        Title = title.Trim();
        Description = description?.Trim();
        DueDate = dueDate;
        PaymentPercent = paymentPercent;
        PaymentAmount = paymentAmount;
        SortOrder = sortOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkCompleted()
    {
        MilestoneStatus = ProjectMilestoneStatus.COMPLETED;
        CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkPaymentReceived()
    {
        IsPaymentReceived = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
