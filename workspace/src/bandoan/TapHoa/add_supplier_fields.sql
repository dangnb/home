START TRANSACTION;
ALTER TABLE `Suppliers` ADD `BankAccountNumber` longtext NULL;

ALTER TABLE `Suppliers` ADD `BankName` longtext NULL;

ALTER TABLE `Suppliers` ADD `Email` longtext NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260628143836_AddSupplierEmailAndBank', '10.0.9');

COMMIT;

