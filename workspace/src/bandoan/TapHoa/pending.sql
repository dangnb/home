START TRANSACTION;
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

