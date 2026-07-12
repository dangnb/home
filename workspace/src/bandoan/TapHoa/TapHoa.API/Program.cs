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
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TapHoa.Infrastructure.Data.AppDbContext>();
    try
    {
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `InventoryTransactions` ADD `AmountPaid` decimal(18,2) NOT NULL DEFAULT 0.0;
            ALTER TABLE `InventoryTransactions` ADD `CustomerId` char(36) NULL;
            ALTER TABLE `InventoryTransactions` ADD `SupplierId` char(36) NULL;
            INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260710203506_AddDebtFieldsToTransactions', '10.0.9');
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `Customers` ADD `LoyaltyPoints` int NOT NULL DEFAULT 0;
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `Promotions` (
                `Id` char(36) NOT NULL,
                `Name` longtext NOT NULL,
                `Description` longtext NULL,
                `Type` int NOT NULL,
                `MinOrderAmount` decimal(18,2) NOT NULL,
                `StartDate` datetime(6) NULL,
                `EndDate` datetime(6) NULL,
                `IsActive` tinyint(1) NOT NULL,
                `DiscountValue` decimal(18,2) NOT NULL,
                `BuyQuantity` int NULL,
                `GetQuantity` int NULL,
                `TargetProductId` char(36) NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`)
            );
            INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260710204132_AddPromotionsAndLoyalty', '10.0.9');
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `Orders` (
                `Id` char(36) NOT NULL,
                `OrderCode` longtext NOT NULL,
                `CustomerId` char(36) NULL,
                `OrderDate` datetime(6) NOT NULL,
                `SubTotal` decimal(18,2) NOT NULL,
                `DiscountAmount` decimal(18,2) NOT NULL,
                `TotalAmount` decimal(18,2) NOT NULL,
                `AmountPaid` decimal(18,2) NOT NULL,
                `PaymentMethod` int NOT NULL,
                `Status` int NOT NULL,
                `PromotionId` char(36) NULL,
                `CreatedBy` longtext NOT NULL,
                `Notes` longtext NULL,
                `CreatedDate` datetime(6) NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`),
                CONSTRAINT `FK_Orders_Customers_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `Customers` (`Id`),
                CONSTRAINT `FK_Orders_Promotions_PromotionId` FOREIGN KEY (`PromotionId`) REFERENCES `Promotions` (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `OrderDetails` (
                `Id` char(36) NOT NULL,
                `OrderId` char(36) NOT NULL,
                `ProductId` char(36) NOT NULL,
                `Quantity` int NOT NULL,
                `UnitPrice` decimal(18,2) NOT NULL,
                `SubTotal` decimal(18,2) NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`),
                CONSTRAINT `FK_OrderDetails_Orders_OrderId` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`Id`) ON DELETE CASCADE,
                CONSTRAINT `FK_OrderDetails_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE INDEX IF NOT EXISTS `IX_OrderDetails_OrderId` ON `OrderDetails` (`OrderId`);
            CREATE INDEX IF NOT EXISTS `IX_OrderDetails_ProductId` ON `OrderDetails` (`ProductId`);
            CREATE INDEX IF NOT EXISTS `IX_Orders_CustomerId` ON `Orders` (`CustomerId`);
            CREATE INDEX IF NOT EXISTS `IX_Orders_PromotionId` ON `Orders` (`PromotionId`);
            INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260711042701_AddPOSOrders', '10.0.9');
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `Products` MODIFY `Barcode` varchar(255) NULL;
            
            CREATE TABLE IF NOT EXISTS `ReturnOrders` (
                `Id` char(36) NOT NULL,
                `OriginalOrderId` char(36) NOT NULL,
                `ReturnCode` longtext NOT NULL,
                `ReturnDate` datetime(6) NOT NULL,
                `Reason` longtext NULL,
                `Status` int NOT NULL,
                `RefundAmount` decimal(18,2) NOT NULL,
                `CreatedBy` longtext NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`),
                CONSTRAINT `FK_ReturnOrders_Orders_OriginalOrderId` FOREIGN KEY (`OriginalOrderId`) REFERENCES `Orders` (`Id`) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS `ReturnOrderDetails` (
                `Id` char(36) NOT NULL,
                `ReturnOrderId` char(36) NOT NULL,
                `ProductId` char(36) NOT NULL,
                `Quantity` int NOT NULL,
                `RefundPrice` decimal(18,2) NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`),
                CONSTRAINT `FK_ReturnOrderDetails_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE,
                CONSTRAINT `FK_ReturnOrderDetails_ReturnOrders_ReturnOrderId` FOREIGN KEY (`ReturnOrderId`) REFERENCES `ReturnOrders` (`Id`) ON DELETE CASCADE
            );

            CREATE UNIQUE INDEX IF NOT EXISTS `IX_Products_Barcode` ON `Products` (`Barcode`);
            CREATE INDEX IF NOT EXISTS `IX_ReturnOrderDetails_ProductId` ON `ReturnOrderDetails` (`ProductId`);
            CREATE INDEX IF NOT EXISTS `IX_ReturnOrderDetails_ReturnOrderId` ON `ReturnOrderDetails` (`ReturnOrderId`);
            CREATE INDEX IF NOT EXISTS `IX_ReturnOrders_OriginalOrderId` ON `ReturnOrders` (`OriginalOrderId`);

            INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260711155435_AddReturnOrders', '10.0.9');
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `StockTakes` (
                `Id` char(36) NOT NULL,
                `DocumentNo` longtext NOT NULL,
                `Status` int NOT NULL,
                `Notes` longtext NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`)
            );

            CREATE TABLE IF NOT EXISTS `StockTakeLines` (
                `Id` char(36) NOT NULL,
                `StockTakeId` char(36) NOT NULL,
                `ProductId` char(36) NOT NULL,
                `ExpectedQuantity` int NOT NULL,
                `ActualQuantity` int NULL,
                `Reason` longtext NULL,
                PRIMARY KEY (`Id`),
                CONSTRAINT `FK_StockTakeLines_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE RESTRICT,
                CONSTRAINT `FK_StockTakeLines_StockTakes_StockTakeId` FOREIGN KEY (`StockTakeId`) REFERENCES `StockTakes` (`Id`) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS `IX_StockTakeLines_ProductId` ON `StockTakeLines` (`ProductId`);
            CREATE INDEX IF NOT EXISTS `IX_StockTakeLines_StockTakeId` ON `StockTakeLines` (`StockTakeId`);

            INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260710154920_AddStockTake', '10.0.9');
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `Shifts` (
                `Id` char(36) NOT NULL,
                `Username` longtext NOT NULL,
                `StartTime` datetime(6) NOT NULL,
                `EndTime` datetime(6) NULL,
                `StartingCash` decimal(18,2) NOT NULL,
                `ExpectedCash` decimal(18,2) NULL,
                `ActualCash` decimal(18,2) NULL,
                `Difference` decimal(18,2) NULL,
                `Notes` longtext NULL,
                `Status` int NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `EmployeeShifts` (
                `Id` char(36) NOT NULL,
                `Username` longtext NOT NULL,
                `ShiftDate` datetime(6) NOT NULL,
                `ShiftType` longtext NOT NULL,
                `StartTime` time(6) NOT NULL,
                `EndTime` time(6) NOT NULL,
                `Notes` longtext NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRateLimiter();
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
app.MapGroup("api/v{version:apiVersion}/stock-takes").WithApiVersionSet(apiVersionSet).MapStockTakesEndpoints();
app.MapGroup("api/v{version:apiVersion}/audits").WithApiVersionSet(apiVersionSet).MapAuditsEndpoints();
app.MapGroup("api/v{version:apiVersion}/customer-ledger").WithApiVersionSet(apiVersionSet).MapCustomerLedgerEndpoints();
app.MapGroup("api/v{version:apiVersion}/supplier-ledger").WithApiVersionSet(apiVersionSet).MapSupplierLedgerEndpoints();
app.MapGroup("api/v{version:apiVersion}/customers").WithApiVersionSet(apiVersionSet).MapCustomersEndpoints();
app.MapGroup("api/v{version:apiVersion}/suppliers").WithApiVersionSet(apiVersionSet).MapSuppliersEndpoints();
app.MapGroup("api/v{version:apiVersion}/dashboard").WithApiVersionSet(apiVersionSet).MapDashboardEndpoints();
app.MapGroup("api/v{version:apiVersion}/promotions").WithApiVersionSet(apiVersionSet).MapPromotionsEndpoints();
app.MapGroup("api/v{version:apiVersion}/orders").WithApiVersionSet(apiVersionSet).MapOrdersEndpoints();
app.MapGroup("api/v{version:apiVersion}/reports").WithApiVersionSet(apiVersionSet).MapReportsEndpoints();
app.MapGroup("api/v{version:apiVersion}/return-orders").WithApiVersionSet(apiVersionSet).MapReturnOrdersEndpoints();
app.MapGroup("api/v{version:apiVersion}/shifts").WithApiVersionSet(apiVersionSet).MapShiftsEndpoints();
app.MapGroup("api/v{version:apiVersion}/shift-schedules").WithApiVersionSet(apiVersionSet).MapShiftSchedulesEndpoints();

app.Run();
