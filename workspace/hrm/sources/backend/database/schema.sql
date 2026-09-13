-- =============================================================================
-- Core HRM Multi-Tenant Platform Database Schema (MariaDB 10.x / 11.x)
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci | Engine: InnoDB
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- TABLE: tenants
-- Quáº£n lÃ½ thÃ´ng tin cÃ¡c tá»• chá»©c/doanh nghiá»‡p thuÃª bao há»‡ thá»‘ng (Multi-tenancy)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenants` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tenants_code` (`code`),
    KEY `idx_tenants_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sÃ¡ch khÃ¡ch hÃ ng doanh nghiá»‡p (Tenant)';

-- -----------------------------------------------------------------------------
-- TABLE: users
-- TÃ i khoáº£n Ä‘á»‹nh danh toÃ n há»‡ thá»‘ng (SuperAdmin tenant_id = NULL)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) DEFAULT NULL COMMENT 'NULL Ä‘á»‘i vá»›i Super Admin há»‡ thá»‘ng',
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_username` (`username`),
    UNIQUE KEY `uk_users_email` (`email`),
    KEY `idx_users_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_users_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TÃ i khoáº£n ngÆ°á»i dÃ¹ng';

-- -----------------------------------------------------------------------------
-- TABLE: user_tokens
-- Refresh tokens, quáº£n lÃ½ phiÃªn lÃ m viá»‡c Ä‘a thiáº¿t bá»‹
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_tokens` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `device_info` VARCHAR(255) DEFAULT NULL,
    `ip_address` VARCHAR(50) DEFAULT NULL,
    `expires_at` DATETIME(6) NOT NULL,
    `revoked_at` DATETIME(6) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, REVOKED, EXPIRED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_user_tokens_user` (`user_id`),
    KEY `idx_user_tokens_token_hash` (`token_hash`),
    CONSTRAINT `fk_user_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PhiÃªn Ä‘Äƒng nháº­p & Refresh Tokens';

-- -----------------------------------------------------------------------------
-- TABLE: roles
-- Vai trÃ² ngÆ°á»i dÃ¹ng (tenant_id NULL lÃ  vai trÃ² há»‡ thá»‘ng toÃ n cá»¥c)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) DEFAULT NULL COMMENT 'NULL náº¿u lÃ  system role máº·c Ä‘á»‹nh',
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_roles_tenant_code` (`tenant_id`, `code`),
    KEY `idx_roles_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_roles_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vai trÃ² phÃ¢n quyá»n';

-- -----------------------------------------------------------------------------
-- TABLE: permissions
-- Quyá»n háº¡n há»‡ thá»‘ng chi tiáº¿t theo tá»«ng module
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissions` (
    `id` CHAR(36) NOT NULL,
    `module` VARCHAR(50) NOT NULL COMMENT 'TENANT, USER, ROLE, DEPARTMENT, EMPLOYEE, ATTENDANCE, LEAVE',
    `code` VARCHAR(100) NOT NULL COMMENT 'Format: MODULE.ACTION (e.g., EMPLOYEE.CREATE)',
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_permissions_code` (`code`),
    KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh má»¥c quyá»n háº¡n';

-- -----------------------------------------------------------------------------
-- TABLE: role_permissions
-- Báº£ng liÃªn káº¿t Many-to-Many giá»¯a Role vÃ  Permission
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_permissions` (
    `role_id` CHAR(36) NOT NULL,
    `permission_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PhÃ¢n quyá»n cho vai trÃ²';

