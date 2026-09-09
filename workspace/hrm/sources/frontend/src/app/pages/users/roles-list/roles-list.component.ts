import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../../core/services/user-management.service';
import { UserRole, ManagedUser } from '../../../core/models/user-management.model';

interface PermissionModule {
  name: string;
  read: boolean;
  write: boolean;
  create: boolean;
}

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent {
  readonly userService = inject(UserManagementService);

  readonly roles = signal<UserRole[]>([
    {
      id: '1',
      name: 'Administrator',
      totalUsers: 5,
      description: 'Full access to all system modules and data',
      users: [
        { name: 'Emma', avatar: 'assets/media/avatars/300-6.jpg' },
        { name: 'Max', avatar: 'assets/media/avatars/300-3.jpg' }
      ],
      permissions: [
        'All Admin Controls',
        'View & Edit Financial Summaries',
        'Enabled Bulk Reports',
        'View & Edit Payouts',
        'View & Edit Disputes'
      ]
    },
    {
      id: '2',
      name: 'Developer',
      totalUsers: 14,
      description: 'Access to developer tools, APIs, and logs',
      users: [
        { name: 'Max', avatar: 'assets/media/avatars/300-3.jpg' },
        { name: 'Brian', avatar: 'assets/media/avatars/300-25.jpg' }
      ],
      permissions: [
        'Some Admin Controls',
        'View Financial Summaries Only',
        'View & Edit API Controls',
        'View Payouts Only',
        'View & Edit Disputes'
      ]
    },
    {
      id: '3',
      name: 'Analyst',
      totalUsers: 7,
      description: 'Access to business intelligence and analytics',
      users: [
        { name: 'Melody', avatar: 'assets/media/avatars/300-1.jpg' }
      ],
      permissions: [
        'View Financial Summaries',
        'Enabled Bulk Reports',
        'View Payouts Only',
        'Generate BI Reports'
      ]
    },
    {
      id: '4',
      name: 'Support',
      totalUsers: 3,
      description: 'Customer support tickets and disputes resolution',
      users: [
        { name: 'Sean', avatar: 'assets/media/avatars/300-5.jpg' }
      ],
      permissions: [
        'View Customer Tickets',
        'View Customer Profiles',
        'Send Customer Notices',
        'Manage Disputes'
      ]
    },
    {
      id: '5',
      name: 'Trial',
      totalUsers: 10,
      description: 'Limited read-only access for evaluation',
      users: [
        { name: 'Mikaela', avatar: 'assets/media/avatars/300-9.jpg' }
      ],
      permissions: [
        'View Public Dashboard',
        'Read-only Documentation',
        'Explore Demo Sandbox'
      ]
    }
  ]);

  // Search and filter for the users table
  readonly userSearchTerm = signal<string>('');
  readonly selectedRoleFilter = signal<string>('All');

  // Modal State
  readonly isRoleModalOpen = signal<boolean>(false);
  readonly modalRoleName = signal<string>('');
  readonly editingRoleId = signal<string | null>(null);

  // Permission Matrix
  readonly permissionModules = signal<PermissionModule[]>([
    { name: 'User Management', read: true, write: false, create: false },
    { name: 'Content Management', read: true, write: true, create: false },
    { name: 'Financial Management', read: false, write: false, create: false },
    { name: 'Reporting & Analytics', read: true, write: false, create: false },
    { name: 'Payroll & Compensation', read: false, write: false, create: false },
    { name: 'System Administration', read: false, write: false, create: false }
  ]);

  readonly selectAllPermissions = signal<boolean>(false);

  readonly filteredUsers = computed(() => {
    const term = this.userSearchTerm().toLowerCase().trim();
    const role = this.selectedRoleFilter();
    const allUsers: ManagedUser[] = this.userService.users();
    return allUsers.filter((u: ManagedUser) => {
      const matchesSearch = u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchesRole = role === 'All' || u.role === role;
      return matchesSearch && matchesRole;
    });
  });

  openAddRoleModal(): void {
    this.editingRoleId.set(null);
    this.modalRoleName.set('');
    this.selectAllPermissions.set(false);
    this.permissionModules.set([
      { name: 'User Management', read: false, write: false, create: false },
      { name: 'Content Management', read: false, write: false, create: false },
      { name: 'Financial Management', read: false, write: false, create: false },
      { name: 'Reporting & Analytics', read: false, write: false, create: false },
      { name: 'Payroll & Compensation', read: false, write: false, create: false },
      { name: 'System Administration', read: false, write: false, create: false }
    ]);
    this.isRoleModalOpen.set(true);
  }

  openEditRoleModal(role: UserRole): void {
    this.editingRoleId.set(role.id);
    this.modalRoleName.set(role.name);
    this.selectAllPermissions.set(false);
    this.permissionModules.set([
      { name: 'User Management', read: true, write: true, create: true },
      { name: 'Content Management', read: true, write: true, create: false },
      { name: 'Financial Management', read: true, write: false, create: false },
      { name: 'Reporting & Analytics', read: true, write: true, create: true },
      { name: 'Payroll & Compensation', read: false, write: false, create: false },
      { name: 'System Administration', read: false, write: false, create: false }
    ]);
    this.isRoleModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.isRoleModalOpen.set(false);
  }

  toggleSelectAll(): void {
    const newVal = !this.selectAllPermissions();
    this.selectAllPermissions.set(newVal);
    this.permissionModules.update(modules =>
      modules.map(m => ({ ...m, read: newVal, write: newVal, create: newVal }))
    );
  }

  saveRole(): void {
    const name = this.modalRoleName().trim();
    if (!name) return;

    if (this.editingRoleId()) {
      // Update existing role
      this.roles.update(roles =>
        roles.map(r => r.id === this.editingRoleId() ? { ...r, name } : r)
      );
    } else {
      // Add new role
      const newRole: UserRole = {
        id: Date.now().toString(),
        name,
        totalUsers: 0,
        users: [],
        description: 'Custom created role with configured permissions',
        permissions: ['Custom Permission Matrix Configured', 'Access to Selected Modules']
      };
      this.roles.update(roles => [...roles, newRole]);
    }
    this.closeRoleModal();
  }

  deleteUser(id: string | number): void {
    this.userService.deleteUser(String(id));
  }
}
