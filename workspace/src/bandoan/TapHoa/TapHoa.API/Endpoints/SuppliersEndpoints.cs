using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Suppliers.Commands;
using TapHoa.Application.Suppliers.Queries;
using TapHoa.Application.Suppliers.DTOs;

namespace TapHoa.API.Endpoints;

public static class SuppliersEndpoints
{
    public static void MapSuppliersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").WithTags("Suppliers");

        group.MapGet("/", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetSuppliersQuery());
            return Results.Ok(result);
        });

        group.MapPost("/", async (IMediator mediator, [FromBody] CreateSupplierCommand command) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/v1/suppliers/{result.Id}", result);
        });

        group.MapPut("/{id:guid}", async (Guid id, IMediator mediator, [FromBody] UpdateSupplierCommand command) =>
        {
            if (id != command.Id)
                return Results.BadRequest();

            var result = await mediator.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new DeleteSupplierCommand { Id = id });
            return result ? Results.NoContent() : Results.NotFound();
        });
    }
}