-- -----------------------------------------------------------------------------
-- TABLE: user_roles
-- PhÃ¢n vai trÃ² cho tÃ i khoáº£n ngÆ°á»i dÃ¹ng theo tenant
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role_id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_roles` (`user_id`, `role_id`, `tenant_id`),
    KEY `idx_user_roles_tenant_user` (`tenant_id`, `user_id`),
    CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ur_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='GÃ¡n vai trÃ² cho tÃ i khoáº£n';

-- -----------------------------------------------------------------------------
-- TABLE: audit_logs
-- Nháº­t kÃ½ kiá»ƒm toÃ¡n cÃ¡c thay Ä‘á»•i ghi dá»¯ liá»‡u trong há»‡ thá»‘ng
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) DEFAULT NULL,
    `user_id` CHAR(36) DEFAULT NULL,
    `action` VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT',
    `entity_name` VARCHAR(100) NOT NULL,
    `entity_id` VARCHAR(100) NOT NULL,
    `old_data` LONGTEXT DEFAULT NULL COMMENT 'Dá»¯ liá»‡u trÆ°á»›c thay Ä‘á»•i (JSON)',
    `new_data` LONGTEXT DEFAULT NULL COMMENT 'Dá»¯ liá»‡u sau thay Ä‘á»•i (JSON)',
    `ip_address` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_audit_tenant_entity` (`tenant_id`, `entity_name`, `entity_id`),
    KEY `idx_audit_user_created` (`user_id`, `created_at`),
    CONSTRAINT `fk_audit_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nháº­t kÃ½ kiá»ƒm toÃ¡n há»‡ thá»‘ng';

-- -----------------------------------------------------------------------------
-- TABLE: departments
-- Danh má»¥c phÃ²ng ban trá»±c thuá»™c Tenant
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `manager_id` CHAR(36) DEFAULT NULL COMMENT 'TrÆ°á»Ÿng phÃ²ng (FK -> users.id)',
    `parent_id` CHAR(36) DEFAULT NULL COMMENT 'PhÃ²ng ban cáº¥p trÃªn (FK -> departments.id)',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_departments_tenant_code` (`tenant_id`, `code`),
    KEY `idx_departments_tenant_status` (`tenant_id`, `status`),
    KEY `idx_departments_manager` (`manager_id`),
    CONSTRAINT `fk_departments_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_departments_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PhÃ²ng ban doanh nghiá»‡p';

-- -----------------------------------------------------------------------------
-- TABLE: employee_profiles
-- Há»“ sÆ¡ chi tiáº¿t thÃ´ng tin nhÃ¢n sá»±
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_profiles` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `department_id` CHAR(36) DEFAULT NULL,
    `manager_id` CHAR(36) DEFAULT NULL COMMENT 'NgÆ°á»i quáº£n lÃ½ trá»±c tiáº¿p (FK -> users.id)',
    `job_title` VARCHAR(150) NOT NULL,
    `gender` VARCHAR(20) NOT NULL DEFAULT 'OTHER' COMMENT 'MALE, FEMALE, OTHER',
    `date_of_birth` DATE DEFAULT NULL,
    `id_card_number` VARCHAR(50) DEFAULT NULL,
    `tax_code` VARCHAR(50) DEFAULT NULL COMMENT 'MÃ£ sá»‘ thuáº¿ cÃ¡ nhÃ¢n',
    `social_insurance_number` VARCHAR(50) DEFAULT NULL COMMENT 'Sá»‘ sá»• BHXH',
    `bank_account_number` VARCHAR(50) DEFAULT NULL COMMENT 'Sá»‘ tÃ i khoáº£n ngÃ¢n hÃ ng',
    `bank_name` VARCHAR(150) DEFAULT NULL COMMENT 'TÃªn ngÃ¢n hÃ ng',
    `bank_branch` VARCHAR(150) DEFAULT NULL COMMENT 'Chi nhÃ¡nh ngÃ¢n hÃ ng',
    `permanent_address` VARCHAR(255) DEFAULT NULL COMMENT 'Äá»‹a chá»‰ thÆ°á»ng trÃº',
    `temporary_address` VARCHAR(255) DEFAULT NULL COMMENT 'Äá»‹a chá»‰ táº¡m trÃº',
    `emergency_contact_name` VARCHAR(150) DEFAULT NULL COMMENT 'TÃªn ngÆ°á»i liÃªn há»‡ kháº©n cáº¥p',
    `emergency_contact_phone` VARCHAR(50) DEFAULT NULL COMMENT 'SÄT liÃªn há»‡ kháº©n cáº¥p',
    `marital_status` VARCHAR(20) DEFAULT 'SINGLE' COMMENT 'SINGLE, MARRIED, DIVORCED',
    `joined_date` DATE DEFAULT NULL,
    `probation_end_date` DATE DEFAULT NULL COMMENT 'NgÃ y káº¿t thÃºc thá»­ viá»‡c',
    `official_joined_date` DATE DEFAULT NULL COMMENT 'NgÃ y chÃ­nh thá»©c',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT 'ÄÆ°á»ng dáº«n áº£nh Ä‘áº¡i diá»‡n avatar',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_employee_profiles_user` (`user_id`),
    KEY `idx_employee_tenant_status` (`tenant_id`, `status`),
    KEY `idx_employee_department` (`department_id`),
    KEY `idx_employee_manager` (`manager_id`),
    CONSTRAINT `fk_employee_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_employee_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_employee_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Há»“ sÆ¡ thÃ´ng tin nhÃ¢n viÃªn';

