export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  initialsColor?: string;
  role: 'Administrator' | 'Developer' | 'Analyst' | 'Support' | 'Trial';
  twoStep: boolean;
  lastLogin: string;
  joinedDate: string;
  status: 'Active' | 'Suspended' | 'Pending';
  statusColor: 'success' | 'danger' | 'warning';
  selected?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  totalUsers: number;
  users: Array<{ name: string; avatar: string }>;
  permissions: string[];
}

