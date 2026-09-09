import '../../core/database/query_executor.dart';
import 'employee_dto.dart';

/// Repository truy vấn dữ liệu hồ sơ nhân sự từ MariaDB
class EmployeeRepository {
  final QueryExecutor _executor;

  EmployeeRepository(this._executor);

  /// Lấy danh sách nhân viên của Tenant có phân trang và bộ lọc
  Future<({List<EmployeeDto> items, int totalCount})> getEmployees({
    required int tenantId,
    int page = 1,
    int pageSize = 20,
    int? departmentId,
    String? status,
    String? keyword,
  }) async {
    final offset = (page - 1) * pageSize;
    final Map<String, dynamic> params = {
      'tenant_id': tenantId,
      'limit': pageSize,
      'offset': offset,
    };

    String whereClause = "WHERE ep.tenant_id = :tenant_id AND ep.status != 'DELETED'";

    if (departmentId != null && departmentId > 0) {
      whereClause += " AND ep.department_id = :department_id";
      params['department_id'] = departmentId;
    }

    if (status != null && status.isNotEmpty) {
      whereClause += " AND ep.status = :status";
      params['status'] = status;
    }

    if (keyword != null && keyword.trim().isNotEmpty) {
      whereClause += " AND (u.full_name LIKE :keyword OR u.email LIKE :keyword OR ep.job_title LIKE :keyword)";
      params['keyword'] = '%${keyword.trim()}%';
    }

    // 1. Đếm tổng số bản ghi
    final countSql = """
      SELECT COUNT(*) 
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      $whereClause;
    """;
    final totalCount = await _executor.queryCount(countSql, params);

    // 2. Lấy dữ liệu danh sách
    final dataSql = """
      SELECT 
        ep.id, ep.tenant_id, ep.user_id, u.username, u.email, u.full_name, u.phone,
        ep.department_id, d.name AS department_name, 
        ep.manager_id, m.full_name AS manager_name,
        ep.job_title, ep.gender, ep.date_of_birth, ep.id_card_number, ep.joined_date,
        ep.status, ep.created_at
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      LEFT JOIN users m ON ep.manager_id = m.id
      $whereClause
      ORDER BY ep.id DESC
      LIMIT :limit OFFSET :offset;
    """;

    final rows = await _executor.query(dataSql, params);
    final items = rows.map(EmployeeDto.fromRow).toList();

    return (items: items, totalCount: totalCount);
  }

  /// Lấy chi tiết hồ sơ nhân sự theo ID và TenantId
  Future<EmployeeDto?> getEmployeeById({
    required int tenantId,
    required int id,
  }) async {
    const sql = """
      SELECT 
        ep.id, ep.tenant_id, ep.user_id, u.username, u.email, u.full_name, u.phone,
        ep.department_id, d.name AS department_name, 
        ep.manager_id, m.full_name AS manager_name,
        ep.job_title, ep.gender, ep.date_of_birth, ep.id_card_number, ep.joined_date,
        ep.status, ep.created_at
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      LEFT JOIN departments d ON ep.department_id = d.id
      LEFT JOIN users m ON ep.manager_id = m.id
      WHERE ep.tenant_id = :tenant_id AND ep.id = :id AND ep.status != 'DELETED'
      LIMIT 1;
    """;

    final row = await _executor.querySingle(sql, {
      'tenant_id': tenantId,
      'id': id,
    });

    return row != null ? EmployeeDto.fromRow(row) : null;
  }
}
