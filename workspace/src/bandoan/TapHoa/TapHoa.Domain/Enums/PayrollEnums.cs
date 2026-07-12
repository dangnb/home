namespace TapHoa.Domain.Enums;

public enum AttendanceStatus
{
    Present = 1,
    Late = 2,
    EarlyLeave = 3,
    Absent = 4,
    DayOff = 5
}

public enum PayrollPeriodStatus
{
    Draft = 1,
    Calculated = 2,
    Approved = 3,
    Paid = 4
}
