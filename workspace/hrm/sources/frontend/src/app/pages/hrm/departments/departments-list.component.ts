import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../core/hrm/services/department.service';
import { ToastService } from '../../../core/services/toast.service';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../../../core/hrm/models/hrm.models';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments-list.component.html'
})
export class DepartmentsListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);

  departments = signal<Department[]>([]);
  filteredDepartments = signal<Department[]>([]);
  isLoading = signal<boolean>(false);
  searchTerm = '';
  statusFilter: string = '';

  // Modal state
  isModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  currentDepartmentId: number | string | null = null;

  // Form Model
  formData = {
    code: '',
    name: '',
    description: '',
    status: 'ACTIVE'
  };

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading.set(true);
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        if (res.data) {
          this.departments.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách phòng ban từ máy chủ.');
      }
    });
  }

  applyFilter() {
    let list = this.departments();
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(d => 
        d.name?.toLowerCase().includes(term) || 
        d.code?.toLowerCase().includes(term) ||
        (d.managerName && d.managerName.toLowerCase().includes(term)) ||
        (d.description && d.description.toLowerCase().includes(term))
      );
    }
    if (this.statusFilter) {
      list = list.filter(d => d.status === this.statusFilter);
    }
    this.filteredDepartments.set(list);
  }

  isDeptActive(status?: string): boolean {
    return status === 'ACTIVE' || status === '1';
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentDepartmentId = null;
    this.formData = {
      code: '',
      name: '',
      description: '',
      status: 'ACTIVE'
    };
    this.isModalOpen = true;
  }

  openEditModal(dept: Department) {
    this.isEditMode = true;
    this.currentDepartmentId = dept.id;
    this.formData = {
      code: dept.code,
      name: dept.name,
      description: dept.description || '',
      status: dept.status || 'ACTIVE'
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveDepartment() {
    if (!this.formData.name.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập tên phòng ban.');
      return;
    }

    if (!this.formData.code.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập mã phòng ban.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.currentDepartmentId) {
      const dto: UpdateDepartmentDto = {
        id: this.currentDepartmentId,
        code: this.formData.code.trim().toUpperCase(),
        name: this.formData.name.trim(),
        description: this.formData.description?.trim() || undefined,
        status: this.formData.status
      };

      this.departmentService.updateDepartment(this.currentDepartmentId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã cập nhật thông tin phòng ban thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể cập nhật phòng ban.';
          this.toastService.error('Thất bại', msg);
        }
      });
    } else {
      const dto: CreateDepartmentDto = {
        code: this.formData.code.toUpperCase().trim(),
        name: this.formData.name.trim(),
        description: this.formData.description?.trim() || undefined
      };

      this.departmentService.createDepartment(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Đã thêm phòng ban "${dto.name}" (${dto.code}) thành công.`);
          this.isSubmitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể tạo mới phòng ban.';
          this.toastService.error('Thất bại', msg);
        }
      });
    }
  }

  // Delete Modal State
  isDeleteModalOpen = false;
  departmentToDelete: Department | null = null;
  isDeleting = false;

  openDeleteModal(dept: Department) {
    this.departmentToDelete = dept;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.departmentToDelete = null;
  }

  confirmDelete() {
    if (!this.departmentToDelete) return;
    this.isDeleting = true;
    const dept = this.departmentToDelete;

    this.departmentService.deleteDepartment(dept.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa', `Đã xóa phòng ban "${dept.name}" thành công.`);
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadDepartments();
      },
      error: (err) => {
        this.isDeleting = false;
        const msg = err.error?.message || err.error?.detail || 'Không thể xóa phòng ban.';
        this.toastService.error('Thất bại', msg);
        this.closeDeleteModal();
      }
    });
  }
}
