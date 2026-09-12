using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Projects.Commands;

// ─── Assign Tech Team ─────────────────────────────────────────────────────────

public class AssignTechTeamCommand : IRequest<bool>
{
    public long ProjectId { get; set; }
    public long TechLeadUserId { get; set; }
    public long? TechDepartmentId { get; set; }
    public long[]? MemberUserIds { get; set; }
}

public class AssignTechTeamCommandHandler : IRequestHandler<AssignTechTeamCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AssignTechTeamCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AssignTechTeamCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken)
                      ?? throw new NotFoundException("Dự án không tồn tại.");

        project.AssignTechTeam(request.TechLeadUserId, request.TechDepartmentId);

        // Thêm PM vào danh sách thành viên dự án
        var pmExists = await _context.ProjectMembers
            .AnyAsync(m => m.ProjectId == request.ProjectId && m.UserId == request.TechLeadUserId && m.Status != Domain.Enums.EntityStatus.DELETED, cancellationToken);
        if (!pmExists)
            _context.ProjectMembers.Add(ProjectMember.Create(request.ProjectId, request.TechLeadUserId, "TECH_PM"));

        // Thêm các thành viên khác
        if (request.MemberUserIds != null)
        {
            foreach (var uid in request.MemberUserIds.Where(uid => uid != request.TechLeadUserId))
            {
                var memberExists = await _context.ProjectMembers
                    .AnyAsync(m => m.ProjectId == request.ProjectId && m.UserId == uid && m.Status != Domain.Enums.EntityStatus.DELETED, cancellationToken);
                if (!memberExists)
                    _context.ProjectMembers.Add(ProjectMember.Create(request.ProjectId, uid, "DEV"));
            }
        }

        // Notification cho PM
        var notification = Notification.Create(
            tenantId: tenantId,
            userId: request.TechLeadUserId,
            title: "Bạn được phân công PM dự án",
            message: $"Bạn được chỉ định là Project Manager cho dự án [{project.Code}] - {project.Name}. Vui lòng lập kế hoạch triển khai.",
            notificationType: "PROJECT_ASSIGNED",
            referenceId: project.Id,
            targetUrl: $"/hrm/projects/{project.Id}"
        );
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ─── Update Tech Status ───────────────────────────────────────────────────────

public class UpdateProjectTechStatusCommand : IRequest<bool>
{
    public long ProjectId { get; set; }
    public ProjectTechStatus NewTechStatus { get; set; }
}

public class UpdateProjectTechStatusCommandHandler : IRequestHandler<UpdateProjectTechStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProjectTechStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateProjectTechStatusCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken)
                      ?? throw new NotFoundException("Dự án không tồn tại.");

        project.UpdateTechStatus(request.NewTechStatus);

        // Khi hoàn thành → notify Sales phụ trách
        if (request.NewTechStatus == ProjectTechStatus.COMPLETED)
        {
            var notification = Notification.Create(
                tenantId: tenantId,
                userId: project.SalesUserId,
                title: "Dự án đã nghiệm thu thành công",
                message: $"Dự án [{project.Code}] - {project.Name} đã hoàn tất nghiệm thu và bàn giao khách hàng. Vui lòng tiến hành thu tiền theo hợp đồng.",
                notificationType: "PROJECT_COMPLETED",
                referenceId: project.Id,
                targetUrl: $"/hrm/projects/{project.Id}"
            );
            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ─── Create Milestone ─────────────────────────────────────────────────────────

public class CreateProjectMilestoneCommand : IRequest<long>
{
    public long ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public System.DateOnly? DueDate { get; set; }
    public decimal PaymentPercent { get; set; } = 0;
    public decimal PaymentAmount { get; set; } = 0;
    public int SortOrder { get; set; } = 0;
}

public class CreateProjectMilestoneCommandHandler : IRequestHandler<CreateProjectMilestoneCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateProjectMilestoneCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateProjectMilestoneCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken);
        if (!projectExists) throw new NotFoundException("Dự án không tồn tại.");

        var milestone = ProjectMilestone.Create(request.ProjectId, request.Title,
            request.Description, request.DueDate, request.PaymentPercent, request.PaymentAmount, request.SortOrder);

        _context.ProjectMilestones.Add(milestone);
        await _context.SaveChangesAsync(cancellationToken);
        return milestone.Id;
    }
}

