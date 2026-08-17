import { Component, OnInit, ChangeDetectionStrategy, computed, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';

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
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private cdr = inject(ChangeDetectorRef);

  users: any[] = [];
  roles: any[] = [];

  showModal = false;
  isEditMode = false;
  isSubmitting = false;
  editingUser: any = { id: 0, username: '', password: '', fullName: '', email: '', roles: [], isActive: true, phoneNumber: '', citizenId: '', address: '' };

  searchTerm: string = '';
  activeDropdownRowId: string | null = null;

  // Pagination state
  currentPage = 1;
  pageSize = 5;
  totalUsers = 0;

  // Real data
  allUsers: any[] = [];
  
  selectedRoles: { [key: string]: boolean } = {};

  ngOnInit() {
    this.loadRoles();
    this.loadData();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load roles', err);
      }
    });
  }

  loadData() {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.allUsers = res;
        this.totalUsers = this.allUsers.length;
        this.updatePaginatedUsers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  updatePaginatedUsers() {
    let filtered = this.allUsers;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = this.allUsers.filter(u => 
        u.fullName?.toLowerCase().includes(term) || 
        u.username?.toLowerCase().includes(term) || 
        u.email?.toLowerCase().includes(term)
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

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeDropdownRowId === id) {
      this.activeDropdownRowId = null;
    } else {
      this.activeDropdownRowId = id;
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingUser = { username: '', password: '', fullName: '', email: '', roles: [], isActive: true, phoneNumber: '', citizenId: '', address: '' };
    this.selectedRoles = {};
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.editingUser = { ...user };
    this.selectedRoles = {};
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((r: string) => {
        this.selectedRoles[r] = true;
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  onRoleChange(roleName: string, event: any) {
    if (event.target.checked) {
      this.selectedRoles[roleName] = true;
    } else {
      delete this.selectedRoles[roleName];
    }
  }

  saveUser() {
    if (this.isSubmitting) return;

    const payload = { ...this.editingUser };
    payload.roles = Object.keys(this.selectedRoles).filter(key => this.selectedRoles[key]);

    if (!this.isEditMode && (!payload.username || !payload.password || !payload.fullName)) {
      this.alertService.error('Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode) {
      this.userService.update(this.editingUser.id, payload).subscribe({
        next: () => {
          this.alertService.success('Cập nhật người dùng thành công');
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'Có lỗi xảy ra');
          this.isSubmitting = false;
        }
      });
    } else {
      this.userService.create(payload).subscribe({
        next: () => {
          this.alertService.success('Thêm mới người dùng thành công');
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'Có lỗi xảy ra');
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteUser(id: string) {
    const confirmTitle = this.translateService.instant('COMMON.CONFIRM') || 'Xác nhận';
    const confirmMsg = this.translateService.instant('USERS.CONFIRM_DELETE') || 'Bạn có chắc chắn muốn khóa/xóa User này?';
    this.alertService.confirm(confirmTitle, confirmMsg).then((result: any) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            const successTitle = this.translateService.instant('COMMON.SUCCESS') || 'Thành công';
            const successMsg = this.translateService.instant('USERS.MSG_DELETE_SUCCESS') || 'Đã xóa người dùng thành công.';
            this.alertService.success(successTitle, successMsg);
            this.loadData();
          },
          error: (err) => {
            this.alertService.error('Lỗi khi xóa người dùng');
          }
        });
      }
    });
  }
}
