-- =============================================================================
-- Migration: 06_create_equipments_tables.sql
-- Quản lý Trang Thiết Bị (Equipments) & Lịch Sử Thao Tác (Equipment Histories)
-- =============================================================================

CREATE TABLE IF NOT EXISTS `equipments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'LAPTOP' COMMENT 'LAPTOP, MONITOR, PHONE, DESK_CHAIR, PERIPHERAL, OTHER',
    `serial_number` VARCHAR(100) DEFAULT NULL,
    `specifications` TEXT DEFAULT NULL,
    `purchase_date` DATE DEFAULT NULL,
    `warranty_end_date` DATE DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' COMMENT 'AVAILABLE, ASSIGNED, BROKEN, MAINTENANCE, DISPOSED',
    `current_user_id` BIGINT DEFAULT NULL COMMENT 'ID tài khoản User đang giữ/sử dụng',
    `current_department_id` BIGINT DEFAULT NULL COMMENT 'ID Phòng ban đang tiếp nhận thiết bị',
    `assigned_date` DATETIME(6) DEFAULT NULL COMMENT 'Thời điểm bàn giao gần nhất',
    `note` TEXT DEFAULT NULL,
    `status_entity` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_equipments_tenant_code` (`tenant_id`, `code`),
    KEY `idx_equipments_tenant_status` (`tenant_id`, `status`),
    KEY `idx_equipments_current_user` (`tenant_id`, `current_user_id`),
    CONSTRAINT `fk_equipments_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_equipments_current_user` FOREIGN KEY (`current_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục trang thiết bị công ty';

CREATE TABLE IF NOT EXISTS `equipment_histories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `equipment_id` BIGINT NOT NULL,
    `user_id` BIGINT DEFAULT NULL COMMENT 'Nhân sự liên quan (nhận bàn giao / báo hỏng / trả về)',
    `department_id` BIGINT DEFAULT NULL COMMENT 'Phòng ban liên quan (khi bàn giao phòng ban)',
    `target_type` VARCHAR(50) DEFAULT 'EMPLOYEE' COMMENT 'EMPLOYEE hoặc DEPARTMENT',
    `action_type` VARCHAR(50) NOT NULL COMMENT 'HANDOVER, REVOKE, REPORT_BROKEN, REPAIR_COMPLETED, DISPOSE',
    `action_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `condition_status` VARCHAR(255) DEFAULT NULL COMMENT 'Tình trạng thiết bị lúc thao tác (Mới 100%, Trầy xước, Hỏng màn hình...)',
    `performed_by` BIGINT DEFAULT NULL COMMENT 'ID người thực hiện thao tác (Admin / IT)',
    `note` TEXT DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL,
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_equipment_histories_equipment` (`tenant_id`, `equipment_id`),
    KEY `idx_equipment_histories_user` (`tenant_id`, `user_id`),
    CONSTRAINT `fk_equipment_histories_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_equipment_histories_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký thao tác trang thiết bị (Bàn giao/Thu hồi/Báo hỏng)';
