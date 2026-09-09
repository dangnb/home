import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../../core/errors/response_helper.dart';
import '../../core/middlewares/tenant_middleware.dart';
import 'attendance_repository.dart';

/// Controller xử lý các HTTP GET endpoints đọc dữ liệu chấm công
class AttendanceController {
  final AttendanceRepository _repository;

  AttendanceController(this._repository);

  Router get router {
    final router = Router();

    // GET / - Lấy danh sách chấm công
    router.get('/', (Request request) async {
      final tenantId = getTenantId(request);
      final params = request.url.queryParameters;

      final userId = int.tryParse(params['userId'] ?? '');
      final startDate = params['startDate'];
      final endDate = params['endDate'];

      final items = await _repository.getAttendances(
        tenantId: tenantId,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
      );

      return ResponseHelper.ok(items.map((e) => e.toJson()).toList());
    });

    // GET /summary - Tổng hợp chấm công tháng
    router.get('/summary', (Request request) async {
      final tenantId = getTenantId(request);
      final params = request.url.queryParameters;

      final userId = int.tryParse(params['userId'] ?? '');
      final now = DateTime.now();
      final year = int.tryParse(params['year'] ?? '') ?? now.year;
      final month = int.tryParse(params['month'] ?? '') ?? now.month;

      if (userId == null || userId <= 0) {
        return ResponseHelper.error('Bắt buộc phải cung cấp tham số userId.', statusCode: 400);
      }

      final summary = await _repository.getMonthlySummary(
        tenantId: tenantId,
        userId: userId,
        year: year,
        month: month,
      );

      return ResponseHelper.ok(summary);
    });

    return router;
  }
}
