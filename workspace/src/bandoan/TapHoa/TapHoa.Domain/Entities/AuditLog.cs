namespace TapHoa.Domain.Entities;

using TapHoa.Domain.Common;

public class AuditLog : BaseEntity<Guid>
{
    public string Action { get; private set; }
    public string RequestName { get; private set; }
    public string RequestData { get; private set; }
    public string Username { get; private set; }
    public DateTime Timestamp { get; private set; }

    private AuditLog() { }

    public static AuditLog Create(string action, string requestName, string requestData, string username)
    {
        return new AuditLog
        {
            Action = action,
            RequestName = requestName,
            RequestData = requestData,
            Username = username,
            Timestamp = DateTime.UtcNow
        };
    }
}
