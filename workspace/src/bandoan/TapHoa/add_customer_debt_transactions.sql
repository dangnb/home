CREATE TABLE IF NOT EXISTS CustomerDebtTransactions (
    Id char(36) NOT NULL,
    CompanyId char(36) NOT NULL,
    CreatedBy varchar(255) NULL,
    CreatedDate datetime NOT NULL,
    ModifiedBy varchar(255) NULL,
    ModifiedDate datetime NULL,
    IsDeleted tinyint(1) NOT NULL DEFAULT 0,
    DeletedBy varchar(255) NULL,
    DeletedDate datetime NULL,
    CustomerId char(36) NOT NULL,
    Type int NOT NULL,
    Amount decimal(18,2) NOT NULL,
    PaidAmount decimal(18,2) NOT NULL,
    Note varchar(500) NULL,
    RelatedDebtId char(36) NULL,
    PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
