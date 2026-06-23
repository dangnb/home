import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Cashier' }
  ];

  showModal = false;
  isEditMode = false;
  editingUser: any = { id: 0, username: '', fullName: '', email: '', roleId: 0, isActive: true };

  // Mock data until Users API is fully connected
  mockUsers = [
    { id: 1, username: 'admin', fullName: 'System Admin', email: 'admin@taphoa.com', roleId: 1, isActive: true },
    { id: 2, username: 'dat.dao', fullName: 'Đào Tiến Đạt', email: 'dat@taphoa.com', roleId: 2, isActive: true },
    { id: 3, username: 'thu ngân 1', fullName: 'Nhân viên 1', email: 'nv1@taphoa.com', roleId: 3, isActive: true }
  ];

  ngOnInit() {
    this.users = [...this.mockUsers];
  }

  getRoleName(roleId: number) {
    return this.roles.find(r => r.id == roleId)?.name || 'N/A';
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingUser = { id: 0, username: '', fullName: '', email: '', roleId: this.roles[0]?.id, isActive: true };
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.editingUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    if (this.isEditMode) {
      const index = this.users.findIndex(u => u.id === this.editingUser.id);
      if (index > -1) this.users[index] = { ...this.editingUser };
    } else {
      this.editingUser.id = Math.max(0, ...this.users.map(u => u.id)) + 1;
      this.users.push({ ...this.editingUser });
    }
    this.closeModal();
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc chắn muốn khóa/xóa User này?')) {
      this.users = this.users.filter(u => u.id !== id);
    }
  }
}
