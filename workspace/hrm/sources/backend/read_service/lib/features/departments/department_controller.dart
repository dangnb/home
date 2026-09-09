import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../../core/errors/response_helper.dart';
import '../../core/middlewares/tenant_middleware.dart';
import 'department_repository.dart';

/// Controller xử lý các HTTP GET endpoints đọc dữ liệu phòng ban
class DepartmentController {
  final DepartmentRepository _repository;

  DepartmentController(this._repository);

  Router get router {
    final router = Router();

    // GET / - Lấy danh sách phòng ban
    router.get('/', (Request request) async {
      final tenantId = getTenantId(request);
      final params = request.url.queryParameters;

      final page = int.tryParse(params['page'] ?? '1') ?? 1;
      final pageSize = int.tryParse(params['pageSize'] ?? '20') ?? 20;
      final status = params['status'];

      final result = await _repository.getDepartments(
        tenantId: tenantId,
        page: page,
        pageSize: pageSize,
        status: status,
      );

      return ResponseHelper.paginated(
        items: result.items.map((e) => e.toJson()).toList(),
        totalCount: result.totalCount,
        page: page,
        pageSize: pageSize,
      );
    });

    // GET /<id> - Lấy chi tiết phòng ban
    router.get('/<id|[0-9]+>', (Request request, String idStr) async {
      final tenantId = getTenantId(request);
      final id = int.tryParse(idStr);

      if (id == null) {
        return ResponseHelper.error('ID phòng ban không hợp lệ.', statusCode: 400);
      }

      final department = await _repository.getDepartmentById(
        tenantId: tenantId,
        id: id,
      );

      if (department == null) {
        return ResponseHelper.error('Không tìm thấy phòng ban.', statusCode: 404);
      }

      return ResponseHelper.ok(department.toJson());
    });

    return router;
  }
}
