START TRANSACTION;
CREATE TABLE `CashBookEntries` (
    `Id` char(36) NOT NULL,
    `EntryDate` datetime(6) NOT NULL,
    `Type` int NOT NULL,
    `Category` longtext NOT NULL,
    `Amount` decimal(18,2) NOT NULL,
    `Description` longtext NOT NULL,
    `ReferenceId` longtext NULL,
    `ReferenceType` longtext NULL,
    `ShiftId` char(36) NULL,
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

CREATE TABLE `OperatingExpenses` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Type` int NOT NULL,
    `Amount` decimal(18,2) NOT NULL,
    `Month` int NOT NULL,
    `Year` int NOT NULL,
    `DueDate` datetime(6) NULL,
    `PaidDate` datetime(6) NULL,
    `PaymentStatus` int NOT NULL,
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
VALUES ('20260721103553_AddPayrollAndHR', '10.0.9');

COMMIT;

