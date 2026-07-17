import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeService } from '../../services/employee.service';
import { Department, DepartmentService } from '../../services/department.service';
import { Position, PositionService } from '../../services/position.service';
import { SalaryTemplate } from '../../models/salary-template.model';
import { SalaryTemplateService } from '../../services/salary-template.service';
import { AlertService } from '../../services/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  positions = signal<Position[]>([]);
  salaryTemplates = signal<SalaryTemplate[]>([]);
  users = signal<any[]>([]); // Assuming we can fetch basic users

  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  
  showModal = signal<boolean>(false);
  showUploadModal = signal<boolean>(false);
  selectedFile: File | null = null;
  isEditMode = signal<boolean>(false);
  editingEmployee: Partial<Employee> = {};

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private salaryTemplateService: SalaryTemplateService,
    private alertService: AlertService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    
    // Load lists for dropdowns
    this.departmentService.getAll().subscribe(data => this.departments.set(data));
    this.positionService.getAll().subscribe(data => this.positions.set(data));
    this.salaryTemplateService.getTemplates().subscribe((data: any) => this.salaryTemplates.set(data));
    
    // Fetch users for linking
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(data => this.users.set(data));

    // Fetch employees
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.error('Không thể tải danh sách nhân viên');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.editingEmployee = { 
      employeeCode: '', 
      fullName: '', 
      baseSalary: 0,
      departmentId: null as any,
      positionId: null as any,
      salaryTemplateId: null as any,
      userId: null as any
    };
    this.showModal.set(true);
  }

  openEditModal(item: Employee) {
    this.isEditMode.set(true);
    this.editingEmployee = { ...item };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveEmployee() {
    if (!this.editingEmployee.employeeCode || !this.editingEmployee.fullName) return;

    this.isSubmitting.set(true);
    if (this.isEditMode()) {
      this.employeeService.update(this.editingEmployee.id!, this.editingEmployee as Employee).subscribe({
        next: () => {
          this.alertService.success('Cập nhật nhân viên thành công');
          this.loadData();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi cập nhật');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.employeeService.create(this.editingEmployee as Employee).subscribe({
        next: () => {
          this.alertService.success('Thêm nhân viên thành công');
          this.loadData();
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

  deleteEmployee(id: string) {
    this.alertService.confirm(
      'Bạn có chắc muốn xóa?',
      'Hồ sơ nhân viên này sẽ bị xóa'
    ).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.delete(id).subscribe({
          next: () => {
            this.alertService.success('Xóa thành công');
            this.loadData();
          },
          error: () => {
            this.alertService.error('Không thể xóa nhân viên này');
          }
        });
      }
    });
  }

    });
  }

  openUploadModal() {
    this.selectedFile = null;
    this.showUploadModal.set(true);
  }

  closeUploadModal() {
    this.showUploadModal.set(false);
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  confirmUpload() {
    if (this.selectedFile) {
      this.isSubmitting.set(true);
      this.employeeService.uploadEmployees(this.selectedFile).subscribe({
        next: (res) => {
          this.alertService.success(`Nhập thành công ${res.importedCount} nhân viên`);
          this.loadData();
          this.closeUploadModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi nhập file');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  downloadTemplate() {
    const templateContent = 'Mã NV, Họ Tên, SĐT, Email, Ngày Sinh (YYYY-MM-DD), Lương CB\nNV001, Nguyễn Văn A, 0987654321, nva@example.com, 1990-01-01, 10000000\nNV002, Trần Thị B, 0912345678, ttb@example.com, 1995-05-20, 8500000';
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
