import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../../core/errors/response_helper.dart';
import '../../core/middlewares/tenant_middleware.dart';
import 'employee_repository.dart';

/// Controller xử lý các HTTP GET endpoints đọc dữ liệu hồ sơ nhân sự
class EmployeeController {
  final EmployeeRepository _repository;

  EmployeeController(this._repository);

  Router get router {
    final router = Router();

    // GET / - Lấy danh sách nhân viên của Tenant
    router.get('/', (Request request) async {
      final tenantId = getTenantId(request);
      final params = request.url.queryParameters;

      final page = int.tryParse(params['page'] ?? '1') ?? 1;
      final pageSize = int.tryParse(params['pageSize'] ?? '20') ?? 20;
      final departmentId = int.tryParse(params['departmentId'] ?? '');
      final status = params['status'];
      final keyword = params['keyword'] ?? params['search'];

      final result = await _repository.getEmployees(
        tenantId: tenantId,
        page: page,
        pageSize: pageSize,
        departmentId: departmentId,
        status: status,
        keyword: keyword,
      );

      return ResponseHelper.paginated(
        items: result.items.map((e) => e.toJson()).toList(),
        totalCount: result.totalCount,
        page: page,
        pageSize: pageSize,
      );
    });

    // GET /<id> - Lấy chi tiết hồ sơ nhân sự
    router.get('/<id|[0-9]+>', (Request request, String idStr) async {
      final tenantId = getTenantId(request);
      final id = int.tryParse(idStr);

      if (id == null) {
        return ResponseHelper.error('ID nhân sự không hợp lệ.', statusCode: 400);
      }

      final employee = await _repository.getEmployeeById(
        tenantId: tenantId,
        id: id,
      );

      if (employee == null) {
        return ResponseHelper.error('Không tìm thấy hồ sơ nhân sự.', statusCode: 404);
      }

      return ResponseHelper.ok(employee.toJson());
    });

    return router;
  }
}
