using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Auth.Commands;

namespace TapHoa.API.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        void SetTokenCookie(HttpContext context, string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.Lax, // For local dev over HTTP
                Secure = false // Change to true in Production with HTTPS
            };
            context.Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        group.MapPost("/login", async ([FromBody] LoginCommand command, [FromServices] ISender sender, HttpContext context) =>
        {
            try
            {
                var result = await sender.Send(command);
                
                SetTokenCookie(context, result.RefreshToken);
                result.RefreshToken = ""; // Clear from JSON response for XSS protection
                
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.BadRequest(new { error = "AuthFailed", message = ex.Message });
            }
        })
        .WithName("Login")
        .WithDescription("Authenticates a user and returns a JWT token");

        group.MapPost("/refresh-token", async (HttpContext context, [FromServices] ISender sender) =>
        {
            var refreshToken = context.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Results.Unauthorized(); // Missing cookie
            }

            try
            {
                var result = await sender.Send(new RefreshTokenCommand(refreshToken));
                
                SetTokenCookie(context, result.RefreshToken);
                result.RefreshToken = ""; // Clear from JSON response
                
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.BadRequest(new { error = "TokenRefreshFailed", message = ex.Message });
            }
        })
        .WithName("RefreshToken")
        .WithDescription("Refreshes an expired JWT using a valid HttpOnly Refresh Token Cookie");

        group.MapPost("/revoke", async (HttpContext context, [FromServices] ISender sender) =>
        {
            var refreshToken = context.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken)) 
                return Results.Ok(new { message = "Already revoked or missing." });
            
            var result = await sender.Send(new RevokeTokenCommand(refreshToken));
            
            // Delete cookie on client side
            context.Response.Cookies.Delete("refreshToken");
            
            return result ? Results.Ok(new { message = "Token revoked successfully." }) : Results.NotFound(new { message = "Token not found." });
        })
        .WithName("RevokeToken")
        .WithDescription("Revokes a refresh token and clears the HttpOnly cookie");

        return group;
    }
}
