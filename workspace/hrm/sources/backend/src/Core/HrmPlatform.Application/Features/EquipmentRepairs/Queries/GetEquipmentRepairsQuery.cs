using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.EquipmentRepairs.Queries;

public class EquipmentRepairDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string Code { get; set; } = string.Empty;
    public long EquipmentId { get; set; }
    public string EquipmentCode { get; set; } = string.Empty;
    public string EquipmentName { get; set; } = string.Empty;
    public string EquipmentCategory { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    
    public long ReporterUserId { get; set; }
    public string ReporterUserName { get; set; } = string.Empty;
    public string? ReporterDepartmentName { get; set; }
    public DateTime ReportedDate { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    
    public long? TechnicianUserId { get; set; }
    public string? TechnicianUserName { get; set; }
    public DateTime? AssignedDate { get; set; }
    
    public string Status { get; set; } = string.Empty;
    public string? ActualError { get; set; }
    public string? SolutionDetail { get; set; }
    public string? ReplacedParts { get; set; }
    public decimal RepairCost { get; set; }
    
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EquipmentRepairSummaryDto
{
    public int TotalRepairs { get; set; }
    public int PendingRepairs { get; set; }
    public int InProgressRepairs { get; set; }
    public int CompletedRepairs { get; set; }
    public decimal TotalRepairCost { get; set; }
}

public class GetEquipmentRepairsQuery : IRequest<object>
{
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public long? TechnicianUserId { get; set; }
    public long? EquipmentId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetEquipmentRepairsQueryHandler : IRequestHandler<GetEquipmentRepairsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEquipmentRepairsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetEquipmentRepairsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE r.tenant_id = @TenantId AND r.status_entity != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (r.code LIKE @Keyword OR e.code LIKE @Keyword OR e.name LIKE @Keyword OR u_rep.full_name LIKE @Keyword OR u_tech.full_name LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND r.status = @Status";
            parameters.Add("Status", request.Status.Trim().ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(request.Priority) && request.Priority != "ALL")
        {
            whereClause += " AND r.priority = @Priority";
            parameters.Add("Priority", request.Priority.Trim().ToUpper());
        }

        if (request.TechnicianUserId.HasValue && request.TechnicianUserId.Value > 0)
        {
            whereClause += " AND r.technician_user_id = @TechnicianUserId";
            parameters.Add("TechnicianUserId", request.TechnicianUserId.Value);
        }

        if (request.EquipmentId.HasValue && request.EquipmentId.Value > 0)
        {
            whereClause += " AND r.equipment_id = @EquipmentId";
            parameters.Add("EquipmentId", request.EquipmentId.Value);
        }

        // Summary Query
        var summarySql = $@"
            SELECT 
                COUNT(*) AS TotalRepairs,
                SUM(CASE WHEN r.status = 'PENDING' THEN 1 ELSE 0 END) AS PendingRepairs,
                SUM(CASE WHEN r.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS InProgressRepairs,
                SUM(CASE WHEN r.status = 'COMPLETED' THEN 1 ELSE 0 END) AS CompletedRepairs,
                COALESCE(SUM(r.repair_cost), 0) AS TotalRepairCost
            FROM equipment_repairs r
            INNER JOIN equipments e ON r.equipment_id = e.id
            LEFT JOIN users u_rep ON r.reporter_user_id = u_rep.id
            LEFT JOIN users u_tech ON r.technician_user_id = u_tech.id
            {whereClause}";

        var summary = await connection.QueryFirstOrDefaultAsync<EquipmentRepairSummaryDto>(summarySql, parameters) 
                      ?? new EquipmentRepairSummaryDto();

        // Total Count Query
        var countSql = $@"
            SELECT COUNT(*) 
            FROM equipment_repairs r
            INNER JOIN equipments e ON r.equipment_id = e.id
            LEFT JOIN users u_rep ON r.reporter_user_id = u_rep.id
            LEFT JOIN users u_tech ON r.technician_user_id = u_tech.id
            {whereClause}";

        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        // Pagination
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize;
        var offset = (page - 1) * pageSize;
        parameters.Add("Limit", pageSize);
        parameters.Add("Offset", offset);

        var dataSql = $@"
            SELECT 
                r.id AS Id,
                r.tenant_id AS TenantId,
                r.code AS Code,
                r.equipment_id AS EquipmentId,
                e.code AS EquipmentCode,
                e.name AS EquipmentName,
                e.category AS EquipmentCategory,
                e.serial_number AS SerialNumber,
                r.reporter_user_id AS ReporterUserId,
                u_rep.full_name AS ReporterUserName,
                d_rep.name AS ReporterDepartmentName,
                r.reported_date AS ReportedDate,
                r.issue_description AS IssueDescription,
                r.priority AS Priority,
                r.technician_user_id AS TechnicianUserId,
                u_tech.full_name AS TechnicianUserName,
                r.assigned_date AS AssignedDate,
                r.status AS Status,
                r.actual_error AS ActualError,
                r.solution_detail AS SolutionDetail,
                r.replaced_parts AS ReplacedParts,
                r.repair_cost AS RepairCost,
                r.started_at AS StartedAt,
                r.completed_at AS CompletedAt,
                r.note AS Note,
                r.created_at AS CreatedAt
            FROM equipment_repairs r
            INNER JOIN equipments e ON r.equipment_id = e.id
            LEFT JOIN users u_rep ON r.reporter_user_id = u_rep.id
            LEFT JOIN employee_profiles ep_rep ON u_rep.id = ep_rep.user_id
            LEFT JOIN departments d_rep ON ep_rep.department_id = d_rep.id
            LEFT JOIN users u_tech ON r.technician_user_id = u_tech.id
            {whereClause}
            ORDER BY r.created_at DESC
            LIMIT @Limit OFFSET @Offset";

        var items = await connection.QueryAsync<EquipmentRepairDto>(dataSql, parameters);

        return new
        {
            data = items.ToList(),
            summary = summary,
            pagination = new
            {
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        };
    }
}
