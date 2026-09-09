/// Data Transfer Object cho đơn xin nghỉ phép (Read-optimized)
class LeaveRequestDto {
  final int id;
  final int tenantId;
  final int userId;
  final String? employeeName;
  final String leaveType;
  final String startDate;
  final String endDate;
  final String? reason;
  final String status;
  final int? approverId;
  final String? approverName;
  final DateTime? createdAt;

  LeaveRequestDto({
    required this.id,
    required this.tenantId,
    required this.userId,
    this.employeeName,
    required this.leaveType,
    required this.startDate,
    required this.endDate,
    this.reason,
    required this.status,
    this.approverId,
    this.approverName,
    this.createdAt,
  });

  factory LeaveRequestDto.fromRow(Map<String, dynamic> row) {
    return LeaveRequestDto(
      id: row['id'] as int,
      tenantId: row['tenant_id'] as int,
      userId: row['user_id'] as int,
      employeeName: row['employee_name'] as String?,
      leaveType: row['leave_type'] as String? ?? 'ANNUAL',
      startDate: row['start_date']?.toString() ?? '',
      endDate: row['end_date']?.toString() ?? '',
      reason: row['reason'] as String?,
      status: row['status'] as String? ?? 'PENDING',
      approverId: row['approver_id'] as int?,
      approverName: row['approver_name'] as String?,
      createdAt: row['created_at'] is DateTime ? row['created_at'] as DateTime : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenantId': tenantId,
      'userId': userId,
      'employeeName': employeeName,
      'leaveType': leaveType,
      'startDate': startDate,
      'endDate': endDate,
      'reason': reason,
      'status': status,
      'approverId': approverId,
      'approverName': approverName,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
