using Serilog;
using Microsoft.EntityFrameworkCore;
using TapHoa.Infrastructure.Data;
using TapHoa.API.Middlewares;
using TapHoa.Application;
using TapHoa.Infrastructure;
using TapHoa.API;
using TapHoa.API.Endpoints;

/// <summary>
/// Điểm nòng cốt khởi chạy toàn bộ Hệ thống TapHoa WMS API.
/// File này hoạt động như một Composition Root để điều phối Kiến trúc Clean Architecture.
/// Các thư viện được nạp qua DependencyInjection mở rộng nhằm giữ code cực kỳ tối giản.
/// </summary>
var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Extension Methods containing all DI configuration
builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging(); 

// KHÔNG SỬ DỤNG context.Database.Migrate() Ở ĐÂY VÌ LỖI DBNull CAST CỦA ORACLE PROVIDER (.NET 10)
// DB schema đã được cài đặt hoàn tất thông qua native script trước đó.

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

// Map Minimal API Endpoints
var apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new Asp.Versioning.ApiVersion(1, 0))
    .ReportApiVersions()
    .Build();


app.MapGroup("api/v{version:apiVersion}/products").WithApiVersionSet(apiVersionSet).MapProductsEndpoints();
app.MapGroup("api/v{version:apiVersion}/categories").WithApiVersionSet(apiVersionSet).MapCategoriesEndpoints();
app.MapGroup("api/v{version:apiVersion}/auth").WithApiVersionSet(apiVersionSet).MapAuthEndpoints();
app.MapGroup("api/v{version:apiVersion}/transactions").WithApiVersionSet(apiVersionSet).MapTransactionsEndpoints();
app.MapGroup("api/v{version:apiVersion}/audits").WithApiVersionSet(apiVersionSet).MapAuditsEndpoints();
app.MapGroup("api/v{version:apiVersion}/customer-ledger").WithApiVersionSet(apiVersionSet).MapCustomerLedgerEndpoints();
app.MapGroup("api/v{version:apiVersion}/supplier-ledger").WithApiVersionSet(apiVersionSet).MapSupplierLedgerEndpoints();
app.MapGroup("api/v{version:apiVersion}/customers").WithApiVersionSet(apiVersionSet).MapCustomersEndpoints();
app.MapGroup("api/v{version:apiVersion}/suppliers").WithApiVersionSet(apiVersionSet).MapSuppliersEndpoints();
app.MapGroup("api/v{version:apiVersion}/dashboard").WithApiVersionSet(apiVersionSet).MapDashboardEndpoints();

app.Run();
