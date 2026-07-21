using TapHoa.Domain.Enums;

namespace TapHoa.Application.Notifications.DTOs;

public class NotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public NotificationType Type { get; set; }
    public NotificationPriority Priority { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public string? ActionUrl { get; set; }
    public string? ReferenceId { get; set; }
    public DateTime CreatedDate { get; set; }
}
