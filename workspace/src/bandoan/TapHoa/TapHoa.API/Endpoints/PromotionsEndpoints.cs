using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Promotions.Commands;
using TapHoa.Application.Promotions.Queries;

namespace TapHoa.API.Endpoints;

public static class PromotionsEndpoints
{
    public static RouteGroupBuilder MapPromotionsEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", async ([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string? searchTerm, IMediator mediator) =>
        {
            var query = new GetPagedPromotionsQuery
            {
                PageNumber = pageNumber > 0 ? pageNumber : 1,
                PageSize = pageSize > 0 ? pageSize : 10,
                SearchTerm = searchTerm
            };
            return Results.Ok(await mediator.Send(query));
        }).RequireAuthorization();

        group.MapGet("/active", async (IMediator mediator) =>
        {
            return Results.Ok(await mediator.Send(new GetActivePromotionsQuery()));
        }).RequireAuthorization();

        group.MapGet("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetPromotionByIdQuery { Id = id });
            return result != null ? Results.Ok(result) : Results.NotFound();
        }).RequireAuthorization();

        group.MapPost("/", async (CreatePromotionCommand command, IMediator mediator) =>
        {
            var id = await mediator.Send(command);
            return Results.Created($"/api/v1/promotions/{id}", id);
        }).RequireAuthorization();

        group.MapPut("/{id:guid}", async (Guid id, UpdatePromotionCommand command, IMediator mediator) =>
        {
            if (id != command.Id) return Results.BadRequest();
            var success = await mediator.Send(command);
            return success ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization();

        group.MapPut("/{id:guid}/toggle", async (Guid id, TogglePromotionStatusCommand command, IMediator mediator) =>
        {
            if (id != command.Id) return Results.BadRequest();
            var success = await mediator.Send(command);
            return success ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization();

        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var success = await mediator.Send(new DeletePromotionCommand { Id = id });
            return success ? Results.NoContent() : Results.NotFound();
        }).RequireAuthorization();

        return group;
    }
}
