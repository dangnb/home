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
(27, 'AUDIT', 'AUDIT.VIEW', 'Xem nhật ký kiểm toán', 'Xem nhật ký thay đổi và truy cập hệ thống', 'ACTIVE', NOW(6)),

-- System Configuration / Catalog Module
(28, 'CONFIG', 'config:manage', 'Quản lý danh mục hệ thống', 'Thêm/sửa/xóa các danh mục dùng chung trong hệ thống', 'ACTIVE', NOW(6))
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

-- -----------------------------------------------------------------------------
-- Seed dữ liệu khen thưởng & kỷ luật mẫu (Tenant ID = 1)
-- -----------------------------------------------------------------------------
INSERT INTO `reward_disciplines` (`id`, `tenant_id`, `employee_id`, `type`, `category`, `title`, `decision_number`, `decision_date`, `effective_date`, `amount`, `reason`, `status`, `created_at`) VALUES
(1, 1, 1, 'REWARD', 'PERFORMANCE', 'Thưởng hoàn thành xuất sắc dự án Q3 2026', 'QĐ-KT-2026/001', '2026-09-01', '2026-09-01', 3000000.00, 'Đạt chỉ tiêu KPIs vượt 150% kế hoạch đề ra', 'APPROVED', NOW(6)),
(2, 1, 1, 'DISCIPLINE', 'LATE_VIOLATION', 'Phạt vi phạm quy định giờ giấc làm việc', 'QĐ-KL-2026/004', '2026-09-05', '2026-09-05', 200000.00, 'Đi muộn 3 lần trong tháng 8/2026 không có lý do chính đáng', 'APPROVED', NOW(6))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `amount` = VALUES(`amount`);

-- -----------------------------------------------------------------------------
-- Seed dữ liệu chính sách mẫu (Tenant ID = 1)
-- -----------------------------------------------------------------------------
INSERT INTO `hr_policies` (`id`, `tenant_id`, `policy_code`, `title`, `category`, `effective_date`, `summary`, `content`, `status`, `created_at`) VALUES
(1, 1, 'CS-2026/001', 'Quy định Chế độ Phụ cấp Ăn trưa & Đi lại 2026', 'BENEFITS', '2026-01-01', 'Mức phụ cấp ăn trưa 1,000,000 VNĐ/tháng và phụ cấp xăng xe 500,000 VNĐ/tháng cho toàn thể nhân sự chính thức.', 'Chi tiết quy định áp dụng từ ngày 01/01/2026 đối với tất cả nhân viên làm việc toàn thời gian tại công ty. Phụ cấp được chuyển khoản cùng kỳ lương hàng tháng.', 'PUBLISHED', NOW(6)),
(2, 1, 'CS-2026/002', 'Quy chế Thời giờ làm việc, Làm thêm giờ (OT) & Nghỉ phép', 'WORKING_HOURS', '2026-01-01', 'Quy định giờ làm việc hành chính từ 8:00 - 17:30 (Thứ 2 - Thứ 6) và quy trình đăng ký OT.', 'Toàn bộ nhân viên tuân thủ thời gian làm việc tiêu chuẩn 8 tiếng/ngày. Làm thêm giờ cần có sự đồng ý của Trưởng bộ phận trước 17:00 hàng ngày.', 'PUBLISHED', NOW(6))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- -----------------------------------------------------------------------------
-- Seed dữ liệu Danh Mục Hệ Thống mặc định (Tenant ID = 1)
-- -----------------------------------------------------------------------------
INSERT INTO `system_catalogs` (`id`, `tenant_id`, `catalog_type`, `code`, `name`, `description`, `sort_order`, `is_system_default`, `status`, `created_at`) VALUES
-- LEAVE_TYPE: Loại nghỉ phép
(1,  1, 'LEAVE_TYPE', 'ANNUAL',     'Nghỉ phép năm',         'Nghỉ phép theo quy định Luật Lao động (12 ngày/năm)',   1, 1, 'ACTIVE', NOW(6)),
(2,  1, 'LEAVE_TYPE', 'SICK',       'Nghỉ bệnh',             'Nghỉ ốm có xác nhận y tế',                              2, 1, 'ACTIVE', NOW(6)),
(3,  1, 'LEAVE_TYPE', 'UNPAID',     'Nghỉ không lương',      'Nghỉ phép không hưởng lương theo thỏa thuận',           3, 1, 'ACTIVE', NOW(6)),
(4,  1, 'LEAVE_TYPE', 'MATERNITY',  'Nghỉ thai sản',         'Nghỉ thai sản theo Luật Bảo hiểm xã hội',              4, 1, 'ACTIVE', NOW(6)),
(5,  1, 'LEAVE_TYPE', 'PATERNITY',  'Nghỉ hộ sản (nam)',     'Nghỉ khi vợ sinh (5-14 ngày tùy ca)',                   5, 1, 'ACTIVE', NOW(6)),
(6,  1, 'LEAVE_TYPE', 'COMPENSATORY', 'Nghỉ bù',             'Nghỉ bù các ngày làm thêm, trực lễ/tết',               6, 1, 'ACTIVE', NOW(6)),
(7,  1, 'LEAVE_TYPE', 'BEREAVEMENT', 'Nghỉ tang chế',        'Nghỉ khi gia đình có tang sự (3 ngày)',                 7, 1, 'ACTIVE', NOW(6)),

