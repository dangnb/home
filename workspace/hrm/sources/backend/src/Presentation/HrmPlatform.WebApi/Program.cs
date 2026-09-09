using System.Text;
using HrmPlatform.Application;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Infrastructure;
using HrmPlatform.WebApi.Common;
using HrmPlatform.WebApi.Middlewares;
using HrmPlatform.WebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình các Layer theo Clean Architecture
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// 2. Cấu hình HTTP Context & Current User Service
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// 3. Controllers & OpenAPI / Swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();

// Cấu hình CORS cho phép Frontend Angular kết nối
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Cấu hình Authentication & JWT Bearer
var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"]
    ?? "SuperSecretKeyForCoreHrmPlatformMultiTenantSaaS2026!";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "HrmPlatform";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "HrmPlatformClients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// 4. Tự động kiểm tra & khởi tạo CSDL MariaDB nếu cần
await DatabaseInitializer.InitializeAsync(app.Configuration, app.Logger, app.Environment.ContentRootPath);

// Cấu hình CORS middleware
app.UseCors();

// 5. Global Exception Handling Middleware (RFC 7807)
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 6. Authentication & Tenant Resolver Middleware
app.UseAuthentication();
app.UseMiddleware<TenantResolverMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
