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

        group.MapGet("/{id:int}", async (int id, [FromServices] ISender sender) =>
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

        return group;
    }
}
