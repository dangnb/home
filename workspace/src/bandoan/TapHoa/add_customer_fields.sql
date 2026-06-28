START TRANSACTION;
ALTER TABLE `Customers` ADD `BankAccountNumber` longtext NULL;

ALTER TABLE `Customers` ADD `BankName` longtext NULL;

ALTER TABLE `Customers` ADD `Email` longtext NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260628143335_AddCustomerEmailAndBank', '10.0.9');

COMMIT;

