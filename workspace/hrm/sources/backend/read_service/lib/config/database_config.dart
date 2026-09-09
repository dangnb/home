import 'package:dotenv/dotenv.dart';

/// Cấu hình kết nối cơ sở dữ liệu MariaDB cho Read Service
class DatabaseConfig {
  final String host;
  final int port;
  final String user;
  final String password;
  final String database;
  final int maxConnections;

  const DatabaseConfig({
    required this.host,
    required this.port,
    required this.user,
    required this.password,
    required this.database,
    this.maxConnections = 10,
  });

  factory DatabaseConfig.fromEnv(DotEnv env) {
    return DatabaseConfig(
      host: env['DB_HOST'] ?? 'localhost',
      port: int.tryParse(env['DB_PORT'] ?? '3306') ?? 3306,
      user: env['DB_USER'] ?? 'root',
      password: env['DB_PASSWORD'] ?? '12345678',
      database: env['DB_NAME'] ?? 'hrm_platform',
      maxConnections: int.tryParse(env['DB_MAX_CONNECTIONS'] ?? '10') ?? 10,
    );
  }
}
