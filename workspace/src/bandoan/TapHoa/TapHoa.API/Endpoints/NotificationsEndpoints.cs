using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Notifications.Commands.MarkAsRead;
using TapHoa.Application.Notifications.Queries.GetNotifications;
using TapHoa.Application.Notifications.Queries.GetUnreadCount;

namespace TapHoa.API.Endpoints;

public static class NotificationsEndpoints
{
    public static void MapNotificationsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").RequireAuthorization();

        group.MapGet("/", async (ISender sender, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] bool unreadOnly = false) =>
        {
            var result = await sender.Send(new GetNotificationsQuery(pageNumber, pageSize, unreadOnly));
            return Results.Ok(result);
        });

        group.MapGet("/unread-count", async (ISender sender) =>
        {
            var result = await sender.Send(new GetUnreadCountQuery());
            return Results.Ok(new { Count = result });
        });

        group.MapPut("/{id}/read", async (Guid id, ISender sender) =>
        {
            await sender.Send(new MarkNotificationAsReadCommand(id));
            return Results.NoContent();
        });

        group.MapPut("/read-all", async (ISender sender) =>
        {
            await sender.Send(new MarkAllNotificationsAsReadCommand());
            return Results.NoContent();
        });
    }
}
