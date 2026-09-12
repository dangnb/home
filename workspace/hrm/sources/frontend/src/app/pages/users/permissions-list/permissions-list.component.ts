import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoleManagementService } from '../../../core/services/role-management.service';
import { SystemPermission } from '../../../core/models/rbac.model';

interface ModuleBadgeMeta {
  label: string;
  badgeClass: string;
  icon: string;
}

export const MODULE_META_MAP: Record<string, ModuleBadgeMeta> = {
  TENANT:     { label: 'Khách Hàng (Tenant)', badgeClass: 'badge-light-primary text-primary', icon: 'bi-buildings' },
  USER:       { label: 'Người Dùng & Đăng Nhập', badgeClass: 'badge-light-info text-info', icon: 'bi-people' },
  ROLE:       { label: 'Phân Quyền & Vai Trò', badgeClass: 'badge-light-danger text-danger', icon: 'bi-shield-lock' },
  DEPARTMENT: { label: 'Phòng Ban Cơ Cấu', badgeClass: 'badge-light-warning text-warning', icon: 'bi-diagram-3' },
  EMPLOYEE:   { label: 'Hồ Sơ Nhân Sự', badgeClass: 'badge-light-success text-success', icon: 'bi-person-badge' },
  ATTENDANCE: { label: 'Chấm Công & Giờ Giấc', badgeClass: 'badge-light-warning text-warning', icon: 'bi-clock-history' },
  LEAVE:      { label: 'Đơn Xin Nghỉ Phép', badgeClass: 'badge-light-primary text-primary', icon: 'bi-calendar-event' },
  AUDIT:      { label: 'Nhật Ký Kiểm Toán', badgeClass: 'badge-light-secondary text-dark', icon: 'bi-journal-text' },
  CONFIG:     { label: 'Danh Mục Cấu Hình', badgeClass: 'badge-light-dark text-dark', icon: 'bi-sliders' }
};

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.scss']
})
export class PermissionsListComponent implements OnInit {
  private roleService = inject(RoleManagementService);

  readonly permissions = signal<SystemPermission[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  // Filters
  readonly searchTerm = signal<string>('');
  readonly selectedModule = signal<string>('ALL');

  // Module List extracted from DB
  readonly availableModules = computed(() => {
    const set = new Set<string>();
    this.permissions().forEach(p => set.add(p.module));
    return Array.from(set).sort();
  });

  // Filtered list
  readonly filteredPermissions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const mod = this.selectedModule();

    return this.permissions().filter(p => {
      const matchMod = mod === 'ALL' || p.module === mod;
      const matchSearch = !term ||
        p.code.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term));
      return matchMod && matchSearch;
    });
  });

  // Grouped by Module for accordion / overview
  readonly permissionsByModule = computed(() => {
    const map = new Map<string, SystemPermission[]>();
    for (const p of this.filteredPermissions()) {
      if (!map.has(p.module)) {
        map.set(p.module, []);
      }
      map.get(p.module)!.push(p);
    }
    return map;
  });

  // Stats
  readonly totalPermissionsCount = computed(() => this.permissions().length);
  readonly totalModulesCount = computed(() => this.availableModules().length);
  readonly activePermissionsCount = computed(() => this.permissions().filter(p => p.status === 'ACTIVE').length);
  readonly totalAssignedLinksCount = computed(() =>
    this.permissions().reduce((acc, curr) => acc + (curr.assignedRolesCount || 0), 0)
  );

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.roleService.getPermissions().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && res.data) {
          this.permissions.set(res.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Không thể tải danh sách quyền hạn.');
      }
    });
  }

  getModuleMeta(moduleName: string): ModuleBadgeMeta {
    return MODULE_META_MAP[moduleName.toUpperCase()] || {
      label: moduleName,
      badgeClass: 'badge-light-primary text-primary',
      icon: 'bi-app'
    };
  }

  selectModuleFilter(mod: string): void {
    this.selectedModule.set(mod);
  }
}
