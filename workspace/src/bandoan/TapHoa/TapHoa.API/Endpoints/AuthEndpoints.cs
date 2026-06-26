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

        group.MapPost("/refresh-token", async ([FromBody] RefreshTokenCommand command, [FromServices] ISender sender) =>
        {
            try
            {
                var result = await sender.Send(command);
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.BadRequest(new { error = "TokenRefreshFailed", message = ex.Message });
            }
        })
        .WithName("RefreshToken")
        .WithDescription("Refreshes an expired JWT using a valid Refresh Token");

        group.MapPost("/revoke", async ([FromBody] RevokeTokenCommand command, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(command);
            return result ? Results.Ok(new { message = "Token revoked successfully." }) : Results.NotFound(new { message = "Token not found." });
        })
        .WithName("RevokeToken")
        .WithDescription("Revokes a refresh token, rendering it unusable");

        return group;
    }
}
