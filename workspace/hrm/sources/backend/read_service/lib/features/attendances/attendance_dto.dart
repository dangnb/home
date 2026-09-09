/// Data Transfer Object cho bảng chấm công (Read-optimized)
class AttendanceDto {
  final int id;
  final int tenantId;
  final int userId;
  final String? employeeName;
  final String workDate;
  final DateTime? checkIn;
  final DateTime? checkOut;
  final int lateMinutes;
  final int earlyMinutes;
  final String status;
  final DateTime? createdAt;

  AttendanceDto({
    required this.id,
    required this.tenantId,
    required this.userId,
    this.employeeName,
    required this.workDate,
    this.checkIn,
    this.checkOut,
    required this.lateMinutes,
    required this.earlyMinutes,
    required this.status,
    this.createdAt,
  });

  factory AttendanceDto.fromRow(Map<String, dynamic> row) {
    return AttendanceDto(
      id: row['id'] as int,
      tenantId: row['tenant_id'] as int,
      userId: row['user_id'] as int,
      employeeName: row['employee_name'] as String?,
      workDate: row['work_date']?.toString() ?? '',
      checkIn: row['check_in'] is DateTime ? row['check_in'] as DateTime : null,
      checkOut: row['check_out'] is DateTime ? row['check_out'] as DateTime : null,
      lateMinutes: row['late_minutes'] as int? ?? 0,
      earlyMinutes: row['early_minutes'] as int? ?? 0,
      status: row['status'] as String? ?? 'PRESENT',
      createdAt: row['created_at'] is DateTime ? row['created_at'] as DateTime : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenantId': tenantId,
      'userId': userId,
      'employeeName': employeeName,
      'workDate': workDate,
      'checkIn': checkIn?.toIso8601String(),
      'checkOut': checkOut?.toIso8601String(),
      'lateMinutes': lateMinutes,
      'earlyMinutes': earlyMinutes,
      'status': status,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
