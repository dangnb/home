namespace TapHoa.Domain.Enums;

public enum NotificationType
{
    System = 1,
    LowStock = 2,
    DebtOverdue = 3,
    ExpenseOverdue = 4,
    ShiftReminder = 5,
    OrderAlert = 6,
    BatchExpiry = 7
}

public enum NotificationPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}
