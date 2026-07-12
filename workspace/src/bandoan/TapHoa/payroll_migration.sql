-- ============================================
-- PAYROLL & ATTENDANCE MIGRATION
-- TapHoa WMS
-- ============================================

-- Bảng Chấm Công (Attendance)
CREATE TABLE IF NOT EXISTS `Attendances` (
    `Id` CHAR(36) NOT NULL,
    `Username` VARCHAR(100) NOT NULL,
    `Date` DATE NOT NULL,
    `CheckIn` DATETIME(6) NULL,
    `CheckOut` DATETIME(6) NULL,
    `TotalHours` DECIMAL(5,2) NOT NULL DEFAULT 0,
    `OvertimeHours` DECIMAL(5,2) NOT NULL DEFAULT 0,
    `LateMinutes` INT NOT NULL DEFAULT 0,
    `EarlyLeaveMinutes` INT NOT NULL DEFAULT 0,
    `Status` INT NOT NULL DEFAULT 1,
    `Notes` LONGTEXT NULL,
    `CreatedDate` DATETIME(6) NULL,
    `CreatedBy` LONGTEXT NULL,
    `ModifiedDate` DATETIME(6) NULL,
    `ModifiedBy` LONGTEXT NULL,
    `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `DeletedDate` DATETIME(6) NULL,
    `DeletedBy` LONGTEXT NULL,
    `CompanyId` CHAR(36) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE UNIQUE INDEX `IX_Attendances_Username_Date_CompanyId`
    ON `Attendances` (`Username`, `Date`, `CompanyId`)
    WHERE `IsDeleted` = 0;

-- Bảng Kỳ Lương (PayrollPeriods)
CREATE TABLE IF NOT EXISTS `PayrollPeriods` (
    `Id` CHAR(36) NOT NULL,
    `Month` INT NOT NULL,
    `Year` INT NOT NULL,
    `StartDate` DATE NOT NULL,
    `EndDate` DATE NOT NULL,
    `Status` INT NOT NULL DEFAULT 1,
    `Notes` LONGTEXT NULL,
    `CreatedDate` DATETIME(6) NULL,
    `CreatedBy` LONGTEXT NULL,
    `ModifiedDate` DATETIME(6) NULL,
    `ModifiedBy` LONGTEXT NULL,
    `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `DeletedDate` DATETIME(6) NULL,
    `DeletedBy` LONGTEXT NULL,
    `CompanyId` CHAR(36) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE UNIQUE INDEX `IX_PayrollPeriods_Month_Year_CompanyId`
    ON `PayrollPeriods` (`Month`, `Year`, `CompanyId`)
    WHERE `IsDeleted` = 0;

-- Bảng Chi Tiết Lương (PayrollEntries)
CREATE TABLE IF NOT EXISTS `PayrollEntries` (
    `Id` CHAR(36) NOT NULL,
    `PayrollPeriodId` CHAR(36) NOT NULL,
    `Username` VARCHAR(100) NOT NULL,
    `EmployeeName` VARCHAR(200) NOT NULL,
    `WorkDays` INT NOT NULL DEFAULT 0,
    `TotalHours` DECIMAL(7,2) NOT NULL DEFAULT 0,
    `OvertimeHours` DECIMAL(7,2) NOT NULL DEFAULT 0,
    `BaseSalary` DECIMAL(18,0) NOT NULL DEFAULT 0,
    `OvertimePay` DECIMAL(18,0) NOT NULL DEFAULT 0,
    `Allowance` DECIMAL(18,0) NOT NULL DEFAULT 0,
    `Bonus` DECIMAL(18,0) NOT NULL DEFAULT 0,
    `Deduction` DECIMAL(18,0) NOT NULL DEFAULT 0,
    `NetSalary` DECIMAL(18,0) NOT NULL DEFAULT 0,
    `Notes` LONGTEXT NULL,
    `CreatedDate` DATETIME(6) NULL,
    `CreatedBy` LONGTEXT NULL,
    `ModifiedDate` DATETIME(6) NULL,
    `ModifiedBy` LONGTEXT NULL,
    `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `DeletedDate` DATETIME(6) NULL,
    `DeletedBy` LONGTEXT NULL,
    `CompanyId` CHAR(36) NOT NULL,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_PayrollEntries_PayrollPeriods_PayrollPeriodId`
        FOREIGN KEY (`PayrollPeriodId`) REFERENCES `PayrollPeriods` (`Id`)
        ON DELETE CASCADE
);

CREATE INDEX `IX_PayrollEntries_PayrollPeriodId`
    ON `PayrollEntries` (`PayrollPeriodId`);

CREATE INDEX `IX_PayrollEntries_Username`
    ON `PayrollEntries` (`Username`);
