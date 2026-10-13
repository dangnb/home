export interface SystemPermission {
  id: string;
  module: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  assignedRolesCount: number;
}

export interface RoleDetail {
  id: string;
  tenantId?: string | null;
  code: string;
  name: string;
  description?: string;
  status: string;
  totalUsers: number;
  isSystemRole: boolean;
  permissionIds: string[];
  permissionCodes: string[];
  permissionNames: string[];
}

export interface CreateRoleDto {
  code: string;
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleDto {
  id: string;
  name: string;
  description?: string;
  permissionIds: string[];
}
