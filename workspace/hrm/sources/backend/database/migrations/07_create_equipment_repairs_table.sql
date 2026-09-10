-- =============================================================================
-- Migration: 07_create_equipment_repairs_table.sql
-- Quản lý Phiếu Báo Hỏng & Sửa Chữa Thiết Bị IT (Equipment Repair Requests)
-- =============================================================================

CREATE TABLE IF NOT EXISTS `equipment_repairs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL,
    `code` VARCHAR(50) NOT NULL COMMENT 'Mã phiếu sửa chữa: REP-YYYY-XXX',
    `equipment_id` BIGINT NOT NULL COMMENT 'ID trang thiết bị báo hỏng',
    `reporter_user_id` BIGINT NOT NULL COMMENT 'ID người báo hỏng / sử dụng',
    `reported_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `issue_description` TEXT NOT NULL COMMENT 'Mô tả sự cố ban đầu',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' COMMENT 'LOW, MEDIUM, HIGH, URGENT',
    `technician_user_id` BIGINT DEFAULT NULL COMMENT 'ID nhân viên IT được phân công',
    `assigned_date` DATETIME(6) DEFAULT NULL COMMENT 'Thời điểm phân công IT',
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, IN_PROGRESS, COMPLETED, UNREPAIRABLE, CANCELLED',
    `actual_error` TEXT DEFAULT NULL COMMENT 'Chi tiết lỗi thực tế ghi nhận khi IT kiểm tra',
    `solution_detail` TEXT DEFAULT NULL COMMENT 'Chi tiết cách khắc phục / xử lý của IT',
    `replaced_parts` TEXT DEFAULT NULL COMMENT 'Mô tả linh kiện thay thế, phụ tùng, vật tư',
    `repair_cost` DECIMAL(18,2) DEFAULT '0.00' COMMENT 'Chi phí sửa chữa / linh kiện',
    `started_at` DATETIME(6) DEFAULT NULL COMMENT 'Bắt đầu kiểm tra / sửa chữa',
    `completed_at` DATETIME(6) DEFAULT NULL COMMENT 'Hoàn tất sửa chữa',
    `note` TEXT DEFAULT NULL,
    `status_entity` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, DELETED',
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_equipment_repairs_tenant_code` (`tenant_id`, `code`),
    KEY `idx_equipment_repairs_equipment` (`tenant_id`, `equipment_id`),
    KEY `idx_equipment_repairs_technician` (`tenant_id`, `technician_user_id`),
    KEY `idx_equipment_repairs_status` (`tenant_id`, `status`),
    CONSTRAINT `fk_equipment_repairs_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_equipment_repairs_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách phiếu yêu cầu báo hỏng & sửa chữa thiết bị IT';
