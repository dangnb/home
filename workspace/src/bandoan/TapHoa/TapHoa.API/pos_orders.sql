START TRANSACTION;
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

COMMIT;

