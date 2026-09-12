export interface SystemPermission {
  id: number;
  module: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  assignedRolesCount: number;
}

export interface RoleDetail {
  id: number;
  tenantId?: number | null;
  code: string;
  name: string;
  description?: string;
  status: string;
  totalUsers: number;
  isSystemRole: boolean;
  permissionIds: number[];
  permissionCodes: string[];
  permissionNames: string[];
}

export interface CreateRoleDto {
  code: string;
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface UpdateRoleDto {
  id: number;
  name: string;
  description?: string;
  permissionIds: number[];
}