// ─── Create Task ──────────────────────────────────────────────────────────────

public class CreateProjectTaskCommand : IRequest<long>
{
    public long ProjectId { get; set; }
    public long? MilestoneId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectTaskType TaskType { get; set; } = ProjectTaskType.DEVELOPMENT;
    public ProjectTaskPriority Priority { get; set; } = ProjectTaskPriority.MEDIUM;
    public long? AssigneeUserId { get; set; }
    public decimal EstimatedHours { get; set; } = 0;
    public System.DateOnly? DueDate { get; set; }
    public string? Tags { get; set; }
}

public class CreateProjectTaskCommandHandler : IRequestHandler<CreateProjectTaskCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateProjectTaskCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateProjectTaskCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == request.ProjectId && p.TenantId == tenantId, cancellationToken);
        if (!projectExists) throw new NotFoundException("Dự án không tồn tại.");

        var task = ProjectTask.Create(request.ProjectId, request.Title, request.Description,
            request.TaskType, request.Priority, request.AssigneeUserId,
            _currentUserService.UserId, request.EstimatedHours, request.DueDate, request.MilestoneId, request.Tags);

        _context.ProjectTasks.Add(task);

        // Notify assignee
        if (request.AssigneeUserId.HasValue && request.AssigneeUserId > 0)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId, cancellationToken);
            var notification = Notification.Create(
                tenantId: tenantId,
                userId: request.AssigneeUserId.Value,
                title: "Bạn có công việc mới được phân công",
                message: $"Task [{request.Title}] trong dự án [{project?.Code}] vừa được phân công cho bạn.",
                notificationType: "PROJECT_TASK_ASSIGNED",
                referenceId: request.ProjectId,
                targetUrl: $"/hrm/projects/{request.ProjectId}"
            );
            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return task.Id;
    }
}

// ─── Update Task Progress ─────────────────────────────────────────────────────

public class UpdateProjectTaskProgressCommand : IRequest<bool>
{
    public long TaskId { get; set; }
    public int ProgressPercent { get; set; }
    public decimal ActualHours { get; set; }
    public ProjectTaskStatus NewStatus { get; set; }
    public string? BlockedReason { get; set; }
}

public class UpdateProjectTaskProgressCommandHandler : IRequestHandler<UpdateProjectTaskProgressCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProjectTaskProgressCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateProjectTaskProgressCommand request, CancellationToken cancellationToken)
    {
        var task = await _context.ProjectTasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == request.TaskId, cancellationToken)
            ?? throw new NotFoundException("Công việc không tồn tại.");

        task.UpdateProgress(request.ProgressPercent, request.ActualHours, request.NewStatus, request.BlockedReason);

        // Khi task chuyển sang REVIEW → notify PM
        if (request.NewStatus == ProjectTaskStatus.REVIEW && task.Project.TechLeadUserId.HasValue)
        {
            var notification = Notification.Create(
                tenantId: task.Project.TenantId,
                userId: task.Project.TechLeadUserId.Value,
                title: "Task cần review",
                message: $"Task [{task.Title}] trong dự án [{task.Project.Code}] đã hoàn thành và đang chờ bạn review.",
                notificationType: "PROJECT_TASK_REVIEW",
                referenceId: task.ProjectId,
                targetUrl: $"/hrm/projects/{task.ProjectId}"
            );
            _context.Notifications.Add(notification);
        }

        // Recalculate overall progress
        var allTasks = await _context.ProjectTasks
            .Where(t => t.ProjectId == task.ProjectId && t.Status != EntityStatus.DELETED)
            .ToListAsync(cancellationToken);
        task.Project.RecalculateProgress(allTasks);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
