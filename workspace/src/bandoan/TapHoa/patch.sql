START TRANSACTION;
ALTER TABLE `Users` DROP CONSTRAINT `FK_Users_SalaryTemplates_SalaryTemplateId`;

DROP INDEX IX_Users_SalaryTemplateId ON Users;

ALTER TABLE `Users` DROP COLUMN `BaseSalary`;

ALTER TABLE `Users` DROP COLUMN `SalaryTemplateId`;

ALTER TABLE `Roles` MODIFY `Permissions` longtext NOT NULL;

CREATE TABLE `Departments` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Description` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    `ParentId` char(36) NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Departments_Departments_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE `Positions` (
    `Id` char(36) NOT NULL,
    `Name` longtext NOT NULL,
    `Description` longtext NULL,
    `CompanyId` char(36) NOT NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE `Employees` (
    `Id` char(36) NOT NULL,
    `EmployeeCode` longtext NOT NULL,
    `FullName` longtext NOT NULL,
    `PhoneNumber` longtext NULL,
    `CitizenId` longtext NULL,
    `Address` longtext NULL,
    `DateOfBirth` datetime(6) NULL,
    `Gender` longtext NULL,
    `Email` longtext NULL,
    `BaseSalary` decimal(18,2) NOT NULL,
    `SalaryTemplateId` char(36) NULL,
    `DepartmentId` char(36) NULL,
    `PositionId` char(36) NULL,
    `UserId` char(36) NULL,
    `CompanyId` char(36) NOT NULL,
    `CreatedDate` datetime(6) NULL,
    `CreatedBy` longtext NULL,
    `ModifiedDate` datetime(6) NULL,
    `ModifiedBy` longtext NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedDate` datetime(6) NULL,
    `DeletedBy` longtext NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Employees_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`),
    CONSTRAINT `FK_Employees_Positions_PositionId` FOREIGN KEY (`PositionId`) REFERENCES `Positions` (`Id`),
    CONSTRAINT `FK_Employees_SalaryTemplates_SalaryTemplateId` FOREIGN KEY (`SalaryTemplateId`) REFERENCES `SalaryTemplates` (`Id`),
    CONSTRAINT `FK_Employees_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
);

UPDATE `Roles` SET `Permissions` = '["*"]'
WHERE `Id` = '01950000-0000-7000-8000-000000000001';
SELECT ROW_COUNT();


UPDATE `Roles` SET `Permissions` = '["Permissions.Products.View","Permissions.Products.Create","Permissions.Products.Update","Permissions.Categories.View","Permissions.Users.View"]'
WHERE `Id` = '01950000-0000-7000-8000-000000000002';
SELECT ROW_COUNT();


UPDATE `Roles` SET `Permissions` = '["Permissions.Products.View","Permissions.Categories.View"]'
WHERE `Id` = '01950000-0000-7000-8000-000000000003';
SELECT ROW_COUNT();


CREATE INDEX `IX_Departments_ParentId` ON `Departments` (`ParentId`);

CREATE INDEX `IX_Employees_DepartmentId` ON `Employees` (`DepartmentId`);

CREATE INDEX `IX_Employees_PositionId` ON `Employees` (`PositionId`);

CREATE INDEX `IX_Employees_SalaryTemplateId` ON `Employees` (`SalaryTemplateId`);

CREATE INDEX `IX_Employees_UserId` ON `Employees` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260720153022_UpdateMissingFields', '10.0.9');

COMMIT;

