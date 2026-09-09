import 'package:mysql_client/mysql_client.dart';
import 'connection_pool.dart';

/// Bộ thực thi truy vấn SQL đọc dữ liệu tốc độ cao (Raw SQL / Prepared Statements)
class QueryExecutor {
  final MariaDbConnectionPool _connectionPool;

  QueryExecutor(this._connectionPool);

  /// Thực thi câu truy vấn SQL đọc nhiều bản ghi (SELECT)
  Future<List<Map<String, dynamic>>> query(
    String sql, [
    Map<String, dynamic>? params,
  ]) async {
    final IResultSet result;
    if (params != null && params.isNotEmpty) {
      result = await _connectionPool.pool.execute(sql, params);
    } else {
      result = await _connectionPool.pool.execute(sql);
    }

    final List<Map<String, dynamic>> items = [];
    for (final row in result.rows) {
      items.add(row.typedAssoc());
    }
    return items;
  }

  /// Thực thi câu truy vấn SQL đọc duy nhất 1 bản ghi
  Future<Map<String, dynamic>?> querySingle(
    String sql, [
    Map<String, dynamic>? params,
  ]) async {
    final items = await query(sql, params);
    return items.isEmpty ? null : items.first;
  }

  /// Đếm số lượng bản ghi (COUNT)
  Future<int> queryCount(
    String sql, [
    Map<String, dynamic>? params,
  ]) async {
    final row = await querySingle(sql, params);
    if (row == null || row.isEmpty) return 0;
    final val = row.values.first;
    if (val is int) return val;
    if (val is num) return val.toInt();
    return int.tryParse(val?.toString() ?? '0') ?? 0;
  }
}
