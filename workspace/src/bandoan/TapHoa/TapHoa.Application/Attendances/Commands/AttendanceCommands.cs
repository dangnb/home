using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Attendances.Commands;

// ── Check-In ──
public class CheckInCommand : IRequest<Guid>
{
    public TimeSpan ShiftStart { get; set; } = new TimeSpan(7, 0, 0); // default 07:00
}

public class CheckInCommandHandler : IRequestHandler<CheckInCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CheckInCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CheckInCommand request, CancellationToken cancellationToken)
    {
        var username = _currentUserService.UserName
            ?? throw new UnauthorizedAccessException("User not authenticated.");

        var today = DateTime.UtcNow.Date;
        var existing = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Username == username && a.Date == today && !a.IsDeleted, cancellationToken);

        if (existing != null)
            throw new InvalidOperationException("Already checked in today.");

        var attendance = Attendance.CheckInNow(username, request.ShiftStart);
        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync(cancellationToken);
        return attendance.Id;
    }
}

// ── Check-Out ──
public class CheckOutCommand : IRequest<bool>
{
    public TimeSpan ShiftEnd { get; set; } = new TimeSpan(17, 0, 0); // default 17:00
    public decimal StandardHoursPerDay { get; set; } = 8m;
}

public class CheckOutCommandHandler : IRequestHandler<CheckOutCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CheckOutCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(CheckOutCommand request, CancellationToken cancellationToken)
    {
        var username = _currentUserService.UserName
            ?? throw new UnauthorizedAccessException("User not authenticated.");

        var today = DateTime.UtcNow.Date;
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Username == username && a.Date == today && a.CheckOut == null && !a.IsDeleted, cancellationToken)
            ?? throw new InvalidOperationException("No open check-in found for today.");

        attendance.DoCheckOut(request.ShiftEnd, request.StandardHoursPerDay);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

// ── Create/Update Attendance (Admin) ──
public class CreateAttendanceCommand : IRequest<Guid>
{
    public Guid? Id { get; set; } // null = create, has value = update
    public string Username { get; set; } = null!;
    public DateTime Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public decimal TotalHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public int LateMinutes { get; set; }
    public int EarlyLeaveMinutes { get; set; }
    public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;
    public string? Notes { get; set; }
}

public class CreateAttendanceCommandHandler : IRequestHandler<CreateAttendanceCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateAttendanceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateAttendanceCommand request, CancellationToken cancellationToken)
    {
        if (request.Id.HasValue)
        {
            // Update existing
            var existing = await _context.Attendances
                .FirstOrDefaultAsync(a => a.Id == request.Id.Value && !a.IsDeleted, cancellationToken)
                ?? throw new InvalidOperationException("Attendance not found.");

            existing.Update(request.CheckIn, request.CheckOut, request.TotalHours, request.OvertimeHours,
                request.LateMinutes, request.EarlyLeaveMinutes, request.Status, request.Notes);
            await _context.SaveChangesAsync(cancellationToken);
            return existing.Id;
        }
        else
        {
            // Create new
            var attendance = Attendance.CreateManual(request.Username, request.Date, request.CheckIn, request.CheckOut,
                request.TotalHours, request.OvertimeHours, request.LateMinutes, request.EarlyLeaveMinutes,
                request.Status, request.Notes);
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync(cancellationToken);
            return attendance.Id;
        }
    }
}
