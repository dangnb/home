using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class EmployeeShift : BaseAuditableEntity<Guid>
{
    public string Username { get; private set; } // Identifies the employee
    
    public DateTime ShiftDate { get; private set; }
    
    // e.g. "Ca Sáng", "Ca Chiều", "Ca Tối"
    public string ShiftType { get; private set; }
    
    // The specific time range
    public TimeSpan StartTime { get; private set; }
    public TimeSpan EndTime { get; private set; }
    
    public string? Notes { get; private set; }

    private EmployeeShift() { } // EF Core

    public EmployeeShift(string username, DateTime shiftDate, string shiftType, TimeSpan startTime, TimeSpan endTime, string? notes = null)
    {
        Username = username;
        ShiftDate = shiftDate.Date; // Store date only
        ShiftType = shiftType;
        StartTime = startTime;
        EndTime = endTime;
        Notes = notes;
    }

    public void MoveToDate(DateTime newDate)
    {
        ShiftDate = newDate.Date;
    }
}
