-- =============================================================================
-- Migration: 08_sync_all_tables_and_catalogs.sql
-- Cập nhật đồng bộ các bảng Master Data, Thiết Bị, Tài Sản Cố Định & Hạt nhân RBAC
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. BẢNG: system_catalogs (Cấu hình danh mục hệ thống Master Data)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_catalogs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `catalog_type` VARCHAR(50) NOT NULL COMMENT 'LEAVE_TYPE, JOB_POSITION, EDUCATION_LEVEL, ASSET_CATEGORY, CONTRACT_TYPE, NATIONALITY, DEPARTMENT_TYPE',
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_system_default` TINYINT(1) NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_system_catalogs_tenant_type_code` (`tenant_id`, `catalog_type`, `code`),
    KEY `idx_system_catalogs_tenant_type_status` (`tenant_id`, `catalog_type`, `status`),
    CONSTRAINT `fk_system_catalogs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục cấu hình hệ thống master data';

-- -----------------------------------------------------------------------------
-- 2. BẢNG: equipment_parts (Kho linh kiện / vật tư thay thế thiết bị IT)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipment_parts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    `unit` VARCHAR(20) NOT NULL DEFAULT 'Cái',
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `min_stock_quantity` INT NOT NULL DEFAULT 2,
    `unit_price` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `specifications` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_equipment_parts_tenant_code` (`tenant_id`, `code`),
    KEY `idx_equipment_parts_tenant_category` (`tenant_id`, `category`),
    KEY `idx_equipment_parts_tenant_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_equipment_parts_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kho phụ tùng và linh kiện sửa chữa thiết bị';

-- -----------------------------------------------------------------------------
-- 3. BẢNG: assets (Quản lý Tài Sản Doanh Nghiệp)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `asset_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'IT',
    `serial_number` VARCHAR(100) DEFAULT NULL,
    `purchase_date` DATE DEFAULT NULL,
    `purchase_price` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `current_value` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `assignee_id` BIGINT DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_assets_tenant_code` (`tenant_id`, `asset_code`),
    KEY `idx_assets_tenant_status` (`tenant_id`, `status`),
    KEY `idx_assets_assignee` (`tenant_id`, `assignee_id`),
    CONSTRAINT `fk_assets_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_assets_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý hồ sơ tài sản doanh nghiệp';

-- -----------------------------------------------------------------------------
-- 4. BẢNG: asset_transactions (Nhật ký giao dịch điều chuyển tài sản)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `asset_id` BIGINT NOT NULL,
    `action_type` VARCHAR(50) NOT NULL,
    `from_user_id` BIGINT DEFAULT NULL,
    `to_user_id` BIGINT DEFAULT NULL,
    `transaction_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `condition_notes` TEXT DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_asset_transactions_asset` (`tenant_id`, `asset_id`),
    KEY `idx_asset_transactions_to_user` (`tenant_id`, `to_user_id`),
    CONSTRAINT `fk_asset_transactions_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_asset_transactions_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký điều chuyển bàn giao tài sản';

-- -----------------------------------------------------------------------------
-- 5. BẢNG: maintenance_tickets (Phiếu bảo trì / bảo dưỡng tài sản)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `maintenance_tickets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `asset_id` BIGINT NOT NULL,
    `reported_by` BIGINT NOT NULL,
    `technician_id` BIGINT DEFAULT NULL,
    `issue_description` TEXT NOT NULL,
    `resolution_notes` TEXT DEFAULT NULL,
    `repair_cost` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `status` VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_maintenance_tickets_asset` (`tenant_id`, `asset_id`),
    KEY `idx_maintenance_tickets_reporter` (`tenant_id`, `reported_by`),
    KEY `idx_maintenance_tickets_technician` (`tenant_id`, `technician_id`),
    CONSTRAINT `fk_maintenance_tickets_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_maintenance_tickets_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phiếu bảo dưỡng bảo trì tài sản';

