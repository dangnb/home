import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';
import { AppPermissionsList, AppPermissions } from '../../models/permission.enum';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  permissionsList = AppPermissionsList;

  showModal = false;
  isEditMode = false;
  editingRole: Role = { id: 0, name: '', description: '', permissions: 0 };

  // Temporary mock data since we haven't implemented full backend GET /roles yet
  mockRoles: Role[] = [
    { id: 1, name: 'Admin', description: 'Quản trị viên hệ thống', permissions: -1 }, // All
    { id: 2, name: 'Manager', description: 'Quản lý cửa hàng', permissions: AppPermissions.ViewProducts | AppPermissions.CreateProducts | AppPermissions.ViewCategories },
    { id: 3, name: 'Cashier', description: 'Nhân viên thu ngân', permissions: AppPermissions.ViewProducts }
  ];

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    // Override with Mock Data for demonstration until API is fully ready
    this.roles = [...this.mockRoles];
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingRole = { id: 0, name: '', description: '', permissions: 0 };
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
      this.editingRole.id = Math.max(0, ...this.roles.map(r => r.id)) + 1;
      this.roles.push({ ...this.editingRole });
      this.mockRoles.push({ ...this.editingRole });
    }
    this.closeModal();
  }

  deleteRole(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa vai trò này không?')) {
      this.roles = this.roles.filter(r => r.id !== id);
      this.mockRoles = this.mockRoles.filter(r => r.id !== id);
    }
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
