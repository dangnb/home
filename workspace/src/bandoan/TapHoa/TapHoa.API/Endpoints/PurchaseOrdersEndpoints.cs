using MediatR;
using TapHoa.Application.PurchaseOrders.Commands;
using TapHoa.Application.PurchaseOrders.DTOs;
using TapHoa.Application.PurchaseOrders.Queries;

namespace TapHoa.API.Endpoints;

public static class PurchaseOrdersEndpoints
{
    public static RouteGroupBuilder MapPurchaseOrdersEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Purchase Orders").RequireAuthorization();

        group.MapGet("/", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetPurchaseOrdersQuery());
            return Results.Ok(result);
        });

        group.MapGet("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetPurchaseOrderByIdQuery(id));
            return result != null ? Results.Ok(result) : Results.NotFound();
        });

        group.MapPost("/", async (CreatePurchaseOrderDto dto, IMediator mediator) =>
        {
            var id = await mediator.Send(new CreatePurchaseOrderCommand(dto));
            return Results.Created($"/api/v1/purchase-orders/{id}", new { id });
        });

        group.MapPut("/{id:guid}/status", async (Guid id, UpdatePurchaseOrderStatusDto dto, IMediator mediator) =>
        {
            var success = await mediator.Send(new UpdatePurchaseOrderStatusCommand(id, dto));
            return success ? Results.NoContent() : Results.NotFound();
        });

        return group;
    }
}
