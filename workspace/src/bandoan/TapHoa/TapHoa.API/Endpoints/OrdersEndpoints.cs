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
            [FromQuery] DateTime? toDate) =>
        {
            var query = new GetOrdersQuery 
            { 
                PageNumber = pageNumber ?? 1, 
                PageSize = pageSize ?? 10,
                SearchTerm = searchTerm,
                FromDate = fromDate,
                ToDate = toDate
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        });

        return group;
    }
}
