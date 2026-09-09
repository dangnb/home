import 'package:shelf/shelf.dart';
import '../errors/response_helper.dart';

/// Middleware đảm bảo và trích xuất TenantId trong mọi yêu cầu đọc dữ liệu
/// Tuân thủ nguyên tắc Multi-Tenancy Isolation cốt lõi của hệ thống
Middleware tenantMiddleware() {
  return (Handler innerHandler) {
    return (Request request) async {
      // Các route công khai không bắt buộc tenantId (như health check, ping)
      final path = request.url.path;
      if (path == 'health' || path == 'ping' || path == '') {
        return innerHandler(request);
      }

      // 1. Trích xuất X-Tenant-Id từ Header
      final headerVal = request.headers['x-tenant-id'] ?? request.headers['X-Tenant-Id'];
      int? tenantId;

      if (headerVal != null && headerVal.isNotEmpty) {
        tenantId = int.tryParse(headerVal);
      }

      // 2. Dự phòng: Trích xuất từ Query Parameter ?tenant_id=...
      if (tenantId == null && request.url.queryParameters.containsKey('tenant_id')) {
        tenantId = int.tryParse(request.url.queryParameters['tenant_id']!);
      }

      // 3. Kiểm tra tính hợp lệ của TenantId
      if (tenantId == null || tenantId <= 0) {
        return ResponseHelper.error(
          'Truy cập bị từ chối: Bắt buộc phải cung cấp header X-Tenant-Id hợp lệ để truy vấn dữ liệu.',
          statusCode: 400,
        );
      }

      // 4. Lưu tenant_id vào request context để các Query Handler sử dụng
      final updatedRequest = request.change(context: {
        'tenant_id': tenantId,
      });

      return innerHandler(updatedRequest);
    };
  };
}

/// Tiện ích lấy tenant_id từ Request context
int getTenantId(Request request) {
  final tenantId = request.context['tenant_id'];
  if (tenantId is int) return tenantId;
  if (tenantId is String) return int.parse(tenantId);
  throw StateError('TenantId không tồn tại trong request context.');
}
