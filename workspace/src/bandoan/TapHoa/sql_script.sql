START TRANSACTION;
IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Promotions` ADD `ApplicableCategoryId` char(36) NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Promotions` ADD `CouponCode` longtext NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Promotions` ADD `CurrentUsageCount` int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Promotions` ADD `MaxDiscountAmount` decimal(18,2) NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Promotions` ADD `MaxUsageCount` int NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Orders` ADD `PointDiscountAmount` decimal(18,2) NOT NULL DEFAULT 0.0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Orders` ADD `PointsEarned` int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Orders` ADD `PointsUsed` int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Customers` ADD `Tier` int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    ALTER TABLE `Customers` ADD `TotalAccumulatedPoints` int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    CREATE TABLE `EmployeeShifts` (
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
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    CREATE TABLE `Shifts` (
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
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712122235_AddLoyaltyMembership')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260712122235_AddLoyaltyMembership', '10.0.9');
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712134813_AddPurchaseOrders')
BEGIN
    CREATE TABLE `PurchaseOrders` (
        `Id` char(36) NOT NULL,
        `OrderCode` longtext NOT NULL,
        `SupplierId` char(36) NOT NULL,
        `OrderDate` datetime(6) NOT NULL,
        `ExpectedDeliveryDate` datetime(6) NULL,
        `TotalAmount` decimal(18,2) NOT NULL,
        `AmountPaid` decimal(18,2) NOT NULL,
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
        PRIMARY KEY (`Id`),
        CONSTRAINT `FK_PurchaseOrders_Suppliers_SupplierId` FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers` (`Id`) ON DELETE CASCADE
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712134813_AddPurchaseOrders')
BEGIN
    CREATE TABLE `PurchaseOrderDetails` (
        `Id` char(36) NOT NULL,
        `PurchaseOrderId` char(36) NOT NULL,
        `ProductId` char(36) NOT NULL,
        `Quantity` int NOT NULL,
        `CostPrice` decimal(18,2) NOT NULL,
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
        CONSTRAINT `FK_PurchaseOrderDetails_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE,
        CONSTRAINT `FK_PurchaseOrderDetails_PurchaseOrders_PurchaseOrderId` FOREIGN KEY (`PurchaseOrderId`) REFERENCES `PurchaseOrders` (`Id`) ON DELETE CASCADE
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712134813_AddPurchaseOrders')
BEGIN
    CREATE INDEX `IX_PurchaseOrderDetails_ProductId` ON `PurchaseOrderDetails` (`ProductId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712134813_AddPurchaseOrders')
BEGIN
    CREATE INDEX `IX_PurchaseOrderDetails_PurchaseOrderId` ON `PurchaseOrderDetails` (`PurchaseOrderId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712134813_AddPurchaseOrders')
BEGIN
    CREATE INDEX `IX_PurchaseOrders_SupplierId` ON `PurchaseOrders` (`SupplierId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712134813_AddPurchaseOrders')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260712134813_AddPurchaseOrders', '10.0.9');
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    CREATE TABLE `Attendances` (
        `Id` char(36) NOT NULL,
        `Username` varchar(255) NOT NULL,
        `Date` datetime(6) NOT NULL,
        `CheckIn` datetime(6) NULL,
        `CheckOut` datetime(6) NULL,
        `TotalHours` decimal(18,2) NOT NULL,
        `OvertimeHours` decimal(18,2) NOT NULL,
        `LateMinutes` int NOT NULL,
        `EarlyLeaveMinutes` int NOT NULL,
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
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    CREATE TABLE `PayrollPeriods` (
        `Id` char(36) NOT NULL,
        `Month` int NOT NULL,
        `Year` int NOT NULL,
        `StartDate` datetime(6) NOT NULL,
        `EndDate` datetime(6) NOT NULL,
        `Status` int NOT NULL,
        `Notes` longtext NULL,
        `Formula` longtext NOT NULL,
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
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    CREATE TABLE `PayrollEntries` (
        `Id` char(36) NOT NULL,
        `PayrollPeriodId` char(36) NOT NULL,
        `Username` longtext NOT NULL,
        `EmployeeName` longtext NOT NULL,
        `WorkDays` int NOT NULL,
        `TotalHours` decimal(18,2) NOT NULL,
        `OvertimeHours` decimal(18,2) NOT NULL,
        `BaseSalary` decimal(18,2) NOT NULL,
        `OvertimePay` decimal(18,2) NOT NULL,
        `Allowance` decimal(18,2) NOT NULL,
        `Bonus` decimal(18,2) NOT NULL,
        `Deduction` decimal(18,2) NOT NULL,
        `NetSalary` decimal(18,2) NOT NULL,
        `Notes` longtext NULL,
        `CreatedDate` datetime(6) NULL,
        `CreatedBy` longtext NULL,
        `ModifiedDate` datetime(6) NULL,
        `ModifiedBy` longtext NULL,
        `IsDeleted` tinyint(1) NOT NULL,
        `DeletedDate` datetime(6) NULL,
        `DeletedBy` longtext NULL,
        `CompanyId` char(36) NOT NULL,
        PRIMARY KEY (`Id`),
        CONSTRAINT `FK_PayrollEntries_PayrollPeriods_PayrollPeriodId` FOREIGN KEY (`PayrollPeriodId`) REFERENCES `PayrollPeriods` (`Id`) ON DELETE CASCADE
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    CREATE UNIQUE INDEX `IX_Attendances_Username_Date_CompanyId` ON `Attendances` (`Username`, `Date`, `CompanyId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    CREATE INDEX `IX_PayrollEntries_PayrollPeriodId` ON `PayrollEntries` (`PayrollPeriodId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    CREATE UNIQUE INDEX `IX_PayrollPeriods_Month_Year_CompanyId` ON `PayrollPeriods` (`Month`, `Year`, `CompanyId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260712164102_AddFormulaToPayrollPeriod')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260712164102_AddFormulaToPayrollPeriod', '10.0.9');
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    ALTER TABLE `Users` ADD `BaseSalary` decimal(18,2) NOT NULL DEFAULT 0.0;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    ALTER TABLE `Users` ADD `SalaryTemplateId` char(36) NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    ALTER TABLE `PayrollPeriods` ADD `CustomVariables` longtext NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    CREATE TABLE `SalaryTemplates` (
        `Id` char(36) NOT NULL,
        `Name` longtext NOT NULL,
        `Formula` longtext NOT NULL,
        `Notes` longtext NULL,
        `IsActive` tinyint(1) NOT NULL,
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
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    UPDATE `Users` SET `BaseSalary` = 10000000.0, `SalaryTemplateId` = NULL
    WHERE `Id` = '01950000-0000-7000-8000-000000000004';
    SELECT ROW_COUNT();

END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    CREATE INDEX `IX_Users_SalaryTemplateId` ON `Users` (`SalaryTemplateId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    ALTER TABLE `Users` ADD CONSTRAINT `FK_Users_SalaryTemplates_SalaryTemplateId` FOREIGN KEY (`SalaryTemplateId`) REFERENCES `SalaryTemplates` (`Id`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260717142917_AddSalaryTemplates')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260717142917_AddSalaryTemplates', '10.0.9');
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    ALTER TABLE `Users` DROP CONSTRAINT `FK_Users_SalaryTemplates_SalaryTemplateId`;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    DROP INDEX IX_Users_SalaryTemplateId ON Users;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    ALTER TABLE `Users` DROP COLUMN `BaseSalary`;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    ALTER TABLE `Users` DROP COLUMN `SalaryTemplateId`;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    ALTER TABLE `Roles` MODIFY `Permissions` longtext NOT NULL;
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE TABLE `Departments` (
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
        PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Departments_Departments_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE TABLE `Positions` (
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
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE TABLE `Employees` (
        `Id` char(36) NOT NULL,
        `EmployeeCode` longtext NOT NULL,
        `FullName` longtext NOT NULL,
        `PhoneNumber` longtext NULL,
        `CitizenId` longtext NULL,
        `Address` longtext NULL,
        `DateOfBirth` datetime(6) NULL,
        `Gender` longtext NULL,
        `Email` longtext NULL,
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
        PRIMARY KEY (`Id`),
        CONSTRAINT `FK_Employees_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`),
        CONSTRAINT `FK_Employees_Positions_PositionId` FOREIGN KEY (`PositionId`) REFERENCES `Positions` (`Id`),
        CONSTRAINT `FK_Employees_SalaryTemplates_SalaryTemplateId` FOREIGN KEY (`SalaryTemplateId`) REFERENCES `SalaryTemplates` (`Id`),
        CONSTRAINT `FK_Employees_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
    );
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    UPDATE `Roles` SET `Permissions` = '["*"]'
    WHERE `Id` = '01950000-0000-7000-8000-000000000001';
    SELECT ROW_COUNT();

END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    UPDATE `Roles` SET `Permissions` = '["Permissions.Products.View","Permissions.Products.Create","Permissions.Products.Update","Permissions.Categories.View","Permissions.Users.View"]'
    WHERE `Id` = '01950000-0000-7000-8000-000000000002';
    SELECT ROW_COUNT();

END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    UPDATE `Roles` SET `Permissions` = '["Permissions.Products.View","Permissions.Categories.View"]'
    WHERE `Id` = '01950000-0000-7000-8000-000000000003';
    SELECT ROW_COUNT();

END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE INDEX `IX_Departments_ParentId` ON `Departments` (`ParentId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE INDEX `IX_Employees_DepartmentId` ON `Employees` (`DepartmentId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE INDEX `IX_Employees_PositionId` ON `Employees` (`PositionId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE INDEX `IX_Employees_SalaryTemplateId` ON `Employees` (`SalaryTemplateId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    CREATE INDEX `IX_Employees_UserId` ON `Employees` (`UserId`);
END;

IF NOT EXISTS(SELECT * FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20260720153022_UpdateMissingFields')
BEGIN
    INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
    VALUES ('20260720153022_UpdateMissingFields', '10.0.9');
END;

COMMIT;

