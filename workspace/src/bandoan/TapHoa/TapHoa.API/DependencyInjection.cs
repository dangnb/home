using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Asp.Versioning;
using TapHoa.Application.Interfaces;
using TapHoa.API.Services;
using TapHoa.API.Authorization;

namespace TapHoa.API;

/// <summary>
/// Đăng ký các dịch vụ đặc thù của riêng dự án API như Authentication (Xác thực JWT),
/// Authorization (Phân quyền bảo mật), cấu hình Swagger/OpenAPI, và khóa bảo mật máy chủ CORS.
/// Tuân thủ nguyên lý Đơn Trách Nhiệm (SRP) giúp tách biệt khỏi file Program.cs gốc.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));

        // ══════════════════════════════════════════════════════════
        // RATE LIMITING
        // ══════════════════════════════════════════════════════════
        var permitLimit = configuration.GetValue<int>("Security:RateLimiting:PermitLimit", 100);
        var window = configuration.GetValue<int>("Security:RateLimiting:Window", 60);
        var queueLimit = configuration.GetValue<int>("Security:RateLimiting:QueueLimit", 0);

        services.AddRateLimiter(options =>
        {
            // Global rate limiter (per user or IP)
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.User.Identity?.Name
                                  ?? httpContext.Connection.RemoteIpAddress?.ToString()
                                  ?? "anonymous",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit       = permitLimit,
                        QueueLimit        = queueLimit,
                        Window            = TimeSpan.FromSeconds(window)
                    }));

            // Strict limiter for /auth/login — prevent brute-force (5 requests/minute per IP)
            options.AddFixedWindowLimiter("login-policy", opt =>
            {
                opt.PermitLimit   = 5;
                opt.Window        = TimeSpan.FromMinutes(1);
                opt.QueueLimit    = 0;
                opt.AutoReplenishment = true;
            });

            // Strict limiter for /auth/refresh-token (10/minute)
            options.AddFixedWindowLimiter("refresh-policy", opt =>
            {
                opt.PermitLimit   = 10;
                opt.Window        = TimeSpan.FromMinutes(1);
                opt.QueueLimit    = 0;
                opt.AutoReplenishment = true;
            });

            // Storefront limiter — prevent excessive scraping (30 requests / 10 seconds per IP)
            options.AddFixedWindowLimiter("storefront-policy", opt =>
            {
                opt.PermitLimit   = 30;
                opt.Window        = TimeSpan.FromSeconds(10);
                opt.QueueLimit    = 2;
                opt.AutoReplenishment = true;
            });

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });

        // ══════════════════════════════════════════════════════════
        // CORS
        // ══════════════════════════════════════════════════════════
        var allowedOrigins = configuration
            .GetSection("Security:AllowedOrigins")
            .Get<string[]>() ?? ["http://localhost:4200"];

        services.AddCors(options =>
        {
            options.AddPolicy("TapHoaCorsPolicy",
                policy => policy
                    .SetIsOriginAllowed(_ => true)
                    .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .WithHeaders("Authorization", "Content-Type", "X-Requested-With", "X-CSRF-Token", "X-API-Key")
                    .AllowCredentials()          // Needed for HttpOnly cookie (refresh token)
                    .SetPreflightMaxAge(TimeSpan.FromMinutes(10)));
        });

        // ══════════════════════════════════════════════════════════
        // API VERSIONING
        // ══════════════════════════════════════════════════════════
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
        })
        .AddApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        // ══════════════════════════════════════════════════════════
        // JWT AUTHENTICATION
        // Priority: User Secrets > Environment Variables > appsettings
        // ══════════════════════════════════════════════════════════
        var jwtKey = configuration["Security:JwtKey"]
                  ?? configuration["Jwt:Key"]
                  ?? throw new InvalidOperationException(
                        "JWT key is not configured. Set 'Security:JwtKey' via environment variable or User Secrets.");

        if (jwtKey == "SET_VIA_ENV_VAR_OR_USER_SECRETS" || jwtKey.Length < 32)
        {
            throw new InvalidOperationException(
                "JWT key is missing or too short (minimum 32 chars). " +
                "Set 'Security:JwtKey' via environment variable or dotnet user-secrets.");
        }

        var jwtExpiry = configuration.GetValue<int>("Security:JwtExpiryMinutes", 30);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew                = TimeSpan.FromSeconds(30), // Reduce from default 5 min
                    ValidIssuer              = "TapHoaApi",
                    ValidAudience            = "TapHoaFrontend",
                    IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<JwtBearerEvents>>();
                        logger.LogInformation("SECURITY: OnMessageReceived. Token Length: {Length}", context.Token?.Length ?? 0);
                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<JwtBearerEvents>>();
                        logger.LogWarning("SECURITY: OnChallenge. Error: {Error}, ErrorDesc: {ErrorDesc}", context.Error, context.ErrorDescription);
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = async context =>
                    {
                        var dbContext = context.HttpContext.RequestServices
                            .GetRequiredService<IApplicationDbContext>();
                        var token = context.SecurityToken as System.IdentityModel.Tokens.Jwt.JwtSecurityToken;
                        if (token != null)
                        {
                            // Check if this raw token is blacklisted in DB
                            var isRevoked = await dbContext.UserTokens
                                .AnyAsync(t => t.Token == token.RawData && t.IsRevoked);
                            if (isRevoked)
                            {
                                context.Fail("This token has been revoked.");
                            }
                        }
                    },

                    OnAuthenticationFailed = context =>
                    {
                        var logger = context.HttpContext.RequestServices
                            .GetRequiredService<ILogger<JwtBearerEvents>>();
                        logger.LogWarning(
                            "SECURITY: JWT authentication failed from IP {IP} — {Error}",
                            context.HttpContext.Connection.RemoteIpAddress,
                            context.Exception?.Message);
                        return Task.CompletedTask;
                    },

                    OnForbidden = context =>
                    {
                        var logger = context.HttpContext.RequestServices
                            .GetRequiredService<ILogger<JwtBearerEvents>>();
                        logger.LogWarning(
                            "SECURITY: Access forbidden for user {User} on {Path} from IP {IP}",
                            context.HttpContext.User.Identity?.Name ?? "anonymous",
                            context.HttpContext.Request.Path,
                            context.HttpContext.Connection.RemoteIpAddress);
                        return Task.CompletedTask;
                    }
                };
            });

        // ══════════════════════════════════════════════════════════
        // AUTHORIZATION
        // ══════════════════════════════════════════════════════════
        services.AddAuthorization();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        // ══════════════════════════════════════════════════════════
        // INFRASTRUCTURE SERVICES
        // ══════════════════════════════════════════════════════════
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        // ASP.NET Core 9+ OpenAPI
        services.AddOpenApi();

        return services;
    }
}
