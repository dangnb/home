using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TapHoa.Application.Auth.Commands;

namespace TapHoa.API.Endpoints;

/// <summary>Marker class for ILogger in AuthEndpoints (static classes cannot be generic type args)</summary>
internal sealed class AuthLog { }

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        void SetTokenCookie(HttpContext context, string token)
        {
            var env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = env.IsProduction() ? SameSiteMode.Strict : SameSiteMode.Lax,
                Secure = env.IsProduction() // Auto-detect: true in Production (HTTPS), false in Development
            };
            context.Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        group.MapPost("/login", async ([FromBody] LoginCommand command, [FromServices] ISender sender, HttpContext context) =>
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<AuthLog>>();
            var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            try
            {
                var result = await sender.Send(command);

                SetTokenCookie(context, result.RefreshToken);
                result.RefreshToken = ""; // Clear from JSON response for XSS protection

                logger.LogInformation(
                    "SECURITY: Successful login for user {Username} from IP {IP} at {Time}",
                    command.Username, clientIp, DateTime.UtcNow);

                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                // Log failed login attempts for security monitoring
                logger.LogWarning(
                    "SECURITY: Failed login attempt for username '{Username}' from IP {IP} — {Reason}",
                    command.Username, clientIp, ex.Message);

                // Return generic message to avoid username enumeration
                return Results.BadRequest(new { error = "AuthFailed", message = "Tên đăng nhập hoặc mật khẩu không đúng." });
            }
        })
        .RequireRateLimiting("login-policy")   // ✅ Max 5 attempts/minute per IP
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
                var logger = context.RequestServices.GetRequiredService<ILogger<AuthLog>>();
                logger.LogWarning(
                    "SECURITY: Token refresh failed from IP {IP} — {Reason}",
                    context.Connection.RemoteIpAddress, ex.Message);
                return Results.BadRequest(new { error = "TokenRefreshFailed", message = ex.Message });
            }
        })
        .RequireRateLimiting("refresh-policy")  // ✅ Max 10 refreshes/minute per IP
        .WithName("RefreshToken")
        .WithDescription("Refreshes an expired JWT using a valid HttpOnly Refresh Token Cookie");

        group.MapPost("/revoke", async (HttpContext context, [FromServices] ISender sender) =>
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<AuthLog>>();
            var refreshToken = context.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken)) 
                return Results.Ok(new { message = "Already revoked or missing." });
            
            var result = await sender.Send(new RevokeTokenCommand(refreshToken));
            
            // Delete cookie on client side
            context.Response.Cookies.Delete("refreshToken");

            var username = context.User.Identity?.Name ?? "unknown";
            logger.LogInformation(
                "SECURITY: Token revoked for user {Username} from IP {IP} at {Time}",
                username, context.Connection.RemoteIpAddress, DateTime.UtcNow);
            
            return result 
                ? Results.Ok(new { message = "Token revoked successfully." }) 
                : Results.NotFound(new { message = "Token not found." });
        })
        .WithName("RevokeToken")
        .WithDescription("Revokes a refresh token and clears the HttpOnly cookie");

        return group;
    }
}
