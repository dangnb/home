using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Warehouse.Commands.CreateStockTake;
using TapHoa.Application.Warehouse.Commands.UpdateStockTakeLine;
using TapHoa.Application.Warehouse.Commands.CompleteStockTake;

namespace TapHoa.API.Endpoints;

public static class StockTakesEndpoints
{
    public static RouteGroupBuilder MapStockTakesEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization();

        group.MapPost("/", async ([FromBody] CreateStockTakeCommand command, [FromServices] ISender sender) =>
        {
            var id = await sender.Send(command);
            return Results.Ok(new { Id = id, Message = "Stock take created successfully." });
        })
        .WithName("CreateStockTake")
        .WithDescription("Creates a new stock take (Draft)");

        group.MapPut("/{id:guid}/lines", async (Guid id, [FromBody] UpdateStockTakeLineRequest request, [FromServices] ISender sender) =>
        {
            var command = new UpdateStockTakeLineCommand
            {
                StockTakeId = id,
                LineId = request.LineId,
                ActualQuantity = request.ActualQuantity,
                Reason = request.Reason
            };
            
            await sender.Send(command);
            return Results.NoContent();
        })
        .WithName("UpdateStockTakeLine")
        .WithDescription("Updates the actual quantity of a stock take line");

        group.MapPost("/{id:guid}/complete", async (Guid id, [FromServices] ISender sender, System.Security.Claims.ClaimsPrincipal user) =>
        {
            var username = user.Identity?.Name ?? "System";
            var command = new CompleteStockTakeCommand
            {
                StockTakeId = id,
                CompletedBy = username
            };
            
            await sender.Send(command);
            return Results.Ok(new { Message = "Stock take completed successfully." });
        })
        .WithName("CompleteStockTake")
        .WithDescription("Completes a stock take and generates stock adjustments");

        return group;
    }
}

public class UpdateStockTakeLineRequest
{
    public Guid LineId { get; set; }
    public int ActualQuantity { get; set; }
    public string? Reason { get; set; }
}
