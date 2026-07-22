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

// Hide Server header for security
builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});

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
        var script = System.IO.File.ReadAllText(@"d:\WORKSPACE\Home\web\home\workspace\src\bandoan\TapHoa\mysql_script.sql");
        var commands = script.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var cmd in commands)
        {
            if (string.IsNullOrWhiteSpace(cmd)) continue;
            try
            {
                context.Database.ExecuteSqlRaw(cmd);
            }
            catch (Exception ex) { 
                Console.WriteLine($"SQL Error: {ex.Message}");
            }
        }
    }
    catch (Exception ex) { 
        Console.WriteLine($"File Error: {ex.Message}");
    }

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
            ALTER TABLE `Promotions` ADD COLUMN IF NOT EXISTS `CouponCode` longtext NULL;
            ALTER TABLE `Promotions` ADD COLUMN IF NOT EXISTS `MaxUsageCount` int NULL;
            ALTER TABLE `Promotions` ADD COLUMN IF NOT EXISTS `CurrentUsageCount` int NOT NULL DEFAULT 0;
            ALTER TABLE `Promotions` ADD COLUMN IF NOT EXISTS `ApplicableCategoryId` char(36) NULL;
            ALTER TABLE `Promotions` ADD COLUMN IF NOT EXISTS `MaxDiscountAmount` decimal(18,2) NULL;
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
            ALTER TABLE `Roles` MODIFY `Permissions` LONGTEXT NULL;
            UPDATE `Roles` SET `Permissions` = '[""*""]' WHERE `Name` = 'Admin';
            UPDATE `Roles` SET `Permissions` = '[""Permissions.POS.View"", ""Permissions.POS.CreateOrder"", ""Permissions.Products.View"", ""Permissions.Categories.View""]' WHERE `Name` = 'Staff';
            UPDATE `Roles` SET `Permissions` = '[""Permissions.POS.View"", ""Permissions.POS.CreateOrder"", ""Permissions.Products.View"", ""Permissions.Categories.View"", ""Permissions.Inventory.View""]' WHERE `Name` = 'Manager';
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
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`)
            );
        ");
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `Shifts` ADD IF NOT EXISTS `DeletedBy` longtext NULL;
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
    try
    {
        context.Database.ExecuteSqlRaw(@"ALTER TABLE `PayrollPeriods` ADD `Formula` longtext NOT NULL DEFAULT 'BaseSalary + OvertimePay + Allowance + Bonus - Deduction';");
    }
    catch { }
    try
    {
        context.Database.ExecuteSqlRaw(@"ALTER TABLE `PayrollPeriods` ADD `CustomVariables` longtext NULL;");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `SalaryTemplates` (
                `Id` char(36) NOT NULL,
                `Name` longtext NOT NULL,
                `Formula` longtext NOT NULL,
                `Notes` longtext NULL,
                `IsActive` tinyint(1) NOT NULL,
                `CompanyId` char(36) NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `Departments` (
                `Id` char(36) NOT NULL,
                `Name` longtext NOT NULL,
                `Description` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                `ParentId` char(36) NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `Positions` (
                `Id` char(36) NOT NULL,
                `Name` longtext NOT NULL,
                `Description` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `Employees` (
                `Id` char(36) NOT NULL,
                `EmployeeCode` longtext NOT NULL,
                `FullName` longtext NOT NULL,
                `PhoneNumber` longtext NULL,
                `CitizenId` longtext NULL,
                `Address` longtext NULL,
                `DateOfBirth` datetime(6) NULL,
                `Gender` longtext NULL,
                `BaseSalary` decimal(18,2) NOT NULL,
                `SalaryTemplateId` char(36) NULL,
                `DepartmentId` char(36) NULL,
                `PositionId` char(36) NULL,
                `UserId` char(36) NULL,
                `CompanyId` char(36) NOT NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        // Add ParentId to existing Departments table if it wasn't there
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `Departments` ADD `ParentId` char(36) NULL;
        ");
    }
    catch { }

    try
    {
        // Add foreign key for ParentId
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `Departments` ADD CONSTRAINT `FK_Departments_Departments_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT;
        ");
    }
    catch { }

    try
    {
        // Add Email to existing Employees table if it wasn't there
        context.Database.ExecuteSqlRaw(@"
            ALTER TABLE `Employees` ADD `Email` longtext NULL;
        ");
    }
    catch { }

    // ── Pha 1: Sổ quỹ + Chi phí vận hành ──────────────────────────────────────
    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `CashBookEntries` (
                `Id` char(36) NOT NULL,
                `EntryDate` datetime(6) NOT NULL,
                `Type` int NOT NULL,
                `Category` longtext NOT NULL,
                `Amount` decimal(18,2) NOT NULL,
                `Description` longtext NULL,
                `ReferenceId` longtext NULL,
                `ReferenceType` longtext NULL,
                `ShiftId` char(36) NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
                `DeletedDate` datetime(6) NULL,
                `DeletedBy` longtext NULL,
                `CompanyId` char(36) NOT NULL,
                PRIMARY KEY (`Id`)
            );
        ");
    }
    catch { }

    try
    {
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS `OperatingExpenses` (
                `Id` char(36) NOT NULL,
                `Name` longtext NOT NULL,
                `Type` int NOT NULL,
                `Amount` decimal(18,2) NOT NULL,
                `Month` int NOT NULL,
                `Year` int NOT NULL,
                `DueDate` datetime(6) NULL,
                `PaidDate` datetime(6) NULL,
                `PaymentStatus` int NOT NULL DEFAULT 1,
                `Notes` longtext NULL,
                `CreatedDate` datetime(6) NULL,
                `CreatedBy` longtext NULL,
                `ModifiedDate` datetime(6) NULL,
                `ModifiedBy` longtext NULL,
                `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
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

// ── Security Headers Middleware ─────────────────────────────────────────────
// Thêm các HTTP security headers vào mọi response để chống XSS, Clickjacking,
// MIME sniffing và tấn công thông qua thông tin referrer.
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;

    // Chống Clickjacking — ngăn nhúng trong iframe
    headers.Append("X-Frame-Options", "DENY");

    // Chống MIME-type sniffing
    headers.Append("X-Content-Type-Options", "nosniff");

    // Kiểm soát thông tin Referrer khi navigate ra ngoài site
    headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

    // Chặn Permissions không cần thiết (camera, mic, geolocation...)
    headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    // Content Security Policy — Chỉ cho phép tài nguyên từ source tin cậy
    // Điều chỉnh 'connect-src' nếu API host thay đổi
    headers.Append("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +  // unsafe-inline cần cho Angular
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +
        "img-src 'self' data: blob: https:; " +
        "connect-src 'self' http://localhost:5000 http://localhost:5001 ws://localhost:* wss://localhost:*; " +
        "frame-ancestors 'none'");

    // HSTS — Bắt buộc HTTPS (chỉ có hiệu lực khi dùng HTTPS)
    if (context.Request.IsHttps)
    {
        headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    // Ẩn thông tin server technology
    headers.Remove("Server");
    headers.Remove("X-Powered-By");

    await next();
});

// ── Middleware Pipeline Order ────────────────────────────────────────────────
app.UseCors("TapHoaCorsPolicy");
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseRateLimiter();

var webRootPath = builder.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(webRootPath)) Directory.CreateDirectory(webRootPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(webRootPath),
    RequestPath = ""
});

app.UseAuthentication();
app.UseAuthorization();

// ── Map Minimal API Endpoints ────────────────────────────────────────────────
var apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new Asp.Versioning.ApiVersion(1, 0))
    .ReportApiVersions()
    .Build();

app.MapGroup("api/v{version:apiVersion}/products").WithApiVersionSet(apiVersionSet).MapProductsEndpoints();
app.MapGroup("api/v{version:apiVersion}/categories").WithApiVersionSet(apiVersionSet).MapCategoriesEndpoints();
// Auth group: áp dụng strict rate-limit cho login & refresh endpoints bên trong
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
app.MapGroup("api/v{version:apiVersion}/purchase-orders").WithApiVersionSet(apiVersionSet).MapPurchaseOrdersEndpoints();
app.MapGroup("api/v{version:apiVersion}/attendances").WithApiVersionSet(apiVersionSet).MapAttendancesEndpoints();
app.MapGroup("api/v{version:apiVersion}/payroll").WithApiVersionSet(apiVersionSet).MapPayrollEndpoints();
app.MapGroup("api/v{version:apiVersion}/salary-templates").WithApiVersionSet(apiVersionSet).MapSalaryTemplateEndpoints();
app.MapGroup("api/v{version:apiVersion}/hr").WithApiVersionSet(apiVersionSet).MapHREndpoints();
app.MapGroup("api/v{version:apiVersion}/cashbook").WithApiVersionSet(apiVersionSet).MapCashBookEndpoints();
app.MapGroup("api/v{version:apiVersion}/expenses").WithApiVersionSet(apiVersionSet).MapOperatingExpenseEndpoints();
app.MapGroup("api/v{version:apiVersion}/notifications").WithApiVersionSet(apiVersionSet).MapNotificationsEndpoints();
app.MapGroup("api/v{version:apiVersion}/online-store").WithApiVersionSet(apiVersionSet).MapOnlineStoreEndpoints();
app.MapRoleEndpoints();

app.Run();
