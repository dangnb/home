using System;
using HrmPlatform.Domain.Common;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể thông báo thời gian thực / theo vết công việc cho người dùng
/// </summary>
public class Notification : BaseEntity, ITenantScopedEntity
{
    public long TenantId { get; set; }

    /// <summary>
    /// ID tài khoản User nhận thông báo (FK -> users.id)
    /// </summary>
    public long UserId { get; private set; }

    /// <summary>
    /// Tiêu đề thông báo
    /// </summary>
    public string Title { get; private set; } = string.Empty;

    /// <summary>
    /// Nội dung thông báo chi tiết
    /// </summary>
    public string Message { get; private set; } = string.Empty;

    /// <summary>
    /// Loại thông báo (TRANSFER_STEP, TRANSFER_COMPLETED, TRANSFER_REJECTED, REWARD_STEP...)
    /// </summary>
    public string NotificationType { get; private set; } = string.Empty;

    /// <summary>
    /// ID thực thể liên quan (vd: EmployeeJobHistory.Id)
    /// </summary>
    public long? ReferenceId { get; private set; }

    /// <summary>
    /// Đường dẫn tới màn hình xử lý (vd: /hrm/transfers)
    /// </summary>
    public string? TargetUrl { get; private set; }

    /// <summary>
    /// Trạng thái đã đọc hay chưa
    /// </summary>
    public bool IsRead { get; private set; }

    /// <summary>
    /// Thời điểm xem / đọc thông báo
    /// </summary>
    public DateTime? ReadAt { get; private set; }

    public static Notification Create(
        long tenantId,
        long userId,
        string title,
        string message,
        string notificationType,
        long? referenceId = null,
        string? targetUrl = null)
    {
        return new Notification
        {
            TenantId = tenantId,
            UserId = userId,
            Title = title,
            Message = message,
            NotificationType = notificationType,
            ReferenceId = referenceId,
            TargetUrl = targetUrl,
            IsRead = false
        };
    }

    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTime.UtcNow;
    }
}
