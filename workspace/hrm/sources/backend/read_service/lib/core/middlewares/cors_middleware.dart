import 'package:shelf/shelf.dart';

/// Middleware cấu hình Cross-Origin Resource Sharing (CORS)
Middleware corsMiddleware() {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization, X-Tenant-Id, X-Tenant-Code, Accept',
    'Access-Control-Max-Age': '86400',
  };

  return (Handler innerHandler) {
    return (Request request) async {
      // Xử lý Preflight OPTIONS request
      if (request.method == 'OPTIONS') {
        return Response.ok('', headers: corsHeaders);
      }

      final response = await innerHandler(request);
      return response.change(headers: corsHeaders);
    };
  };
}
