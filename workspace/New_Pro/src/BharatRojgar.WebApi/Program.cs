using Asp.Versioning;
using BharatRojgar.Application;
using BharatRojgar.Infrastructure;
using BharatRojgar.Infrastructure.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 1. Register Application & Infrastructure Services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// 2. Add Controller support
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// 3. Configure API Versioning (URL Path Versioning: /api/v{version:apiVersion}/...)
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
})
.AddMvc()
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// 4. Configure CORS for Angular Frontend
const string corsPolicy = "AngularClientPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// 5. Global Exception Middleware (RFC 7807 Problem Details)
app.UseGlobalExceptionMiddleware();

app.UseHttpsRedirection();

app.UseCors(corsPolicy);

app.UseAuthorization();

// 6. Map Versioned Controllers
app.MapControllers();

app.Run();
