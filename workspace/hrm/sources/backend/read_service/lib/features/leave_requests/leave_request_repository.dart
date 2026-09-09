import '../../core/database/query_executor.dart';
import 'leave_request_dto.dart';

/// Repository truy vấn dữ liệu đơn xin nghỉ phép từ MariaDB
class LeaveRequestRepository {
  final QueryExecutor _executor;

  LeaveRequestRepository(this._executor);

  /// Lấy danh sách đơn xin nghỉ phép của Tenant có phân trang và bộ lọc
  Future<({List<LeaveRequestDto> items, int totalCount})> getLeaveRequests({
    required int tenantId,
    int page = 1,
    int pageSize = 20,
    int? userId,
    String? status,
    String? leaveType,
  }) async {
    final offset = (page - 1) * pageSize;
    final Map<String, dynamic> params = {
      'tenant_id': tenantId,
      'limit': pageSize,
      'offset': offset,
    };

    String whereClause = "WHERE lr.tenant_id = :tenant_id";

    if (userId != null && userId > 0) {
      whereClause += " AND lr.user_id = :user_id";
      params['user_id'] = userId;
    }

    if (status != null && status.isNotEmpty) {
      whereClause += " AND lr.status = :status";
      params['status'] = status;
    }

    if (leaveType != null && leaveType.isNotEmpty) {
      whereClause += " AND lr.leave_type = :leave_type";
      params['leave_type'] = leaveType;
    }

    // 1. Đếm tổng số bản ghi
    final countSql = "SELECT COUNT(*) FROM leave_requests lr $whereClause;";
    final totalCount = await _executor.queryCount(countSql, params);

    // 2. Lấy dữ liệu danh sách
    final dataSql = """
      SELECT 
        lr.id, lr.tenant_id, lr.user_id, u.full_name AS employee_name,
        lr.leave_type, lr.start_date, lr.end_date, lr.reason, lr.status,
        lr.approver_id, a.full_name AS approver_name, lr.created_at
      FROM leave_requests lr
      INNER JOIN users u ON lr.user_id = u.id
      LEFT JOIN users a ON lr.approver_id = a.id
      $whereClause
      ORDER BY lr.id DESC
      LIMIT :limit OFFSET :offset;
    """;

    final rows = await _executor.query(dataSql, params);
    final items = rows.map(LeaveRequestDto.fromRow).toList();

    return (items: items, totalCount: totalCount);
  }

  /// Lấy chi tiết đơn nghỉ phép theo ID
  Future<LeaveRequestDto?> getLeaveRequestById({
    required int tenantId,
    required int id,
  }) async {
    const sql = """
      SELECT 
        lr.id, lr.tenant_id, lr.user_id, u.full_name AS employee_name,
        lr.leave_type, lr.start_date, lr.end_date, lr.reason, lr.status,
        lr.approver_id, a.full_name AS approver_name, lr.created_at
      FROM leave_requests lr
      INNER JOIN users u ON lr.user_id = u.id
      LEFT JOIN users a ON lr.approver_id = a.id
      WHERE lr.tenant_id = :tenant_id AND lr.id = :id
      LIMIT 1;
    """;

    final row = await _executor.querySingle(sql, {
      'tenant_id': tenantId,
      'id': id,
    });

    return row != null ? LeaveRequestDto.fromRow(row) : null;
  }
}
