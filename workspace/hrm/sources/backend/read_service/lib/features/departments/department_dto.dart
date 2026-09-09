/// Data Transfer Object cho thông tin phòng ban (Read-optimized)
class DepartmentDto {
  final int id;
  final int tenantId;
  final String name;
  final String code;
  final int? managerId;
  final String? managerName;
  final int? parentId;
  final String? parentName;
  final String status;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  DepartmentDto({
    required this.id,
    required this.tenantId,
    required this.name,
    required this.code,
    this.managerId,
    this.managerName,
    this.parentId,
    this.parentName,
    required this.status,
    this.createdAt,
    this.updatedAt,
  });

  factory DepartmentDto.fromRow(Map<String, dynamic> row) {
    return DepartmentDto(
      id: row['id'] as int,
      tenantId: row['tenant_id'] as int,
      name: row['name'] as String,
      code: row['code'] as String,
      managerId: row['manager_id'] as int?,
      managerName: row['manager_name'] as String?,
      parentId: row['parent_id'] as int?,
      parentName: row['parent_name'] as String?,
      status: row['status'] as String? ?? 'ACTIVE',
      createdAt: row['created_at'] is DateTime ? row['created_at'] as DateTime : null,
      updatedAt: row['updated_at'] is DateTime ? row['updated_at'] as DateTime : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tenantId': tenantId,
      'name': name,
      'code': code,
      'managerId': managerId,
      'managerName': managerName,
      'parentId': parentId,
      'parentName': parentName,
      'status': status,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
