using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Attendances.Queries;

public class AttendanceDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long UserId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string WorkDate { get; set; } = string.Empty;
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public int LateMinutes { get; set; }
    public int EarlyMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class GetAttendancesQuery : IRequest<ApiResponseDto<List<AttendanceDto>>>
{
    public long? UserId { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
}

public class GetAttendancesQueryHandler : IRequestHandler<GetAttendancesQuery, ApiResponseDto<List<AttendanceDto>>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetAttendancesQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ApiResponseDto<List<AttendanceDto>>> Handle(GetAttendancesQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE a.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.UserId.HasValue && request.UserId.Value > 0)
        {
            whereClause += " AND a.user_id = @UserId";
            parameters.Add("UserId", request.UserId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.StartDate))
        {
            whereClause += " AND a.work_date >= @StartDate";
            parameters.Add("StartDate", request.StartDate);
        }

        if (!string.IsNullOrWhiteSpace(request.EndDate))
        {
            whereClause += " AND a.work_date <= @EndDate";
            parameters.Add("EndDate", request.EndDate);
        }

        var sql = $@"
            SELECT 
                a.id AS Id, 
                a.tenant_id AS TenantId, 
                a.user_id AS UserId, 
                u.full_name AS EmployeeName,
                DATE_FORMAT(a.work_date, '%Y-%m-%d') AS WorkDate, 
                a.check_in AS CheckIn, 
                a.check_out AS CheckOut, 
                a.late_minutes AS LateMinutes, 
                a.early_minutes AS EarlyMinutes,
                a.status AS Status, 
                a.created_at AS CreatedAt
            FROM attendances a
            INNER JOIN users u ON a.user_id = u.id
            {whereClause}
            ORDER BY a.work_date DESC, a.id DESC;
        ";

        var items = (await connection.QueryAsync<AttendanceDto>(sql, parameters)).ToList();
        return ApiResponseDto<List<AttendanceDto>>.Ok(items);
    }
}
