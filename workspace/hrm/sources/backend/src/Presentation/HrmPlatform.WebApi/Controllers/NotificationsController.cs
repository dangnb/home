using HrmPlatform.Application.Features.Notifications.Commands;
using HrmPlatform.Application.Features.Notifications.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly ISender _sender;

    public NotificationsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách thông báo của người dùng hiện tại
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNotifications(
        [FromQuery] bool unreadOnly = false,
        [FromQuery] int limit = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetNotificationsQuery { UnreadOnly = unreadOnly, Limit = limit }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Đánh dấu thông báo đã đọc
    /// </summary>
    [HttpPost("{id:long}/read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkRead(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new MarkNotificationReadCommand { Id = id }, cancellationToken);
        return Ok(new { succeeded = true, message = "Đã đánh dấu thông báo là đã đọc." });
    }

    /// <summary>
    /// Đánh dấu tất cả thông báo là đã đọc
    /// </summary>
    [HttpPost("read-all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkReadAll(CancellationToken cancellationToken = default)
    {
        await _sender.Send(new MarkNotificationReadAllCommand(), cancellationToken);
        return Ok(new { succeeded = true, message = "Đã đánh dấu tất cả thông báo là đã đọc." });
    }
}
