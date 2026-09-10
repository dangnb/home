-- =============================================================================
-- Core HRM Multi-Tenant Platform Database Schema (MariaDB 10.x / 11.x)
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci | Engine: InnoDB
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- TABLE: tenants
-- Quản lý thông tin các tổ chức/doanh nghiệp thuê bao hệ thống (Multi-tenancy)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenants` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_tenants_code` (`code`),
    KEY `idx_tenants_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách khách hàng doanh nghiệp (Tenant)';

-- -----------------------------------------------------------------------------
-- TABLE: users
-- Tài khoản định danh toàn hệ thống (SuperAdmin tenant_id = NULL)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT DEFAULT NULL COMMENT 'NULL đối với Super Admin hệ thống',
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_username` (`username`),
    UNIQUE KEY `uk_users_email` (`email`),
    KEY `idx_users_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_users_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tài khoản người dùng';

-- -----------------------------------------------------------------------------
-- TABLE: user_tokens
-- Refresh tokens, quản lý phiên làm việc đa thiết bị
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_tokens` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phiên đăng nhập & Refresh Tokens';

-- -----------------------------------------------------------------------------
-- TABLE: roles
-- Vai trò người dùng (tenant_id NULL là vai trò hệ thống toàn cục)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT DEFAULT NULL COMMENT 'NULL nếu là system role mặc định',
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_roles_tenant_code` (`tenant_id`, `code`),
    KEY `idx_roles_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_roles_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vai trò phân quyền';

