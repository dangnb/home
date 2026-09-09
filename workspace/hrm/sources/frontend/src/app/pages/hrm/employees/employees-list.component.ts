import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { DepartmentService } from '../../../core/hrm/services/department.service';
import { ToastService } from '../../../core/services/toast.service';
import { Employee, Department, CreateEmployeeDto, UpdateEmployeeDto } from '../../../core/hrm/models/hrm.models';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees-list.component.html'
})
export class EmployeesListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);

  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  isLoading = signal<boolean>(false);

  // Filters
  searchTerm = '';
  selectedDepartmentId = '';
  selectedStatus: number | '' = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;

  // Modal State
  isModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  currentEmployeeId: string | null = null;

  // Form Model
  formData = {
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 1,
    departmentId: '',
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    baseSalary: 15000000,
    status: 1
  };

  ngOnInit() {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        if (res.data) this.departments.set(res.data);
      },
      error: () => {}
    });
  }

  loadEmployees() {
    this.isLoading.set(true);
    this.employeeService.getEmployees({
      page: this.currentPage,
      pageSize: this.pageSize,
      departmentId: this.selectedDepartmentId || undefined,
      search: this.searchTerm || undefined,
      status: this.selectedStatus !== '' ? Number(this.selectedStatus) : undefined
    }).subscribe({
      next: (res) => {
        if (res.data) {
          this.employees.set(res.data);
          if (res.meta) {
            this.totalRecords = res.meta.total || res.data.length;
            this.totalPages = res.meta.totalPages || Math.ceil(this.totalRecords / this.pageSize);
          }
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadEmployees();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEmployees();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentEmployeeId = null;
    this.formData = {
      employeeCode: 'EMP' + Math.floor(1000 + Math.random() * 9000),
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '1995-01-01',
      gender: 1,
      departmentId: this.departments().length > 0 ? String(this.departments()[0].id) : '',
      position: 'Chuyên viên',
      hireDate: new Date().toISOString().split('T')[0],
      baseSalary: 15000000,
      status: 1
    };
    this.isModalOpen = true;
  }

  openEditModal(emp: Employee) {
    this.isEditMode = true;
    this.currentEmployeeId = emp.id;
    this.formData = {
      employeeCode: emp.employeeCode,
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone || '',
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
      gender: emp.gender,
      departmentId: emp.departmentId || '',
      position: emp.position || '',
      hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
      baseSalary: emp.baseSalary || 0,
      status: emp.status
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveEmployee() {
    if (!this.formData.fullName.trim() || !this.formData.email.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập họ tên và email nhân viên.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.currentEmployeeId) {
      const dto: UpdateEmployeeDto = {
        fullName: this.formData.fullName.trim(),
        phone: this.formData.phone || undefined,
        dateOfBirth: this.formData.dateOfBirth || undefined,
        gender: Number(this.formData.gender),
        departmentId: this.formData.departmentId || undefined,
        position: this.formData.position || undefined,
        baseSalary: Number(this.formData.baseSalary),
        status: Number(this.formData.status)
      };

      this.employeeService.updateEmployee(this.currentEmployeeId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã cập nhật hồ sơ nhân sự.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadEmployees();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      const dto: CreateEmployeeDto = {
        employeeCode: this.formData.employeeCode.trim(),
        fullName: this.formData.fullName.trim(),
        email: this.formData.email.trim(),
        phone: this.formData.phone || undefined,
        dateOfBirth: this.formData.dateOfBirth || undefined,
        gender: Number(this.formData.gender),
        departmentId: this.formData.departmentId || undefined,
        position: this.formData.position || undefined,
        hireDate: this.formData.hireDate,
        baseSalary: Number(this.formData.baseSalary)
      };

      this.employeeService.createEmployee(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã tạo mới hồ sơ nhân sự thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadEmployees();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteEmployee(emp: Employee) {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân viên "${emp.fullName}" (${emp.employeeCode})?`)) {
      return;
    }

    this.employeeService.deleteEmployee(emp.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa', `Đã xóa nhân viên ${emp.fullName}.`);
        this.loadEmployees();
      },
      error: () => {}
    });
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'badge-light-success';
      case 2: return 'badge-light-warning';
      case 3: return 'badge-light-danger';
      default: return 'badge-light-secondary';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Đang làm việc';
      case 2: return 'Tạm nghỉ';
      case 3: return 'Đã thôi việc';
      default: return 'Chưa rõ';
    }
  }
}
