using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TapHoa.Application.Auth.Commands;
using TapHoa.Application.Auth.Queries;

namespace TapHoa.API.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users").RequireAuthorization();

        group.MapGet("/", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetUsersQuery());
            return Results.Ok(result);
        });

        group.MapPost("/", async (IMediator mediator, [FromBody] CreateUserCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Ok(id);
        });

        group.MapPut("/{id:guid}", async (IMediator mediator, Guid id, [FromBody] UpdateUserCommand command) =>
        {
            if (id != command.Id) return Results.BadRequest();
            await mediator.Send(command);
            return Results.NoContent();
        });

        group.MapDelete("/{id:guid}", async (IMediator mediator, Guid id) =>
        {
            await mediator.Send(new DeleteUserCommand(id));
            return Results.NoContent();
        });
    }
}
