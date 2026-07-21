import { Component, OnInit, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, PaginationComponent, ModalComponent, TranslatePipe],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private alertService = inject(AlertService);
  private translateService = inject(TranslateService);
  users: any[] = [];
  roles: any[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Cashier' }
  ];

  showModal = false;
  isEditMode = false;
  isSubmitting = false;
  editingUser: any = { id: 0, username: '', fullName: '', email: '', roleId: 0, isActive: true, phoneNumber: '', citizenId: '', address: '' };

  searchTerm: string = '';
  activeDropdownRowId: number | null = null;

  // Pagination state
  currentPage = 1;
  pageSize = 5;
  totalUsers = 0;

  // Mock data until Users API is fully connected
  mockUsers = [
    { id: 1, username: 'admin', fullName: 'System Admin', email: 'admin@taphoa.com', roleId: 1, isActive: true },
    { id: 2, username: 'dat.dao', fullName: 'Đào Tiến Đạt', email: 'dat@taphoa.com', roleId: 2, isActive: true },
    { id: 3, username: 'thu ngân 1', fullName: 'Nhân viên 1', email: 'nv1@taphoa.com', roleId: 3, isActive: true }
  ];

  ngOnInit() {
    // Generate some extra mock users for pagination demo
    const generated = Array.from({ length: 22 }, (_, i) => ({
      id: i + 4, username: `user${i}`, fullName: `Nhân viên ${i + 4}`, email: `nv${i + 4}@taphoa.com`, roleId: 3, isActive: true
    }));
    this.mockUsers = [...this.mockUsers, ...generated];

    this.totalUsers = this.mockUsers.length;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    let filtered = this.mockUsers;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = this.mockUsers.filter(u => 
        u.fullName.toLowerCase().includes(term) || 
        u.username.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }
    
    this.totalUsers = filtered.length;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.users = filtered.slice(start, end);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.updatePaginatedUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePaginatedUsers();
  }

  toggleDropdown(id: number, event: Event) {
    event.stopPropagation();
    if (this.activeDropdownRowId === id) {
      this.activeDropdownRowId = null;
    } else {
      this.activeDropdownRowId = id;
    }
  }

  getRoleName(roleId: string) {
    return this.roles.find(r => r.id == roleId)?.name || 'N/A';
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingUser = { id: 0, username: '', fullName: '', email: '', roleId: this.roles[0]?.id, isActive: true, phoneNumber: '', citizenId: '', address: '' };
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.editingUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  saveUser() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Simulate API delay
    setTimeout(() => {
      if (this.isEditMode) {
        const index = this.mockUsers.findIndex(u => u.id === this.editingUser.id);
        if (index > -1) {
          this.mockUsers[index] = { ...this.editingUser };
        }
      } else {
        this.editingUser.id = Math.max(0, ...this.mockUsers.map(u => u.id)) + 1;
        this.mockUsers.unshift({ ...this.editingUser }); // add to top
      }

      this.updatePaginatedUsers();
      this.closeModal();
    }, 300);
  }

  deleteUser(id: string) {
    const confirmTitle = this.translateService.instant('COMMON.CONFIRM') || 'Xác nhận';
    const confirmMsg = this.translateService.instant('USERS.CONFIRM_DELETE') || 'Bạn có chắc chắn muốn khóa/xóa User này?';
    this.alertService.confirm(confirmTitle, confirmMsg).then((result: any) => {
      if (result.isConfirmed) {
        this.mockUsers = this.mockUsers.filter(u => u.id !== (id as any));

        // Prevent current page from being empty if possible
        const maxPage = Math.ceil(this.mockUsers.length / this.pageSize);
        if (this.currentPage > maxPage && maxPage > 0) {
          this.currentPage = maxPage;
        }

        this.updatePaginatedUsers();
        const successTitle = this.translateService.instant('COMMON.SUCCESS') || 'Thành công';
        const successMsg = this.translateService.instant('USERS.MSG_DELETE_SUCCESS') || 'Đã xóa người dùng thành công.';
        this.alertService.success(successTitle, successMsg);
      }
    });
  }
}
