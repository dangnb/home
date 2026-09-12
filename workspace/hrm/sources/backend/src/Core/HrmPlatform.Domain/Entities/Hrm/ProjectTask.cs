using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Công việc kỹ thuật cụ thể trong dự án (Task)
/// </summary>
public class ProjectTask : BaseEntity
{
    public long ProjectId { get; private set; }

    /// <summary>FK → Hạng mục / Milestone cha (nullable — task tổng quát không thuộc milestone nào)</summary>
    public long? MilestoneId { get; private set; }

    /// <summary>Tiêu đề công việc</summary>
    public string Title { get; private set; } = string.Empty;

    /// <summary>Mô tả kỹ thuật chi tiết</summary>
    public string? Description { get; private set; }

    /// <summary>Người được phân công thực hiện</summary>
    public long? AssigneeUserId { get; private set; }

    /// <summary>Người phân công (PM)</summary>
    public long? AssignedByUserId { get; private set; }

    /// <summary>Loại công việc kỹ thuật</summary>
    public ProjectTaskType TaskType { get; private set; } = ProjectTaskType.DEVELOPMENT;

    /// <summary>Mức độ ưu tiên</summary>
    public ProjectTaskPriority Priority { get; private set; } = ProjectTaskPriority.MEDIUM;

    /// <summary>Trạng thái công việc (Kanban)</summary>
    public ProjectTaskStatus TaskStatus { get; private set; } = ProjectTaskStatus.TODO;

    /// <summary>Thời gian ước tính (giờ)</summary>
    public decimal EstimatedHours { get; private set; } = 0;

    /// <summary>Thời gian thực tế đã làm (giờ)</summary>
    public decimal ActualHours { get; private set; } = 0;

    /// <summary>Tiến độ task (0-100%)</summary>
    public int ProgressPercent { get; private set; } = 0;

    /// <summary>Ngày bắt đầu thực tế</summary>
    public DateOnly? StartDate { get; private set; }

    /// <summary>Deadline task</summary>
    public DateOnly? DueDate { get; private set; }

    /// <summary>Ngày hoàn thành thực tế</summary>
    public DateOnly? CompletedDate { get; private set; }

    /// <summary>Lý do tắc nghẽn khi BLOCKED</summary>
    public string? BlockedReason { get; private set; }

    /// <summary>Nhãn / Tags (Feature, Bug, API, UI, ...)</summary>
    public string? Tags { get; private set; }

    #region Navigation
    public virtual Project Project { get; private set; } = null!;
    public virtual ProjectMilestone? Milestone { get; private set; }
    public virtual User? Assignee { get; private set; }
    #endregion

    protected ProjectTask() { }

    public static ProjectTask Create(
        long projectId,
        string title,
        string? description,
        ProjectTaskType taskType,
        ProjectTaskPriority priority,
        long? assigneeUserId,
        long? assignedByUserId,
        decimal estimatedHours,
        DateOnly? dueDate,
        long? milestoneId = null,
        string? tags = null)
    {
        if (projectId <= 0) throw new DomainException("ProjectId không hợp lệ.");
        if (string.IsNullOrWhiteSpace(title)) throw new DomainException("Tiêu đề công việc không được để trống.");

        return new ProjectTask
        {
            ProjectId = projectId,
            MilestoneId = milestoneId,
            Title = title.Trim(),
            Description = description?.Trim(),
            TaskType = taskType,
            Priority = priority,
            AssigneeUserId = assigneeUserId,
            AssignedByUserId = assignedByUserId,
            EstimatedHours = estimatedHours < 0 ? 0 : estimatedHours,
            DueDate = dueDate,
            Tags = tags?.Trim(),
            TaskStatus = ProjectTaskStatus.TODO,
            ProgressPercent = 0,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string title,
        string? description,
        ProjectTaskType taskType,
        ProjectTaskPriority priority,
        long? assigneeUserId,
        decimal estimatedHours,
        DateOnly? dueDate,
        long? milestoneId,
        string? tags)
    {
        Title = title.Trim();
        Description = description?.Trim();
        TaskType = taskType;
        Priority = priority;
        AssigneeUserId = assigneeUserId;
        EstimatedHours = estimatedHours < 0 ? 0 : estimatedHours;
        DueDate = dueDate;
        MilestoneId = milestoneId;
        Tags = tags?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>Kỹ sư cập nhật tiến độ và số giờ thực tế</summary>
    public void UpdateProgress(int progressPercent, decimal actualHours, ProjectTaskStatus newStatus, string? blockedReason = null)
    {
        if (progressPercent < 0 || progressPercent > 100)
            throw new DomainException("Tiến độ phải nằm trong khoảng 0-100%.");

        ProgressPercent = progressPercent;
        ActualHours = actualHours < 0 ? 0 : actualHours;
        TaskStatus = newStatus;

        if (newStatus == ProjectTaskStatus.IN_PROGRESS && StartDate == null)
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow);

        if (newStatus == ProjectTaskStatus.BLOCKED)
        {
            if (string.IsNullOrWhiteSpace(blockedReason))
                throw new DomainException("Vui lòng nhập lý do tắc nghẽn khi đánh dấu BLOCKED.");
            BlockedReason = blockedReason.Trim();
        }
        else
        {
            BlockedReason = null;
        }

        if (newStatus == ProjectTaskStatus.COMPLETED)
        {
            ProgressPercent = 100;
            CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);
        }

        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>PM duyệt task hoàn thành (REVIEW → COMPLETED)</summary>
    public void ApproveReview()
    {
        if (TaskStatus != ProjectTaskStatus.REVIEW)
            throw new DomainException("Task phải ở trạng thái REVIEW để phê duyệt.");

        TaskStatus = ProjectTaskStatus.COMPLETED;
        ProgressPercent = 100;
        CompletedDate = DateOnly.FromDateTime(DateTime.UtcNow);
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>PM từ chối review, trả lại kỹ sư làm tiếp</summary>
    public void RejectReview(string reason)
    {
        if (TaskStatus != ProjectTaskStatus.REVIEW)
            throw new DomainException("Task phải ở trạng thái REVIEW để từ chối.");

        TaskStatus = ProjectTaskStatus.IN_PROGRESS;
        BlockedReason = reason?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
