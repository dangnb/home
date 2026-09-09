import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:test/test.dart';
import 'package:read_service/config/app_config.dart';
import 'package:read_service/core/database/connection_pool.dart';
import 'package:read_service/core/database/query_executor.dart';
import 'package:read_service/core/errors/response_helper.dart';
import 'package:read_service/core/middlewares/tenant_middleware.dart';

void main() {
  group('1. Cấu hình & Helpers', () {
    test('AppConfig nạp đúng giá trị mặc định hoặc từ .env', () {
      final config = AppConfig.load();
      expect(config.port, equals(5050));
      expect(config.database.host, equals('localhost'));
      expect(config.database.port, equals(3306));
      expect(config.database.user, equals('root'));
      expect(config.database.database, equals('hrm_platform'));
    });

    test('ResponseHelper định dạng JSON chuẩn RFC', () {
      final response = ResponseHelper.ok({'name': 'Engineering'});
      expect(response.statusCode, equals(200));
      expect(response.headers['content-type'], contains('application/json'));
    });
  });

  group('2. Multi-Tenancy Isolation Middleware', () {
    final middleware = tenantMiddleware();

    test('Route /health cho phép truy cập không cần X-Tenant-Id', () async {
      final handler = middleware((req) => Response.ok('healthy'));
      final request = Request('GET', Uri.parse('http://localhost/health'));

      final response = await handler(request);
      expect(response.statusCode, equals(200));
    });

    test('Route nghiệp vụ chặn yêu cầu khi thiếu X-Tenant-Id (HTTP 400)', () async {
      final handler = middleware((req) => Response.ok('allowed'));
      final request = Request('GET', Uri.parse('http://localhost/api/v1/departments'));

      final response = await handler(request);
      expect(response.statusCode, equals(400));

      final body = jsonDecode(await response.readAsString());
      expect(body['success'], isFalse);
      expect(body['error']['message'], contains('X-Tenant-Id'));
    });

    test('Route nghiệp vụ chấp nhận yêu cầu khi có X-Tenant-Id hợp lệ', () async {
      int? capturedTenantId;
      final handler = middleware((req) {
        capturedTenantId = getTenantId(req);
        return Response.ok('allowed');
      });

      final request = Request(
        'GET',
        Uri.parse('http://localhost/api/v1/departments'),
        headers: {'X-Tenant-Id': '7'},
      );

      final response = await handler(request);
      expect(response.statusCode, equals(200));
      expect(capturedTenantId, equals(7));
    });
  });

  group('3. MariaDB Connection & QueryExecutor Integration', () {
    late MariaDbConnectionPool pool;
    late QueryExecutor executor;

    setUpAll(() async {
      final config = AppConfig.load();
      pool = MariaDbConnectionPool(config.database);
      await pool.init();
      executor = QueryExecutor(pool);
    });

    tearDownAll(() async {
      await pool.close();
    });

    test('MariaDbConnectionPool kết nối thành công tới MariaDB local', () async {
      final isAlive = await pool.testConnection();
      expect(isAlive, isTrue);
    });

    test('QueryExecutor thực thi SELECT trên database hrm_platform', () async {
      final rows = await executor.query('SELECT username, email FROM users WHERE id = :id LIMIT 1;', {'id': 1});
      expect(rows, isNotEmpty);
      expect(rows.first['username'], equals('superadmin'));
      expect(rows.first['email'], equals('superadmin@hrmplatform.local'));
    });
  });
}
