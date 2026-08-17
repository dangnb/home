namespace EduProCRM.Domain.Entities;

public class ZaloReminderLog
{
    public Guid Id { get; private set; }
    public DateTime SentAt { get; private set; }
    public string StudentName { get; private set; } = string.Empty;
    public string Channel { get; private set; } = "Zalo ZNS"; // "Zalo ZNS" hoặc "Email"
    public string MessageContent { get; private set; } = string.Empty;
    public decimal DebtAmount { get; private set; }
    public string Status { get; private set; } = "Đã gửi thành công";
    public string OperatorName { get; private set; } = "Hệ thống AutoBot";

    public ZaloReminderLog() { }

    public static ZaloReminderLog Create(
        string studentName,
        string channel,
        string content,
        decimal debtAmount,
        string operatorName)
    {
        return new ZaloReminderLog
        {
            Id = Guid.NewGuid(),
            SentAt = DateTime.UtcNow,
            StudentName = studentName,
            Channel = channel,
            MessageContent = content,
            DebtAmount = debtAmount,
            Status = "Đã gửi thành công",
            OperatorName = operatorName
        };
    }
}
