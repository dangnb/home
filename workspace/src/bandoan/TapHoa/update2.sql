START TRANSACTION;
ALTER TABLE `ProductBatches` ADD `IsActive` tinyint(1) NOT NULL DEFAULT FALSE;

ALTER TABLE `ProductBatches` ADD `StockQuantity` int NOT NULL DEFAULT 0;

ALTER TABLE `InventoryTransactionLines` ADD `ProductBatchId` char(36) NULL;

CREATE INDEX `IX_InventoryTransactionLines_ProductBatchId` ON `InventoryTransactionLines` (`ProductBatchId`);

ALTER TABLE `InventoryTransactionLines` ADD CONSTRAINT `FK_InventoryTransactionLines_ProductBatches_ProductBatchId` FOREIGN KEY (`ProductBatchId`) REFERENCES `ProductBatches` (`Id`) ON DELETE RESTRICT;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260627104654_AddProductBatchStockTracking', '10.0.9');

COMMIT;

