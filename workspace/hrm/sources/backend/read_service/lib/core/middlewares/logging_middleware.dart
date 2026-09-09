import 'package:shelf/shelf.dart';

/// Middleware ghi nhận log truy vấn và thời gian thực thi (latency)
Middleware loggingMiddleware() {
  return (Handler innerHandler) {
    return (Request request) async {
      final stopwatch = Stopwatch()..start();
      final startTime = DateTime.now();

      try {
        final response = await innerHandler(request);
        stopwatch.stop();

        final tenantId = request.context['tenant_id'] ?? 'NONE';
        // ignore: avoid_print
        print(
          '[$startTime] ${request.method} /${request.url.path} '
          '-> Status: ${response.statusCode} | Tenant: $tenantId | Time: ${stopwatch.elapsedMilliseconds}ms',
        );

        return response;
      } catch (error, stackTrace) {
        stopwatch.stop();
        // ignore: avoid_print
        print(
          '[$startTime] ERROR ${request.method} /${request.url.path} '
          '-> ${stopwatch.elapsedMilliseconds}ms | Error: $error\n$stackTrace',
        );
        rethrow;
      }
    };
  };
}
