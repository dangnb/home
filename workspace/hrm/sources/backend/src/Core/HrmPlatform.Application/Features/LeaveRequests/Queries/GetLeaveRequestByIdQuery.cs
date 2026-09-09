using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.LeaveRequests.Queries;

public class GetLeaveRequestByIdQuery : IRequest<ApiResponseDto<LeaveRequestDto>>
{
    public long Id { get; set; }
}

public class GetLeaveRequestByIdQueryHandler : IRequestHandler<GetLeaveRequestByIdQuery, ApiResponseDto<LeaveRequestDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetLeaveRequestByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ApiResponseDto<LeaveRequestDto>> Handle(GetLeaveRequestByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        const string sql = @"
            SELECT 
                lr.id AS Id, 
                lr.tenant_id AS TenantId, 
                lr.user_id AS UserId, 
                u.full_name AS EmployeeName,
                lr.leave_type AS LeaveType, 
                DATE_FORMAT(lr.start_date, '%Y-%m-%d') AS StartDate, 
                DATE_FORMAT(lr.end_date, '%Y-%m-%d') AS EndDate, 
                lr.reason AS Reason, 
                lr.status AS Status,
                lr.approver_id AS ApproverId, 
                a.full_name AS ApproverName, 
                lr.created_at AS CreatedAt
            FROM leave_requests lr
            INNER JOIN users u ON lr.user_id = u.id
            LEFT JOIN users a ON lr.approver_id = a.id
            WHERE lr.tenant_id = @TenantId AND lr.id = @Id
            LIMIT 1;
        ";

        var leaveRequest = await connection.QueryFirstOrDefaultAsync<LeaveRequestDto>(sql, new { TenantId = tenantId, Id = request.Id });

        if (leaveRequest == null)
        {
            throw new NotFoundException("Đơn xin nghỉ", request.Id);
        }

        return ApiResponseDto<LeaveRequestDto>.Ok(leaveRequest);
    }
}
