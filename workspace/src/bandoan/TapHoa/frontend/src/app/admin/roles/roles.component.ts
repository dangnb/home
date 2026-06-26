import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { AppPermissionsList, AppPermissions } from '../../models/permission.enum';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-roles',
  imports: [FormsModule],
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  permissionsList = AppPermissionsList;

  showModal = false;
  isEditMode = false;
  editingRole: Role = { id: "", name: '', description: '', permissions: 0 };

  // Temporary mock data since we haven't implemented full backend GET /roles yet
  mockRoles: Role[] = [
    { id: "1", name: 'Admin', description: 'Quản trị viên hệ thống', permissions: -1 }, // All
    { id: "2", name: 'Manager', description: 'Quản lý cửa hàng', permissions: AppPermissions.ViewProducts | AppPermissions.CreateProducts | AppPermissions.ViewCategories },
    { id: "3", name: 'Cashier', description: 'Nhân viên thu ngân', permissions: AppPermissions.ViewProducts }
  ];

  constructor(private roleService: RoleService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    // Override with Mock Data for demonstration until API is fully ready
    this.roles = [...this.mockRoles];
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingRole = { id: "", name: '', description: '', permissions: 0 };
    this.showModal = true;
  }

  openEditModal(role: Role) {
    this.isEditMode = true;
    this.editingRole = { ...role };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveRole() {
    if (this.isEditMode) {
      const index = this.roles.findIndex(r => r.id === this.editingRole.id);
      if (index !== -1) {
        this.roles[index] = { ...this.editingRole };
        this.mockRoles[index] = { ...this.editingRole };
      }
    } else {
      this.editingRole.id = Date.now().toString();
      this.roles.push({ ...this.editingRole });
      this.mockRoles.push({ ...this.editingRole });
    }
    this.closeModal();
  }

  deleteRole(id: string) {
    this.alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa vai trò này không?').then((result: any) => {
      if (result.isConfirmed) {
        this.roles = this.roles.filter(r => r.id !== id);
        this.mockRoles = this.mockRoles.filter(r => r.id !== id);
        this.alertService.success('Thành công', 'Đã xóa vai trò.');
      }
    });
  }

  // --- BITWISE MATRIX LOGIC ---

  hasPermission(rolePermissions: number, permissionValue: number): boolean {
    if (rolePermissions === -1) return true; // Admin master bypass
    return (rolePermissions & permissionValue) === permissionValue;
  }

  togglePermission(event: Event, permissionValue: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Safety check for Admin Master
    if (this.editingRole.permissions === -1 && !isChecked) {
      this.editingRole.permissions = 0; // Break out of master mode if they uncheck anything
    }

    if (isChecked) {
      this.editingRole.permissions |= permissionValue; // Turn ON bit
    } else {
      this.editingRole.permissions &= ~permissionValue; // Turn OFF bit
    }
  }
}
