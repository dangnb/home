using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.ReturnOrders.Commands;
using TapHoa.Application.ReturnOrders.Queries;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Endpoints;

public static class ReturnOrdersEndpoints
{
    public static RouteGroupBuilder MapReturnOrdersEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/", CreateReturnOrder)
            .RequireAuthorization("RequireCashierRole");

        group.MapPost("/{id}/approve", ApproveReturnOrder)
            .RequireAuthorization("RequireManagerRole");

        group.MapGet("/", GetReturnOrders)
            .RequireAuthorization("RequireCashierRole");

        group.MapGet("/{id}", GetReturnOrderById)
            .RequireAuthorization("RequireCashierRole");

        return group;
    }

    private static async Task<IResult> CreateReturnOrder([FromBody] CreateReturnOrderCommand command, IMediator mediator)
    {
        var id = await mediator.Send(command);
        return Results.Created($"/api/v1/return-orders/{id}", id);
    }

    private static async Task<IResult> ApproveReturnOrder(Guid id, IMediator mediator)
    {
        var result = await mediator.Send(new ApproveReturnOrderCommand(id));
        return result ? Results.NoContent() : Results.BadRequest("Approval failed");
    }

    private static async Task<IResult> GetReturnOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        IMediator mediator = null!)
    {
        var query = new GetReturnOrdersQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SearchTerm = searchTerm
        };
        var result = await mediator.Send(query);
        return Results.Ok(result);
    }

    private static async Task<IResult> GetReturnOrderById(Guid id, IMediator mediator)
    {
        var result = await mediator.Send(new GetReturnOrderByIdQuery(id));
        return result != null ? Results.Ok(result) : Results.NotFound();
    }
}
