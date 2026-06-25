using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.API.Middlewares;
using FluentValidation;
using TapHoa.Application.Behaviors;
using TapHoa.Application.Interfaces;
using TapHoa.API.Middlewares;
using TapHoa.Application.Products.Commands.CreateProduct;
using TapHoa.Infrastructure.Data;
using TapHoa.Domain.Interfaces;
using TapHoa.Infrastructure.Repositories;
using Serilog;
using Asp.Versioning;
using TapHoa.API.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

Dapper.SqlMapper.AddTypeHandler(new JsonStringListTypeHandler());
Dapper.SqlMapper.AddTypeHandler(new GuidTypeHandler());
Dapper.SqlMapper.AddTypeHandler(new NullableGuidTypeHandler());

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Setup API Versioning
builder.Services.AddApiVersioning(options =>
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
var jwtKey = builder.Configuration["Jwt:Key"] ?? "super_secret_key_that_is_very_long_and_secure_12345!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
    });
builder.Services.AddAuthorization();
builder.Services.AddSingleton<IAuthorizationPolicyProvider, TapHoa.API.Authorization.PermissionPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, TapHoa.API.Authorization.PermissionAuthorizationHandler>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=taphoa.db";

// EF Core
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IInventoryTransactionRepository, InventoryTransactionRepository>();
builder.Services.AddScoped<IStockLevelRepository, StockLevelRepository>();

// Dapper Factory
builder.Services.AddSingleton<ISqlConnectionFactory>(new SqlConnectionFactory(connectionString));

builder.Services.AddValidatorsFromAssembly(typeof(CreateProductCommand).Assembly); // Since all validators are in this assembly

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<TapHoa.Application.Interfaces.ICurrentUserService, TapHoa.API.Services.CurrentUserService>();

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CreateProductCommand).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly); // For queries/behaviors in API
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuditBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging(); // Added request logging

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try {
        context.Database.Migrate();
    } catch(Exception ex) {
        System.IO.File.WriteAllText("ef_error.txt", ex.ToString());
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
var webRootPath = builder.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(webRootPath)) Directory.CreateDirectory(webRootPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(webRootPath),
    RequestPath = ""
});
app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

// Map Endpoints with Versioning
var apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new ApiVersion(1, 0))
    .ReportApiVersions()
    .Build();

app.MapGroup("api/v{version:apiVersion}/products")
   .WithApiVersionSet(apiVersionSet)
   .MapProductsEndpoints();

app.MapGroup("api/v{version:apiVersion}/categories")
   .WithApiVersionSet(apiVersionSet)
   .MapCategoriesEndpoints();

app.MapGroup("api/v{version:apiVersion}/auth")
   .WithApiVersionSet(apiVersionSet)
   .MapAuthEndpoints();

app.MapGroup("api/v{version:apiVersion}/transactions")
   .WithApiVersionSet(apiVersionSet)
   .MapTransactionsEndpoints();

app.MapGroup("api/v{version:apiVersion}/audits")
   .WithApiVersionSet(apiVersionSet)
   .MapAuditsEndpoints();

app.Run();

// Dapper Type Handler for JSON List<string> (like AdditionalImages)
public class JsonStringListTypeHandler : Dapper.SqlMapper.TypeHandler<List<string>>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, List<string> value)
    {
        parameter.Value = System.Text.Json.JsonSerializer.Serialize(value ?? new List<string>());
    }

    public override List<string> Parse(object value)
    {
        if (value is string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new List<string>();
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        return new List<string>();
    }
}

public class GuidTypeHandler : Dapper.SqlMapper.TypeHandler<Guid>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, Guid value)
    {
        parameter.Value = value.ToString();
    }

    public override Guid Parse(object value)
    {
        if (value is string s && Guid.TryParse(s, out var guid))
            return guid;
        if (value is byte[] bytes)
            return new Guid(bytes);
            
        return Guid.Empty;
    }
}
public class NullableGuidTypeHandler : Dapper.SqlMapper.TypeHandler<Guid?>
{
    public override void SetValue(System.Data.IDbDataParameter parameter, Guid? value)
    {
        if (value.HasValue) parameter.Value = value.Value.ToString();
        else parameter.Value = DBNull.Value;
    }

    public override Guid? Parse(object value)
    {
        if (value is string s && Guid.TryParse(s, out var guid))
            return guid;
        if (value is byte[] bytes)
            return new Guid(bytes);
            
        return null;
    }
}
