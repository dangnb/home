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

COMMIT;

