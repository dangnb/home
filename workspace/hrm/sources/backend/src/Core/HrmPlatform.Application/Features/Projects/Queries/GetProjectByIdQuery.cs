using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Projects.Queries;

public class ProjectDetailDto : ProjectListDto
{
    public string? CustomerEmail { get; set; }
    public string? ContractFileRef { get; set; }
    public string? Description { get; set; }
    public string? InternalNote { get; set; }
    public string? CancelledReason { get; set; }
    public List<ProjectMilestoneDto> Milestones { get; set; } = new();
    public List<ProjectTaskDetailDto> Tasks { get; set; } = new();
    public List<ProjectMemberDto> Members { get; set; } = new();
}

public class ProjectMilestoneDto
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public string MilestoneStatus { get; set; } = string.Empty;
    public string? DueDate { get; set; }
    public decimal PaymentPercent { get; set; }
    public decimal PaymentAmount { get; set; }
    public bool IsPaymentReceived { get; set; }
    public string? CompletedDate { get; set; }
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }
}

public class ProjectTaskDetailDto
{
    public long Id { get; set; }
    public long? MilestoneId { get; set; }
    public string? MilestoneTitle { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string TaskType { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string TaskStatus { get; set; } = string.Empty;
    public long? AssigneeUserId { get; set; }
    public string? AssigneeUserName { get; set; }
    public string? AssigneeAvatar { get; set; }
    public decimal EstimatedHours { get; set; }
    public decimal ActualHours { get; set; }
    public int ProgressPercent { get; set; }
    public string? StartDate { get; set; }
    public string? DueDate { get; set; }
    public string? CompletedDate { get; set; }
    public string? BlockedReason { get; set; }
    public string? Tags { get; set; }
}

public class ProjectMemberDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string? UserFullName { get; set; }
    public string? JobTitle { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? JoinedDate { get; set; }
    public string? LeftDate { get; set; }
    public string? Note { get; set; }
}

public class GetProjectByIdQuery : IRequest<ProjectDetailDto>
{
    public long Id { get; set; }
}

public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, ProjectDetailDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetProjectByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ProjectDetailDto> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        using var connection = _sqlConnectionFactory.CreateConnection();

        // Main project detail
        var projectSql = @"
            SELECT
                p.id AS Id, p.code AS Code, p.name AS Name,
                p.customer_name AS CustomerName, p.customer_contact_name AS CustomerContactName,
                p.customer_phone AS CustomerPhone, p.customer_email AS CustomerEmail,
                p.project_type AS ProjectType, p.priority AS Priority,
                p.sales_status AS SalesStatus, p.tech_status AS TechStatus,
                p.sales_user_id AS SalesUserId, su.full_name AS SalesUserName,
                p.sales_department_id AS SalesDepartmentId, sd.name AS SalesDepartmentName,
                p.tech_lead_user_id AS TechLeadUserId, tu.full_name AS TechLeadUserName,
                p.tech_department_id AS TechDepartmentId, td.name AS TechDepartmentName,
                p.quoted_value AS QuotedValue, p.contract_value AS ContractValue,
                p.contract_signed_date AS ContractSignedDate, p.contract_file_ref AS ContractFileRef,
                p.warranty_months AS WarrantyMonths, p.warranty_end_date AS WarrantyEndDate,
                p.planned_start_date AS PlannedStartDate, p.planned_end_date AS PlannedEndDate,
                p.actual_start_date AS ActualStartDate, p.actual_end_date AS ActualEndDate,
                p.overall_progress_percent AS OverallProgressPercent,
                p.description AS Description, p.internal_note AS InternalNote,
                p.cancelled_reason AS CancelledReason,
                CASE WHEN p.planned_end_date < CURDATE() AND p.tech_status NOT IN ('COMPLETED', 'NOT_APPLICABLE') THEN 1 ELSE 0 END AS IsOverdue,
                DATEDIFF(p.planned_end_date, CURDATE()) AS DaysUntilDeadline,
                p.created_at AS CreatedAt,
                0 AS TotalTasks, 0 AS CompletedTasks, 0 AS BlockedTasks,
                0 AS TotalMilestones, 0 AS CompletedMilestones
            FROM projects p
            LEFT JOIN users su ON p.sales_user_id = su.id
            LEFT JOIN departments sd ON p.sales_department_id = sd.id
            LEFT JOIN users tu ON p.tech_lead_user_id = tu.id
            LEFT JOIN departments td ON p.tech_department_id = td.id
            WHERE p.id = @Id AND p.tenant_id = @TenantId AND p.status != 'DELETED'";

        var project = await connection.QueryFirstOrDefaultAsync<ProjectDetailDto>(projectSql, new { request.Id, TenantId = tenantId });
        if (project == null)
            throw new NotFoundException("Dự án không tồn tại hoặc đã bị xóa.");

        // Milestones
        var milestoneSql = @"
            SELECT m.id AS Id, m.title AS Title, m.description AS Description,
                m.sort_order AS SortOrder, m.milestone_status AS MilestoneStatus,
                m.due_date AS DueDate, m.payment_percent AS PaymentPercent,
                m.payment_amount AS PaymentAmount, m.is_payment_received AS IsPaymentReceived,
                m.completed_date AS CompletedDate,
                COUNT(t.id) AS TaskCount,
                SUM(CASE WHEN t.task_status = 'COMPLETED' THEN 1 ELSE 0 END) AS CompletedTaskCount
            FROM project_milestones m
            LEFT JOIN project_tasks t ON t.milestone_id = m.id AND t.status != 'DELETED'
            WHERE m.project_id = @Id AND m.status != 'DELETED'
            GROUP BY m.id ORDER BY m.sort_order ASC, m.created_at ASC";
        project.Milestones = (await connection.QueryAsync<ProjectMilestoneDto>(milestoneSql, new { request.Id })).ToList();

        // Tasks
        var taskSql = @"
            SELECT t.id AS Id, t.milestone_id AS MilestoneId, m.title AS MilestoneTitle,
                t.title AS Title, t.description AS Description,
                t.task_type AS TaskType, t.priority AS Priority, t.task_status AS TaskStatus,
                t.assignee_user_id AS AssigneeUserId, u.full_name AS AssigneeUserName,
                t.estimated_hours AS EstimatedHours, t.actual_hours AS ActualHours,
                t.progress_percent AS ProgressPercent,
                t.start_date AS StartDate, t.due_date AS DueDate, t.completed_date AS CompletedDate,
                t.blocked_reason AS BlockedReason, t.tags AS Tags
            FROM project_tasks t
            LEFT JOIN project_milestones m ON t.milestone_id = m.id
            LEFT JOIN users u ON t.assignee_user_id = u.id
            WHERE t.project_id = @Id AND t.status != 'DELETED'
            ORDER BY t.due_date ASC, t.created_at ASC";
        project.Tasks = (await connection.QueryAsync<ProjectTaskDetailDto>(taskSql, new { request.Id })).ToList();
        project.TotalTasks = project.Tasks.Count;
        project.CompletedTasks = project.Tasks.Count(t => t.TaskStatus == "COMPLETED");
        project.BlockedTasks = project.Tasks.Count(t => t.TaskStatus == "BLOCKED");
        project.TotalMilestones = project.Milestones.Count;
        project.CompletedMilestones = project.Milestones.Count(m => m.MilestoneStatus == "COMPLETED");

        // Members
        var memberSql = @"
            SELECT pm.id AS Id, pm.user_id AS UserId, u.full_name AS UserFullName,
                ep.job_title AS JobTitle, pm.role AS Role,
                pm.joined_date AS JoinedDate, pm.left_date AS LeftDate, pm.note AS Note
            FROM project_members pm
            LEFT JOIN users u ON pm.user_id = u.id
            LEFT JOIN employee_profiles ep ON u.id = ep.user_id
            WHERE pm.project_id = @Id AND pm.status != 'DELETED'
            ORDER BY pm.joined_date ASC";
        project.Members = (await connection.QueryAsync<ProjectMemberDto>(memberSql, new { request.Id })).ToList();

        return project;
    }
}
