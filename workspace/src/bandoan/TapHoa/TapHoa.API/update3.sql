START TRANSACTION;
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

COMMIT;

