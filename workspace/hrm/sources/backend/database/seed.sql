-- =============================================================================
-- Core HRM Initial Seed Data (UUIDv7 Format)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Default Tenant Seed
-- -----------------------------------------------------------------------------
INSERT INTO `tenants` (`id`, `code`, `name`, `email`, `phone`, `status`, `created_at`) VALUES
('01956100-0000-7000-8000-000000000001', 'DEFAULT', 'Default Tenant', 'admin@default.local', '0900000001', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

-- -----------------------------------------------------------------------------
-- Permissions Seed
-- -----------------------------------------------------------------------------
INSERT INTO `permissions` (`id`, `module`, `code`, `name`, `description`, `status`, `created_at`) VALUES
-- Tenant Module
('01956100-0000-7000-8000-000000000101', 'TENANT', 'TENANT.VIEW', 'Xem danh sách khách hàng/tenant', 'Cho phép xem thông tin tenant', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000102', 'TENANT', 'TENANT.CREATE', 'Tạo mới tenant', 'Cho phép tạo mới tenant trên hệ thống', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000103', 'TENANT', 'TENANT.UPDATE', 'Cập nhật tenant', 'Cho phép sửa thông tin tenant', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000104', 'TENANT', 'TENANT.DELETE', 'Xóa tenant', 'Cho phép vô hiệu hóa hoặc xóa tenant', 'ACTIVE', NOW(6)),

-- User & Identity Module
('01956100-0000-7000-8000-000000000105', 'USER', 'USER.VIEW', 'Xem người dùng', 'Xem danh sách và chi tiết người dùng', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000106', 'USER', 'USER.CREATE', 'Tạo người dùng', 'Tạo tài khoản người dùng mới', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000107', 'USER', 'USER.UPDATE', 'Cập nhật người dùng', 'Cập nhật thông tin tài khoản người dùng', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000108', 'USER', 'USER.DELETE', 'Xóa người dùng', 'Vô hiệu hóa hoặc xóa người dùng', 'ACTIVE', NOW(6)),

-- Role & Permission Module
('01956100-0000-7000-8000-000000000109', 'ROLE', 'ROLE.VIEW', 'Xem vai trò', 'Xem danh sách vai trò phân quyền', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000110', 'ROLE', 'ROLE.MANAGE', 'Quản lý vai trò', 'Tạo, sửa, gán quyền cho vai trò', 'ACTIVE', NOW(6)),

-- Department Module
('01956100-0000-7000-8000-000000000111', 'DEPARTMENT', 'DEPARTMENT.VIEW', 'Xem phòng ban', 'Xem danh sách và cơ cấu phòng ban', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000112', 'DEPARTMENT', 'DEPARTMENT.CREATE', 'Tạo phòng ban', 'Thêm phòng ban mới vào công ty', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000113', 'DEPARTMENT', 'DEPARTMENT.UPDATE', 'Cập nhật phòng ban', 'Sửa thông tin phòng ban', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000114', 'DEPARTMENT', 'DEPARTMENT.DELETE', 'Xóa phòng ban', 'Xóa hoặc lưu trữ phòng ban', 'ACTIVE', NOW(6)),

-- Employee Profile Module
('01956100-0000-7000-8000-000000000115', 'EMPLOYEE', 'EMPLOYEE.VIEW', 'Xem hồ sơ nhân sự', 'Xem danh sách và hồ sơ nhân sự', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000116', 'EMPLOYEE', 'EMPLOYEE.CREATE', 'Thêm mới nhân sự', 'Tạo mới hồ sơ nhân sự', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000117', 'EMPLOYEE', 'EMPLOYEE.UPDATE', 'Cập nhật nhân sự', 'Cập nhật hồ sơ và thông tin chức danh', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000118', 'EMPLOYEE', 'EMPLOYEE.DELETE', 'Xóa nhân sự', 'Thôi việc hoặc lưu trữ nhân sự', 'ACTIVE', NOW(6)),

-- Attendance Module
('01956100-0000-7000-8000-000000000119', 'ATTENDANCE', 'ATTENDANCE.VIEW_OWN', 'Xem chấm công cá nhân', 'Xem bảng chấm công của chính mình', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000120', 'ATTENDANCE', 'ATTENDANCE.CHECKIN', 'Thực hiện chấm công', 'Chấm công check-in / check-out', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000121', 'ATTENDANCE', 'ATTENDANCE.VIEW_ALL', 'Xem chấm công toàn công ty', 'Xem bảng chấm công của mọi nhân viên', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000122', 'ATTENDANCE', 'ATTENDANCE.MANAGE', 'Quản lý chấm công', 'Điều chỉnh giờ chấm công nhân viên', 'ACTIVE', NOW(6)),

-- Leave Request Module
('01956100-0000-7000-8000-000000000123', 'LEAVE', 'LEAVE.CREATE', 'Tạo đơn xin nghỉ', 'Tạo đơn xin nghỉ phép cá nhân', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000124', 'LEAVE', 'LEAVE.VIEW_OWN', 'Xem đơn nghỉ cá nhân', 'Xem lịch sử đơn xin nghỉ của mình', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000125', 'LEAVE', 'LEAVE.VIEW_ALL', 'Xem đơn nghỉ toàn công ty', 'Xem đơn xin nghỉ của tất cả nhân sự', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000126', 'LEAVE', 'LEAVE.APPROVE', 'Phê duyệt nghỉ phép', 'Phê duyệt hoặc từ chối đơn xin nghỉ', 'ACTIVE', NOW(6)),

-- Audit Log Module
('01956100-0000-7000-8000-000000000127', 'AUDIT', 'AUDIT.VIEW', 'Xem nhật ký kiểm toán', 'Xem nhật ký thay đổi và truy cập hệ thống', 'ACTIVE', NOW(6)),

-- System Configuration / Catalog Module
('01956100-0000-7000-8000-000000000128', 'CONFIG', 'config:manage', 'Quản lý danh mục hệ thống', 'Thêm/sửa/xóa các danh mục dùng chung trong hệ thống', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000129', 'CONFIG', 'CONFIG.VIEW', 'Xem danh mục hệ thống', 'Xem danh sách các danh mục hệ thống dùng chung', 'ACTIVE', NOW(6)),

-- Equipment Module
('01956100-0000-7000-8000-000000000130', 'EQUIPMENT', 'EQUIPMENT.VIEW', 'Xem trang thiết bị', 'Xem danh mục và tình trạng trang thiết bị', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000131', 'EQUIPMENT', 'EQUIPMENT.MANAGE', 'Quản lý trang thiết bị', 'Bàn giao, thu hồi, báo hỏng trang thiết bị', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000132', 'EQUIPMENT', 'EQUIPMENT.REPAIR', 'Quản lý sửa chữa thiết bị', 'Tiếp nhận, xử lý và cập nhật tiến độ sửa chữa', 'ACTIVE', NOW(6)),

-- Asset Module
('01956100-0000-7000-8000-000000000133', 'ASSET', 'ASSET.VIEW', 'Xem tài sản cố định', 'Xem danh mục tài sản và hồ sơ tài sản', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000134', 'ASSET', 'ASSET.MANAGE', 'Quản lý tài sản', 'Cấp phát, điều chuyển, bảo trì và khấu hao tài sản', 'ACTIVE', NOW(6)),

-- Project Module
('01956100-0000-7000-8000-000000000135', 'PROJECT', 'PROJECT.VIEW', 'Xem dự án', 'Xem danh sách và tiến độ dự án', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000136', 'PROJECT', 'PROJECT.MANAGE', 'Quản lý dự án', 'Tạo, sửa, phân bổ nhân sự và công việc dự án', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------------------------------
-- System Roles Seed (tenant_id = NULL là vai trò toàn cục)
-- -----------------------------------------------------------------------------
INSERT INTO `roles` (`id`, `tenant_id`, `code`, `name`, `description`, `status`, `created_at`) VALUES
('01956100-0000-7000-8000-000000000010', NULL, 'SUPER_ADMIN', 'Super Administrator', 'Quản trị viên cấp cao nhất của toàn hệ thống', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000011', NULL, 'TENANT_ADMIN', 'Tenant Administrator', 'Quản trị viên công ty/doanh nghiệp', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000012', NULL, 'HR_MANAGER', 'Human Resources Manager', 'Trưởng phòng / Chuyên viên nhân sự', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000013', NULL, 'EMPLOYEE', 'Standard Employee', 'Nhân viên tiêu chuẩn của doanh nghiệp', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------------------------------
-- Super Admin Default User (tenant_id = NULL)
-- Password mặc định: Admin@123 (BCrypt hash) & Admin@123456
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `tenant_id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `status`, `created_at`) VALUES
('01956100-0000-7000-8000-000000000002', NULL, 'superadmin', 'superadmin@hrmplatform.local', '$2a$11$kOrN96NGCQg9tohOnzeHSeOZyuGkZbeqw/Z/2HRSjLI7alnko8B9C', 'System Super Administrator', '0900000000', 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000003', '01956100-0000-7000-8000-000000000001', 'admin@hrm.local', 'admin@hrm.local', '$2a$11$kOrN96NGCQg9tohOnzeHSeOZyuGkZbeqw/Z/2HRSjLI7alnko8B9C', 'Tenant Administrator', '0900000002', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`), `password_hash` = VALUES(`password_hash`);

-- Gán SuperAdmin role cho User id = 01956100-0000-7000-8000-000000000002
INSERT INTO `user_roles` (`id`, `user_id`, `role_id`, `tenant_id`, `status`, `created_at`) VALUES
('01956100-0000-7000-8000-000000000020', '01956100-0000-7000-8000-000000000002', '01956100-0000-7000-8000-000000000010', NULL, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000021', '01956100-0000-7000-8000-000000000003', '01956100-0000-7000-8000-000000000011', '01956100-0000-7000-8000-000000000001', 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- -----------------------------------------------------------------------------
-- Gán toàn bộ permissions cho vai trò SUPER_ADMIN
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT '01956100-0000-7000-8000-000000000010', id, NOW(6) FROM `permissions`;

-- Gán toàn bộ permissions cho vai trò TENANT_ADMIN
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`, `created_at`)
SELECT '01956100-0000-7000-8000-000000000011', id, NOW(6) FROM `permissions`;

-- -----------------------------------------------------------------------------
-- Seed dữ liệu chính sách mẫu
-- -----------------------------------------------------------------------------
INSERT INTO `hr_policies` (`id`, `tenant_id`, `policy_code`, `title`, `category`, `effective_date`, `summary`, `content`, `status`, `created_at`) VALUES
('01956100-0000-7000-8000-000000000501', '01956100-0000-7000-8000-000000000001', 'CS-2026/001', 'Quy định Chế độ Phụ cấp Ăn trưa & Đi lại 2026', 'BENEFITS', '2026-01-01', 'Mức phụ cấp ăn trưa 1,000,000 VNĐ/tháng và phụ cấp xăng xe 500,000 VNĐ/tháng cho toàn thể nhân sự chính thức.', 'Chi tiết quy định áp dụng từ ngày 01/01/2026 đối với tất cả nhân viên làm việc toàn thời gian tại công ty. Phụ cấp được chuyển khoản cùng kỳ lương hàng tháng.', 'PUBLISHED', NOW(6)),
('01956100-0000-7000-8000-000000000502', '01956100-0000-7000-8000-000000000001', 'CS-2026/002', 'Quy chế Thời giờ làm việc, Làm thêm giờ (OT) & Nghỉ phép', 'WORKING_HOURS', '2026-01-01', 'Quy định giờ làm việc hành chính từ 8:00 - 17:30 (Thứ 2 - Thứ 6) và quy trình đăng ký OT.', 'Toàn bộ nhân viên tuân thủ thời gian làm việc tiêu chuẩn 8 tiếng/ngày. Làm thêm giờ cần có sự đồng ý của Trưởng bộ phận trước 17:00 hàng ngày.', 'PUBLISHED', NOW(6))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- -----------------------------------------------------------------------------
-- Seed dữ liệu Danh Mục Hệ Thống mặc định
-- -----------------------------------------------------------------------------
INSERT INTO `system_catalogs` (`id`, `tenant_id`, `catalog_type`, `code`, `name`, `description`, `sort_order`, `is_system_default`, `status`, `created_at`) VALUES
-- LEAVE_TYPE
('01956100-0000-7000-8000-000000000301', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'ANNUAL',     'Nghỉ phép năm',         'Nghỉ phép theo quy định Luật Lao động (12 ngày/năm)',   1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000302', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'SICK',       'Nghỉ bệnh',             'Nghỉ ốm có xác nhận y tế',                              2, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000303', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'UNPAID',     'Nghỉ không lương',      'Nghỉ phép không hưởng lương theo thỏa thuận',           3, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000304', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'MATERNITY',  'Nghỉ thai sản',         'Nghỉ thai sản theo Luật Bảo hiểm xã hội',              4, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000305', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'PATERNITY',  'Nghỉ hộ sản (nam)',     'Nghỉ khi vợ sinh (5-14 ngày tùy ca)',                   5, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000306', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'COMPENSATORY', 'Nghỉ bù',             'Nghỉ bù các ngày làm thêm, trực lễ/tết',               6, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000307', '01956100-0000-7000-8000-000000000001', 'LEAVE_TYPE', 'BEREAVEMENT', 'Nghỉ tang chế',        'Nghỉ khi gia đình có tang sự (3 ngày)',                 7, 1, 'ACTIVE', NOW(6)),

-- JOB_POSITION
('01956100-0000-7000-8000-000000000310', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'CEO',          'Giám đốc điều hành (CEO)',      NULL, 1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000311', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'CFO',          'Giám đốc tài chính (CFO)',      NULL, 2, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000312', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'CTO',          'Giám đốc kỹ thuật (CTO)',       NULL, 3, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000313', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'DEPT_MGR',     'Trưởng phòng',                  NULL, 4, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000314', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'TEAM_LEAD',    'Trưởng nhóm (Team Lead)',       NULL, 5, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000315', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'SR_ENGINEER',  'Kỹ sư cao cấp (Senior)',        NULL, 6, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000316', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'ENGINEER',     'Kỹ sư (Engineer)',              NULL, 7, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000317', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'JR_ENGINEER',  'Kỹ sư tập sự (Junior)',         NULL, 8, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000318', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'INTERN',       'Thực tập sinh',                 NULL, 9, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000319', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'HR_OFFICER',   'Chuyên viên Nhân sự',           NULL, 10, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000320', '01956100-0000-7000-8000-000000000001', 'JOB_POSITION', 'ACCOUNTANT',   'Kế toán viên',                  NULL, 11, 1, 'ACTIVE', NOW(6)),

-- EDUCATION_LEVEL
('01956100-0000-7000-8000-000000000330', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'PHDS',        'Tiến sĩ (Ph.D)',              NULL, 1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000331', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'MASTER',      'Thạc sĩ',                     NULL, 2, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000332', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'BACHELOR',    'Đại học (Cử nhân/Kỹ sư)',    NULL, 3, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000333', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'COLLEGE',     'Cao đẳng',                    NULL, 4, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000334', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'VOCATIONAL',  'Trung cấp / Dạy nghề',       NULL, 5, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000335', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'HIGH_SCHOOL', 'Tốt nghiệp THPT',            NULL, 6, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000336', '01956100-0000-7000-8000-000000000001', 'EDUCATION_LEVEL', 'OTHER',       'Khác',                        NULL, 7, 1, 'ACTIVE', NOW(6)),

-- ASSET_CATEGORY
('01956100-0000-7000-8000-000000000340', '01956100-0000-7000-8000-000000000001', 'ASSET_CATEGORY', 'IT',        'Thiết bị IT & Công nghệ',       'Laptop, máy tính, màn hình, thiết bị mạng...',  1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000341', '01956100-0000-7000-8000-000000000001', 'ASSET_CATEGORY', 'MACHINERY', 'Máy móc & Thiết bị sản xuất',   'Máy in, máy photocopy, máy cắt...',             2, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000342', '01956100-0000-7000-8000-000000000001', 'ASSET_CATEGORY', 'VEHICLE',   'Phương tiện vận tải',           'Xe ô tô, xe máy, xe tải công ty...',            3, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000343', '01956100-0000-7000-8000-000000000001', 'ASSET_CATEGORY', 'OFFICE',    'Nội thất & Văn phòng',          'Bàn ghế, tủ, điều hòa, đèn chiếu sáng...',     4, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000344', '01956100-0000-7000-8000-000000000001', 'ASSET_CATEGORY', 'OTHER',     'Khác',                          NULL,                                             5, 1, 'ACTIVE', NOW(6)),

-- CONTRACT_TYPE
('01956100-0000-7000-8000-000000000350', '01956100-0000-7000-8000-000000000001', 'CONTRACT_TYPE', 'PROBATION',      'Hợp đồng thử việc',              'Tối đa 60 ngày theo BLLĐ',              1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000351', '01956100-0000-7000-8000-000000000001', 'CONTRACT_TYPE', 'DEFINITE',       'HĐLĐ xác định thời hạn',         '1 - 3 năm (không ký quá 2 lần)',        2, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000352', '01956100-0000-7000-8000-000000000001', 'CONTRACT_TYPE', 'INDEFINITE',     'HĐLĐ không xác định thời hạn',   'Hợp đồng chính thức không kỳ hạn',      3, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000353', '01956100-0000-7000-8000-000000000001', 'CONTRACT_TYPE', 'INTERNSHIP',     'Hợp đồng thực tập',              'Dành cho sinh viên thực tập',           4, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000354', '01956100-0000-7000-8000-000000000001', 'CONTRACT_TYPE', 'SEASONAL',       'Hợp đồng thời vụ / Ngắn hạn',   'Dưới 12 tháng theo nhu cầu công việc', 5, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000355', '01956100-0000-7000-8000-000000000001', 'CONTRACT_TYPE', 'ADDENDUM',       'Phụ lục hợp đồng',              'Điều chỉnh/bổ sung điều khoản HĐ gốc',  6, 1, 'ACTIVE', NOW(6)),

-- NATIONALITY
('01956100-0000-7000-8000-000000000360', '01956100-0000-7000-8000-000000000001', 'NATIONALITY', 'VN',   'Việt Nam',     NULL, 1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000361', '01956100-0000-7000-8000-000000000001', 'NATIONALITY', 'CN',   'Trung Quốc',   NULL, 2, 0, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000362', '01956100-0000-7000-8000-000000000001', 'NATIONALITY', 'JP',   'Nhật Bản',     NULL, 3, 0, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000363', '01956100-0000-7000-8000-000000000001', 'NATIONALITY', 'KR',   'Hàn Quốc',     NULL, 4, 0, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000364', '01956100-0000-7000-8000-000000000001', 'NATIONALITY', 'US',   'Hoa Kỳ',       NULL, 5, 0, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000365', '01956100-0000-7000-8000-000000000001', 'NATIONALITY', 'OTHER','Nước ngoài khác', NULL, 99, 0, 'ACTIVE', NOW(6)),

-- DEPARTMENT_TYPE
('01956100-0000-7000-8000-000000000370', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'ENGINEERING',  'Kỹ thuật & Công nghệ',     NULL, 1, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000371', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'BUSINESS',     'Kinh doanh & Bán hàng',    NULL, 2, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000372', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'HR',           'Nhân sự (HR)',              NULL, 3, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000373', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'FINANCE',      'Tài chính & Kế toán',      NULL, 4, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000374', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'ADMIN',        'Hành chính & Văn phòng',   NULL, 5, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000375', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'MARKETING',    'Marketing & Truyền thông', NULL, 6, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000376', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'LEGAL',        'Pháp chế & Tuân thủ',      NULL, 7, 1, 'ACTIVE', NOW(6)),
('01956100-0000-7000-8000-000000000377', '01956100-0000-7000-8000-000000000001', 'DEPARTMENT_TYPE', 'IT_SUPPORT',   'Hỗ trợ IT (Helpdesk)',     NULL, 8, 1, 'ACTIVE', NOW(6))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

SET FOREIGN_KEY_CHECKS = 1;
