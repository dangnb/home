/// Data Transfer Object cho hồ sơ nhân sự (Read-optimized)
class EmployeeDto {
  final int id;
  final int tenantId;
  final int userId;
  final String username;
  final String email;
  final String fullName;
  final String? phone;
  final int? departmentId;
  final String? departmentName;
  final int? managerId;
  final String? managerName;
  final String jobTitle;
  final String gender;
  final String? dateOfBirth;
  final String? idCardNumber;
  final String? joinedDate;
  final String status;
  final DateTime? createdAt;

  EmployeeDto({
    required this.id,
    required this.tenantId,
    required this.userId,
    required this.username,
    required this.email,
    required this.fullName,
    this.phone,
    this.departmentId,
    this.departmentName,
    this.managerId,
    this.managerName,
    required this.jobTitle,
    required this.gender,
    this.dateOfBirth,
    this.idCardNumber,
    this.joinedDate,
    required this.status,
    this.createdAt,
  });

  factory EmployeeDto.fromRow(Map<String, dynamic> row) {
    return EmployeeDto(
      id: row['id'] as int,
      tenantId: row['tenant_id'] as int,
      userId: row['user_id'] as int,
      username: row['username'] as String? ?? '',
      email: row['email'] as String? ?? '',
      fullName: row['full_name'] as String? ?? '',
      phone: row['phone'] as String?,
      departmentId: row['department_id'] as int?,
      departmentName: row['department_name'] as String?,
      managerId: row['manager_id'] as int?,
      managerName: row['manager_name'] as String?,
      jobTitle: row['job_title'] as String? ?? '',
      gender: row['gender'] as String? ?? 'OTHER',
      dateOfBirth: row['date_of_birth']?.toString(),
      idCardNumber: row['id_card_number'] as String?,
      joinedDate: row['joined_date']?.toString(),
      status: row['status'] as String? ?? 'ACTIVE',
      createdAt: row['created_at'] is DateTime ? row['created_at'] as DateTime : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenantId': tenantId,
      'userId': userId,
      'username': username,
      'email': email,
      'fullName': fullName,
      'phone': phone,
      'departmentId': departmentId,
      'departmentName': departmentName,
      'managerId': managerId,
      'managerName': managerName,
      'jobTitle': jobTitle,
      'gender': gender,
      'dateOfBirth': dateOfBirth,
      'idCardNumber': idCardNumber,
      'joinedDate': joinedDate,
      'status': status,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
