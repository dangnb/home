export interface User {
  id: string | number;
  name: string;
  username?: string;
  email: string;
  avatar?: string;
  role: string;
  company?: string;
  tenantId?: number | null;
  isSuperAdmin?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface AuthSession {
  token: string;
  user: User;
  expiresIn?: number;
}
