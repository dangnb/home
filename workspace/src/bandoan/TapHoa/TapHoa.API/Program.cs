using System.Reflection;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.API.Middlewares;
using FluentValidation;
using TapHoa.Application.Behaviors;
using TapHoa.Application.Interfaces;
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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=taphoa.db";

// EF Core
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

// Dapper Factory
builder.Services.AddSingleton<ISqlConnectionFactory>(new SqlConnectionFactory(connectionString));

builder.Services.AddValidatorsFromAssembly(typeof(CreateProductCommand).Assembly); // Since all validators are in this assembly

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CreateProductCommand).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging(); // Added request logging

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
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

app.Run(); // Trigger hot reload
