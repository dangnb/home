import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementService } from '../../../core/services/user-management.service';
import { ToastService } from '../../../core/services/toast.service';
import { ManagedUser, CreateUserDto, UpdateUserDto, RoleOption } from '../../../core/models/user-management.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  private userMgmtService = inject(UserManagementService);
  private toastService = inject(ToastService);

  users = signal<ManagedUser[]>([]);
  filteredUsers = signal<ManagedUser[]>([]);
  roles = signal<RoleOption[]>([]);
  isLoading = signal<boolean>(false);

  searchTerm = '';
  selectedRole = 'All';
  selectedStatus = 'All';

  // Filter Dropdown Popover
  isFilterMenuOpen = false;

  // Row Action Dropdown
  activeActionMenuId: string | number | null = null;

  @HostListener('document:click')
  onDocumentClick() {
    this.activeActionMenuId = null;
  }

  toggleActionMenu(id: string | number, event?: Event) {
    if (event) event.stopPropagation();
    this.activeActionMenuId = this.activeActionMenuId === id ? null : id;
  }

  // Add / Edit Modal state
  isUserModalOpen = false;
  isEditing = false;
  editingUserId: number | string | null = null;
  isSaving = false;

  formData = {
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    roleId: 4,
    status: 'ACTIVE'
  };

  // Delete Modal state
  isDeleteModalOpen = false;
  userToDelete: ManagedUser | null = null;
  isDeleting = false;

  // Pagination state
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadRoles(): void {
    this.userMgmtService.getRoles().subscribe({
      next: (res) => {
        if (res.data) {
          this.roles.set(res.data);
        }
      },
      error: () => {}
    });
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userMgmtService.getUsers({
      search: this.searchTerm,
      role: this.selectedRole,
      status: this.selectedStatus,
      page: this.currentPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.users.set(res.data);
          this.filteredUsers.set(res.data);
          if (res.pagination) {
            this.totalCount = res.pagination.totalCount;
            this.totalPages = res.pagination.totalPages;
          } else {
            this.totalCount = res.data.length;
            this.totalPages = 1;
          }
        } else {
          this.users.set([]);
          this.filteredUsers.set([]);
          this.totalCount = 0;
          this.totalPages = 1;
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách người dùng từ hệ thống.');
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  onPageSizeChange(size?: number): void {
    if (size) {
      this.pageSize = size;
    }
    this.currentPage = 1;
    this.loadUsers();
  }

  // --- Add / Edit User ---

  openAddModal(): void {
    this.isEditing = false;
    this.editingUserId = null;
    this.formData = {
      username: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      roleId: this.roles().length > 0 ? this.roles()[this.roles().length - 1].id : 4,
      status: 'ACTIVE'
    };
    this.isUserModalOpen = true;
    this.activeActionMenuId = null;
  }

  openEditModal(user: ManagedUser): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.formData = {
      username: user.username,
      fullName: user.fullName || user.name,
      email: user.email,
      phone: user.phone || '',
      password: '', // Để trống nếu không đổi
      roleId: user.roleId || 4,
      status: user.status || 'ACTIVE'
    };
    this.isUserModalOpen = true;
    this.activeActionMenuId = null;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
  }

  saveUser(): void {
    if (!this.formData.fullName.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập họ và tên người dùng.');
      return;
    }

    if (!this.isEditing && !this.formData.username.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập tên đăng nhập.');
      return;
    }

    if (!this.formData.email.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập địa chỉ email.');
      return;
    }

    if (!this.isEditing && (!this.formData.password || this.formData.password.length < 6)) {
      this.toastService.warning('Mật khẩu yếu', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    this.isSaving = true;

    if (this.isEditing && this.editingUserId) {
      const dto: UpdateUserDto = {
        id: this.editingUserId,
        fullName: this.formData.fullName.trim(),
        email: this.formData.email.trim().toLowerCase(),
        phone: this.formData.phone?.trim() || undefined,
        password: this.formData.password?.trim() || undefined,
        roleId: Number(this.formData.roleId),
        status: this.formData.status
      };

      this.userMgmtService.updateUser(this.editingUserId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã cập nhật thông tin người dùng thành công.');
          this.isSaving = false;
          this.closeUserModal();
          this.loadUsers();
        },
        error: (err) => {
          this.isSaving = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể cập nhật thông tin người dùng.';
          this.toastService.error('Thất bại', msg);
        }
      });
    } else {
      const dto: CreateUserDto = {
        username: this.formData.username.trim().toLowerCase(),
        email: this.formData.email.trim().toLowerCase(),
        fullName: this.formData.fullName.trim(),
        password: this.formData.password.trim(),
        phone: this.formData.phone?.trim() || undefined,
        roleId: Number(this.formData.roleId),
        status: this.formData.status
      };

      this.userMgmtService.createUser(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Đã tạo tài khoản người dùng "${dto.username}" thành công.`);
          this.isSaving = false;
          this.closeUserModal();
          this.loadUsers();
        },
        error: (err) => {
          this.isSaving = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể tạo mới tài khoản người dùng.';
          this.toastService.error('Thất bại', msg);
        }
      });
    }
  }

  // --- Delete User ---

  openDeleteModal(user: ManagedUser): void {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
    this.activeActionMenuId = null;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;
    this.isDeleting = true;
    const user = this.userToDelete;

    this.userMgmtService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa', `Đã xóa tài khoản "${user.username}" (${user.name}) thành công.`);
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (err) => {
        this.isDeleting = false;
        const msg = err.error?.message || err.error?.detail || 'Không thể xóa tài khoản người dùng.';
        this.toastService.error('Thất bại', msg);
        this.closeDeleteModal();
      }
    });
  }

  // --- Badge Helpers ---

  getRoleBadgeClass(roleCode?: string): string {
    switch (roleCode?.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'badge-light-danger';
      case 'TENANT_ADMIN':
      case 'ADMINISTRATOR':
        return 'badge-light-primary';
      case 'HR_MANAGER':
        return 'badge-light-info';
      case 'DEVELOPER':
        return 'badge-light-warning';
      case 'EMPLOYEE':
      default:
        return 'badge-light-success';
    }
  }

  isUserActive(status?: string): boolean {
    return status === 'ACTIVE' || status === 'Active' || status === '1';
  }
}
