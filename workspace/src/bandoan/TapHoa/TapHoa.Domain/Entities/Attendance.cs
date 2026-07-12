using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class Attendance : BaseAuditableEntity<Guid>
{
    public string Username { get; private set; } = null!;
    public DateTime Date { get; private set; }
    public DateTime? CheckIn { get; private set; }
    public DateTime? CheckOut { get; private set; }
    public decimal TotalHours { get; private set; }
    public decimal OvertimeHours { get; private set; }
    public int LateMinutes { get; private set; }
    public int EarlyLeaveMinutes { get; private set; }
    public AttendanceStatus Status { get; private set; }
    public string? Notes { get; private set; }

    private Attendance() { } // EF Core

    /// <summary>
    /// Admin creates attendance manually.
    /// </summary>
    public static Attendance CreateManual(string username, DateTime date, DateTime? checkIn, DateTime? checkOut,
        decimal totalHours, decimal overtimeHours, int lateMinutes, int earlyLeaveMinutes,
        AttendanceStatus status, string? notes)
    {
        return new Attendance
        {
            Id = Guid.NewGuid(),
            Username = username,
            Date = date.Date,
            CheckIn = checkIn,
            CheckOut = checkOut,
            TotalHours = totalHours,
            OvertimeHours = overtimeHours,
            LateMinutes = lateMinutes,
            EarlyLeaveMinutes = earlyLeaveMinutes,
            Status = status,
            Notes = notes
        };
    }

    /// <summary>
    /// Employee checks in. Detects late automatically.
    /// </summary>
    public static Attendance CheckInNow(string username, TimeSpan shiftStart, int lateThresholdMinutes = 15)
    {
        var now = DateTime.UtcNow;
        var scheduledStart = now.Date.Add(shiftStart);
        var lateMinutes = 0;
        var status = AttendanceStatus.Present;

        if (now > scheduledStart.AddMinutes(lateThresholdMinutes))
        {
            lateMinutes = (int)(now - scheduledStart).TotalMinutes;
            status = AttendanceStatus.Late;
        }

        return new Attendance
        {
            Id = Guid.NewGuid(),
            Username = username,
            Date = now.Date,
            CheckIn = now,
            TotalHours = 0,
            OvertimeHours = 0,
            LateMinutes = lateMinutes,
            EarlyLeaveMinutes = 0,
            Status = status
        };
    }

    /// <summary>
    /// Employee checks out. Calculates total hours and overtime.
    /// </summary>
    public void DoCheckOut(TimeSpan shiftEnd, decimal standardHoursPerDay = 8m)
    {
        if (CheckIn == null)
            throw new InvalidOperationException("Cannot check out without checking in first.");

        CheckOut = DateTime.UtcNow;

        var worked = (decimal)(CheckOut.Value - CheckIn.Value).TotalHours;
        TotalHours = Math.Round(Math.Max(0, worked), 2);
        OvertimeHours = Math.Round(Math.Max(0, TotalHours - standardHoursPerDay), 2);

        var scheduledEnd = Date.Add(shiftEnd);
        if (CheckOut.Value < scheduledEnd.AddMinutes(-15))
        {
            EarlyLeaveMinutes = (int)(scheduledEnd - CheckOut.Value).TotalMinutes;
            if (Status == AttendanceStatus.Present)
                Status = AttendanceStatus.EarlyLeave;
        }
    }

    public void Update(DateTime? checkIn, DateTime? checkOut, decimal totalHours, decimal overtimeHours,
        int lateMinutes, int earlyLeaveMinutes, AttendanceStatus status, string? notes)
    {
        CheckIn = checkIn;
        CheckOut = checkOut;
        TotalHours = totalHours;
        OvertimeHours = overtimeHours;
        LateMinutes = lateMinutes;
        EarlyLeaveMinutes = earlyLeaveMinutes;
        Status = status;
        Notes = notes;
    }
}
