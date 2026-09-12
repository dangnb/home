using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Projects.Queries;

// ─── DTOs ───────────────────────────────────────────────────────────────────

public class ProjectListDto
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerContactName { get; set; }
    public string? CustomerPhone { get; set; }
    public string ProjectType { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string SalesStatus { get; set; } = string.Empty;
    public string TechStatus { get; set; } = string.Empty;
    public long SalesUserId { get; set; }
    public string? SalesUserName { get; set; }
    public long SalesDepartmentId { get; set; }
    public string? SalesDepartmentName { get; set; }
    public long? TechLeadUserId { get; set; }
    public string? TechLeadUserName { get; set; }
    public long? TechDepartmentId { get; set; }
    public string? TechDepartmentName { get; set; }
    public decimal? QuotedValue { get; set; }
    public decimal? ContractValue { get; set; }
    public DateOnly? ContractSignedDate { get; set; }
    public DateOnly? PlannedStartDate { get; set; }
    public DateOnly? PlannedEndDate { get; set; }
    public DateOnly? ActualStartDate { get; set; }
    public DateOnly? ActualEndDate { get; set; }
    public int OverallProgressPercent { get; set; }
    public int WarrantyMonths { get; set; }
    public DateOnly? WarrantyEndDate { get; set; }
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int BlockedTasks { get; set; }
    public int TotalMilestones { get; set; }
    public int CompletedMilestones { get; set; }
    public bool IsOverdue { get; set; }
    public int? DaysUntilDeadline { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProjectSummaryStatsDto
{
    public int TotalProjects { get; set; }
    public int ActiveTechProjects { get; set; }
    public int OverdueProjects { get; set; }
    public int PendingAssignmentProjects { get; set; }
    public decimal TotalContractValue { get; set; }
    public decimal TotalQuotedValue { get; set; }
    public int WonProjects { get; set; }
    public int LostProjects { get; set; }
}

// ─── Query ───────────────────────────────────────────────────────────────────

public class GetProjectsQuery : IRequest<object>
{
    public string? Keyword { get; set; }
    public string? SalesStatus { get; set; }
    public string? TechStatus { get; set; }
    public string? Priority { get; set; }
    public long? SalesUserId { get; set; }
    public long? TechLeadUserId { get; set; }
    public long? SalesDepartmentId { get; set; }
    public long? TechDepartmentId { get; set; }
    public string? ProjectType { get; set; }
    public DateOnly? ContractSignedFrom { get; set; }
    public DateOnly? ContractSignedTo { get; set; }
    public bool? IsOverdue { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetProjectsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE p.tenant_id = @TenantId AND p.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (p.code LIKE @Keyword OR p.name LIKE @Keyword OR p.customer_name LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.SalesStatus) && request.SalesStatus != "ALL")
        {
            whereClause += " AND p.sales_status = @SalesStatus";
            parameters.Add("SalesStatus", request.SalesStatus.Trim().ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(request.TechStatus) && request.TechStatus != "ALL")
        {
            whereClause += " AND p.tech_status = @TechStatus";
            parameters.Add("TechStatus", request.TechStatus.Trim().ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(request.Priority) && request.Priority != "ALL")
        {
            whereClause += " AND p.priority = @Priority";
            parameters.Add("Priority", request.Priority.Trim().ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(request.ProjectType) && request.ProjectType != "ALL")
        {
            whereClause += " AND p.project_type = @ProjectType";
            parameters.Add("ProjectType", request.ProjectType.Trim().ToUpper());
        }

        if (request.SalesUserId.HasValue && request.SalesUserId > 0)
        {
            whereClause += " AND p.sales_user_id = @SalesUserId";
            parameters.Add("SalesUserId", request.SalesUserId.Value);
        }

        if (request.TechLeadUserId.HasValue && request.TechLeadUserId > 0)
        {
            whereClause += " AND p.tech_lead_user_id = @TechLeadUserId";
            parameters.Add("TechLeadUserId", request.TechLeadUserId.Value);
        }

        if (request.SalesDepartmentId.HasValue && request.SalesDepartmentId > 0)
        {
            whereClause += " AND p.sales_department_id = @SalesDepartmentId";
            parameters.Add("SalesDepartmentId", request.SalesDepartmentId.Value);
        }

        if (request.TechDepartmentId.HasValue && request.TechDepartmentId > 0)
        {
            whereClause += " AND p.tech_department_id = @TechDepartmentId";
            parameters.Add("TechDepartmentId", request.TechDepartmentId.Value);
        }

        if (request.ContractSignedFrom.HasValue)
        {
            whereClause += " AND p.contract_signed_date >= @ContractSignedFrom";
            parameters.Add("ContractSignedFrom", request.ContractSignedFrom.Value);
        }

        if (request.ContractSignedTo.HasValue)
        {
            whereClause += " AND p.contract_signed_date <= @ContractSignedTo";
            parameters.Add("ContractSignedTo", request.ContractSignedTo.Value);
        }

        if (request.IsOverdue == true)
        {
            whereClause += " AND p.planned_end_date < CURDATE() AND p.tech_status NOT IN ('COMPLETED', 'NOT_APPLICABLE')";
        }

        // 1. Summary stats
        var summarySql = $@"
            SELECT
                COUNT(*) AS TotalProjects,
                SUM(CASE WHEN p.tech_status NOT IN ('NOT_APPLICABLE', 'COMPLETED', 'WARRANTY') THEN 1 ELSE 0 END) AS ActiveTechProjects,
                SUM(CASE WHEN p.planned_end_date < CURDATE() AND p.tech_status NOT IN ('COMPLETED', 'NOT_APPLICABLE') THEN 1 ELSE 0 END) AS OverdueProjects,
                SUM(CASE WHEN p.tech_status = 'PENDING_ASSIGNMENT' THEN 1 ELSE 0 END) AS PendingAssignmentProjects,
                COALESCE(SUM(p.contract_value), 0) AS TotalContractValue,
                COALESCE(SUM(p.quoted_value), 0) AS TotalQuotedValue,
                SUM(CASE WHEN p.sales_status = 'CLOSED_WON' THEN 1 ELSE 0 END) AS WonProjects,
                SUM(CASE WHEN p.sales_status = 'CLOSED_LOST' THEN 1 ELSE 0 END) AS LostProjects
            FROM projects p
            {whereClause}";

        var stats = await connection.QueryFirstOrDefaultAsync<ProjectSummaryStatsDto>(summarySql, parameters)
                    ?? new ProjectSummaryStatsDto();

        // 2. Count
        var countSql = $"SELECT COUNT(*) FROM projects p {whereClause}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        // 3. Data
        var page = request.Page > 0 ? request.Page : 1;
        var pageSize = request.PageSize > 0 && request.PageSize <= 500 ? request.PageSize : 20;
        var offset = (page - 1) * pageSize;
        parameters.Add("Limit", pageSize);
        parameters.Add("Offset", offset);

        var dataSql = $@"
            SELECT
                p.id AS Id,
                p.code AS Code,
                p.name AS Name,
                p.customer_name AS CustomerName,
                p.customer_contact_name AS CustomerContactName,
                p.customer_phone AS CustomerPhone,
                p.project_type AS ProjectType,
                p.priority AS Priority,
                p.sales_status AS SalesStatus,
                p.tech_status AS TechStatus,
                p.sales_user_id AS SalesUserId,
                su.full_name AS SalesUserName,
                p.sales_department_id AS SalesDepartmentId,
                sd.name AS SalesDepartmentName,
                p.tech_lead_user_id AS TechLeadUserId,
                tu.full_name AS TechLeadUserName,
                p.tech_department_id AS TechDepartmentId,
                td.name AS TechDepartmentName,
                p.quoted_value AS QuotedValue,
                p.contract_value AS ContractValue,
                p.contract_signed_date AS ContractSignedDate,
                p.planned_start_date AS PlannedStartDate,
                p.planned_end_date AS PlannedEndDate,
                p.actual_start_date AS ActualStartDate,
                p.actual_end_date AS ActualEndDate,
                p.overall_progress_percent AS OverallProgressPercent,
                p.warranty_months AS WarrantyMonths,
                p.warranty_end_date AS WarrantyEndDate,
                COALESCE(t.TotalTasks, 0) AS TotalTasks,
                COALESCE(t.CompletedTasks, 0) AS CompletedTasks,
                COALESCE(t.BlockedTasks, 0) AS BlockedTasks,
                COALESCE(m.TotalMilestones, 0) AS TotalMilestones,
                COALESCE(m.CompletedMilestones, 0) AS CompletedMilestones,
                CASE WHEN p.planned_end_date < CURDATE() AND p.tech_status NOT IN ('COMPLETED', 'NOT_APPLICABLE') THEN 1 ELSE 0 END AS IsOverdue,
                DATEDIFF(p.planned_end_date, CURDATE()) AS DaysUntilDeadline,
                p.created_at AS CreatedAt
            FROM projects p
            LEFT JOIN users su ON p.sales_user_id = su.id
            LEFT JOIN departments sd ON p.sales_department_id = sd.id
            LEFT JOIN users tu ON p.tech_lead_user_id = tu.id
            LEFT JOIN departments td ON p.tech_department_id = td.id
            LEFT JOIN (
                SELECT project_id,
                    COUNT(*) AS TotalTasks,
                    SUM(CASE WHEN task_status = 'COMPLETED' THEN 1 ELSE 0 END) AS CompletedTasks,
                    SUM(CASE WHEN task_status = 'BLOCKED' THEN 1 ELSE 0 END) AS BlockedTasks
                FROM project_tasks WHERE status != 'DELETED' GROUP BY project_id
            ) t ON p.id = t.project_id
            LEFT JOIN (
                SELECT project_id,
                    COUNT(*) AS TotalMilestones,
                    SUM(CASE WHEN milestone_status = 'COMPLETED' THEN 1 ELSE 0 END) AS CompletedMilestones
                FROM project_milestones WHERE status != 'DELETED' GROUP BY project_id
            ) m ON p.id = m.project_id
            {whereClause}
            ORDER BY
                FIELD(p.priority, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'),
                p.planned_end_date ASC,
                p.created_at DESC
            LIMIT @Limit OFFSET @Offset";

        var data = (await connection.QueryAsync<ProjectListDto>(dataSql, parameters)).ToList();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        return new
        {
            success = true,
            stats,
            data,
            pagination = new { totalCount, page, pageSize, totalPages }
        };
    }
}
