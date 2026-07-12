using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Attendances.Queries;

public class AttendanceDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public DateTime Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public decimal TotalHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public int LateMinutes { get; set; }
    public int EarlyLeaveMinutes { get; set; }
    public AttendanceStatus Status { get; set; }
    public string StatusText => Status switch
    {
        AttendanceStatus.Present => "Có mặt",
        AttendanceStatus.Late => "Đi muộn",
        AttendanceStatus.EarlyLeave => "Về sớm",
        AttendanceStatus.Absent => "Vắng mặt",
        AttendanceStatus.DayOff => "Nghỉ phép",
        _ => "N/A"
    };
    public string? Notes { get; set; }
}

public class GetAttendancesQuery : IRequest<List<AttendanceDto>>
{
    public int Month { get; set; }
    public int Year { get; set; }
    public string? Username { get; set; }
}

public class GetAttendancesQueryHandler : IRequestHandler<GetAttendancesQuery, List<AttendanceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAttendancesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttendanceDto>> Handle(GetAttendancesQuery request, CancellationToken cancellationToken)
    {
        var startDate = new DateTime(request.Year, request.Month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var query = _context.Attendances
            .Where(a => a.Date >= startDate && a.Date <= endDate && !a.IsDeleted);

        if (!string.IsNullOrEmpty(request.Username))
            query = query.Where(a => a.Username == request.Username);

        return await query
            .OrderBy(a => a.Date)
            .ThenBy(a => a.Username)
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                Username = a.Username,
                Date = a.Date,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,
                TotalHours = a.TotalHours,
                OvertimeHours = a.OvertimeHours,
                LateMinutes = a.LateMinutes,
                EarlyLeaveMinutes = a.EarlyLeaveMinutes,
                Status = a.Status,
                Notes = a.Notes
            })
            .ToListAsync(cancellationToken);
    }
}

// ── Get today's attendance for the current user ──
public class GetMyAttendanceTodayQuery : IRequest<AttendanceDto?>
{
}

public class GetMyAttendanceTodayQueryHandler : IRequestHandler<GetMyAttendanceTodayQuery, AttendanceDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetMyAttendanceTodayQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<AttendanceDto?> Handle(GetMyAttendanceTodayQuery request, CancellationToken cancellationToken)
    {
        var username = _currentUserService.UserName;
        if (string.IsNullOrEmpty(username)) return null;

        var today = DateTime.UtcNow.Date;
        return await _context.Attendances
            .Where(a => a.Username == username && a.Date == today && !a.IsDeleted)
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                Username = a.Username,
                Date = a.Date,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,
                TotalHours = a.TotalHours,
                OvertimeHours = a.OvertimeHours,
                LateMinutes = a.LateMinutes,
                EarlyLeaveMinutes = a.EarlyLeaveMinutes,
                Status = a.Status,
                Notes = a.Notes
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
