namespace EduProCRM.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; private set; }
    public DateTime Timestamp { get; private set; }
    public string OperatorName { get; private set; } = string.Empty;
    public string Action { get; private set; } = string.Empty; // "CREATE_RECEIPT", "LOCK_LEGAL_JOURNAL", "APPROVE_REFUND"
    public string Module { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string IpAddress { get; private set; } = "127.0.0.1";

    public AuditLog() { }

    public static AuditLog Create(string operatorName, string action, string module, string description)
    {
        return new AuditLog
        {
            Id = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
            OperatorName = operatorName,
            Action = action,
            Module = module,
            Description = description
        };
    }
}
