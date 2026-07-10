using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.API.Authorization;
using TapHoa.Domain.Enums;
using TapHoa.Application.Warehouse.Commands;

namespace TapHoa.API.Endpoints;

public static class TransactionsEndpoints
{
    public static RouteGroupBuilder MapTransactionsEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization();

        // NOTE: In the future, we should query transactions using Dapper for high performance.
        // For now, this is just the creation endpoint.

        group.MapPost("/inbound", async ([FromBody] CreateInboundTransactionCommand command, [FromServices] ISender sender, System.Security.Claims.ClaimsPrincipal user) =>
        {
            var username = user.Identity?.Name ?? "System";
            var finalCommand = command with { CreatedBy = username };

            var id = await sender.Send(finalCommand);
            return Results.Ok(new { Id = id, Message = "Inbound Transaction created successfully as Draft." });
        })
        .WithName("CreateInboundTransaction")
        .WithDescription("Creates a new inbound transaction (Draft)")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.CreateProducts); // For now tying it to CreateProducts permission

        group.MapPost("/outbound", async ([FromBody] CreateOutboundTransactionCommand command, [FromServices] ISender sender, System.Security.Claims.ClaimsPrincipal user) =>
        {
            var username = user.Identity?.Name ?? "System";
            var finalCommand = command with { CreatedBy = username };

            var id = await sender.Send(finalCommand);
            return Results.Ok(new { Id = id, Message = "Outbound Transaction created successfully as Draft." });
        })
        .WithName("CreateOutboundTransaction")
        .WithDescription("Creates a new outbound transaction (Draft)")
        .RequireAuthorization();

        group.MapPost("/wastage", async ([FromBody] CreateWastageTransactionCommand command, [FromServices] ISender sender, System.Security.Claims.ClaimsPrincipal user) =>
        {
            var username = user.Identity?.Name ?? "System";
            var finalCommand = command with { CreatedBy = username };

            var id = await sender.Send(finalCommand);
            return Results.Ok(new { Id = id, Message = "Wastage Transaction created successfully as Draft." });
        })
        .WithName("CreateWastageTransaction")
        .WithDescription("Creates a new wastage/damage transaction (Draft)")
        .RequireAuthorization();

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateTransactionCommand command, [FromServices] ISender sender) =>
        {
            if (id != command.TransactionId) return Results.BadRequest("ID mismatch");

            var result = await sender.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateTransaction")
        .RequireAuthorization();

        group.MapPost("/{id:guid}/approve", async (Guid id, [FromServices] ISender sender, System.Security.Claims.ClaimsPrincipal user) =>
        {
            var username = user.Identity?.Name ?? "System";
            var result = await sender.Send(new ApproveTransactionCommand(id, username));
            return Results.Ok(new { Success = result, Message = "Transaction approved and stock updated successfully." });
        })
        .WithName("ApproveTransaction")
        .RequireAuthorization();

        group.MapDelete("/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new DeleteTransactionCommand(id));
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteTransaction")
        .RequireAuthorization();

        group.MapGet("/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetTransactionByIdQuery(id));
            return result is not null ? Results.Ok(result) : Results.NotFound();
        })
        .WithName("GetTransactionById")
        .RequireAuthorization();

        group.MapGet("/", async ([FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetTransactionsQuery());
            return Results.Ok(result);
        })
        .WithName("GetTransactions")
        .RequireAuthorization();

        group.MapGet("/product/{productId:guid}", async (Guid productId, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetProductTransactionHistoryQuery(productId));
            return Results.Ok(result);
        })
        .WithName("GetProductTransactionHistory")
        .RequireAuthorization();

        group.MapPost("/adjust", async ([FromBody] CreateAdjustmentTransactionCommand command, [FromServices] ISender sender, System.Security.Claims.ClaimsPrincipal user) =>
        {
            var username = user.Identity?.Name ?? "System";
            var finalCommand = command with { CreatedBy = username };

            var id = await sender.Send(finalCommand);
            return Results.Ok(new { Id = id, Message = "Stock adjusted successfully." });
        })
        .WithName("AdjustmentTransaction")
        .RequireAuthorization();

        group.MapGet("/stock", async ([FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetStockLevelsQuery());
            return Results.Ok(result);
        })
        .WithName("GetStockLevels")
        .RequireAuthorization();

        group.MapGet("/low-stock", async ([FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetLowStockProductsQuery());
            return Results.Ok(result);
        })
        .WithName("GetLowStockProducts")
        .RequireAuthorization();

        group.MapGet("/expiring-batches", async ([FromQuery] int? days, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetExpiringBatchesQuery { DaysThreshold = days ?? 30 });
            return Results.Ok(result);
        })
        .WithName("GetExpiringBatches")
        .RequireAuthorization();

        group.MapGet("/suggested-batches/{productId:guid}", async (Guid productId, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new TapHoa.Application.Warehouse.Queries.GetSuggestedBatchesQuery(productId));
            return Results.Ok(result);
        })
        .WithName("GetSuggestedBatches")
        .WithDescription("Gets suggested batches for outbound based on FEFO")
        .RequireAuthorization();

        return group;
    }
}
