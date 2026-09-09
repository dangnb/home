import '../../core/database/query_executor.dart';
import 'attendance_dto.dart';

/// Repository truy vấn dữ liệu chấm công từ MariaDB
class AttendanceRepository {
  final QueryExecutor _executor;

  AttendanceRepository(this._executor);

  /// Lấy danh sách chấm công theo khoảng thời gian và tenantId
  Future<List<AttendanceDto>> getAttendances({
    required int tenantId,
    int? userId,
    String? startDate,
    String? endDate,
  }) async {
    final Map<String, dynamic> params = {
      'tenant_id': tenantId,
    };

    String whereClause = "WHERE a.tenant_id = :tenant_id";

    if (userId != null && userId > 0) {
      whereClause += " AND a.user_id = :user_id";
      params['user_id'] = userId;
    }

    if (startDate != null && startDate.isNotEmpty) {
      whereClause += " AND a.work_date >= :start_date";
      params['start_date'] = startDate;
    }

    if (endDate != null && endDate.isNotEmpty) {
      whereClause += " AND a.work_date <= :end_date";
      params['end_date'] = endDate;
    }

    final sql = """
      SELECT 
        a.id, a.tenant_id, a.user_id, u.full_name AS employee_name,
        a.work_date, a.check_in, a.check_out, a.late_minutes, a.early_minutes,
        a.status, a.created_at
      FROM attendances a
      INNER JOIN users u ON a.user_id = u.id
      $whereClause
      ORDER BY a.work_date DESC, a.id DESC;
    """;

    final rows = await _executor.query(sql, params);
    return rows.map(AttendanceDto.fromRow).toList();
  }

  /// Lấy tổng hợp chấm công tháng của nhân viên
  Future<Map<String, dynamic>> getMonthlySummary({
    required int tenantId,
    required int userId,
    required int year,
    required int month,
  }) async {
    final startDate = '$year-${month.toString().padLeft(2, '0')}-01';
    final lastDay = DateTime(year, month + 1, 0).day;
    final endDate = '$year-${month.toString().padLeft(2, '0')}-$lastDay';

    const sql = """
      SELECT 
        COUNT(*) AS total_days,
        SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) AS present_days,
        SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END) AS late_days,
        SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_days,
        COALESCE(SUM(late_minutes), 0) AS total_late_minutes,
        COALESCE(SUM(early_minutes), 0) AS total_early_minutes
      FROM attendances
      WHERE tenant_id = :tenant_id AND user_id = :user_id
        AND work_date BETWEEN :start_date AND :end_date;
    """;

    final row = await _executor.querySingle(sql, {
      'tenant_id': tenantId,
      'user_id': userId,
      'start_date': startDate,
      'end_date': endDate,
    });

    return row ?? {
      'total_days': 0,
      'present_days': 0,
      'late_days': 0,
      'absent_days': 0,
      'total_late_minutes': 0,
      'total_early_minutes': 0,
    };
  }
}