-- -----------------------------------------------------------------------------
-- TABLE: employee_contracts
-- Há»£p Ä‘á»“ng lao Ä‘á»™ng nhÃ¢n sá»±
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_contracts` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `employee_id` CHAR(36) NOT NULL,
    `contract_number` VARCHAR(100) NOT NULL,
    `contract_type` VARCHAR(50) NOT NULL,
    `sign_date` DATE NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE DEFAULT NULL,
    `basic_salary` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `insurance_salary` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `note` TEXT DEFAULT NULL,
    `attachment_url` VARCHAR(500) DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_contracts_tenant_number` (`tenant_id`, `contract_number`),
    KEY `idx_contracts_tenant_employee` (`tenant_id`, `employee_id`),
    KEY `idx_contracts_expiry` (`tenant_id`, `end_date`, `status`),
    CONSTRAINT `fk_contracts_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_contracts_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Há»£p Ä‘á»“ng lao Ä‘á»™ng nhÃ¢n sá»±';

-- -----------------------------------------------------------------------------
-- TABLE: employee_dependents
-- NgÆ°á»i phá»¥ thuá»™c giáº£m trá»« gia cáº£nh
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_dependents` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `employee_id` CHAR(36) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `relationship` VARCHAR(50) NOT NULL,
    `date_of_birth` DATE DEFAULT NULL,
    `id_card_number` VARCHAR(50) DEFAULT NULL,
    `tax_code` VARCHAR(50) DEFAULT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_dependents_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_dependents_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_dependents_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='NgÆ°á»i phá»¥ thuá»™c giáº£m trá»« gia cáº£nh';

-- -----------------------------------------------------------------------------
-- TABLE: employee_job_history
-- Lá»‹ch sá»­ biáº¿n Ä‘á»™ng cÃ´ng tÃ¡c nhÃ¢n sá»±
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_job_history` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `employee_id` CHAR(36) NOT NULL,
    `decision_number` VARCHAR(100) DEFAULT NULL,
    `change_type` VARCHAR(50) NOT NULL,
    `old_department_id` CHAR(36) DEFAULT NULL,
    `new_department_id` CHAR(36) DEFAULT NULL,
    `old_job_title` VARCHAR(150) DEFAULT NULL,
    `new_job_title` VARCHAR(150) DEFAULT NULL,
    `old_manager_id` CHAR(36) DEFAULT NULL,
    `new_manager_id` CHAR(36) DEFAULT NULL,
    `effective_date` DATE NOT NULL,
    `note` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `approval_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL' COMMENT 'DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CANCELLED',
    `approver_id` CHAR(36) DEFAULT NULL,
    `approved_at` DATETIME(6) DEFAULT NULL,
    `rejection_reason` VARCHAR(500) DEFAULT NULL,
    `current_step` INT NOT NULL DEFAULT 1,
    `current_manager_status` VARCHAR(30) DEFAULT 'PENDING',
    `current_manager_note` TEXT DEFAULT NULL,
    `current_manager_approved_at` DATETIME(6) DEFAULT NULL,
    `new_manager_status` VARCHAR(30) DEFAULT 'PENDING',
    `new_manager_note` TEXT DEFAULT NULL,
    `new_manager_approved_at` DATETIME(6) DEFAULT NULL,
    `hr_status` VARCHAR(30) DEFAULT 'PENDING',
    `hr_note` TEXT DEFAULT NULL,
    `hr_approved_at` DATETIME(6) DEFAULT NULL,
    `director_status` VARCHAR(30) DEFAULT 'PENDING',
    `director_note` TEXT DEFAULT NULL,
    `director_approved_at` DATETIME(6) DEFAULT NULL,
    `employee_ack_status` VARCHAR(30) DEFAULT 'PENDING',
    `employee_ack_note` TEXT DEFAULT NULL,
    `employee_acknowledged_at` DATETIME(6) DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_job_history_tenant_employee` (`tenant_id`, `employee_id`),
    KEY `idx_job_history_tenant_approval` (`tenant_id`, `approval_status`),
    CONSTRAINT `fk_job_history_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_job_history_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_job_history_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lá»‹ch sá»­ biáº¿n Ä‘á»™ng cÃ´ng tÃ¡c';

-- -----------------------------------------------------------------------------
-- TABLE: employee_documents
-- TÃ i liá»‡u Ä‘Ã­nh kÃ¨m há»“ sÆ¡ nhÃ¢n viÃªn
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_documents` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `employee_id` CHAR(36) NOT NULL,
    `document_type` VARCHAR(50) NOT NULL,
    `document_name` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `file_size` BIGINT DEFAULT 0,
    `issued_date` DATE DEFAULT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_docs_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_docs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_docs_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TÃ i liá»‡u Ä‘Ã­nh kÃ¨m há»“ sÆ¡';

-- -----------------------------------------------------------------------------
-- TABLE: employee_certificates
-- Báº±ng cáº¥p vÃ  chá»©ng chá»‰ chuyÃªn mÃ´n
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_certificates` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `employee_id` CHAR(36) NOT NULL,
    `certificate_name` VARCHAR(255) NOT NULL,
    `issuing_organization` VARCHAR(255) DEFAULT NULL,
    `issue_date` DATE DEFAULT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `score_or_grade` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_certs_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_certs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_certs_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Báº±ng cáº¥p chá»©ng chá»‰';


