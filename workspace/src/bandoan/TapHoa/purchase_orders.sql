START TRANSACTION;
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

