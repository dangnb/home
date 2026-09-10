using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Extensions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.LeaveRequests.Queries;

public class LeaveRequestDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long UserId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string? DepartmentName { get; set; }
    public string LeaveType { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public int TotalDays { get; set; } = 1;
    public string? Reason { get; set; }
    public string Status { get; set; } = string.Empty;
    public long? ApproverId { get; set; }
    public string? ApproverName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GetLeaveRequestsQuery : IRequest<PaginatedResultDto<LeaveRequestDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public long? UserId { get; set; }
    public string? Status { get; set; }
    public string? LeaveType { get; set; }
    public string? Keyword { get; set; }
    public string? FromDate { get; set; }
    public string? ToDate { get; set; }
}

public class GetLeaveRequestsQueryHandler : IRequestHandler<GetLeaveRequestsQuery, PaginatedResultDto<LeaveRequestDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetLeaveRequestsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<LeaveRequestDto>> Handle(GetLeaveRequestsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE lr.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.UserId.HasValue && request.UserId.Value > 0)
        {
            whereClause += " AND lr.user_id = @UserId";
            parameters.Add("UserId", request.UserId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL" && request.Status != "All")
        {
            whereClause += " AND lr.status = @Status";
            parameters.Add("Status", request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.LeaveType) && request.LeaveType != "ALL" && request.LeaveType != "All")
        {
            whereClause += " AND lr.leave_type = @LeaveType";
            parameters.Add("LeaveType", request.LeaveType);
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (u.full_name LIKE @Keyword OR lr.reason LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.FromDate))
        {
            whereClause += " AND lr.start_date >= @FromDate";
            parameters.Add("FromDate", request.FromDate);
        }

        if (!string.IsNullOrWhiteSpace(request.ToDate))
        {
            whereClause += " AND lr.start_date <= @ToDate";
            parameters.Add("ToDate", request.ToDate);
        }

        var countSql = $@"
            SELECT COUNT(*) 
            FROM leave_requests lr 
            INNER JOIN users u ON lr.user_id = u.id 
            {whereClause};";

        var dataSql = $@"
            SELECT 
                lr.id AS Id, 
                lr.tenant_id AS TenantId, 
                lr.user_id AS UserId, 
                u.full_name AS EmployeeName,
                d.name AS DepartmentName,
                lr.leave_type AS LeaveType, 
                DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS StartDate, 
                DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS EndDate, 
                (DATEDIFF(lr.end_date, lr.start_date) + 1) AS TotalDays,
                lr.reason AS Reason, 
                lr.status AS Status,
                lr.approver_id AS ApproverId, 
                a.full_name AS ApproverName, 
                lr.created_at AS CreatedAt
            FROM leave_requests lr
            INNER JOIN users u ON lr.user_id = u.id
            LEFT JOIN employee_profiles ep ON u.id = ep.user_id
            LEFT JOIN departments d ON ep.department_id = d.id
            LEFT JOIN users a ON lr.approver_id = a.id
            {whereClause}
            ORDER BY lr.id DESC";

        return await connection.QueryPaginatedAsync<LeaveRequestDto>(
            countSql: countSql,
            dataSql: dataSql,
            parameters: parameters,
            page: request.Page,
            pageSize: request.PageSize
        );
    }
}
