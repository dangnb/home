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

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=taphoa.db";

// EF Core
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Dapper Factory
builder.Services.AddSingleton<ISqlConnectionFactory>(new SqlConnectionFactory(connectionString));


builder.Services.AddValidatorsFromAssembly(typeof(CreateProductCommand).Assembly);

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CreateProductCommand).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

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
app.MapControllers();

app.Run(); // Trigger hot reload
