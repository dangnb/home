using System.Data;
using EduProCRM.Application.Approvals.Commands;
using EduProCRM.Application.LegalJournals.Commands;
using EduProCRM.Application.Users.Commands;
using EduProCRM.Infrastructure.Repositories;
using EduProCRM.WebApi.Endpoints;
using FluentValidation;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add Services & Clean Architecture Layers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "EduPro CRM .NET 9 Clean Architecture API", Version = "v1" });
});

// 1. Dapper IDbConnection Registration
builder.Services.AddScoped<IDbConnection>(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=(localdb)\\mssqllocaldb;Database=EduProCRM;Trusted_Connection=True;";
    return new SqlConnection(connectionString);
});

// 2. CQRS & MediatR Registration (.NET 9)
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<CreateLegalJournalCommand>();
});

// 3. FluentValidation Registration
builder.Services.AddValidatorsFromAssemblyContaining<CreateLegalJournalCommandValidator>();

// 4. Infrastructure Repositories
builder.Services.AddScoped<ILegalJournalRepository, LegalJournalRepository>();
builder.Services.AddScoped<IApprovalRepository, ApprovalRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// CORS for Angular Standalone App
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:3005")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

// Map Minimal API Endpoints
app.MapLegalJournalEndpoints();
app.MapApprovalEndpoints();
app.MapReceiptEndpoints();
app.MapUserEndpoints();

app.Run();
