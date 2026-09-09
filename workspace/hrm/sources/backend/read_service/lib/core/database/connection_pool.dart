import 'package:mysql_client/mysql_client.dart';
import '../../config/database_config.dart';

/// Quản lý Connection Pool kết nối MariaDB tối ưu tốc độ đọc dữ liệu
class MariaDbConnectionPool {
  final DatabaseConfig _config;
  MySQLConnectionPool? _pool;

  MariaDbConnectionPool(this._config);

  MySQLConnectionPool get pool {
    if (_pool == null) {
      throw StateError('Database connection pool chưa được khởi tạo. Hãy gọi init() trước.');
    }
    return _pool!;
  }

  /// Khởi tạo connection pool tới MariaDB
  Future<void> init() async {
    if (_pool != null) return;

    _pool = MySQLConnectionPool(
      host: _config.host,
      port: _config.port,
      userName: _config.user,
      password: _config.password,
      databaseName: _config.database,
      maxConnections: _config.maxConnections,
      secure: false, // Local MariaDB kết nối không mã hóa SSL mặc định
    );

    // Kiểm tra kết nối liveness
    await testConnection();
  }

  /// Kiểm tra kết nối tới MariaDB
  Future<bool> testConnection() async {
    final result = await pool.execute('SELECT 1 AS alive;');
    return result.rows.isNotEmpty;
  }

  /// Đóng toàn bộ kết nối trong pool khi tắt service
  Future<void> close() async {
    if (_pool != null) {
      await _pool!.close();
      _pool = null;
    }
  }
}
