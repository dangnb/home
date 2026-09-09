import '../../core/database/query_executor.dart';
import 'department_dto.dart';

/// Repository truy vấn dữ liệu phòng ban từ MariaDB
class DepartmentRepository {
  final QueryExecutor _executor;

  DepartmentRepository(this._executor);

  /// Lấy danh sách phòng ban của Tenant có phân trang
  Future<({List<DepartmentDto> items, int totalCount})> getDepartments({
    required int tenantId,
    int page = 1,
    int pageSize = 20,
    String? status,
  }) async {
    final offset = (page - 1) * pageSize;
    final Map<String, dynamic> params = {
      'tenant_id': tenantId,
      'limit': pageSize,
      'offset': offset,
    };

    String whereClause = "WHERE d.tenant_id = :tenant_id AND d.status != 'DELETED'";
    if (status != null && status.isNotEmpty) {
      whereClause += " AND d.status = :status";
      params['status'] = status;
    }

    // 1. Đếm tổng số bản ghi
    final countSql = "SELECT COUNT(*) FROM departments d $whereClause;";
    final totalCount = await _executor.queryCount(countSql, params);

    // 2. Lấy dữ liệu phân trang
    final dataSql = """
      SELECT 
        d.id, d.tenant_id, d.name, d.code, d.manager_id, 
        u.full_name AS manager_name, d.status, d.created_at, d.updated_at
      FROM departments d
      LEFT JOIN users u ON d.manager_id = u.id
      $whereClause
      ORDER BY d.id DESC
      LIMIT :limit OFFSET :offset;
    """;

    final rows = await _executor.query(dataSql, params);
    final items = rows.map(DepartmentDto.fromRow).toList();

    return (items: items, totalCount: totalCount);
  }

  /// Lấy chi tiết phòng ban theo ID và TenantId
  Future<DepartmentDto?> getDepartmentById({
    required int tenantId,
    required int id,
  }) async {
    const sql = """
      SELECT 
        d.id, d.tenant_id, d.name, d.code, d.manager_id, 
        u.full_name AS manager_name, d.status, d.created_at, d.updated_at
      FROM departments d
      LEFT JOIN users u ON d.manager_id = u.id
      WHERE d.tenant_id = :tenant_id AND d.id = :id AND d.status != 'DELETED'
      LIMIT 1;
    """;

    final row = await _executor.querySingle(sql, {
      'tenant_id': tenantId,
      'id': id,
    });

    return row != null ? DepartmentDto.fromRow(row) : null;
  }
}
