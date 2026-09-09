import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../../core/errors/response_helper.dart';
import '../../core/middlewares/tenant_middleware.dart';
import 'leave_request_repository.dart';

/// Controller xử lý các HTTP GET endpoints đọc dữ liệu đơn nghỉ phép
class LeaveRequestController {
  final LeaveRequestRepository _repository;

  LeaveRequestController(this._repository);

  Router get router {
    final router = Router();

    // GET / - Lấy danh sách đơn nghỉ phép
    router.get('/', (Request request) async {
      final tenantId = getTenantId(request);
      final params = request.url.queryParameters;

      final page = int.tryParse(params['page'] ?? '1') ?? 1;
      final pageSize = int.tryParse(params['pageSize'] ?? '20') ?? 20;
      final userId = int.tryParse(params['userId'] ?? '');
      final status = params['status'];
      final leaveType = params['leaveType'];

      final result = await _repository.getLeaveRequests(
        tenantId: tenantId,
        page: page,
        pageSize: pageSize,
        userId: userId,
        status: status,
        leaveType: leaveType,
      );

      return ResponseHelper.paginated(
        items: result.items.map((e) => e.toJson()).toList(),
        totalCount: result.totalCount,
        page: page,
        pageSize: pageSize,
      );
    });

    // GET /<id> - Lấy chi tiết đơn nghỉ phép
    router.get('/<id|[0-9]+>', (Request request, String idStr) async {
      final tenantId = getTenantId(request);
      final id = int.tryParse(idStr);

      if (id == null) {
        return ResponseHelper.error('ID đơn nghỉ phép không hợp lệ.', statusCode: 400);
      }

      final leaveRequest = await _repository.getLeaveRequestById(
        tenantId: tenantId,
        id: id,
      );

      if (leaveRequest == null) {
        return ResponseHelper.error('Không tìm thấy đơn nghỉ phép.', statusCode: 404);
      }

      return ResponseHelper.ok(leaveRequest.toJson());
    });

    return router;
  }
}
