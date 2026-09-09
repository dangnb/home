import 'package:dotenv/dotenv.dart';
import 'database_config.dart';

/// Cấu hình tổng thể của ứng dụng Read Service
class AppConfig {
  final int port;
  final String environment;
  final DatabaseConfig database;

  const AppConfig({
    required this.port,
    required this.environment,
    required this.database,
  });

  factory AppConfig.load() {
    final env = DotEnv(includePlatformEnvironment: true)..load();

    return AppConfig(
      port: int.tryParse(env['PORT'] ?? '5050') ?? 5050,
      environment: env['ENVIRONMENT'] ?? 'development',
      database: DatabaseConfig.fromEnv(env),
    );
  }
}
