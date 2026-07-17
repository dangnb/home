START TRANSACTION;
ALTER TABLE `Users` ADD `BaseSalary` decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE `Users` ADD `SalaryTemplateId` char(36) NULL;

ALTER TABLE `PayrollPeriods` ADD `CustomVariables` longtext NULL;

CREATE TABLE `SalaryTemplates` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Formula` longtext NOT NULL,
    `Notes` longtext NULL,
    `IsActive` tinyint(1) NOT NULL,
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

UPDATE `Users` SET `BaseSalary` = 10000000.0, `SalaryTemplateId` = NULL
WHERE `Id` = '01950000-0000-7000-8000-000000000004';
SELECT ROW_COUNT();


CREATE INDEX `IX_Users_SalaryTemplateId` ON `Users` (`SalaryTemplateId`);

ALTER TABLE `Users` ADD CONSTRAINT `FK_Users_SalaryTemplates_SalaryTemplateId` FOREIGN KEY (`SalaryTemplateId`) REFERENCES `SalaryTemplates` (`Id`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260717142917_AddSalaryTemplates', '10.0.9');

COMMIT;

