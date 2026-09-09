import '../../core/database/query_executor.dart';
import 'user_dto.dart';

/// Repository truy vấn dữ liệu người dùng từ MariaDB
class UserRepository {
  final QueryExecutor _executor;

  UserRepository(this._executor);

  /// Lấy danh sách người dùng có phân trang và bộ lọc
  Future<({List<UserDto> items, int totalCount})> getUsers({
    int? tenantId,
    int page = 1,
    int pageSize = 20,
    String? status,
    String? roleCode,
    String? search,
  }) async {
    final offset = (page - 1) * pageSize;
    final Map<String, dynamic> params = {
      'limit': pageSize,
      'offset': offset,
    };

    String whereClause = "WHERE u.status != 'DELETED'";

    if (tenantId != null) {
      whereClause += " AND (u.tenant_id = :tenant_id OR u.tenant_id IS NULL)";
      params['tenant_id'] = tenantId;
    }

    if (status != null && status.isNotEmpty && status != 'All') {
      whereClause += " AND u.status = :status";
      params['status'] = status;
    }

    if (roleCode != null && roleCode.isNotEmpty && roleCode != 'All') {
      whereClause += " AND r.code = :role_code";
      params['role_code'] = roleCode;
    }

    if (search != null && search.trim().isNotEmpty) {
      whereClause += " AND (u.full_name LIKE :search OR u.username LIKE :search OR u.email LIKE :search OR u.phone LIKE :search)";
      params['search'] = '%${search.trim()}%';
    }

    // 1. Đếm tổng số bản ghi
    final countSql = """
      SELECT COUNT(DISTINCT u.id) 
      FROM users u
      LEFT JOIN (
        SELECT user_id, MIN(role_id) as role_id 
        FROM user_roles 
        WHERE status != 'DELETED' 
        GROUP BY user_id
      ) ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      $whereClause;
    """;
    final totalCount = await _executor.queryCount(countSql, params);

    // 2. Lấy dữ liệu người dùng
    final dataSql = """
      SELECT 
        u.id, u.tenant_id, u.username, u.email, u.full_name, u.phone, 
        u.status, u.created_at, u.updated_at,
        r.id as role_id, r.code as role_code, r.name as role_name
      FROM users u
      LEFT JOIN (
        SELECT user_id, MIN(role_id) as role_id 
        FROM user_roles 
        WHERE status != 'DELETED' 
        GROUP BY user_id
      ) ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      $whereClause
      ORDER BY u.id ASC
      LIMIT :limit OFFSET :offset;
    """;

    final rows = await _executor.query(dataSql, params);
    final items = rows.map(UserDto.fromRow).toList();

    return (items: items, totalCount: totalCount);
  }

  /// Lấy chi tiết người dùng theo ID
  Future<UserDto?> getUserById(int id) async {
    final Map<String, dynamic> params = {'id': id};
    const sql = """
      SELECT 
        u.id, u.tenant_id, u.username, u.email, u.full_name, u.phone, 
        u.status, u.created_at, u.updated_at,
        r.id as role_id, r.code as role_code, r.name as role_name
      FROM users u
      LEFT JOIN (
        SELECT user_id, MIN(role_id) as role_id 
        FROM user_roles 
        WHERE status != 'DELETED' 
        GROUP BY user_id
      ) ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = :id AND u.status != 'DELETED'
      LIMIT 1;
    """;

    final rows = await _executor.query(sql, params);
    if (rows.isEmpty) return null;
    return UserDto.fromRow(rows.first);
  }

  /// Lấy danh sách toàn bộ vai trò (Roles) trong hệ thống
  Future<List<Map<String, dynamic>>> getRoles() async {
    const sql = "SELECT id, code, name, description FROM roles ORDER BY id ASC;";
    final rows = await _executor.query(sql, {});
    return rows;
  }
}
