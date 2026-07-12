START TRANSACTION;

ALTER TABLE `Products` ADD `MaxStockLevel` int NOT NULL DEFAULT 0;

ALTER TABLE `Products` ADD `MinStockLevel` int NOT NULL DEFAULT 0;

ALTER TABLE `Products` ADD `SupplierId` char(36) NULL;

CREATE TABLE IF NOT EXISTS `CustomerDebtTransactions` (
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

CREATE TABLE IF NOT EXISTS `SupplierDebts` (
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

CREATE TABLE IF NOT EXISTS `SupplierDebtTransactions` (
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

UPDATE `Products` SET `MaxStockLevel` = 0, `MinStockLevel` = 0, `SupplierId` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002002';

UPDATE `Products` SET `MaxStockLevel` = 50, `MinStockLevel` = 10, `SupplierId` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000002003';

CREATE INDEX `IX_Products_SupplierId` ON `Products` (`SupplierId`);

CREATE INDEX `IX_CustomerDebtTransactions_CustomerId` ON `CustomerDebtTransactions` (`CustomerId`);

CREATE INDEX `IX_SupplierDebts_SupplierId` ON `SupplierDebts` (`SupplierId`);

CREATE INDEX `IX_SupplierDebtTransactions_SupplierId` ON `SupplierDebtTransactions` (`SupplierId`);

ALTER TABLE `Products` ADD CONSTRAINT `FK_Products_Suppliers_SupplierId` FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers` (`Id`);

INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260710150729_AddMinMaxStockLevelToProduct', '10.0.9');

COMMIT;
