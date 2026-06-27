using MediatR;
using TapHoa.Application.Customers.Commands;
using TapHoa.Application.Customers.Queries;
using TapHoa.Application.Customers.DTOs;

namespace TapHoa.API.Endpoints;

public static class CustomersEndpoints
{
    public static void MapCustomersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").WithTags("Customers");

        group.MapGet("/", async (IMediator mediator) =>
        {
            var query = new GetCustomersQuery();
            var result = await mediator.Send(query);
            return Results.Ok(result);
        });

        group.MapPost("/", async (CreateCustomerCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/v1/customers/{result.Id}", result);
        });

        group.MapPut("/{id:guid}", async (Guid id, UpdateCustomerCommand command, IMediator mediator) =>
        {
            if (id != command.Id) return Results.BadRequest("Id mismatch");
            
            var success = await mediator.Send(command);
            if (!success) return Results.NotFound();
            return Results.NoContent();
        });

        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var command = new DeleteCustomerCommand { Id = id };
            var success = await mediator.Send(command);
            if (!success) return Results.NotFound();
            return Results.NoContent();
        });
    }
}
