import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementService } from '../../../core/services/user-management.service';
import { ManagedUser } from '../../../core/models/user-management.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private userMgmtService = inject(UserManagementService);

  users: ManagedUser[] = [];
  searchTerm = '';

  // Filter Popover state
  isFilterMenuOpen = false;
  filterRole = 'All';
  filterTwoStep = 'All';

  // Active filters applied to table
  appliedRole = 'All';
  appliedTwoStep = 'All';

  // Export Modal state
  isExportModalOpen = false;
  exportRole = 'All';
  exportFormat = 'excel';
  isExporting = false;
  exportSuccess = false;

  // Add/Edit User Modal state
  isUserModalOpen = false;
  isEditing = false;
  editingUserId = '';
  modalName = '';
  modalEmail = '';
  modalRole: ManagedUser['role'] = 'Administrator';
  modalAvatar = 'assets/media/avatars/300-6.jpg';
  modalTwoStep = false;
  modalStatus: ManagedUser['status'] = 'Active';
  isSaving = false;

  // Row Action Dropdown
  activeActionMenuId: string | null = null;

  // Pagination state
  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userMgmtService.getUsers().subscribe(list => {
      this.users = list.map(u => ({ ...u, selected: false }));
    });
  }

  // Filter logic
  toggleFilterMenu(): void {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  applyFilter(): void {
    this.appliedRole = this.filterRole;
    this.appliedTwoStep = this.filterTwoStep;
    this.currentPage = 1;
    this.isFilterMenuOpen = false;
  }

  resetFilter(): void {
    this.filterRole = 'All';
    this.filterTwoStep = 'All';
    this.appliedRole = 'All';
    this.appliedTwoStep = 'All';
    this.currentPage = 1;
    this.isFilterMenuOpen = false;
  }

  get filteredUsers(): ManagedUser[] {
    return this.users.filter(u => {
      const matchesSearch = !this.searchTerm ||
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.appliedRole === 'All' || u.role === this.appliedRole;

      const matchesTwoStep = this.appliedTwoStep === 'All' ||
        (this.appliedTwoStep === 'Enabled' && u.twoStep) ||
        (this.appliedTwoStep === 'Disabled' && !u.twoStep);

      return matchesSearch && matchesRole && matchesTwoStep;
    });
  }

  get paginatedUsers(): ManagedUser[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Selection & Bulk Actions
  get selectedCount(): number {
    return this.users.filter(u => u.selected).length;
  }

  get isAllSelected(): boolean {
    const pageUsers = this.paginatedUsers;
    return pageUsers.length > 0 && pageUsers.every(u => u.selected);
  }

  toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentPaginatedIds = new Set(this.paginatedUsers.map(u => u.id));
    this.users.forEach(u => {
      if (currentPaginatedIds.has(u.id)) {
        u.selected = isChecked;
      }
    });
  }

  deleteSelected(): void {
    const selectedIds = this.users.filter(u => u.selected).map(u => u.id);
    if (selectedIds.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected user(s)?`)) {
      this.userMgmtService.deleteUsers(selectedIds);
      this.loadUsers();
    }
  }

  // Export Modal
  openExportModal(): void {
    this.isExportModalOpen = true;
    this.exportRole = 'All';
    this.exportFormat = 'excel';
    this.exportSuccess = false;
  }

  closeExportModal(): void {
    this.isExportModalOpen = false;
  }

  submitExport(): void {
    this.isExporting = true;
    setTimeout(() => {
      this.isExporting = false;
      this.exportSuccess = true;
      setTimeout(() => {
        this.closeExportModal();
      }, 1200);
    }, 1000);
  }

  // Add / Edit Modal
  openAddModal(): void {
    this.isEditing = false;
    this.editingUserId = '';
    this.modalName = '';
    this.modalEmail = '';
    this.modalRole = 'Administrator';
    this.modalAvatar = 'assets/media/avatars/300-6.jpg';
    this.modalTwoStep = false;
    this.modalStatus = 'Active';
    this.isUserModalOpen = true;
    this.activeActionMenuId = null;
  }

  openEditModal(user: ManagedUser): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.modalName = user.name;
    this.modalEmail = user.email;
    this.modalRole = user.role;
    this.modalAvatar = user.avatar || 'assets/media/avatars/300-1.jpg';
    this.modalTwoStep = user.twoStep;
    this.modalStatus = user.status;
    this.isUserModalOpen = true;
    this.activeActionMenuId = null;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
  }

  saveUser(): void {
    if (!this.modalName || !this.modalEmail) return;

    this.isSaving = true;
    setTimeout(() => {
      if (this.isEditing) {
        this.userMgmtService.updateUser(this.editingUserId, {
          name: this.modalName,
          email: this.modalEmail,
          role: this.modalRole,
          avatar: this.modalAvatar,
          twoStep: this.modalTwoStep,
          status: this.modalStatus,
          statusColor: this.modalStatus === 'Active' ? 'success' : this.modalStatus === 'Suspended' ? 'danger' : 'warning'
        });
      } else {
        this.userMgmtService.addUser({
          name: this.modalName,
          email: this.modalEmail,
          role: this.modalRole,
          avatar: this.modalAvatar,
          twoStep: this.modalTwoStep,
          status: this.modalStatus
        });
      }

      this.loadUsers();
      this.isSaving = false;
      this.closeUserModal();
    }, 400);
  }

  // Actions dropdown
  toggleActionMenu(userId: string): void {
    this.activeActionMenuId = this.activeActionMenuId === userId ? null : userId;
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userMgmtService.deleteUser(id);
      this.loadUsers();
    }
  }
}
