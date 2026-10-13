export interface ManagedUser {
  id: string;
  username: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  initials?: string;
  initialsColor?: string;
  roleId?: string;
  roleCode?: string;
  role: string;
  twoStep?: boolean;
  status: string;
  statusColor?: 'success' | 'danger' | 'warning';
  createdAt?: string;
  joinedDate?: string;
  lastLogin?: string;
  selected?: boolean;
}

export interface RoleOption {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleId?: string;
  roleCode?: string;
  status?: string;
  twoStep?: boolean;
}

export interface UpdateUserDto {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  roleId?: string;
  roleCode?: string;
  status?: string;
  twoStep?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  code?: string;
  description: string;
  totalUsers?: number;
  users?: Array<{ name: string; avatar: string }>;
  permissions?: string[];
}
