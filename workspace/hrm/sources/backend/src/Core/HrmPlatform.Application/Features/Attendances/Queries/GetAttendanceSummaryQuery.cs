using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Attendances.Queries;

public class AttendanceSummaryDto
{
    public int TotalDays { get; set; }
    public int PresentDays { get; set; }
    public int LateDays { get; set; }
    public int AbsentDays { get; set; }
    public int TotalLateMinutes { get; set; }
    public int TotalEarlyMinutes { get; set; }
}

public class GetAttendanceSummaryQuery : IRequest<ApiResponseDto<AttendanceSummaryDto>>
{
    public long? UserId { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
}

public class GetAttendanceSummaryQueryHandler : IRequestHandler<GetAttendanceSummaryQuery, ApiResponseDto<AttendanceSummaryDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetAttendanceSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ApiResponseDto<AttendanceSummaryDto>> Handle(GetAttendanceSummaryQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = request.UserId ?? _currentUserService.UserId ?? 0;

        var startDate = $"{request.Year}-{request.Month:D2}-01";
        var lastDay = DateTime.DaysInMonth(request.Year, request.Month);
        var endDate = $"{request.Year}-{request.Month:D2}-{lastDay:D2}";

        using var connection = _sqlConnectionFactory.CreateConnection();

        const string sql = @"
            SELECT 
                COUNT(*) AS TotalDays,
                SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) AS PresentDays,
                SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END) AS LateDays,
                SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) AS AbsentDays,
                COALESCE(SUM(late_minutes), 0) AS TotalLateMinutes,
                COALESCE(SUM(early_minutes), 0) AS TotalEarlyMinutes
            FROM attendances
            WHERE tenant_id = @TenantId AND user_id = @UserId
              AND work_date BETWEEN @StartDate AND @EndDate;
        ";

        var summary = await connection.QueryFirstOrDefaultAsync<AttendanceSummaryDto>(sql, new
        {
            TenantId = tenantId,
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate
        }) ?? new AttendanceSummaryDto();

        return ApiResponseDto<AttendanceSummaryDto>.Ok(summary);
    }
}
