CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;
CREATE TABLE `AuditLogs` (
    `Id` char(36) NOT NULL,
    `Action` longtext NOT NULL,
    `RequestName` longtext NOT NULL,
    `RequestData` longtext NOT NULL,
    `Username` longtext NOT NULL,
    `Timestamp` datetime(6) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Categories` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Description` longtext NOT NULL,
    `Icon` longtext NOT NULL,
    `ParentId` char(36) NULL,
    `ParentCategoryId` char(36) NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Categories_Categories_ParentCategoryId` FOREIGN KEY (`ParentCategoryId`) REFERENCES `Categories` (`Id`)
);

CREATE TABLE `InventoryTransactions` (
    `Id` char(36) NOT NULL,
    `Code` longtext NOT NULL,
    `Type` int NOT NULL,
    `Status` int NOT NULL,
    `ReferenceId` longtext NOT NULL,
    `Notes` longtext NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `CreatedBy` longtext NOT NULL,
    `ApprovedAt` datetime(6) NULL,
    `ApprovedBy` longtext NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Products` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Category` longtext NOT NULL,
    `MainImageUrl` longtext NULL,
    `AdditionalImages` longtext NOT NULL,
    `Price` decimal(18,2) NOT NULL,
    `StockQuantity` int NOT NULL,
    `Unit` longtext NOT NULL,
    `Status` longtext NOT NULL,
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

CREATE TABLE `Roles` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Description` longtext NOT NULL,
    `Permissions` bigint NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Users` (
    `Id` char(36) NOT NULL,
    `Username` longtext NOT NULL,
    `PasswordHash` longtext NOT NULL,
    `FullName` longtext NOT NULL,
    `Email` longtext NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `CompanyId` char(36) NOT NULL,
    `PhoneNumber` longtext NULL,
    `CitizenId` longtext NULL,
    `Address` longtext NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `WarehouseLocations` (
    `Id` char(36) NOT NULL,
    `Zone` longtext NOT NULL,
    `Aisle` longtext NOT NULL,
    `Rack` longtext NOT NULL,
    `Bin` longtext NOT NULL,
    `Barcode` longtext NOT NULL,
    `Description` longtext NOT NULL,
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

CREATE TABLE `InventoryTransactionLines` (
    `Id` char(36) NOT NULL,
    `TransactionId` char(36) NOT NULL,
    `ProductId` char(36) NOT NULL,
    `Quantity` int NOT NULL,
    `UnitCost` decimal(18,2) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_InventoryTransactionLines_InventoryTransactions_TransactionId` FOREIGN KEY (`TransactionId`) REFERENCES `InventoryTransactions` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_InventoryTransactionLines_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `ProductBatches` (
    `Id` char(36) NOT NULL,
    `ProductId` char(36) NOT NULL,
    `BatchNumber` longtext NOT NULL,
    `MfgDate` datetime(6) NOT NULL,
    `ExpiryDate` datetime(6) NOT NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ProductBatches_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `UserRoles` (
    `RolesId` char(36) NOT NULL,
    `UsersId` char(36) NOT NULL,
    PRIMARY KEY (`RolesId`, `UsersId`),
    CONSTRAINT `FK_UserRoles_Roles_RolesId` FOREIGN KEY (`RolesId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_UserRoles_Users_UsersId` FOREIGN KEY (`UsersId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `StockLevels` (
    `Id` char(36) NOT NULL,
    `ProductId` char(36) NOT NULL,
    `LocationId` char(36) NULL,
    `BatchId` char(36) NULL,
    `StoreId` char(36) NOT NULL,
    `QuantityOnHand` int NOT NULL,
    `AvailableQuantity` int NOT NULL,
    `ReservedQuantity` int NOT NULL,
    `ReorderPoint` int NOT NULL,
    `MovingAverageCost` decimal(18,2) NOT NULL,
    `LastRestockedAt` datetime(6) NOT NULL,
    `RowVersion` longblob NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_StockLevels_ProductBatches_BatchId` FOREIGN KEY (`BatchId`) REFERENCES `ProductBatches` (`Id`),
    CONSTRAINT `FK_StockLevels_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_StockLevels_WarehouseLocations_LocationId` FOREIGN KEY (`LocationId`) REFERENCES `WarehouseLocations` (`Id`)
);

INSERT INTO `Categories` (`Id`, `CompanyId`, `CreatedBy`, `CreatedDate`, `DeletedBy`, `DeletedDate`, `Description`, `Icon`, `IsDeleted`, `ModifiedBy`, `ModifiedDate`, `Name`, `ParentCategoryId`, `ParentId`)
VALUES ('01950000-0000-7000-8000-000000001001', '01950000-0000-7000-8000-000000000000', NULL, '2025-01-01 00:00:00.000000', NULL, NULL, 'Hoa quả tươi các loại', '🍎', FALSE, NULL, NULL, 'Trái cây', NULL, NULL);
SELECT ROW_COUNT();

INSERT INTO `Categories` (`Id`, `CompanyId`, `CreatedBy`, `CreatedDate`, `DeletedBy`, `DeletedDate`, `Description`, `Icon`, `IsDeleted`, `ModifiedBy`, `ModifiedDate`, `Name`, `ParentCategoryId`, `ParentId`)
VALUES ('01950000-0000-7000-8000-000000001002', '01950000-0000-7000-8000-000000000000', NULL, '2025-01-01 00:00:00.000000', NULL, NULL, 'Rau củ sạch nông trại', '🥬', FALSE, NULL, NULL, 'Rau củ', NULL, NULL);
SELECT ROW_COUNT();

INSERT INTO `Categories` (`Id`, `CompanyId`, `CreatedBy`, `CreatedDate`, `DeletedBy`, `DeletedDate`, `Description`, `Icon`, `IsDeleted`, `ModifiedBy`, `ModifiedDate`, `Name`, `ParentCategoryId`, `ParentId`)
VALUES ('01950000-0000-7000-8000-000000001003', '01950000-0000-7000-8000-000000000000', NULL, '2025-01-01 00:00:00.000000', NULL, NULL, 'Thịt tươi sống và hải sản', '🥩', FALSE, NULL, NULL, 'Thịt cá', NULL, NULL);
SELECT ROW_COUNT();


INSERT INTO `Products` (`Id`, `AdditionalImages`, `Category`, `CompanyId`, `CreatedBy`, `CreatedDate`, `DeletedBy`, `DeletedDate`, `IsDeleted`, `MainImageUrl`, `ModifiedBy`, `ModifiedDate`, `Name`, `Price`, `Status`, `StockQuantity`, `Unit`)
VALUES ('01950000-0000-7000-8000-000000002001', '[]', 'Trái cây', '01950000-0000-7000-8000-000000000000', NULL, '2025-01-01 00:00:00.000000', NULL, NULL, FALSE, NULL, NULL, NULL, 'Táo New Zealand size to', 75000.0, 'Đang bán', 150, 'kg');
SELECT ROW_COUNT();

INSERT INTO `Products` (`Id`, `AdditionalImages`, `Category`, `CompanyId`, `CreatedBy`, `CreatedDate`, `DeletedBy`, `DeletedDate`, `IsDeleted`, `MainImageUrl`, `ModifiedBy`, `ModifiedDate`, `Name`, `Price`, `Status`, `StockQuantity`, `Unit`)
VALUES ('01950000-0000-7000-8000-000000002002', '[]', 'Rau củ', '01950000-0000-7000-8000-000000000000', NULL, '2025-01-01 00:00:00.000000', NULL, NULL, FALSE, NULL, NULL, NULL, 'Rau cải thìa hữu cơ', 15000.0, 'Đang bán', 30, 'bó');
SELECT ROW_COUNT();

INSERT INTO `Products` (`Id`, `AdditionalImages`, `Category`, `CompanyId`, `CreatedBy`, `CreatedDate`, `DeletedBy`, `DeletedDate`, `IsDeleted`, `MainImageUrl`, `ModifiedBy`, `ModifiedDate`, `Name`, `Price`, `Status`, `StockQuantity`, `Unit`)
VALUES ('01950000-0000-7000-8000-000000002003', '[]', 'Thịt cá', '01950000-0000-7000-8000-000000000000', NULL, '2025-01-01 00:00:00.000000', NULL, NULL, FALSE, NULL, NULL, NULL, 'Thịt bò thăn Úc tươi sạch', 350000.0, 'Sắp hết', 5, 'kg');
SELECT ROW_COUNT();


INSERT INTO `Roles` (`Id`, `Description`, `Name`, `Permissions`)
VALUES ('01950000-0000-7000-8000-000000000001', 'System Administrator', 'Admin', -1);
SELECT ROW_COUNT();

INSERT INTO `Roles` (`Id`, `Description`, `Name`, `Permissions`)
VALUES ('01950000-0000-7000-8000-000000000002', 'Store Manager', 'Manager', 24117249);
SELECT ROW_COUNT();

INSERT INTO `Roles` (`Id`, `Description`, `Name`, `Permissions`)
VALUES ('01950000-0000-7000-8000-000000000003', 'Store Cashier', 'Cashier', 17825792);
SELECT ROW_COUNT();


INSERT INTO `Users` (`Id`, `Address`, `CitizenId`, `CompanyId`, `CreatedAt`, `Email`, `FullName`, `IsActive`, `PasswordHash`, `PhoneNumber`, `Username`)
VALUES ('01950000-0000-7000-8000-000000000004', NULL, NULL, '01950000-0000-7000-8000-000000000000', '2025-01-01 00:00:00.000000', 'admin@taphoa.com', 'System Admin', TRUE, '$2a$11$8rpnI.9n7caa2N3lLrkVeOyfSDUH1LlRGHt4.64Z6c0uGaFs8q0xy', NULL, 'admin');
SELECT ROW_COUNT();


INSERT INTO `UserRoles` (`RolesId`, `UsersId`)
VALUES ('01950000-0000-7000-8000-000000000001', '01950000-0000-7000-8000-000000000004');
SELECT ROW_COUNT();


CREATE INDEX `IX_Categories_ParentCategoryId` ON `Categories` (`ParentCategoryId`);

CREATE INDEX `IX_InventoryTransactionLines_ProductId` ON `InventoryTransactionLines` (`ProductId`);

CREATE INDEX `IX_InventoryTransactionLines_TransactionId` ON `InventoryTransactionLines` (`TransactionId`);

CREATE INDEX `IX_ProductBatches_ProductId` ON `ProductBatches` (`ProductId`);

CREATE INDEX `IX_StockLevels_BatchId` ON `StockLevels` (`BatchId`);

CREATE INDEX `IX_StockLevels_LocationId` ON `StockLevels` (`LocationId`);

CREATE INDEX `IX_StockLevels_ProductId_LocationId_BatchId` ON `StockLevels` (`ProductId`, `LocationId`, `BatchId`);

CREATE INDEX `IX_UserRoles_UsersId` ON `UserRoles` (`UsersId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260626074019_InitialMariaDB', '10.0.9');

CREATE TABLE `UserTokens` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `Token` longtext NOT NULL,
    `ExpiresAt` datetime(6) NOT NULL,
    `IsRevoked` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_UserTokens_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_UserTokens_UserId` ON `UserTokens` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627053133_AddUserTokens', '10.0.9');

ALTER TABLE `Products` ADD `Barcode` longtext NULL;

CREATE TABLE `CustomerDebts` (
    `Id` char(36) NOT NULL,
    `CustomerId` char(36) NOT NULL,
    `CustomerName` longtext NOT NULL,
    `PhoneNumber` longtext NULL,
    `TotalDebt` decimal(18,2) NOT NULL,
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

CREATE TABLE `ProductUnits` (
    `Id` char(36) NOT NULL,
    `ProductId` char(36) NOT NULL,
    `UnitName` longtext NOT NULL,
    `ConversionFactor` int NOT NULL,
    `Barcode` longtext NULL,
    `Price` decimal(18,2) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ProductUnits_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE
);

UPDATE `Products` SET `Barcode` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002001';
SELECT ROW_COUNT();


UPDATE `Products` SET `Barcode` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002002';
SELECT ROW_COUNT();


UPDATE `Products` SET `Barcode` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002003';
SELECT ROW_COUNT();


CREATE INDEX `IX_ProductUnits_ProductId` ON `ProductUnits` (`ProductId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627054209_AddUoMAndDebt', '10.0.9');

CREATE TABLE `Customers` (
    `Id` char(36) NOT NULL,
    `FullName` longtext NOT NULL,
    `PhoneNumber` longtext NULL,
    `Address` longtext NULL,
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

CREATE INDEX `IX_CustomerDebts_CustomerId` ON `CustomerDebts` (`CustomerId`);

ALTER TABLE `CustomerDebts` ADD CONSTRAINT `FK_CustomerDebts_Customers_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `Customers` (`Id`) ON DELETE CASCADE;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627061034_AddCustomerEntity', '10.0.9');

CREATE TABLE `Suppliers` (
    `Id` char(36) NOT NULL,
    `FullName` longtext NOT NULL,
    `PhoneNumber` longtext NULL,
    `Address` longtext NULL,
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

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627092712_AddSupplierEntity', '10.0.9');

ALTER TABLE `Products` DROP COLUMN `Category`;

ALTER TABLE `Products` ADD `CategoryId` char(36) NULL;

ALTER TABLE `Products` ADD `CostPrice` decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE `Products` ADD `WholesalePrice` decimal(18,2) NOT NULL DEFAULT 0.0;

UPDATE `Products` SET `CategoryId` = '01950000-0000-7000-8000-000000001001', `CostPrice` = 50000.0, `WholesalePrice` = 70000.0
WHERE `Id` = '01950000-0000-7000-8000-000000002001';
SELECT ROW_COUNT();


UPDATE `Products` SET `CategoryId` = '01950000-0000-7000-8000-000000001002', `CostPrice` = 8000.0, `WholesalePrice` = 12000.0
WHERE `Id` = '01950000-0000-7000-8000-000000002002';
SELECT ROW_COUNT();


UPDATE `Products` SET `CategoryId` = '01950000-0000-7000-8000-000000001003', `CostPrice` = 250000.0, `WholesalePrice` = 330000.0
WHERE `Id` = '01950000-0000-7000-8000-000000002003';
SELECT ROW_COUNT();


CREATE INDEX `IX_Products_CategoryId` ON `Products` (`CategoryId`);

ALTER TABLE `Products` ADD CONSTRAINT `FK_Products_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627104033_UpdateProductCategoryAndPrice', '10.0.9');

ALTER TABLE `ProductBatches` ADD `IsActive` tinyint(1) NOT NULL DEFAULT FALSE;

ALTER TABLE `ProductBatches` ADD `StockQuantity` int NOT NULL DEFAULT 0;

ALTER TABLE `InventoryTransactionLines` ADD `ProductBatchId` char(36) NULL;

CREATE INDEX `IX_InventoryTransactionLines_ProductBatchId` ON `InventoryTransactionLines` (`ProductBatchId`);

ALTER TABLE `InventoryTransactionLines` ADD CONSTRAINT `FK_InventoryTransactionLines_ProductBatches_ProductBatchId` FOREIGN KEY (`ProductBatchId`) REFERENCES `ProductBatches` (`Id`) ON DELETE RESTRICT;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627104654_AddProductBatchStockTracking', '10.0.9');

ALTER TABLE `Products` MODIFY `Status` int NOT NULL;

UPDATE `Products` SET `Status` = 0
WHERE `Id` = '01950000-0000-7000-8000-000000002001';
SELECT ROW_COUNT();


UPDATE `Products` SET `Status` = 0
WHERE `Id` = '01950000-0000-7000-8000-000000002002';
SELECT ROW_COUNT();


UPDATE `Products` SET `Status` = 2
WHERE `Id` = '01950000-0000-7000-8000-000000002003';
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627160202_UpdateProductStatusToEnum', '10.0.9');

ALTER TABLE `Customers` ADD `BankAccountNumber` longtext NULL;

ALTER TABLE `Customers` ADD `BankName` longtext NULL;

ALTER TABLE `Customers` ADD `Email` longtext NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260628143335_AddCustomerEmailAndBank', '10.0.9');

ALTER TABLE `Suppliers` ADD `BankAccountNumber` longtext NULL;

ALTER TABLE `Suppliers` ADD `BankName` longtext NULL;

ALTER TABLE `Suppliers` ADD `Email` longtext NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260628143836_AddSupplierEmailAndBank', '10.0.9');

ALTER TABLE `Products` ADD `MaxStockLevel` int NOT NULL DEFAULT 0;

ALTER TABLE `Products` ADD `MinStockLevel` int NOT NULL DEFAULT 0;

ALTER TABLE `Products` ADD `SupplierId` char(36) NULL;

CREATE TABLE `CustomerDebtTransactions` (
    `Id` char(36) NOT NULL,
    `CustomerId` char(36) NOT NULL,
    `Type` int NOT NULL,
    `Amount` decimal(18,2) NOT NULL,
    `PaidAmount` decimal(18,2) NOT NULL,
    `Note` longtext NULL,
    `RelatedDebtId` char(36) NULL,
    `DueDate` datetime(6) NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_CustomerDebtTransactions_Customers_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `Customers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `SupplierDebts` (
    `Id` char(36) NOT NULL,
    `SupplierId` char(36) NOT NULL,
    `SupplierName` longtext NOT NULL,
    `PhoneNumber` longtext NULL,
    `TotalDebt` decimal(18,2) NOT NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_SupplierDebts_Suppliers_SupplierId` FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers` (`Id`) ON DELETE CASCADE
);

CREATE TABLE `SupplierDebtTransactions` (
    `Id` char(36) NOT NULL,
    `SupplierId` char(36) NOT NULL,
    `Type` int NOT NULL,
    `Amount` decimal(18,2) NOT NULL,
    `PaidAmount` decimal(18,2) NOT NULL,
    `Note` longtext NULL,
    `RelatedDebtId` char(36) NULL,
    `DueDate` datetime(6) NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_SupplierDebtTransactions_Suppliers_SupplierId` FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers` (`Id`) ON DELETE CASCADE
);

UPDATE `Products` SET `MaxStockLevel` = 200, `MinStockLevel` = 10, `SupplierId` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002001';
SELECT ROW_COUNT();


UPDATE `Products` SET `MaxStockLevel` = 0, `MinStockLevel` = 0, `SupplierId` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002002';
SELECT ROW_COUNT();


UPDATE `Products` SET `MaxStockLevel` = 50, `MinStockLevel` = 10, `SupplierId` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002003';
SELECT ROW_COUNT();


CREATE INDEX `IX_Products_SupplierId` ON `Products` (`SupplierId`);

CREATE INDEX `IX_CustomerDebtTransactions_CustomerId` ON `CustomerDebtTransactions` (`CustomerId`);

CREATE INDEX `IX_SupplierDebts_SupplierId` ON `SupplierDebts` (`SupplierId`);

CREATE INDEX `IX_SupplierDebtTransactions_SupplierId` ON `SupplierDebtTransactions` (`SupplierId`);

ALTER TABLE `Products` ADD CONSTRAINT `FK_Products_Suppliers_SupplierId` FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers` (`Id`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260710150729_AddMinMaxStockLevelToProduct', '10.0.9');

CREATE TABLE `StockTakes` (
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

CREATE TABLE `StockTakeLines` (
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

CREATE INDEX `IX_StockTakeLines_ProductId` ON `StockTakeLines` (`ProductId`);

CREATE INDEX `IX_StockTakeLines_StockTakeId` ON `StockTakeLines` (`StockTakeId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260710154920_AddStockTake', '10.0.9');

ALTER TABLE `InventoryTransactions` ADD `AmountPaid` decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE `InventoryTransactions` ADD `CustomerId` char(36) NULL;

ALTER TABLE `InventoryTransactions` ADD `SupplierId` char(36) NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260710203506_AddDebtFieldsToTransactions', '10.0.9');

ALTER TABLE `Customers` ADD `LoyaltyPoints` int NOT NULL DEFAULT 0;

CREATE TABLE `Promotions` (
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

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260710204132_AddPromotionsAndLoyalty', '10.0.9');

CREATE TABLE `Orders` (
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

CREATE TABLE `OrderDetails` (
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

CREATE INDEX `IX_OrderDetails_OrderId` ON `OrderDetails` (`OrderId`);

CREATE INDEX `IX_OrderDetails_ProductId` ON `OrderDetails` (`ProductId`);

CREATE INDEX `IX_Orders_CustomerId` ON `Orders` (`CustomerId`);

CREATE INDEX `IX_Orders_PromotionId` ON `Orders` (`PromotionId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260711042701_AddPOSOrders', '10.0.9');

ALTER TABLE `Products` MODIFY `Barcode` varchar(255) NULL;

CREATE TABLE `ReturnOrders` (
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

CREATE TABLE `ReturnOrderDetails` (
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

CREATE UNIQUE INDEX `IX_Products_Barcode` ON `Products` (`Barcode`);

CREATE INDEX `IX_ReturnOrderDetails_ProductId` ON `ReturnOrderDetails` (`ProductId`);

CREATE INDEX `IX_ReturnOrderDetails_ReturnOrderId` ON `ReturnOrderDetails` (`ReturnOrderId`);

CREATE INDEX `IX_ReturnOrders_OriginalOrderId` ON `ReturnOrders` (`OriginalOrderId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260711155435_AddReturnOrders', '10.0.9');

ALTER TABLE `Promotions` ADD `ApplicableCategoryId` char(36) NULL;

ALTER TABLE `Promotions` ADD `CouponCode` longtext NULL;

ALTER TABLE `Promotions` ADD `CurrentUsageCount` int NOT NULL DEFAULT 0;

ALTER TABLE `Promotions` ADD `MaxDiscountAmount` decimal(18,2) NULL;

ALTER TABLE `Promotions` ADD `MaxUsageCount` int NULL;

ALTER TABLE `Orders` ADD `PointDiscountAmount` decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE `Orders` ADD `PointsEarned` int NOT NULL DEFAULT 0;

ALTER TABLE `Orders` ADD `PointsUsed` int NOT NULL DEFAULT 0;

ALTER TABLE `Customers` ADD `Tier` int NOT NULL DEFAULT 0;

ALTER TABLE `Customers` ADD `TotalAccumulatedPoints` int NOT NULL DEFAULT 0;

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

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260712122235_AddLoyaltyMembership', '10.0.9');

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

CREATE INDEX `IX_PurchaseOrderDetails_ProductId` ON `PurchaseOrderDetails` (`ProductId`);

CREATE INDEX `IX_PurchaseOrderDetails_PurchaseOrderId` ON `PurchaseOrderDetails` (`PurchaseOrderId`);

CREATE INDEX `IX_PurchaseOrders_SupplierId` ON `PurchaseOrders` (`SupplierId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260712134813_AddPurchaseOrders', '10.0.9');

COMMIT;

