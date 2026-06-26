using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
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
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll",
                policy => policy.AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowAnyHeader());
        });

        // Setup API Versioning
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

        // Configure JWT Authentication
        var jwtKey = configuration["Jwt:Key"] ?? "super_secret_key_that_is_very_long_and_secure_12345!";
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "TapHoaApi",
                    ValidAudience = "TapHoaFrontend",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
                
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var dbContext = context.HttpContext.RequestServices.GetRequiredService<IApplicationDbContext>();
                        var token = context.SecurityToken as System.IdentityModel.Tokens.Jwt.JwtSecurityToken;
                        if (token != null)
                        {
                            // Check if this raw token is blacklisted in DB
                            var isRevoked = await dbContext.UserTokens.AnyAsync(t => t.Token == token.RawData && t.IsRevoked);
                            if (isRevoked)
                            {
                                context.Fail("This token has been revoked by the system.");
                            }
                        }
                    }
                };
            });

        services.AddAuthorization();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        
        // ASP.NET Core 9+ OpenAPI
        services.AddOpenApi();

        return services;
    }
}