-- -----------------------------------------------------------------------------
-- 6. BẢNG: asset_depreciations (Bảng tính khấu hao tài sản định kỳ)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset_depreciations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `asset_id` BIGINT NOT NULL,
    `period_month` INT NOT NULL,
    `period_year` INT NOT NULL,
    `depreciated_amount` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `remaining_value` DECIMAL(18,2) NOT NULL DEFAULT '0.00',
    `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_asset_depreciations_period` (`tenant_id`, `asset_id`, `period_year`, `period_month`),
    CONSTRAINT `fk_asset_depreciations_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_asset_depreciations_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Khấu hao tài sản hàng tháng';

-- -----------------------------------------------------------------------------
-- 7. SEED DỮ LIỆU: system_catalogs (Tenant ID = 1)
-- -----------------------------------------------------------------------------
INSERT INTO `system_catalogs` (`id`, `tenant_id`, `catalog_type`, `code`, `name`, `description`, `sort_order`, `is_system_default`, `status`, `created_at`) VALUES
-- LEAVE_TYPE
(1,  1, 'LEAVE_TYPE', 'ANNUAL',     'Nghỉ phép năm',         'Nghỉ phép theo quy định Luật Lao động (12 ngày/năm)',   1, 1, 'ACTIVE', NOW(6)),
(2,  1, 'LEAVE_TYPE', 'SICK',       'Nghỉ bệnh',             'Nghỉ ốm có xác nhận y tế',                              2, 1, 'ACTIVE', NOW(6)),
(3,  1, 'LEAVE_TYPE', 'UNPAID',     'Nghỉ không lương',      'Nghỉ phép không hưởng lương theo thỏa thuận',           3, 1, 'ACTIVE', NOW(6)),
(4,  1, 'LEAVE_TYPE', 'MATERNITY',  'Nghỉ thai sản',         'Nghỉ thai sản theo Luật Bảo hiểm xã hội',              4, 1, 'ACTIVE', NOW(6)),
(5,  1, 'LEAVE_TYPE', 'PATERNITY',  'Nghỉ hộ sản (nam)',     'Nghỉ khi vợ sinh (5-14 ngày tùy ca)',                   5, 1, 'ACTIVE', NOW(6)),
(6,  1, 'LEAVE_TYPE', 'COMPENSATORY', 'Nghỉ bù',             'Nghỉ bù các ngày làm thêm, trực lễ/tết',               6, 1, 'ACTIVE', NOW(6)),
(7,  1, 'LEAVE_TYPE', 'BEREAVEMENT', 'Nghỉ tang chế',        'Nghỉ khi gia đình có tang sự (3 ngày)',                 7, 1, 'ACTIVE', NOW(6)),

-- JOB_POSITION
(10, 1, 'JOB_POSITION', 'CEO',          'Giám đốc điều hành (CEO)',      NULL, 1, 1, 'ACTIVE', NOW(6)),
(11, 1, 'JOB_POSITION', 'CFO',          'Giám đốc tài chính (CFO)',      NULL, 2, 1, 'ACTIVE', NOW(6)),
(12, 1, 'JOB_POSITION', 'CTO',          'Giám đốc kỹ thuật (CTO)',       NULL, 3, 1, 'ACTIVE', NOW(6)),
(13, 1, 'JOB_POSITION', 'DEPT_MGR',     'Trưởng phòng',                  NULL, 4, 1, 'ACTIVE', NOW(6)),
(14, 1, 'JOB_POSITION', 'TEAM_LEAD',    'Trưởng nhóm (Team Lead)',       NULL, 5, 1, 'ACTIVE', NOW(6)),
(15, 1, 'JOB_POSITION', 'SR_ENGINEER',  'Kỹ sư cao cấp (Senior)',        NULL, 6, 1, 'ACTIVE', NOW(6)),
(16, 1, 'JOB_POSITION', 'ENGINEER',     'Kỹ sư (Engineer)',              NULL, 7, 1, 'ACTIVE', NOW(6)),
(17, 1, 'JOB_POSITION', 'JR_ENGINEER',  'Kỹ sư tập sự (Junior)',         NULL, 8, 1, 'ACTIVE', NOW(6)),
(18, 1, 'JOB_POSITION', 'INTERN',       'Thực tập sinh',                 NULL, 9, 1, 'ACTIVE', NOW(6)),
(19, 1, 'JOB_POSITION', 'HR_OFFICER',   'Chuyên viên Nhân sự',           NULL, 10, 1, 'ACTIVE', NOW(6)),
(20, 1, 'JOB_POSITION', 'ACCOUNTANT',   'Kế toán viên',                  NULL, 11, 1, 'ACTIVE', NOW(6)),

-- EDUCATION_LEVEL
(30, 1, 'EDUCATION_LEVEL', 'PHDS',        'Tiến sĩ (Ph.D)',              NULL, 1, 1, 'ACTIVE', NOW(6)),
(31, 1, 'EDUCATION_LEVEL', 'MASTER',      'Thạc sĩ',                     NULL, 2, 1, 'ACTIVE', NOW(6)),
(32, 1, 'EDUCATION_LEVEL', 'BACHELOR',    'Đại học (Cử nhân/Kỹ sư)',    NULL, 3, 1, 'ACTIVE', NOW(6)),
(33, 1, 'EDUCATION_LEVEL', 'COLLEGE',     'Cao đẳng',                    NULL, 4, 1, 'ACTIVE', NOW(6)),
(34, 1, 'EDUCATION_LEVEL', 'VOCATIONAL',  'Trung cấp / Dạy nghề',       NULL, 5, 1, 'ACTIVE', NOW(6)),
(35, 1, 'EDUCATION_LEVEL', 'HIGH_SCHOOL', 'Tốt nghiệp THPT',            NULL, 6, 1, 'ACTIVE', NOW(6)),
(36, 1, 'EDUCATION_LEVEL', 'OTHER',       'Khác',                        NULL, 7, 1, 'ACTIVE', NOW(6)),

-- ASSET_CATEGORY
(40, 1, 'ASSET_CATEGORY', 'IT',        'Thiết bị IT & Công nghệ',       'Laptop, máy tính, màn hình, thiết bị mạng...',  1, 1, 'ACTIVE', NOW(6)),
(41, 1, 'ASSET_CATEGORY', 'MACHINERY', 'Máy móc & Thiết bị sản xuất',   'Máy in, máy photocopy, máy cắt...',             2, 1, 'ACTIVE', NOW(6)),
(42, 1, 'ASSET_CATEGORY', 'VEHICLE',   'Phương tiện vận tải',           'Xe ô tô, xe máy, xe tải công ty...',            3, 1, 'ACTIVE', NOW(6)),
(43, 1, 'ASSET_CATEGORY', 'OFFICE',    'Nội thất & Văn phòng',          'Bàn ghế, tủ, điều hòa, đèn chiếu sáng...',     4, 1, 'ACTIVE', NOW(6)),
(44, 1, 'ASSET_CATEGORY', 'OTHER',     'Khác',                          NULL,                                             5, 1, 'ACTIVE', NOW(6)),

-- CONTRACT_TYPE
(50, 1, 'CONTRACT_TYPE', 'PROBATION',      'Hợp đồng thử việc',              'Tối đa 60 ngày theo BLLĐ',              1, 1, 'ACTIVE', NOW(6)),
(51, 1, 'CONTRACT_TYPE', 'DEFINITE',       'HĐLĐ xác định thời hạn',         '1 - 3 năm (không ký quá 2 lần)',        2, 1, 'ACTIVE', NOW(6)),
(52, 1, 'CONTRACT_TYPE', 'INDEFINITE',     'HĐLĐ không xác định thời hạn',   'Hợp đồng chính thức không kỳ hạn',      3, 1, 'ACTIVE', NOW(6)),
(53, 1, 'CONTRACT_TYPE', 'INTERNSHIP',     'Hợp đồng thực tập',              'Dành cho sinh viên thực tập',           4, 1, 'ACTIVE', NOW(6)),
(54, 1, 'CONTRACT_TYPE', 'SEASONAL',       'Hợp đồng thời vụ / Ngắn hạn',   'Dưới 12 tháng theo nhu cầu công việc', 5, 1, 'ACTIVE', NOW(6)),
(55, 1, 'CONTRACT_TYPE', 'ADDENDUM',       'Phụ lục hợp đồng',              'Điều chỉnh/bổ sung điều khoản HĐ gốc',  6, 1, 'ACTIVE', NOW(6)),

-- NATIONALITY
(60, 1, 'NATIONALITY', 'VN',   'Việt Nam',     NULL, 1, 1, 'ACTIVE', NOW(6)),
(61, 1, 'NATIONALITY', 'CN',   'Trung Quốc',   NULL, 2, 0, 'ACTIVE', NOW(6)),
(62, 1, 'NATIONALITY', 'JP',   'Nhật Bản',     NULL, 3, 0, 'ACTIVE', NOW(6)),
(63, 1, 'NATIONALITY', 'KR',   'Hàn Quốc',     NULL, 4, 0, 'ACTIVE', NOW(6)),
(64, 1, 'NATIONALITY', 'US',   'Hoa Kỳ',       NULL, 5, 0, 'ACTIVE', NOW(6)),
(65, 1, 'NATIONALITY', 'OTHER','Nước ngoài khác', NULL, 99, 0, 'ACTIVE', NOW(6)),

-- DEPARTMENT_TYPE
(70, 1, 'DEPARTMENT_TYPE', 'ENGINEERING',  'Kỹ thuật & Công nghệ',     NULL, 1, 1, 'ACTIVE', NOW(6)),
(71, 1, 'DEPARTMENT_TYPE', 'BUSINESS',     'Kinh doanh & Bán hàng',    NULL, 2, 1, 'ACTIVE', NOW(6)),
(72, 1, 'DEPARTMENT_TYPE', 'HR',           'Nhân sự (HR)',              NULL, 3, 1, 'ACTIVE', NOW(6)),
(73, 1, 'DEPARTMENT_TYPE', 'FINANCE',      'Tài chính & Kế toán',      NULL, 4, 1, 'ACTIVE', NOW(6)),
(74, 1, 'DEPARTMENT_TYPE', 'ADMIN',        'Hành chính & Văn phòng',   NULL, 5, 1, 'ACTIVE', NOW(6)),
(75, 1, 'DEPARTMENT_TYPE', 'MARKETING',    'Marketing & Truyền thông', NULL, 6, 1, 'ACTIVE', NOW(6)),
(76, 1, 'DEPARTMENT_TYPE', 'LEGAL',        'Pháp chế & Tuân thủ',      NULL, 7, 1, 'ACTIVE', NOW(6)),
(77, 1, 'DEPARTMENT_TYPE', 'IT_SUPPORT',   'Hỗ trợ IT (Helpdesk)',     NULL, 8, 1, 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

-- -----------------------------------------------------------------------------
-- 8. SEED QUYỀN HẠN (Permissions bổ sung cho CONFIG, EQUIPMENT, ASSET, PROJECT)
-- -----------------------------------------------------------------------------
INSERT INTO `permissions` (`id`, `module`, `code`, `name`, `description`, `status`, `created_at`) VALUES
(28, 'CONFIG', 'config:manage', 'Quản lý danh mục hệ thống', 'Thêm/sửa/xóa các danh mục dùng chung trong hệ thống', 'ACTIVE', NOW(6)),
(29, 'CONFIG', 'CONFIG.VIEW', 'Xem danh mục hệ thống', 'Xem danh sách các danh mục hệ thống dùng chung', 'ACTIVE', NOW(6)),
(30, 'EQUIPMENT', 'EQUIPMENT.VIEW', 'Xem trang thiết bị', 'Xem danh mục và tình trạng trang thiết bị', 'ACTIVE', NOW(6)),
(31, 'EQUIPMENT', 'EQUIPMENT.MANAGE', 'Quản lý trang thiết bị', 'Bàn giao, thu hồi, báo hỏng trang thiết bị', 'ACTIVE', NOW(6)),
(32, 'EQUIPMENT', 'EQUIPMENT.REPAIR', 'Quản lý sửa chữa thiết bị', 'Tiếp nhận, xử lý và cập nhật tiến độ sửa chữa', 'ACTIVE', NOW(6)),
(33, 'ASSET', 'ASSET.VIEW', 'Xem tài sản cố định', 'Xem danh mục tài sản và hồ sơ tài sản', 'ACTIVE', NOW(6)),
(34, 'ASSET', 'ASSET.MANAGE', 'Quản lý tài sản', 'Cấp phát, điều chuyển, bảo trì và khấu hao tài sản', 'ACTIVE', NOW(6)),
(35, 'PROJECT', 'PROJECT.VIEW', 'Xem dự án', 'Xem danh sách và tiến độ dự án', 'ACTIVE', NOW(6)),
(36, 'PROJECT', 'PROJECT.MANAGE', 'Quản lý dự án', 'Tạo, sửa, phân bổ nhân sự và công việc dự án', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

-- Cấp toàn bộ permissions cho SUPER_ADMIN
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT 1, id, NOW(6) FROM `permissions`;

SET FOREIGN_KEY_CHECKS = 1;