-- -----------------------------------------------------------------------------
-- TABLE: attendances
-- Dá»¯ liá»‡u cháº¥m cÃ´ng hÃ ng ngÃ y
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendances` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `work_date` DATE NOT NULL,
    `check_in` DATETIME(6) DEFAULT NULL,
    `check_out` DATETIME(6) DEFAULT NULL,
    `late_minutes` INT NOT NULL DEFAULT 0,
    `early_minutes` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PRESENT' COMMENT 'PRESENT, LATE, ABSENT',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_attendances_tenant_user_date` (`tenant_id`, `user_id`, `work_date`),
    KEY `idx_attendances_tenant_date` (`tenant_id`, `work_date`),
    KEY `idx_attendances_user_date` (`user_id`, `work_date`),
    CONSTRAINT `fk_attendances_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_attendances_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Báº£ng ghi cháº¥m cÃ´ng nhÃ¢n viÃªn';

-- -----------------------------------------------------------------------------
-- TABLE: leave_requests
-- YÃªu cáº§u Ä‘Æ¡n nghá»‰ phÃ©p
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leave_requests` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `leave_type` VARCHAR(20) NOT NULL COMMENT 'ANNUAL, SICK, UNPAID',
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `reason` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED',
    `approver_id` CHAR(36) DEFAULT NULL COMMENT 'NgÆ°á»i phÃª duyá»‡t (FK -> users.id)',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_leave_tenant_status` (`tenant_id`, `status`),
    KEY `idx_leave_tenant_user` (`tenant_id`, `user_id`),
    KEY `idx_leave_approver` (`approver_id`),
    CONSTRAINT `fk_leave_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_leave_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_leave_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ÄÆ¡n xin nghá»‰ phÃ©p';

-- -----------------------------------------------------------------------------
-- TABLE: reward_disciplines
-- Quáº£n lÃ½ Quyáº¿t Ä‘á»‹nh Khen thÆ°á»Ÿng vÃ  Ká»· luáº­t cá»§a NhÃ¢n sá»±
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reward_disciplines` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `employee_id` CHAR(36) NOT NULL COMMENT 'FK -> employee_profiles.id',
    `type` VARCHAR(20) NOT NULL COMMENT 'REWARD, DISCIPLINE',
    `category` VARCHAR(50) NOT NULL COMMENT 'PERFORMANCE, EXCELLENCE, INNOVATION, LATE_VIOLATION, SAFETY_VIOLATION, DISCIPLINE_BREACH, BONUS, OTHER',
    `title` VARCHAR(255) NOT NULL,
    `decision_number` VARCHAR(100) DEFAULT NULL,
    `decision_date` DATE NOT NULL,
    `effective_date` DATE NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `reason` TEXT DEFAULT NULL,
    `attachment_url` VARCHAR(500) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'APPROVED' COMMENT 'PENDING, APPROVED, REJECTED, CANCELLED',
    `approver_id` CHAR(36) DEFAULT NULL,
    `approved_at` DATETIME(6) DEFAULT NULL,
    `rejection_reason` VARCHAR(500) DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_reward_disc_tenant_status` (`tenant_id`, `status`),
    KEY `idx_reward_disc_tenant_employee` (`tenant_id`, `employee_id`),
    KEY `idx_reward_disc_tenant_type` (`tenant_id`, `type`),
    CONSTRAINT `fk_reward_disc_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_reward_disc_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sÃ¡ch quyáº¿t Ä‘á»‹nh thÆ°á»Ÿng pháº¡t nhÃ¢n sá»±';

-- -----------------------------------------------------------------------------
-- TABLE: hr_policies
-- Quáº£n lÃ½ Quy Ä‘á»‹nh, Quy cháº¿ & ChÃ­nh sÃ¡ch HR CÃ´ng ty
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_policies` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `policy_code` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL COMMENT 'BENEFITS, WORKING_HOURS, INSURANCE_WELFARE, CODE_OF_CONDUCT, SAFETY_HEALTH, OTHER',
    `effective_date` DATE NOT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `summary` VARCHAR(500) DEFAULT NULL,
    `content` LONGTEXT DEFAULT NULL,
    `attachment_url` VARCHAR(500) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_hr_policies_tenant_code` (`tenant_id`, `policy_code`),
    KEY `idx_hr_policies_tenant_category` (`tenant_id`, `category`),
    KEY `idx_hr_policies_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_hr_policies_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quáº£n lÃ½ Quy Ä‘á»‹nh, Quy cháº¿ & ChÃ­nh sÃ¡ch HR CÃ´ng ty';

