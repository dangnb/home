-- =============================================================================
-- Core HRM Initial Seed Data (Permissions, System Roles, Super Admin)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Default Tenant Seed
-- -----------------------------------------------------------------------------
INSERT INTO `tenants` (`id`, `code`, `name`, `email`, `phone`, `status`, `created_at`) VALUES
(1, 'DEFAULT', 'Default Tenant', 'admin@default.local', '0900000001', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

-- -----------------------------------------------------------------------------
-- Permissions Seed
-- -----------------------------------------------------------------------------
INSERT INTO `permissions` (`id`, `module`, `code`, `name`, `description`, `status`, `created_at`) VALUES
-- Tenant Module
(1, 'TENANT', 'TENANT.VIEW', 'Xem danh sách khách hàng/tenant', 'Cho phép xem thông tin tenant', 'ACTIVE', NOW(6)),
(2, 'TENANT', 'TENANT.CREATE', 'Tạo mới tenant', 'Cho phép tạo mới tenant trên hệ thống', 'ACTIVE', NOW(6)),
(3, 'TENANT', 'TENANT.UPDATE', 'Cập nhật tenant', 'Cho phép sửa thông tin tenant', 'ACTIVE', NOW(6)),
(4, 'TENANT', 'TENANT.DELETE', 'Xóa tenant', 'Cho phép vô hiệu hóa hoặc xóa tenant', 'ACTIVE', NOW(6)),

-- User & Identity Module
(5, 'USER', 'USER.VIEW', 'Xem người dùng', 'Xem danh sách và chi tiết người dùng', 'ACTIVE', NOW(6)),
(6, 'USER', 'USER.CREATE', 'Tạo người dùng', 'Tạo tài khoản người dùng mới', 'ACTIVE', NOW(6)),
(7, 'USER', 'USER.UPDATE', 'Cập nhật người dùng', 'Cập nhật thông tin tài khoản người dùng', 'ACTIVE', NOW(6)),
(8, 'USER', 'USER.DELETE', 'Xóa người dùng', 'Vô hiệu hóa hoặc xóa người dùng', 'ACTIVE', NOW(6)),

-- Role & Permission Module
(9, 'ROLE', 'ROLE.VIEW', 'Xem vai trò', 'Xem danh sách vai trò phân quyền', 'ACTIVE', NOW(6)),
(10, 'ROLE', 'ROLE.MANAGE', 'Quản lý vai trò', 'Tạo, sửa, gán quyền cho vai trò', 'ACTIVE', NOW(6)),

-- Department Module
(11, 'DEPARTMENT', 'DEPARTMENT.VIEW', 'Xem phòng ban', 'Xem danh sách và cơ cấu phòng ban', 'ACTIVE', NOW(6)),
(12, 'DEPARTMENT', 'DEPARTMENT.CREATE', 'Tạo phòng ban', 'Thêm phòng ban mới vào công ty', 'ACTIVE', NOW(6)),
(13, 'DEPARTMENT', 'DEPARTMENT.UPDATE', 'Cập nhật phòng ban', 'Sửa thông tin phòng ban', 'ACTIVE', NOW(6)),
(14, 'DEPARTMENT', 'DEPARTMENT.DELETE', 'Xóa phòng ban', 'Xóa hoặc lưu trữ phòng ban', 'ACTIVE', NOW(6)),

-- Employee Profile Module
(15, 'EMPLOYEE', 'EMPLOYEE.VIEW', 'Xem hồ sơ nhân sự', 'Xem danh sách và hồ sơ nhân sự', 'ACTIVE', NOW(6)),
(16, 'EMPLOYEE', 'EMPLOYEE.CREATE', 'Thêm mới nhân sự', 'Tạo mới hồ sơ nhân sự', 'ACTIVE', NOW(6)),
(17, 'EMPLOYEE', 'EMPLOYEE.UPDATE', 'Cập nhật nhân sự', 'Cập nhật hồ sơ và thông tin chức danh', 'ACTIVE', NOW(6)),
(18, 'EMPLOYEE', 'EMPLOYEE.DELETE', 'Xóa nhân sự', 'Thôi việc hoặc lưu trữ nhân sự', 'ACTIVE', NOW(6)),

-- Attendance Module
(19, 'ATTENDANCE', 'ATTENDANCE.VIEW_OWN', 'Xem chấm công cá nhân', 'Xem bảng chấm công của chính mình', 'ACTIVE', NOW(6)),
(20, 'ATTENDANCE', 'ATTENDANCE.CHECKIN', 'Thực hiện chấm công', 'Chấm công check-in / check-out', 'ACTIVE', NOW(6)),
(21, 'ATTENDANCE', 'ATTENDANCE.VIEW_ALL', 'Xem chấm công toàn công ty', 'Xem bảng chấm công của mọi nhân viên', 'ACTIVE', NOW(6)),
(22, 'ATTENDANCE', 'ATTENDANCE.MANAGE', 'Quản lý chấm công', 'Điều chỉnh giờ chấm công nhân viên', 'ACTIVE', NOW(6)),

-- Leave Request Module
(23, 'LEAVE', 'LEAVE.CREATE', 'Tạo đơn xin nghỉ', 'Tạo đơn xin nghỉ phép cá nhân', 'ACTIVE', NOW(6)),
(24, 'LEAVE', 'LEAVE.VIEW_OWN', 'Xem đơn nghỉ cá nhân', 'Xem lịch sử đơn xin nghỉ của mình', 'ACTIVE', NOW(6)),
(25, 'LEAVE', 'LEAVE.VIEW_ALL', 'Xem đơn nghỉ toàn công ty', 'Xem đơn xin nghỉ của tất cả nhân sự', 'ACTIVE', NOW(6)),
(26, 'LEAVE', 'LEAVE.APPROVE', 'Phê duyệt nghỉ phép', 'Phê duyệt hoặc từ chối đơn xin nghỉ', 'ACTIVE', NOW(6)),

-- Audit Log Module
(27, 'AUDIT', 'AUDIT.VIEW', 'Xem nhật ký kiểm toán', 'Xem nhật ký thay đổi và truy cập hệ thống', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------------------------------
-- System Roles Seed (tenant_id = NULL là vai trò toàn cục)
-- -----------------------------------------------------------------------------
INSERT INTO `roles` (`id`, `tenant_id`, `code`, `name`, `description`, `status`, `created_at`) VALUES
(1, NULL, 'SUPER_ADMIN', 'Super Administrator', 'Quản trị viên cấp cao nhất của toàn hệ thống', 'ACTIVE', NOW(6)),
(2, NULL, 'TENANT_ADMIN', 'Tenant Administrator', 'Quản trị viên công ty/doanh nghiệp', 'ACTIVE', NOW(6)),
(3, NULL, 'HR_MANAGER', 'Human Resources Manager', 'Trưởng phòng / Chuyên viên nhân sự', 'ACTIVE', NOW(6)),
(4, NULL, 'EMPLOYEE', 'Standard Employee', 'Nhân viên tiêu chuẩn của doanh nghiệp', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------------------------------
-- Super Admin Default User (tenant_id = NULL)
-- Password mặc định: Admin@123456 (BCrypt hash)
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `tenant_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `status`, `created_at`) VALUES
(1, NULL, 'superadmin', 'superadmin@hrmplatform.local', '$2a$11$ELwYfiaM3TVvYRYy4lR08ukuHA5yHCQZY6/1wVMwPNUTWTKwSdVfq', 'System Super Administrator', '0900000000', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`), `password_hash` = VALUES(`password_hash`);

-- Gán SuperAdmin role cho User id = 1
INSERT INTO `user_roles` (`user_id`, `role_id`, `tenant_id`, `status`, `created_at`) VALUES
(1, 1, NULL, 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- -----------------------------------------------------------------------------
-- Gán toàn bộ permissions cho vai trò SUPER_ADMIN (Role ID = 1)
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT 1, id, NOW(6) FROM `permissions`;

SET FOREIGN_KEY_CHECKS = 1;
