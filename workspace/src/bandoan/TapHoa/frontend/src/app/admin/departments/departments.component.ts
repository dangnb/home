import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department, DepartmentService } from '../../services/department.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments = signal<Department[]>([]);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  
  showModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingDepartment: Partial<Department> = {};

  constructor(
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading.set(true);
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.error('Không thể tải danh sách phòng ban');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.editingDepartment = { name: '', description: '', parentId: null as any };
    this.showModal.set(true);
  }

  openEditModal(item: Department) {
    this.isEditMode.set(true);
    this.editingDepartment = { ...item };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveDepartment() {
    if (!this.editingDepartment.name) return;

    this.isSubmitting.set(true);
    if (this.isEditMode()) {
      this.departmentService.update(this.editingDepartment.id!, this.editingDepartment as Department).subscribe({
        next: () => {
          this.alertService.success('Cập nhật phòng ban thành công');
          this.loadDepartments();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi cập nhật');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.departmentService.create(this.editingDepartment as Department).subscribe({
        next: () => {
          this.alertService.success('Thêm phòng ban thành công');
          this.loadDepartments();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi thêm mới');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deleteDepartment(id: string) {
    this.alertService.confirm(
      'Bạn có chắc muốn xóa?',
      'Phòng ban này sẽ bị xóa khỏi hệ thống'
    ).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.delete(id).subscribe({
          next: () => {
            this.alertService.success('Xóa thành công');
            this.loadDepartments();
          },
          error: () => {
            this.alertService.error('Không thể xóa phòng ban này');
          }
        });
      }
    });
  }
}
