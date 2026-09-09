# Core HRM Read Service (Dart & Shelf)

Dịch vụ truy vấn dữ liệu đọc tốc độ cao (Read-side) trong mô hình CQRS cho hệ thống Core HRM Multi-Tenant SaaS, kết nối trực tiếp tới MariaDB qua package `mysql_client` với cơ chế Connection Pooling và Multi-Tenancy Isolation.

---

## 1. Yêu cầu môi trường & Cài đặt
- **Dart SDK:** >= 3.8.0
- **MariaDB:** 10.x / 11.x

Cài đặt dependencies:
```bash
dart pub get
```

---

## 2. Cấu hình biến môi trường (.env)
Tạo file `.env` từ `.env.example`:
```ini
PORT=5050
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=hrm_platform
DB_MAX_CONNECTIONS=10
```

---

## 3. Khởi chạy dịch vụ
```bash
dart run bin/server.dart
```

---

## 4. Danh sách API Endpoints

> **Lưu ý:** Tất cả các endpoint nghiệp vụ yêu cầu header `X-Tenant-Id: <tenant_id>`.

### Health Check
- `GET /health` - Kiểm tra trạng thái service và kết nối CSDL MariaDB

### Quản lý Phòng ban (Departments)
- `GET /api/v1/departments?page=1&pageSize=20&status=ACTIVE` - Danh sách phòng ban có phân trang
- `GET /api/v1/departments/:id` - Chi tiết phòng ban

### Hồ sơ Nhân sự (Employees)
- `GET /api/v1/employees?page=1&pageSize=20&departmentId=1&keyword=nam` - Danh sách nhân sự kèm phòng ban & quản lý
- `GET /api/v1/employees/:id` - Chi tiết hồ sơ nhân viên

### Chấm công (Attendances)
- `GET /api/v1/attendances?userId=1&startDate=2026-09-01&endDate=2026-09-30` - Lịch sử chấm công
- `GET /api/v1/attendances/summary?userId=1&year=2026&month=9` - Báo cáo tổng hợp chấm công tháng

### Nghỉ phép (Leave Requests)
- `GET /api/v1/leave-requests?userId=1&status=PENDING` - Danh sách đơn xin nghỉ phép
- `GET /api/v1/leave-requests/:id` - Chi tiết đơn xin nghỉ phép

---

## 5. Chạy kiểm thử tự động
```bash
dart test
```
