import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { AppPermissionsList, AppPermissions } from '../../models/permission.enum';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roles',
  imports: [FormsModule, ModalComponent, TranslatePipe],
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  private translateService = inject(TranslateService);
  roles: Role[] = [];
  permissionsList = AppPermissionsList;

  showModal = false;
  isEditMode = false;
  isSubmitting = false;
  editingRole: Role = { id: "", name: '', description: '', permissions: [] };

  private roleService = inject(RoleService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.alertService.error('Lỗi', 'Không thể tải danh sách vai trò');
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingRole = { id: "", name: '', description: '', permissions: [] };
    this.showModal = true;
  }

  openEditModal(role: Role) {
    this.isEditMode = true;
    this.editingRole = { ...role };
    this.editingRole.permissions = [...(role.permissions || [])]; // Ensure it's a new array
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  saveRole() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.isEditMode) {
      this.roleService.updateRole(this.editingRole.id!, this.editingRole).subscribe({
        next: () => {
          this.loadRoles();
          this.closeModal();
          this.alertService.success('Thành công', 'Đã cập nhật vai trò');
        },
        error: () => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.alertService.error('Lỗi', 'Không thể cập nhật vai trò');
        }
      });
    } else {
      this.roleService.createRole(this.editingRole).subscribe({
        next: () => {
          this.loadRoles();
          this.closeModal();
          this.alertService.success('Thành công', 'Đã thêm vai trò');
        },
        error: () => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.alertService.error('Lỗi', 'Không thể thêm vai trò');
        }
      });
    }
  }

  deleteRole(id: string) {
    const confirmTitle = this.translateService.instant('COMMON.CONFIRM') || 'Xác nhận';
    const confirmMsg = this.translateService.instant('ROLES.CONFIRM_DELETE') || 'Bạn có chắc chắn muốn xóa vai trò này không?';
    this.alertService.confirm(confirmTitle, confirmMsg).then((result: any) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(id).subscribe({
          next: () => {
            this.loadRoles();
            this.alertService.success('Thành công', 'Đã xóa vai trò');
          },
          error: () => {
            this.alertService.error('Lỗi', 'Không thể xóa vai trò');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  // --- STRING ARRAY LOGIC ---

  hasPermission(rolePermissions: string[], permissionValue: string): boolean {
    if (!rolePermissions) return false;
    if (rolePermissions.includes('*')) return true; // Admin master bypass
    return rolePermissions.includes(permissionValue);
  }

  togglePermission(event: Event, permissionValue: string) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (!this.editingRole.permissions) {
      this.editingRole.permissions = [];
    }

    if (isChecked) {
      if (!this.editingRole.permissions.includes(permissionValue)) {
        this.editingRole.permissions.push(permissionValue);
      }
    } else {
      // If admin master bypass is unchecked, remove wildcard and rebuild?
      // Normally Admin doesn't get edited here, but let's handle standard remove
      const index = this.editingRole.permissions.indexOf(permissionValue);
      if (index !== -1) {
        this.editingRole.permissions.splice(index, 1);
      }
      
      // If they had wildcard and unchecked something, we should probably strip wildcard. 
      // But for simplicity, we don't expose "*" in the checkboxes, only specific claims.
      const wildcardIndex = this.editingRole.permissions.indexOf('*');
      if (wildcardIndex !== -1) {
        this.editingRole.permissions.splice(wildcardIndex, 1);
        // Add everything back EXCEPT the unchecked one?
        // This is complex. For now, just removing '*' if they uncheck anything while having '*'.
      }
    }
  }
}
