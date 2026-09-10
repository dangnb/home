using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Extensions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.RewardDisciplines.Queries;

public class RewardDisciplineDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string? DepartmentName { get; set; }
    public string Type { get; set; } = string.Empty; // REWARD / DISCIPLINE
    public string Category { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? DecisionNumber { get; set; }
    public string DecisionDate { get; set; } = string.Empty;
    public string EffectiveDate { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Reason { get; set; }
    public string? AttachmentUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public long? ApproverId { get; set; }
    public string? ApproverName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GetRewardDisciplinesQuery : IRequest<PaginatedResultDto<RewardDisciplineDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public long? EmployeeId { get; set; }
    public string? Type { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; }
    public string? Keyword { get; set; }
    public string? FromDate { get; set; }
    public string? ToDate { get; set; }
}

public class GetRewardDisciplinesQueryHandler : IRequestHandler<GetRewardDisciplinesQuery, PaginatedResultDto<RewardDisciplineDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetRewardDisciplinesQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<RewardDisciplineDto>> Handle(GetRewardDisciplinesQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE rd.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.EmployeeId.HasValue && request.EmployeeId.Value > 0)
        {
            whereClause += " AND rd.employee_id = @EmployeeId";
            parameters.Add("EmployeeId", request.EmployeeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Type) && request.Type != "ALL")
        {
            whereClause += " AND rd.type = @Type";
            parameters.Add("Type", request.Type);
        }

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "ALL")
        {
            whereClause += " AND rd.category = @Category";
            parameters.Add("Category", request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND rd.status = @Status";
            parameters.Add("Status", request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (u.full_name LIKE @Keyword OR rd.title LIKE @Keyword OR rd.decision_number LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.FromDate))
        {
            whereClause += " AND rd.decision_date >= @FromDate";
            parameters.Add("FromDate", request.FromDate);
        }

        if (!string.IsNullOrWhiteSpace(request.ToDate))
        {
            whereClause += " AND rd.decision_date <= @ToDate";
            parameters.Add("ToDate", request.ToDate);
        }

        var countSql = $@"
            SELECT COUNT(*) 
            FROM reward_disciplines rd
            INNER JOIN employee_profiles ep ON rd.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            {whereClause};";

        var dataSql = $@"
            SELECT 
                rd.id AS Id, 
                rd.tenant_id AS TenantId, 
                rd.employee_id AS EmployeeId, 
                u.full_name AS EmployeeName,
                ep.job_title AS JobTitle,
                d.name AS DepartmentName,
                rd.type AS Type,
                rd.category AS Category,
                rd.title AS Title,
                rd.decision_number AS DecisionNumber,
                DATE_FORMAT(rd.decision_date, '%Y-%m-%d') AS DecisionDate,
                DATE_FORMAT(rd.effective_date, '%Y-%m-%d') AS EffectiveDate,
                rd.amount AS Amount,
                rd.reason AS Reason,
                rd.attachment_url AS AttachmentUrl,
                rd.status AS Status,
                rd.approver_id AS ApproverId,
                u_app.full_name AS ApproverName,
                rd.approved_at AS ApprovedAt,
                rd.rejection_reason AS RejectionReason,
                rd.created_at AS CreatedAt
            FROM reward_disciplines rd
            INNER JOIN employee_profiles ep ON rd.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d ON ep.department_id = d.id
            LEFT JOIN users u_app ON rd.approver_id = u_app.id
            {whereClause}
            ORDER BY rd.id DESC";

        // Sử dụng Business Common Extension để truy vấn phân trang tự động
        return await connection.QueryPaginatedAsync<RewardDisciplineDto>(
            countSql: countSql,
            dataSql: dataSql,
            parameters: parameters,
            page: request.Page,
            pageSize: request.PageSize
        );
    }
}
