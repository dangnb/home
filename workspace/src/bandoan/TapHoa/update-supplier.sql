START TRANSACTION;
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

COMMIT;

