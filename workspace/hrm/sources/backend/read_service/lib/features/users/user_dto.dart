/// Data Transfer Object cho thông tin người dùng hệ thống (Read-optimized)
class UserDto {
  final int id;
  final int? tenantId;
  final String username;
  final String email;
  final String fullName;
  final String? phone;
  final String status;
  final int? roleId;
  final String? roleCode;
  final String? roleName;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  UserDto({
    required this.id,
    this.tenantId,
    required this.username,
    required this.email,
    required this.fullName,
    this.phone,
    required this.status,
    this.roleId,
    this.roleCode,
    this.roleName,
    this.createdAt,
    this.updatedAt,
  });

  factory UserDto.fromRow(Map<String, dynamic> row) {
    return UserDto(
      id: row['id'] as int,
      tenantId: row['tenant_id'] as int?,
      username: row['username'] as String,
      email: row['email'] as String,
      fullName: row['full_name'] as String? ?? '',
      phone: row['phone'] as String?,
      status: row['status'] as String? ?? 'ACTIVE',
      roleId: row['role_id'] as int?,
      roleCode: row['role_code'] as String?,
      roleName: row['role_name'] as String?,
      createdAt: row['created_at'] is DateTime ? row['created_at'] as DateTime : null,
      updatedAt: row['updated_at'] is DateTime ? row['updated_at'] as DateTime : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenantId': tenantId,
      'username': username,
      'email': email,
      'fullName': fullName,
      'name': fullName.isNotEmpty ? fullName : username,
      'phone': phone,
      'status': status,
      'roleId': roleId,
      'roleCode': roleCode ?? 'EMPLOYEE',
      'role': roleName ?? roleCode ?? 'Standard Employee',
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