-- JOB_POSITION: Chức vụ / Chức danh
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

-- EDUCATION_LEVEL: Trình độ học vấn
(30, 1, 'EDUCATION_LEVEL', 'PHDS',        'Tiến sĩ (Ph.D)',              NULL, 1, 1, 'ACTIVE', NOW(6)),
(31, 1, 'EDUCATION_LEVEL', 'MASTER',      'Thạc sĩ',                     NULL, 2, 1, 'ACTIVE', NOW(6)),
(32, 1, 'EDUCATION_LEVEL', 'BACHELOR',    'Đại học (Cử nhân/Kỹ sư)',    NULL, 3, 1, 'ACTIVE', NOW(6)),
(33, 1, 'EDUCATION_LEVEL', 'COLLEGE',     'Cao đẳng',                    NULL, 4, 1, 'ACTIVE', NOW(6)),
(34, 1, 'EDUCATION_LEVEL', 'VOCATIONAL',  'Trung cấp / Dạy nghề',       NULL, 5, 1, 'ACTIVE', NOW(6)),
(35, 1, 'EDUCATION_LEVEL', 'HIGH_SCHOOL', 'Tốt nghiệp THPT',            NULL, 6, 1, 'ACTIVE', NOW(6)),
(36, 1, 'EDUCATION_LEVEL', 'OTHER',       'Khác',                        NULL, 7, 1, 'ACTIVE', NOW(6)),

-- ASSET_CATEGORY: Danh mục tài sản
(40, 1, 'ASSET_CATEGORY', 'IT',        'Thiết bị IT & Công nghệ',       'Laptop, máy tính, màn hình, thiết bị mạng...',  1, 1, 'ACTIVE', NOW(6)),
(41, 1, 'ASSET_CATEGORY', 'MACHINERY', 'Máy móc & Thiết bị sản xuất',   'Máy in, máy photocopy, máy cắt...',             2, 1, 'ACTIVE', NOW(6)),
(42, 1, 'ASSET_CATEGORY', 'VEHICLE',   'Phương tiện vận tải',           'Xe ô tô, xe máy, xe tải công ty...',            3, 1, 'ACTIVE', NOW(6)),
(43, 1, 'ASSET_CATEGORY', 'OFFICE',    'Nội thất & Văn phòng',          'Bàn ghế, tủ, điều hòa, đèn chiếu sáng...',     4, 1, 'ACTIVE', NOW(6)),
(44, 1, 'ASSET_CATEGORY', 'OTHER',     'Khác',                          NULL,                                             5, 1, 'ACTIVE', NOW(6)),

