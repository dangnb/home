ALTER TABLE `Products` DROP COLUMN `Category`;

ALTER TABLE `Products` ADD `CategoryId` char(36) NULL;

ALTER TABLE `Products` ADD `CostPrice` decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE `Products` ADD `WholesalePrice` decimal(18,2) NOT NULL DEFAULT 0.0;

UPDATE `Products` SET `CategoryId` = '01950000-0000-7000-8000-000000001001', `CostPrice` = 50000.0, `WholesalePrice` = 70000.0
WHERE `Id` = '01950000-0000-7000-8000-000000002001';

UPDATE `Products` SET `CategoryId` = '01950000-0000-7000-8000-000000001002', `CostPrice` = 8000.0, `WholesalePrice` = 12000.0
WHERE `Id` = '01950000-0000-7000-8000-000000002002';

UPDATE `Products` SET `CategoryId` = '01950000-0000-7000-8000-000000001003', `CostPrice` = 250000.0, `WholesalePrice` = 330000.0
WHERE `Id` = '01950000-0000-7000-8000-000000002003';

CREATE INDEX `IX_Products_CategoryId` ON `Products` (`CategoryId`);

ALTER TABLE `Products` ADD CONSTRAINT `FK_Products_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627104033_UpdateProductCategoryAndPrice', '10.0.9');
