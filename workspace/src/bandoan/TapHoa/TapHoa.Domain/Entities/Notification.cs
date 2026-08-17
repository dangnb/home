using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class Notification : BaseAuditableEntity<Guid>
{
    public string Title { get; private set; }
    public string Message { get; private set; }
    public NotificationType Type { get; private set; }
    public NotificationPriority Priority { get; private set; }
    
    // Target user (null means broadcast to all users, but typically we target specific users like 'root' or specific managers)
    public string? TargetUsername { get; private set; } 
    
    public bool IsRead { get; private set; }
    public DateTime? ReadAt { get; private set; }
    
    public string? ActionUrl { get; private set; }
    public string? ReferenceId { get; private set; }

    private Notification() { } // EF Core

    public Notification(string title, string message, NotificationType type, NotificationPriority priority, 
        string? targetUsername = null, string? actionUrl = null, string? referenceId = null)
    {
        Id = Guid.NewGuid();
        Title = title;
        Message = message;
        Type = type;
        Priority = priority;
        TargetUsername = targetUsername;
        ActionUrl = actionUrl;
        ReferenceId = referenceId;
        IsRead = false;
    }

    public static Notification Create(string title, string message, NotificationType type, NotificationPriority priority, 
        string? targetUsername = null, string? actionUrl = null, string? referenceId = null)
    {
        return new Notification(title, message, type, priority, targetUsername, actionUrl, referenceId);
    }

    public void MarkAsRead()
    {
        if (!IsRead)
        {
            IsRead = true;
            ReadAt = DateTime.UtcNow;
        }
    }
}
