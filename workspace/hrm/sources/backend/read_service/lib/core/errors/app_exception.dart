/// Các ngoại lệ chuẩn của Read Service
abstract class AppException implements Exception {
  final String message;
  final int statusCode;

  const AppException(this.message, this.statusCode);

  @override
  String toString() => message;
}

class NotFoundException extends AppException {
  const NotFoundException([String message = 'Không tìm thấy tài nguyên yêu cầu'])
      : super(message, 404);
}

class BadRequestException extends AppException {
  const BadRequestException([String message = 'Yêu cầu không hợp lệ'])
      : super(message, 400);
}

class UnauthorizedException extends AppException {
  const UnauthorizedException([String message = 'Chưa được xác thực danh tính'])
      : super(message, 401);
}

class ForbiddenException extends AppException {
  const ForbiddenException([String message = 'Không có quyền truy cập'])
      : super(message, 403);
}

class TenantRequiredException extends AppException {
  const TenantRequiredException([
    String message = 'Bắt buộc phải cung cấp header X-Tenant-Id để truy vấn dữ liệu.',
  ]) : super(message, 400);
}
