import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../../core/errors/response_helper.dart';
import '../../core/middlewares/tenant_middleware.dart';
import 'user_repository.dart';

/// Controller xử lý các HTTP GET endpoints đọc dữ liệu người dùng
class UserController {
  final UserRepository _repository;

  UserController(this._repository);

  Router get router {
    final router = Router();

    // GET / - Lấy danh sách người dùng
    router.get('/', (Request request) async {
      int? tenantId;
      try {
        tenantId = getTenantId(request);
      } catch (_) {
        // Nếu không truyền tenant id thì đọc toàn bộ (cho SuperAdmin)
      }

      final params = request.url.queryParameters;
      final page = int.tryParse(params['page'] ?? '1') ?? 1;
      final pageSize = int.tryParse(params['pageSize'] ?? '50') ?? 50;
      final status = params['status'];
      final roleCode = params['role'] ?? params['roleCode'];
      final search = params['search'];

      final result = await _repository.getUsers(
        tenantId: tenantId,
        page: page,
        pageSize: pageSize,
        status: status,
        roleCode: roleCode,
        search: search,
      );

      return ResponseHelper.paginated(
        items: result.items.map((e) => e.toJson()).toList(),
        totalCount: result.totalCount,
        page: page,
        pageSize: pageSize,
      );
    });

    // GET /roles - Lấy danh mục vai trò
    router.get('/roles', (Request request) async {
      final roles = await _repository.getRoles();
      return ResponseHelper.ok(roles);
    });

    // GET /<id> - Lấy chi tiết người dùng
    router.get('/<id|[0-9]+>', (Request request, String idStr) async {
      final id = int.tryParse(idStr);
      if (id == null) {
        return ResponseHelper.error('ID người dùng không hợp lệ.', statusCode: 400);
      }

      final user = await _repository.getUserById(id);
      if (user == null) {
        return ResponseHelper.error('Không tìm thấy người dùng.', statusCode: 404);
      }

      return ResponseHelper.ok(user.toJson());
    });

    return router;
  }
}
