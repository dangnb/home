import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoleManagementService } from '../../../core/services/role-management.service';
import { UserManagementService } from '../../../core/services/user-management.service';
import { ToastService } from '../../../core/services/toast.service';
import { RoleDetail, SystemPermission } from '../../../core/models/rbac.model';
import { ManagedUser } from '../../../core/models/user-management.model';
import { MODULE_META_MAP } from '../permissions-list/permissions-list.component';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  private readonly roleService = inject(RoleManagementService);
  private readonly userService = inject(UserManagementService);
  private readonly toast = inject(ToastService);

  // Data signals
  readonly roles = signal<RoleDetail[]>([]);
  readonly allPermissions = signal<SystemPermission[]>([]);
  readonly users = signal<ManagedUser[]>([]);

  readonly isLoadingRoles = signal<boolean>(false);
  readonly isLoadingUsers = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  // Search & Filter for Users Table
  readonly userSearchTerm = signal<string>('');
  readonly selectedRoleFilter = signal<string>('All');

  // Modal State
  readonly isRoleModalOpen = signal<boolean>(false);
  readonly editingRole = signal<RoleDetail | null>(null);
  readonly modalRoleCode = signal<string>('');
  readonly modalRoleName = signal<string>('');
  readonly modalRoleDescription = signal<string>('');
  readonly selectedPermissionIds = signal<Set<string>>(new Set());

  // Delete Confirm Modal
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly roleToDelete = signal<RoleDetail | null>(null);

  // Computed: Group all permissions by Module
  readonly permissionsByModule = computed(() => {
    const map = new Map<string, SystemPermission[]>();
    for (const p of this.allPermissions()) {
      if (!map.has(p.module)) {
        map.set(p.module, []);
      }
      map.get(p.module)!.push(p);
    }
    return Array.from(map.entries()).map(([module, perms]) => ({
      module,
      meta: MODULE_META_MAP[module.toUpperCase()] || {
        label: module,
        badgeClass: 'badge-light-primary text-primary',
        icon: 'bi-app'
      },
      permissions: perms
    }));
  });

  // Filtered Users
  readonly filteredUsers = computed(() => {
    const term = this.userSearchTerm().toLowerCase().trim();
    const roleFilter = this.selectedRoleFilter();

    return this.users().filter(u => {
      const name = (u.fullName || u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const username = (u.username || '').toLowerCase();
      const matchesSearch = !term || name.includes(term) || email.includes(term) || username.includes(term);

      const matchesRole = roleFilter === 'All' ||
        u.roleCode === roleFilter ||
        u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  });

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
    this.loadUsers();
  }

  loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.roleService.getRoles().subscribe({
      next: (res) => {
        this.isLoadingRoles.set(false);
        if (res && res.data) {
          this.roles.set(res.data);
        }
      },
      error: (err) => {
        this.isLoadingRoles.set(false);
        this.toast.error('Lỗi', err?.error?.message || 'Không thể tải danh sách vai trò.');
      }
    });
  }

  loadPermissions(): void {
    this.roleService.getPermissions().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.allPermissions.set(res.data);
        }
      },
      error: () => {
        // Silently handled or retry
      }
    });
  }

  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.userService.getUsers({ pageSize: 100 }).subscribe({
      next: (res) => {
        this.isLoadingUsers.set(false);
        if (res && res.data) {
          this.users.set(res.data);
        }
      },
      error: () => {
        this.isLoadingUsers.set(false);
      }
    });
  }

  // --- Modal Operations ---

  openAddRoleModal(): void {
    this.editingRole.set(null);
    this.modalRoleCode.set('');
    this.modalRoleName.set('');
    this.modalRoleDescription.set('');
    this.selectedPermissionIds.set(new Set());
    this.isRoleModalOpen.set(true);
  }

  openEditRoleModal(role: RoleDetail): void {
    this.editingRole.set(role);
    this.modalRoleCode.set(role.code);
    this.modalRoleName.set(role.name);
    this.modalRoleDescription.set(role.description || '');
    this.selectedPermissionIds.set(new Set(role.permissionIds || []));
    this.isRoleModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.isRoleModalOpen.set(false);
    this.editingRole.set(null);
  }

  // --- Permission Selection Handlers ---

  isPermissionSelected(id: string): boolean {
    return this.selectedPermissionIds().has(id);
  }

  togglePermission(id: string): void {
    const current = new Set(this.selectedPermissionIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedPermissionIds.set(current);
  }

  isModuleAllSelected(moduleName: string): boolean {
    const group = this.permissionsByModule().find(g => g.module === moduleName);
    if (!group || group.permissions.length === 0) return false;
    const current = this.selectedPermissionIds();
    return group.permissions.every(p => current.has(p.id));
  }

  toggleModuleAll(moduleName: string): void {
    const group = this.permissionsByModule().find(g => g.module === moduleName);
    if (!group) return;

    const current = new Set(this.selectedPermissionIds());
    const allSelected = this.isModuleAllSelected(moduleName);

    if (allSelected) {
      // Unselect all in module
      group.permissions.forEach(p => current.delete(p.id));
    } else {
      // Select all in module
      group.permissions.forEach(p => current.add(p.id));
    }
    this.selectedPermissionIds.set(current);
  }

  isAllPermissionsSelected(): boolean {
    const all = this.allPermissions();
    if (all.length === 0) return false;
    const current = this.selectedPermissionIds();
    return all.every(p => current.has(p.id));
  }

  toggleAllPermissions(): void {
    const all = this.allPermissions();
    if (this.isAllPermissionsSelected()) {
      this.selectedPermissionIds.set(new Set());
    } else {
      this.selectedPermissionIds.set(new Set(all.map(p => p.id)));
    }
  }

  saveRole(): void {
    const name = this.modalRoleName().trim();
    if (!name) {
      this.toast.warning('Cảnh báo', 'Vui lòng nhập tên vai trò.');
      return;
    }

    const permissionIds = Array.from(this.selectedPermissionIds());
    this.isSaving.set(true);

    if (this.editingRole()) {
      // Update
      const roleId = this.editingRole()!.id;
      this.roleService.updateRole(roleId, {
        id: roleId,
        name,
        description: this.modalRoleDescription().trim() || undefined,
        permissionIds
      }).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toast.success('Thành công', 'Cập nhật vai trò và phân quyền thành công!');
          this.closeRoleModal();
          this.loadRoles();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.toast.error('Lỗi', err?.error?.message || 'Không thể cập nhật vai trò.');
        }
      });
    } else {
      // Create
      const code = this.modalRoleCode().trim().toUpperCase();
      if (!code) {
        this.isSaving.set(false);
        this.toast.warning('Cảnh báo', 'Vui lòng nhập mã vai trò (viết hoa không dấu).');
        return;
      }

      this.roleService.createRole({
        code,
        name,
        description: this.modalRoleDescription().trim() || undefined,
        permissionIds
      }).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toast.success('Thành công', `Tạo mới vai trò '${name}' thành công!`);
          this.closeRoleModal();
          this.loadRoles();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.toast.error('Lỗi', err?.error?.message || 'Không thể tạo mới vai trò.');
        }
      });
    }
  }

  // --- Delete Operations ---

  promptDeleteRole(role: RoleDetail): void {
    if (role.isSystemRole) {
      this.toast.warning('Không thể xóa', `Vai trò hệ thống '${role.name}' là cốt lõi của HRM Platform và không được phép xóa.`);
      return;
    }
    if (role.totalUsers > 0) {
      this.toast.warning('Không thể xóa', `Vai trò '${role.name}' hiện đang có ${role.totalUsers} người dùng. Vui lòng chuyển vai trò người dùng trước khi xóa.`);
      return;
    }
    this.roleToDelete.set(role);
    this.isDeleteModalOpen.set(true);
  }

  confirmDeleteRole(): void {
    const role = this.roleToDelete();
    if (!role) return;

    this.roleService.deleteRole(role.id).subscribe({
      next: () => {
        this.toast.success('Thành công', `Đã xóa vai trò '${role.name}'.`);
        this.isDeleteModalOpen.set(false);
        this.roleToDelete.set(null);
        this.loadRoles();
      },
      error: (err) => {
        this.toast.error('Lỗi', err?.error?.message || 'Không thể xóa vai trò.');
      }
    });
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.roleToDelete.set(null);
  }

  deleteUser(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toast.success('Thành công', 'Đã xóa người dùng.');
          this.loadUsers();
          this.loadRoles();
        },
        error: (err) => {
          this.toast.error('Lỗi', err?.error?.message || 'Không thể xóa người dùng.');
        }
      });
    }
  }
}