-- -----------------------------------------------------------------------------
-- TABLE: notifications
-- ThÃ´ng bÃ¡o há»‡ thá»‘ng & Tiáº¿n trÃ¬nh duyá»‡t Lá»‡nh Ä‘iá»u Ä‘á»™ng
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `notification_type` VARCHAR(100) NOT NULL,
    `reference_id` CHAR(36) DEFAULT NULL,
    `target_url` VARCHAR(500) DEFAULT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `read_at` DATETIME(6) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_notif_tenant_user` (`tenant_id`, `user_id`),
    KEY `idx_notif_read` (`tenant_id`, `user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sÃ¡ch thÃ´ng bÃ¡o há»‡ thá»‘ng';

-- -----------------------------------------------------------------------------
-- TABLE: equipments
-- Quáº£n lÃ½ Trang Thiáº¿t Bá»‹ cÃ´ng ty (Laptop, MÃ n hÃ¬nh, Äiá»‡n thoáº¡i, Thiáº¿t bá»‹ VP)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipments` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'LAPTOP' COMMENT 'LAPTOP, MONITOR, PHONE, DESK_CHAIR, PERIPHERAL, OTHER',
    `serial_number` VARCHAR(100) DEFAULT NULL,
    `specifications` TEXT DEFAULT NULL,
    `purchase_date` DATE DEFAULT NULL,
    `warranty_end_date` DATE DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' COMMENT 'AVAILABLE, ASSIGNED, BROKEN, MAINTENANCE, DISPOSED',
    `current_user_id` CHAR(36) DEFAULT NULL COMMENT 'ID tÃ i khoáº£n User Ä‘ang giá»¯/sá»­ dá»¥ng',
    `current_department_id` CHAR(36) DEFAULT NULL COMMENT 'ID PhÃ²ng ban Ä‘ang tiáº¿p nháº­n thiáº¿t bá»‹',
    `assigned_date` DATETIME(6) DEFAULT NULL COMMENT 'Thá»i Ä‘iá»ƒm bÃ n giao gáº§n nháº¥t',
    `note` TEXT DEFAULT NULL,
    `status_entity` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_equipments_tenant_code` (`tenant_id`, `code`),
    KEY `idx_equipments_tenant_status` (`tenant_id`, `status`),
    KEY `idx_equipments_current_user` (`tenant_id`, `current_user_id`),
    KEY `idx_equipments_current_dept` (`tenant_id`, `current_department_id`),
    CONSTRAINT `fk_equipments_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_equipments_current_user` FOREIGN KEY (`current_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh má»¥c trang thiáº¿t bá»‹ cÃ´ng ty';

-- -----------------------------------------------------------------------------
-- TABLE: equipment_histories
-- Nháº­t kÃ½ bÃ n giao, thu há»“i, bÃ¡o há»ng thiáº¿t bá»‹
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipment_histories` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `equipment_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) DEFAULT NULL COMMENT 'NhÃ¢n sá»± liÃªn quan (nháº­n bÃ n giao / bÃ¡o há»ng / tráº£ vá»)',
    `department_id` CHAR(36) DEFAULT NULL COMMENT 'PhÃ²ng ban liÃªn quan (khi bÃ n giao phÃ²ng ban)',
    `target_type` VARCHAR(50) DEFAULT 'EMPLOYEE' COMMENT 'EMPLOYEE hoáº·c DEPARTMENT',
    `action_type` VARCHAR(50) NOT NULL COMMENT 'HANDOVER, REVOKE, REPORT_BROKEN, REPAIR_COMPLETED, DISPOSE',
    `action_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `condition_status` VARCHAR(255) DEFAULT NULL COMMENT 'TÃ¬nh tráº¡ng thiáº¿t bá»‹ lÃºc thao tÃ¡c (Má»›i 100%, Tráº§y xÆ°á»›c, Há»ng mÃ n hÃ¬nh...)',
    `performed_by` CHAR(36) DEFAULT NULL COMMENT 'ID ngÆ°á»i thá»±c hiá»‡n thao tÃ¡c (Admin / IT)',
    `note` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_equipment_histories_equipment` (`tenant_id`, `equipment_id`),
    KEY `idx_equipment_histories_user` (`tenant_id`, `user_id`),
    CONSTRAINT `fk_equipment_histories_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_equipment_histories_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nháº­t kÃ½ thao tÃ¡c trang thiáº¿t bá»‹ (BÃ n giao/Thu há»“i/BÃ¡o há»ng)';

-- -----------------------------------------------------------------------------
-- TABLE: equipment_repairs
-- Quáº£n lÃ½ Phiáº¿u BÃ¡o Há»ng & Sá»­a Chá»¯a Thiáº¿t Bá»‹ IT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipment_repairs` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `code` VARCHAR(50) NOT NULL COMMENT 'MÃ£ phiáº¿u sá»­a chá»¯a: REP-YYYY-XXX',
    `equipment_id` CHAR(36) NOT NULL COMMENT 'ID trang thiáº¿t bá»‹ bÃ¡o há»ng',
    `reporter_user_id` CHAR(36) NOT NULL COMMENT 'ID ngÆ°á»i bÃ¡o há»ng / sá»­ dá»¥ng',
    `reported_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `issue_description` TEXT NOT NULL COMMENT 'MÃ´ táº£ sá»± cá»‘ ban Ä‘áº§u',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' COMMENT 'LOW, MEDIUM, HIGH, URGENT',
    `technician_user_id` CHAR(36) DEFAULT NULL COMMENT 'ID nhÃ¢n viÃªn IT Ä‘Æ°á»£c phÃ¢n cÃ´ng',
    `assigned_date` DATETIME(6) DEFAULT NULL COMMENT 'Thá»i Ä‘iá»ƒm phÃ¢n cÃ´ng IT',
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, IN_PROGRESS, COMPLETED, UNREPAIRABLE, CANCELLED',
    `actual_error` TEXT DEFAULT NULL COMMENT 'Chi tiáº¿t lá»—i thá»±c táº¿ ghi nháº­n khi IT kiá»ƒm tra',
    `solution_detail` TEXT DEFAULT NULL COMMENT 'Chi tiáº¿t cÃ¡ch kháº¯c phá»¥c / xá»­ lÃ½ cá»§a IT',
    `replaced_parts` TEXT DEFAULT NULL COMMENT 'MÃ´ táº£ linh kiá»‡n thay tháº¿, phá»¥ tÃ¹ng, váº­t tÆ°',
    `repair_cost` DECIMAL(18,2) DEFAULT '0.00' COMMENT 'Chi phÃ­ sá»­a chá»¯a / linh kiá»‡n',
    `started_at` DATETIME(6) DEFAULT NULL COMMENT 'Báº¯t Ä‘áº§u kiá»ƒm tra / sá»­a chá»¯a',
    `completed_at` DATETIME(6) DEFAULT NULL COMMENT 'HoÃ n táº¥t sá»­a chá»¯a',
    `note` TEXT DEFAULT NULL,
    `status_entity` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_equipment_repairs_tenant_code` (`tenant_id`, `code`),
    KEY `idx_equipment_repairs_equipment` (`tenant_id`, `equipment_id`),
    KEY `idx_equipment_repairs_technician` (`tenant_id`, `technician_user_id`),
    KEY `idx_equipment_repairs_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_equipment_repairs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_equipment_repairs_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sÃ¡ch phiáº¿u yÃªu cáº§u bÃ¡o há»ng & sá»­a chá»¯a thiáº¿t bá»‹ IT';

-- -----------------------------------------------------------------------------
-- TABLE: equipment_parts
-- Kho linh kiá»‡n vÃ  phá»¥ tÃ¹ng thay tháº¿ thiáº¿t bá»‹
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipment_parts` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    `unit` VARCHAR(20) NOT NULL DEFAULT 'CÃ¡i',
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `min_stock_quantity` INT NOT NULL DEFAULT 2,
    `unit_price` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `specifications` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_equipment_parts_tenant_code` (`tenant_id`, `code`),
    KEY `idx_equipment_parts_tenant_category` (`tenant_id`, `category`),
    KEY `idx_equipment_parts_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_equipment_parts_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kho phá»¥ tÃ¹ng vÃ  linh kiá»‡n sá»­a chá»¯a thiáº¿t bá»‹';

-- -----------------------------------------------------------------------------
-- TABLE: assets
-- Quáº£n lÃ½ há»“ sÆ¡ tÃ i sáº£n doanh nghiá»‡p
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assets` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `asset_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'IT',
    `serial_number` VARCHAR(100) DEFAULT NULL,
    `purchase_date` DATE DEFAULT NULL,
    `purchase_price` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `current_value` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `assignee_id` CHAR(36) DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_assets_tenant_code` (`tenant_id`, `asset_code`),
    KEY `idx_assets_tenant_status` (`tenant_id`, `status`),
    KEY `idx_assets_assignee` (`tenant_id`, `assignee_id`),
    CONSTRAINT `fk_assets_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_assets_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quáº£n lÃ½ há»“ sÆ¡ tÃ i sáº£n doanh nghiá»‡p';

-- -----------------------------------------------------------------------------
-- TABLE: asset_transactions
-- Nháº­t kÃ½ Ä‘iá»u chuyá»ƒn bÃ n giao tÃ i sáº£n
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_transactions` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `asset_id` CHAR(36) NOT NULL,
    `action_type` VARCHAR(50) NOT NULL,
    `from_user_id` CHAR(36) DEFAULT NULL,
    `to_user_id` CHAR(36) DEFAULT NULL,
    `transaction_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `condition_notes` TEXT DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_asset_transactions_asset` (`tenant_id`, `asset_id`),
    KEY `idx_asset_transactions_to_user` (`tenant_id`, `to_user_id`),
    CONSTRAINT `fk_asset_transactions_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_asset_transactions_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nháº­t kÃ½ Ä‘iá»u chuyá»ƒn bÃ n giao tÃ i sáº£n';

-- -----------------------------------------------------------------------------
-- TABLE: maintenance_tickets
-- Phiáº¿u báº£o dÆ°á»¡ng báº£o trÃ¬ tÃ i sáº£n
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `maintenance_tickets` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `asset_id` CHAR(36) NOT NULL,
    `reported_by` CHAR(36) NOT NULL,
    `technician_id` CHAR(36) DEFAULT NULL,
    `issue_description` TEXT NOT NULL,
    `resolution_notes` TEXT DEFAULT NULL,
    `repair_cost` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `status` VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_maintenance_tickets_asset` (`tenant_id`, `asset_id`),
    KEY `idx_maintenance_tickets_reporter` (`tenant_id`, `reported_by`),
    KEY `idx_maintenance_tickets_technician` (`tenant_id`, `technician_id`),
    CONSTRAINT `fk_maintenance_tickets_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_maintenance_tickets_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phiáº¿u báº£o dÆ°á»¡ng báº£o trÃ¬ tÃ i sáº£n';

-- -----------------------------------------------------------------------------
-- TABLE: asset_depreciations
-- Kháº¥u hao tÃ i sáº£n hÃ ng thÃ¡ng
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_depreciations` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `asset_id` CHAR(36) NOT NULL,
    `period_month` INT NOT NULL,
    `period_year` INT NOT NULL,
    `depreciated_amount` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `remaining_value` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_asset_depreciations_period` (`tenant_id`, `asset_id`, `period_year`, `period_month`),
    CONSTRAINT `fk_asset_depreciations_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_asset_depreciations_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kháº¥u hao tÃ i sáº£n hÃ ng thÃ¡ng';

-- -----------------------------------------------------------------------------
-- TABLE: system_catalogs
-- Danh má»¥c cáº¥u hÃ¬nh há»‡ thá»‘ng master data (Multi-tenant)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_catalogs` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `catalog_type` VARCHAR(50) NOT NULL COMMENT 'LEAVE_TYPE, JOB_POSITION, EDUCATION_LEVEL, ASSET_CATEGORY, CONTRACT_TYPE, NATIONALITY, DEPARTMENT_TYPE',
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_system_default` TINYINT(1) NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_system_catalogs_tenant_type_code` (`tenant_id`, `catalog_type`, `code`),
    KEY `idx_system_catalogs_tenant_type_status` (`tenant_id`, `catalog_type`, `status`),
    CONSTRAINT `fk_system_catalogs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh má»¥c cáº¥u hÃ¬nh há»‡ thá»‘ng master data';

-- -----------------------------------------------------------------------------
-- TABLE: projects
-- Quáº£n lÃ½ Dá»± Ãn CÃ´ng Ty
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `code` VARCHAR(30) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_contact_name` VARCHAR(100) DEFAULT NULL,
    `customer_phone` VARCHAR(20) DEFAULT NULL,
    `customer_email` VARCHAR(100) DEFAULT NULL,
    `sales_user_id` CHAR(36) NOT NULL,
    `sales_department_id` CHAR(36) NOT NULL,
    `tech_lead_user_id` CHAR(36) DEFAULT NULL,
    `tech_department_id` CHAR(36) DEFAULT NULL,
    `project_type` VARCHAR(30) NOT NULL DEFAULT 'FIXED_PRICE',
    `sales_status` VARCHAR(30) NOT NULL DEFAULT 'LEAD',
    `tech_status` VARCHAR(30) NOT NULL DEFAULT 'NOT_APPLICABLE',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `quoted_value` DECIMAL(18,2) DEFAULT NULL,
    `contract_value` DECIMAL(18,2) DEFAULT NULL,
    `contract_signed_date` DATE DEFAULT NULL,
    `contract_file_ref` VARCHAR(500) DEFAULT NULL,
    `warranty_months` INT NOT NULL DEFAULT 0,
    `warranty_end_date` DATE DEFAULT NULL,
    `planned_start_date` DATE DEFAULT NULL,
    `planned_end_date` DATE DEFAULT NULL,
    `actual_start_date` DATE DEFAULT NULL,
    `actual_end_date` DATE DEFAULT NULL,
    `overall_progress_percent` INT NOT NULL DEFAULT 0,
    `description` TEXT DEFAULT NULL,
    `internal_note` TEXT DEFAULT NULL,
    `cancelled_reason` VARCHAR(500) DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_projects_tenant_code` (`tenant_id`, `code`),
    KEY `idx_projects_sales_status` (`tenant_id`, `sales_status`),
    KEY `idx_projects_tech_status` (`tenant_id`, `tech_status`),
    KEY `fk_projects_sales_user` (`sales_user_id`),
    CONSTRAINT `fk_projects_sales_user` FOREIGN KEY (`sales_user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_projects_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quáº£n lÃ½ thÃ´ng tin dá»± Ã¡n';

-- -----------------------------------------------------------------------------
-- TABLE: project_milestones
-- Quáº£n lÃ½ Giai Äoáº¡n & Cá»™t Má»‘c Dá»± Ãn
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_milestones` (
    `id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `due_date` DATE DEFAULT NULL,
    `milestone_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `payment_percent` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `payment_amount` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `is_payment_received` TINYINT(1) NOT NULL DEFAULT 0,
    `completed_date` DATE DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_milestones_project` (`project_id`),
    CONSTRAINT `fk_milestones_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cá»™t má»‘c dá»± Ã¡n vÃ  thanh toÃ¡n';

-- -----------------------------------------------------------------------------
-- TABLE: project_tasks
-- Nhiá»‡m vá»¥ & CÃ´ng Viá»‡c Dá»± Ãn
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_tasks` (
    `id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `milestone_id` CHAR(36) DEFAULT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `assignee_user_id` CHAR(36) DEFAULT NULL,
    `assigned_by_user_id` CHAR(36) DEFAULT NULL,
    `task_type` VARCHAR(30) NOT NULL DEFAULT 'DEVELOPMENT',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    `task_status` VARCHAR(20) NOT NULL DEFAULT 'TODO',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `estimated_hours` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    `actual_hours` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    `progress_percent` INT NOT NULL DEFAULT 0,
    `start_date` DATE DEFAULT NULL,
    `due_date` DATE DEFAULT NULL,
    `completed_date` DATE DEFAULT NULL,
    `blocked_reason` VARCHAR(500) DEFAULT NULL,
    `tags` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_tasks_project` (`project_id`),
    KEY `idx_tasks_milestone` (`milestone_id`),
    KEY `idx_tasks_assignee` (`assignee_user_id`),
    CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tasks_milestone` FOREIGN KEY (`milestone_id`) REFERENCES `project_milestones` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assignee_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sÃ¡ch nhiá»‡m vá»¥ dá»± Ã¡n';

-- -----------------------------------------------------------------------------
-- TABLE: project_members
-- ThÃ nh ViÃªn Tham Gia Dá»± Ãn
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_members` (
    `id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `joined_date` DATE NOT NULL,
    `left_date` DATE DEFAULT NULL,
    `note` VARCHAR(500) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` CHAR(36) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_members_project` (`project_id`),
    KEY `idx_members_user` (`user_id`),
    CONSTRAINT `fk_members_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_members_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ThÃ nh viÃªn dá»± Ã¡n';

-- -----------------------------------------------------------------------------
-- TABLE: project_documents
-- TÃ i Liá»‡u ÄÃ­nh KÃ¨m Dá»± Ãn
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_documents` (
    `id` CHAR(36) NOT NULL,
    `project_id` CHAR(36) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `document_type` VARCHAR(30) NOT NULL DEFAULT 'OTHER',
    `description` VARCHAR(500) DEFAULT NULL,
    `stored_path` VARCHAR(1000) NOT NULL,
    `file_size_bytes` BIGINT NOT NULL DEFAULT 0,
    `mime_type` VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream',
    `uploaded_by` CHAR(36) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_proj_docs_project` (`project_id`),
    CONSTRAINT `fk_proj_docs_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TÃ i liá»‡u vÃ  file dá»± Ã¡n';

SET FOREIGN_KEY_CHECKS = 1;
