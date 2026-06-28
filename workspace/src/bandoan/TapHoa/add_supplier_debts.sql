CREATE TABLE IF NOT EXISTS SupplierDebts (
    Id char(36) NOT NULL,
    CompanyId char(36) NOT NULL,
    CreatedBy varchar(255) NULL,
    CreatedDate datetime NOT NULL,
    ModifiedBy varchar(255) NULL,
    ModifiedDate datetime NULL,
    IsDeleted tinyint(1) NOT NULL DEFAULT 0,
    DeletedBy varchar(255) NULL,
    DeletedDate datetime NULL,
    SupplierId char(36) NOT NULL,
    SupplierName varchar(255) NOT NULL,
    PhoneNumber varchar(50) NULL,
    TotalDebt decimal(18,2) NOT NULL,
    PRIMARY KEY (Id),
    KEY IX_SupplierDebts_SupplierId (SupplierId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