-- CONTRACT_TYPE: Loại hợp đồng
(50, 1, 'CONTRACT_TYPE', 'PROBATION',      'Hợp đồng thử việc',              'Tối đa 60 ngày theo BLLĐ',              1, 1, 'ACTIVE', NOW(6)),
(51, 1, 'CONTRACT_TYPE', 'DEFINITE',       'HĐLĐ xác định thời hạn',         '1 - 3 năm (không ký quá 2 lần)',        2, 1, 'ACTIVE', NOW(6)),
(52, 1, 'CONTRACT_TYPE', 'INDEFINITE',     'HĐLĐ không xác định thời hạn',   'Hợp đồng chính thức không kỳ hạn',      3, 1, 'ACTIVE', NOW(6)),
(53, 1, 'CONTRACT_TYPE', 'INTERNSHIP',     'Hợp đồng thực tập',              'Dành cho sinh viên thực tập',           4, 1, 'ACTIVE', NOW(6)),
(54, 1, 'CONTRACT_TYPE', 'SEASONAL',       'Hợp đồng thời vụ / Ngắn hạn',   'Dưới 12 tháng theo nhu cầu công việc', 5, 1, 'ACTIVE', NOW(6)),
(55, 1, 'CONTRACT_TYPE', 'ADDENDUM',       'Phụ lục hợp đồng',              'Điều chỉnh/bổ sung điều khoản HĐ gốc',  6, 1, 'ACTIVE', NOW(6)),

-- NATIONALITY: Dân tộc / Quốc tịch
(60, 1, 'NATIONALITY', 'VN',   'Việt Nam',     NULL, 1, 1, 'ACTIVE', NOW(6)),
(61, 1, 'NATIONALITY', 'CN',   'Trung Quốc',   NULL, 2, 0, 'ACTIVE', NOW(6)),
(62, 1, 'NATIONALITY', 'JP',   'Nhật Bản',     NULL, 3, 0, 'ACTIVE', NOW(6)),
(63, 1, 'NATIONALITY', 'KR',   'Hàn Quốc',     NULL, 4, 0, 'ACTIVE', NOW(6)),
(64, 1, 'NATIONALITY', 'US',   'Hoa Kỳ',       NULL, 5, 0, 'ACTIVE', NOW(6)),
(65, 1, 'NATIONALITY', 'OTHER','Nước ngoài khác', NULL, 99, 0, 'ACTIVE', NOW(6)),

-- DEPARTMENT_TYPE: Loại phòng ban
(70, 1, 'DEPARTMENT_TYPE', 'ENGINEERING',  'Kỹ thuật & Công nghệ',     NULL, 1, 1, 'ACTIVE', NOW(6)),
(71, 1, 'DEPARTMENT_TYPE', 'BUSINESS',     'Kinh doanh & Bán hàng',    NULL, 2, 1, 'ACTIVE', NOW(6)),
(72, 1, 'DEPARTMENT_TYPE', 'HR',           'Nhân sự (HR)',              NULL, 3, 1, 'ACTIVE', NOW(6)),
(73, 1, 'DEPARTMENT_TYPE', 'FINANCE',      'Tài chính & Kế toán',      NULL, 4, 1, 'ACTIVE', NOW(6)),
(74, 1, 'DEPARTMENT_TYPE', 'ADMIN',        'Hành chính & Văn phòng',   NULL, 5, 1, 'ACTIVE', NOW(6)),
(75, 1, 'DEPARTMENT_TYPE', 'MARKETING',    'Marketing & Truyền thông', NULL, 6, 1, 'ACTIVE', NOW(6)),
(76, 1, 'DEPARTMENT_TYPE', 'LEGAL',        'Pháp chế & Tuân thủ',      NULL, 7, 1, 'ACTIVE', NOW(6)),
(77, 1, 'DEPARTMENT_TYPE', 'IT_SUPPORT',   'Hỗ trợ IT (Helpdesk)',     NULL, 8, 1, 'ACTIVE', NOW(6))

ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`);

SET FOREIGN_KEY_CHECKS = 1;