-- -----------------------------------------------------------------------------
-- TABLE: permissions
-- Quyền hạn hệ thống chi tiết theo từng module
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `module` VARCHAR(50) NOT NULL COMMENT 'TENANT, USER, ROLE, DEPARTMENT, EMPLOYEE, ATTENDANCE, LEAVE',
    `code` VARCHAR(100) NOT NULL COMMENT 'Format: MODULE.ACTION (e.g., EMPLOYEE.CREATE)',
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_permissions_code` (`code`),
    KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục quyền hạn';

-- -----------------------------------------------------------------------------
-- TABLE: role_permissions
-- Bảng liên kết Many-to-Many giữa Role và Permission
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_permissions` (
    `role_id` BIGINT NOT NULL,
    `permission_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phân quyền cho vai trò';

-- -----------------------------------------------------------------------------
-- TABLE: user_roles
-- Phân vai trò cho tài khoản người dùng theo tenant
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    `tenant_id` BIGINT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_roles` (`user_id`, `role_id`, `tenant_id`),
    KEY `idx_user_roles_tenant_user` (`tenant_id`, `user_id`),
    CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ur_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gán vai trò cho tài khoản';

-- -----------------------------------------------------------------------------
-- TABLE: audit_logs
-- Nhật ký kiểm toán các thay đổi ghi dữ liệu trong hệ thống
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT DEFAULT NULL,
    `user_id` BIGINT DEFAULT NULL,
    `action` VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT',
    `entity_name` VARCHAR(100) NOT NULL,
    `entity_id` VARCHAR(100) NOT NULL,
    `old_data` LONGTEXT DEFAULT NULL COMMENT 'Dữ liệu trước thay đổi (JSON)',
    `new_data` LONGTEXT DEFAULT NULL COMMENT 'Dữ liệu sau thay đổi (JSON)',
    `ip_address` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    KEY `idx_audit_tenant_entity` (`tenant_id`, `entity_name`, `entity_id`),
    KEY `idx_audit_user_created` (`user_id`, `created_at`),
    CONSTRAINT `fk_audit_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký kiểm toán hệ thống';

-- -----------------------------------------------------------------------------
-- TABLE: departments
-- Danh mục phòng ban trực thuộc Tenant
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `manager_id` BIGINT DEFAULT NULL COMMENT 'Trưởng phòng (FK -> users.id)',
    `parent_id` BIGINT DEFAULT NULL COMMENT 'Phòng ban cấp trên (FK -> departments.id)',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_departments_tenant_code` (`tenant_id`, `code`),
    KEY `idx_departments_tenant_status` (`tenant_id`, `status`),
    KEY `idx_departments_manager` (`manager_id`),
    CONSTRAINT `fk_departments_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_departments_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phòng ban doanh nghiệp';

-- -----------------------------------------------------------------------------
-- TABLE: employee_profiles
-- Hồ sơ chi tiết thông tin nhân sự
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_profiles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `department_id` BIGINT DEFAULT NULL,
    `manager_id` BIGINT DEFAULT NULL COMMENT 'Người quản lý trực tiếp (FK -> users.id)',
    `job_title` VARCHAR(150) NOT NULL,
    `gender` VARCHAR(20) NOT NULL DEFAULT 'OTHER' COMMENT 'MALE, FEMALE, OTHER',
    `date_of_birth` DATE DEFAULT NULL,
    `id_card_number` VARCHAR(50) DEFAULT NULL,
    `tax_code` VARCHAR(50) DEFAULT NULL COMMENT 'Mã số thuế cá nhân',
    `social_insurance_number` VARCHAR(50) DEFAULT NULL COMMENT 'Số sổ BHXH',
    `bank_account_number` VARCHAR(50) DEFAULT NULL COMMENT 'Số tài khoản ngân hàng',
    `bank_name` VARCHAR(150) DEFAULT NULL COMMENT 'Tên ngân hàng',
    `bank_branch` VARCHAR(150) DEFAULT NULL COMMENT 'Chi nhánh ngân hàng',
    `permanent_address` VARCHAR(255) DEFAULT NULL COMMENT 'Địa chỉ thường trú',
    `temporary_address` VARCHAR(255) DEFAULT NULL COMMENT 'Địa chỉ tạm trú',
    `emergency_contact_name` VARCHAR(150) DEFAULT NULL COMMENT 'Tên người liên hệ khẩn cấp',
    `emergency_contact_phone` VARCHAR(50) DEFAULT NULL COMMENT 'SĐT liên hệ khẩn cấp',
    `marital_status` VARCHAR(20) DEFAULT 'SINGLE' COMMENT 'SINGLE, MARRIED, DIVORCED',
    `joined_date` DATE DEFAULT NULL,
    `probation_end_date` DATE DEFAULT NULL COMMENT 'Ngày kết thúc thử việc',
    `official_joined_date` DATE DEFAULT NULL COMMENT 'Ngày chính thức',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT 'Đường dẫn ảnh đại diện avatar',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, LOCKED, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_employee_profiles_user` (`user_id`),
    KEY `idx_employee_tenant_status` (`tenant_id`, `status`),
    KEY `idx_employee_department` (`department_id`),
    KEY `idx_employee_manager` (`manager_id`),
    CONSTRAINT `fk_employee_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_employee_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_employee_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hồ sơ thông tin nhân viên';

-- -----------------------------------------------------------------------------
-- TABLE: employee_contracts
-- Hợp đồng lao động nhân sự
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_contracts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
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
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_contracts_tenant_number` (`tenant_id`, `contract_number`),
    KEY `idx_contracts_tenant_employee` (`tenant_id`, `employee_id`),
    KEY `idx_contracts_expiry` (`tenant_id`, `end_date`, `status`),
    CONSTRAINT `fk_contracts_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_contracts_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hợp đồng lao động nhân sự';

-- -----------------------------------------------------------------------------
-- TABLE: employee_dependents
-- Người phụ thuộc giảm trừ gia cảnh
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_dependents` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `relationship` VARCHAR(50) NOT NULL,
    `date_of_birth` DATE DEFAULT NULL,
    `id_card_number` VARCHAR(50) DEFAULT NULL,
    `tax_code` VARCHAR(50) DEFAULT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_dependents_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_dependents_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_dependents_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Người phụ thuộc giảm trừ gia cảnh';

-- -----------------------------------------------------------------------------
-- TABLE: employee_job_history
-- Lịch sử biến động công tác nhân sự
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_job_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    `decision_number` VARCHAR(100) DEFAULT NULL,
    `change_type` VARCHAR(50) NOT NULL,
    `old_department_id` BIGINT DEFAULT NULL,
    `new_department_id` BIGINT DEFAULT NULL,
    `old_job_title` VARCHAR(150) DEFAULT NULL,
    `new_job_title` VARCHAR(150) DEFAULT NULL,
    `old_manager_id` BIGINT DEFAULT NULL,
    `new_manager_id` BIGINT DEFAULT NULL,
    `effective_date` DATE NOT NULL,
    `note` TEXT DEFAULT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_job_history_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_job_history_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_job_history_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lịch sử biến động công tác';

-- -----------------------------------------------------------------------------
-- TABLE: employee_documents
-- Tài liệu đính kèm hồ sơ nhân viên
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_documents` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    `document_type` VARCHAR(50) NOT NULL,
    `document_name` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `file_size` BIGINT DEFAULT 0,
    `issued_date` DATE DEFAULT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_docs_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_docs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_docs_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tài liệu đính kèm hồ sơ';

-- -----------------------------------------------------------------------------
-- TABLE: employee_certificates
-- Bằng cấp và chứng chỉ chuyên môn
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_certificates` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    `certificate_name` VARCHAR(255) NOT NULL,
    `issuing_organization` VARCHAR(255) DEFAULT NULL,
    `issue_date` DATE DEFAULT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `score_or_grade` VARCHAR(50) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_certs_tenant_employee` (`tenant_id`, `employee_id`),
    CONSTRAINT `fk_certs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_certs_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bằng cấp chứng chỉ';


-- -----------------------------------------------------------------------------
-- TABLE: attendances
-- Dữ liệu chấm công hàng ngày
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendances` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `work_date` DATE NOT NULL,
    `check_in` DATETIME(6) DEFAULT NULL,
    `check_out` DATETIME(6) DEFAULT NULL,
    `late_minutes` INT NOT NULL DEFAULT 0,
    `early_minutes` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PRESENT' COMMENT 'PRESENT, LATE, ABSENT',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_attendances_tenant_user_date` (`tenant_id`, `user_id`, `work_date`),
    KEY `idx_attendances_tenant_date` (`tenant_id`, `work_date`),
    KEY `idx_attendances_user_date` (`user_id`, `work_date`),
    CONSTRAINT `fk_attendances_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_attendances_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng ghi chấm công nhân viên';

-- -----------------------------------------------------------------------------
-- TABLE: leave_requests
-- Yêu cầu đơn nghỉ phép
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leave_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `leave_type` VARCHAR(20) NOT NULL COMMENT 'ANNUAL, SICK, UNPAID',
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `reason` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED',
    `approver_id` BIGINT DEFAULT NULL COMMENT 'Người phê duyệt (FK -> users.id)',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_leave_tenant_status` (`tenant_id`, `status`),
    KEY `idx_leave_tenant_user` (`tenant_id`, `user_id`),
    KEY `idx_leave_approver` (`approver_id`),
    CONSTRAINT `fk_leave_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_leave_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_leave_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đơn xin nghỉ phép';

-- -----------------------------------------------------------------------------
-- TABLE: reward_disciplines
-- Quản lý Quyết định Khen thưởng và Kỷ luật của Nhân sự
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reward_disciplines` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL COMMENT 'FK -> employee_profiles.id',
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
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_reward_disc_tenant_status` (`tenant_id`, `status`),
    KEY `idx_reward_disc_tenant_employee` (`tenant_id`, `employee_id`),
    KEY `idx_reward_disc_tenant_type` (`tenant_id`, `type`),
    CONSTRAINT `fk_reward_disc_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_reward_disc_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách quyết định thưởng phạt nhân sự';

SET FOREIGN_KEY_CHECKS = 1;
