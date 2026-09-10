using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Extensions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Queries;

public class EmployeeTransferDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string DecisionNumber { get; set; } = string.Empty;
    public string ChangeType { get; set; } = string.Empty;
    public long? OldDepartmentId { get; set; }
    public string? OldDepartmentName { get; set; }
    public long? NewDepartmentId { get; set; }
    public string? NewDepartmentName { get; set; }
    public string? OldJobTitle { get; set; }
    public string? NewJobTitle { get; set; }
    public long? OldManagerId { get; set; }
    public string? OldManagerName { get; set; }
    public long? NewManagerId { get; set; }
    public string? NewManagerName { get; set; }
    public string EffectiveDate { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string ApprovalStatus { get; set; } = "PENDING_APPROVAL";
    public long? ApproverId { get; set; }
    public string? ApproverName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }

    // Multi-Step Approval Properties
    public int CurrentStep { get; set; } = 1;
    public string CurrentManagerStatus { get; set; } = "PENDING";
    public string? CurrentManagerNote { get; set; }
    public DateTime? CurrentManagerApprovedAt { get; set; }
    public string NewManagerStatus { get; set; } = "PENDING";
    public string? NewManagerNote { get; set; }
    public DateTime? NewManagerApprovedAt { get; set; }
    public string HrStatus { get; set; } = "PENDING";
    public string? HrNote { get; set; }
    public DateTime? HrApprovedAt { get; set; }
    public string DirectorStatus { get; set; } = "PENDING";
    public string? DirectorNote { get; set; }
    public DateTime? DirectorApprovedAt { get; set; }
    public string EmployeeAckStatus { get; set; } = "PENDING";
    public string? EmployeeAckNote { get; set; }
    public DateTime? EmployeeAcknowledgedAt { get; set; }
}

public class EmployeeTransferSummaryDto
{
    public int TotalTransfers { get; set; }
    public int PendingTransfers { get; set; }
    public int ApprovedTransfers { get; set; }
    public int RejectedTransfers { get; set; }
    public int DepartmentTransfers { get; set; }
    public int Promotions { get; set; }
}

public class GetEmployeeTransfersQuery : IRequest<PaginatedResultDto<EmployeeTransferDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public long? EmployeeId { get; set; }
    public string? ChangeType { get; set; }
    public string? ApprovalStatus { get; set; }
    public string? Keyword { get; set; }
    public DateOnly? FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
}

public class GetEmployeeTransfersQueryHandler : IRequestHandler<GetEmployeeTransfersQuery, PaginatedResultDto<EmployeeTransferDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeTransfersQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<EmployeeTransferDto>> Handle(GetEmployeeTransfersQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE jh.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.EmployeeId.HasValue && request.EmployeeId.Value > 0)
        {
            whereClause += " AND jh.employee_id = @EmployeeId";
            parameters.Add("EmployeeId", request.EmployeeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.ChangeType) && request.ChangeType != "ALL")
        {
            whereClause += " AND jh.change_type = @ChangeType";
            parameters.Add("ChangeType", request.ChangeType);
        }

        if (!string.IsNullOrWhiteSpace(request.ApprovalStatus) && request.ApprovalStatus != "ALL")
        {
            whereClause += " AND jh.approval_status = @ApprovalStatus";
            parameters.Add("ApprovalStatus", request.ApprovalStatus);
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (jh.decision_number LIKE @Keyword OR u.full_name LIKE @Keyword OR jh.new_job_title LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (request.FromDate.HasValue)
        {
            whereClause += " AND jh.effective_date >= @FromDate";
            parameters.Add("FromDate", request.FromDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        if (request.ToDate.HasValue)
        {
            whereClause += " AND jh.effective_date <= @ToDate";
            parameters.Add("ToDate", request.ToDate.Value.ToDateTime(TimeOnly.MaxValue));
        }

        var countSql = $@"
            SELECT COUNT(*) 
            FROM employee_job_history jh
            INNER JOIN employee_profiles ep ON jh.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            {whereClause};
        ";

        var dataSql = $@"
            SELECT 
                jh.id AS Id,
                jh.tenant_id AS TenantId,
                jh.employee_id AS EmployeeId,
                u.full_name AS EmployeeName,
                jh.decision_number AS DecisionNumber,
                jh.change_type AS ChangeType,
                jh.old_department_id AS OldDepartmentId,
                d_old.name AS OldDepartmentName,
                jh.new_department_id AS NewDepartmentId,
                d_new.name AS NewDepartmentName,
                jh.old_job_title AS OldJobTitle,
                jh.new_job_title AS NewJobTitle,
                jh.old_manager_id AS OldManagerId,
                m_old.full_name AS OldManagerName,
                jh.new_manager_id AS NewManagerId,
                m_new.full_name AS NewManagerName,
                DATE_FORMAT(jh.effective_date, '%Y-%m-%d') AS EffectiveDate,
                jh.note AS Note,
                jh.approval_status AS ApprovalStatus,
                jh.approver_id AS ApproverId,
                u_app.full_name AS ApproverName,
                jh.approved_at AS ApprovedAt,
                jh.rejection_reason AS RejectionReason,
                jh.created_at AS CreatedAt,
                jh.current_step AS CurrentStep,
                jh.current_manager_status AS CurrentManagerStatus,
                jh.current_manager_note AS CurrentManagerNote,
                jh.current_manager_approved_at AS CurrentManagerApprovedAt,
                jh.new_manager_status AS NewManagerStatus,
                jh.new_manager_note AS NewManagerNote,
                jh.new_manager_approved_at AS NewManagerApprovedAt,
                jh.hr_status AS HrStatus,
                jh.hr_note AS HrNote,
                jh.hr_approved_at AS HrApprovedAt,
                jh.director_status AS DirectorStatus,
                jh.director_note AS DirectorNote,
                jh.director_approved_at AS DirectorApprovedAt,
                jh.employee_ack_status AS EmployeeAckStatus,
                jh.employee_ack_note AS EmployeeAckNote,
                jh.employee_acknowledged_at AS EmployeeAcknowledgedAt
            FROM employee_job_history jh
            INNER JOIN employee_profiles ep ON jh.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d_old ON jh.old_department_id = d_old.id
            LEFT JOIN departments d_new ON jh.new_department_id = d_new.id
            LEFT JOIN users m_old ON jh.old_manager_id = m_old.id
            LEFT JOIN users m_new ON jh.new_manager_id = m_new.id
            LEFT JOIN users u_app ON jh.approver_id = u_app.id
            {whereClause}
            ORDER BY jh.id DESC";

        return await connection.QueryPaginatedAsync<EmployeeTransferDto>(
            countSql,
            dataSql,
            parameters,
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
