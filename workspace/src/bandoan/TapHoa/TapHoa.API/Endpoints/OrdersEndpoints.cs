using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Orders.Commands;
using TapHoa.Application.Orders.Queries;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Endpoints;

public static class OrdersEndpoints
{
    public static RouteGroupBuilder MapOrdersEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization();

        group.MapPost("/", async (IMediator mediator, [FromBody] CreateOrderCommand command) =>
        {
            var result = await mediator.Send(command);
            return Results.Ok(new { Id = result });
        });

        group.MapGet("/", async (IMediator mediator, 
            [FromQuery] int? pageNumber, 
            [FromQuery] int? pageSize, 
            [FromQuery] string? searchTerm,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] OrderStatus? status) =>
        {
            var query = new GetOrdersQuery 
            { 
                PageNumber = pageNumber ?? 1, 
                PageSize = pageSize ?? 10,
                SearchTerm = searchTerm,
                FromDate = fromDate,
                ToDate = toDate,
                Status = status
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        });

        group.MapPut("/{id:guid}/cancel", async (IMediator mediator, Guid id) =>
        {
            var result = await mediator.Send(new CancelOrderCommand(id));
            return Results.Ok(new { success = result, message = "Đơn hàng đã được hủy thành công." });
        });

        group.MapPut("/{id:guid}/approve", async (IMediator mediator, Guid id) =>
        {
            var result = await mediator.Send(new ApproveOrderCommand(id));
            return Results.Ok(new { success = result, message = "Đơn hàng đã được duyệt thành công." });
        });

        return group;
    }
}
