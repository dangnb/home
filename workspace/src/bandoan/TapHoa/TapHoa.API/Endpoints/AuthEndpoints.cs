using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Auth.Commands;

namespace TapHoa.API.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/login", async ([FromBody] LoginCommand command, [FromServices] ISender sender) =>
        {
            try
            {
                var result = await sender.Send(command);
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.BadRequest(new { error = "AuthFailed", message = ex.Message });
            }
        })
        .WithName("Login")
        .WithDescription("Authenticates a user and returns a JWT token");

        return group;
    }
}
