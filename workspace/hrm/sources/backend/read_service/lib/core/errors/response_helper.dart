import 'dart:convert';
import 'package:shelf/shelf.dart';

/// Helper chuẩn hóa các phản hồi HTTP JSON trong Shelf
class ResponseHelper {
  static const Map<String, String> jsonHeaders = {
    'content-type': 'application/json; charset=utf-8',
  };

  /// Phản hồi thành công HTTP 200 kèm dữ liệu
  static Response ok(dynamic data, {String? message}) {
    final body = jsonEncode({
      'success': true,
      if (message != null) 'message': message,
      'data': _sanitizeData(data),
    });
    return Response.ok(body, headers: jsonHeaders);
  }

  /// Phản hồi danh sách kèm phân trang HTTP 200
  static Response paginated({
    required List<dynamic> items,
    required int totalCount,
    required int page,
    required int pageSize,
  }) {
    final body = jsonEncode({
      'success': true,
      'data': _sanitizeData(items),
      'pagination': {
        'totalCount': totalCount,
        'page': page,
        'pageSize': pageSize,
        'totalPages': (totalCount / pageSize).ceil(),
      },
    });
    return Response.ok(body, headers: jsonHeaders);
  }

  /// Phản hồi lỗi HTTP
  static Response error(String message, {int statusCode = 400, dynamic details}) {
    final body = jsonEncode({
      'success': false,
      'error': {
        'statusCode': statusCode,
        'message': message,
        if (details != null) 'details': details,
      },
    });
    return Response(statusCode, body: body, headers: jsonHeaders);
  }

  /// Xử lý các kiểu dữ liệu đặc biệt như DateTime, BigInt, Date trước khi jsonEncode
  static dynamic _sanitizeData(dynamic data) {
    if (data is List) {
      return data.map(_sanitizeData).toList();
    }
    if (data is Map) {
      return data.map((key, value) => MapEntry(key.toString(), _sanitizeData(value)));
    }
    if (data is DateTime) {
      return data.toIso8601String();
    }
    if (data is BigInt) {
      return data.toInt();
    }
    return data;
  }
}
