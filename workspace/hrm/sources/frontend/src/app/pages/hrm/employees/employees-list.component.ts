import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { DepartmentService } from '../../../core/hrm/services/department.service';
import { ToastService } from '../../../core/services/toast.service';
import { 
  Employee, 
  Department, 
  CreateEmployeeDto, 
  UpdateEmployeeDto, 
  ImportEmployeeItemDto 
} from '../../../core/hrm/models/hrm.models';

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

  // Data signals
  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  isLoading = signal<boolean>(false);

  // Filters
  searchTerm = '';
  selectedDepartmentId = '';
  selectedStatus = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 1;

  // Active Dropdown state
  activeDropdownId: number | string | null = null;

  // Create / Edit Modal State
  isModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  currentEmployeeId: number | string | null = null;

  // Delete Modal State
  isDeleteModalOpen = false;
  deletingEmployee: Employee | null = null;

  // Excel Import Modal State
  isImportModalOpen = false;
  isImporting = false;
  importFileName = '';
  importItems: ImportEmployeeItemDto[] = [];
  importValidCount = 0;
  importInvalidCount = 0;

  // Form Model for Single Create/Edit
  formData = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    departmentId: '',
    managerId: '',
    jobTitle: '',
    gender: 'MALE',
    dateOfBirth: '',
    idCardNumber: '',
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE'
  };

  @HostListener('document:click')
  onDocumentClick() {
    this.activeDropdownId = null;
  }

  ngOnInit() {
    this.loadDepartments();
    this.loadEmployees();
  }

  toggleDropdown(id: number | string, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        if (res.data) {
          this.departments.set(res.data);
        }
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
      keyword: this.searchTerm || undefined,
      status: this.selectedStatus || undefined
    }).subscribe({
      next: (res) => {
        if (res.data) {
          this.employees.set(res.data);
          const pagination = (res as any).pagination || res.meta;
          if (pagination) {
            this.totalRecords = pagination.totalCount ?? pagination.total ?? res.data.length;
            this.totalPages = pagination.totalPages || Math.ceil(this.totalRecords / this.pageSize) || 1;
          } else {
            this.totalRecords = res.data.length;
            this.totalPages = 1;
          }
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi tải dữ liệu', 'Không thể tải danh sách hồ sơ nhân sự.');
      }
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

  // --- Single Employee CRUD Operations ---
  openCreateModal() {
    this.isEditMode = false;
    this.currentEmployeeId = null;
    this.formData = {
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      departmentId: this.departments().length > 0 ? String(this.departments()[0].id) : '',
      managerId: '',
      jobTitle: 'Nhân viên',
      gender: 'MALE',
      dateOfBirth: '1995-01-01',
      idCardNumber: '',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    this.isModalOpen = true;
  }

  openEditModal(emp: Employee) {
    this.isEditMode = true;
    this.currentEmployeeId = emp.id;
    this.formData = {
      username: emp.username || '',
      email: emp.email || '',
      password: '',
      fullName: emp.fullName || '',
      phone: emp.phone || '',
      departmentId: emp.departmentId ? String(emp.departmentId) : '',
      managerId: emp.managerId ? String(emp.managerId) : '',
      jobTitle: emp.jobTitle || emp.position || '',
      gender: String(emp.gender || 'MALE'),
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
      idCardNumber: emp.idCardNumber || '',
      joinedDate: (emp.joinedDate || emp.hireDate) ? (emp.joinedDate || emp.hireDate)!.split('T')[0] : '',
      status: String(emp.status || 'ACTIVE')
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveEmployee() {
    if (!this.formData.fullName.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập họ và tên nhân viên.');
      return;
    }

    if (!this.isEditMode && !this.formData.username.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập tên đăng nhập.');
      return;
    }

    if (!this.isEditMode && !this.formData.email.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập email công việc.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.currentEmployeeId) {
      const dto: UpdateEmployeeDto = {
        id: this.currentEmployeeId,
        fullName: this.formData.fullName.trim(),
        phone: this.formData.phone ? this.formData.phone.trim() : undefined,
        departmentId: this.formData.departmentId ? Number(this.formData.departmentId) : undefined,
        managerId: this.formData.managerId ? Number(this.formData.managerId) : undefined,
        jobTitle: this.formData.jobTitle.trim() || 'Nhân viên',
        gender: this.formData.gender,
        dateOfBirth: this.formData.dateOfBirth || undefined,
        idCardNumber: this.formData.idCardNumber ? this.formData.idCardNumber.trim() : undefined,
        joinedDate: this.formData.joinedDate || undefined
      };

      this.employeeService.updateEmployee(this.currentEmployeeId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Cập nhật hồ sơ nhân sự thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || 'Cập nhật thất bại.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else {
      const dto: CreateEmployeeDto = {
        username: this.formData.username.trim().toLowerCase(),
        email: this.formData.email.trim().toLowerCase(),
        password: this.formData.password.trim() || '123456',
        fullName: this.formData.fullName.trim(),
        phone: this.formData.phone ? this.formData.phone.trim() : undefined,
        departmentId: this.formData.departmentId ? Number(this.formData.departmentId) : undefined,
        managerId: this.formData.managerId ? Number(this.formData.managerId) : undefined,
        jobTitle: this.formData.jobTitle.trim() || 'Nhân viên',
        gender: this.formData.gender,
        dateOfBirth: this.formData.dateOfBirth || undefined,
        idCardNumber: this.formData.idCardNumber ? this.formData.idCardNumber.trim() : undefined,
        joinedDate: this.formData.joinedDate || undefined
      };

      this.employeeService.createEmployee(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Thêm mới hồ sơ nhân sự thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || 'Thêm mới thất bại.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  openDeleteModal(emp: Employee) {
    this.deletingEmployee = emp;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.deletingEmployee = null;
  }

  confirmDelete() {
    if (!this.deletingEmployee) return;

    this.employeeService.deleteEmployee(this.deletingEmployee.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa', `Đã xóa hồ sơ nhân viên "${this.deletingEmployee?.fullName}".`);
        this.closeDeleteModal();
        this.loadEmployees();
      },
      error: (err) => {
        const msg = err.error?.message || 'Xóa hồ sơ nhân sự thất bại.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Excel Import Functionality ---
  openImportModal() {
    this.isImportModalOpen = true;
    this.importFileName = '';
    this.importItems = [];
    this.importValidCount = 0;
    this.importInvalidCount = 0;
  }

  closeImportModal() {
    this.isImportModalOpen = false;
    this.importItems = [];
  }

  downloadTemplate() {
    const templateData = [
      {
        'STT': 1,
        'Họ và tên (*)': 'Nguyễn Văn Minh',
        'Tên đăng nhập': 'minh.nguyen',
        'Email (*)': 'minh.nguyen@company.com',
        'Mật khẩu': '123456',
        'Số điện thoại': '0912345678',
        'Chức danh (*)': 'Kỹ sư phần mềm Senior',
        'Phòng ban': this.departments().length > 0 ? this.departments()[0].name : 'Phòng Kỹ Thuật',
        'Giới tính (Nam/Nu/Khac)': 'Nam',
        'Ngày sinh (YYYY-MM-DD)': '1992-05-15',
        'Số CCCD': '001092001234',
        'Ngày vào làm (YYYY-MM-DD)': '2024-01-15'
      },
      {
        'STT': 2,
        'Họ và tên (*)': 'Trần Thị Thu Hà',
        'Tên đăng nhập': 'ha.tran',
        'Email (*)': 'ha.tran@company.com',
        'Mật khẩu': '123456',
        'Số điện thoại': '0987654321',
        'Chức danh (*)': 'Chuyên viên Nhân sự',
        'Phòng ban': this.departments().length > 1 ? this.departments()[1].name : 'Phòng Nhân Sự',
        'Giới tính (Nam/Nu/Khac)': 'Nu',
        'Ngày sinh (YYYY-MM-DD)': '1995-10-20',
        'Số CCCD': '001195009876',
        'Ngày vào làm (YYYY-MM-DD)': '2024-03-01'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },  // STT
      { wch: 24 }, // Họ và tên
      { wch: 18 }, // Tên đăng nhập
      { wch: 28 }, // Email
      { wch: 12 }, // Mật khẩu
      { wch: 15 }, // Số điện thoại
      { wch: 26 }, // Chức danh
      { wch: 24 }, // Phòng ban
      { wch: 22 }, // Giới tính
      { wch: 24 }, // Ngày sinh
      { wch: 18 }, // Số CCCD
      { wch: 26 }  // Ngày vào làm
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhan_Su');
    XLSX.writeFile(workbook, 'mau_nhap_lieu_nhan_su.xlsx');

    this.toastService.info('Tải file mẫu', 'Đã tải xuống file mẫu mau_nhap_lieu_nhan_su.xlsx.');
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    this.importFileName = file.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        this.parseAndValidateImportData(rawData);
      } catch (err) {
        this.toastService.error('Lỗi định dạng', 'Không thể đọc file Excel. Vui lòng kiểm tra định dạng.');
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input value
    event.target.value = '';
  }

  parseAndValidateImportData(rawData: any[]) {
    if (!rawData || rawData.length === 0) {
      this.toastService.warning('File rỗng', 'File Excel không có dòng dữ liệu nào.');
      this.importItems = [];
      return;
    }

    const items: ImportEmployeeItemDto[] = [];
    let validCount = 0;
    let invalidCount = 0;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];

      // Extract values with flexible key naming
      const fullName = (row['Họ và tên (*)'] || row['Họ và tên'] || row['FullName'] || row['fullName'] || '').toString().trim();
      const email = (row['Email (*)'] || row['Email'] || row['email'] || '').toString().trim();
      const username = (row['Tên đăng nhập'] || row['Username'] || row['username'] || '').toString().trim();
      const password = (row['Mật khẩu'] || row['Password'] || row['password'] || '123456').toString().trim();
      const phone = (row['Số điện thoại'] || row['Phone'] || row['phone'] || '').toString().trim();
      const jobTitle = (row['Chức danh (*)'] || row['Chức danh'] || row['Vị trí'] || row['JobTitle'] || row['jobTitle'] || 'Nhân viên').toString().trim();
      const departmentName = (row['Phòng ban'] || row['Department'] || row['departmentName'] || '').toString().trim();
      
      const rawGender = (row['Giới tính (Nam/Nu/Khac)'] || row['Giới tính'] || row['Gender'] || '').toString().trim().toUpperCase();
      let gender = 'OTHER';
      if (rawGender === 'NAM' || rawGender === 'MALE' || rawGender === '1') {
        gender = 'MALE';
      } else if (rawGender === 'NU' || rawGender === 'NỮ' || rawGender === 'FEMALE' || rawGender === '2') {
        gender = 'FEMALE';
      }

      // Format dates (handle Date objects or strings)
      let dateOfBirth = this.formatDateCell(row['Ngày sinh (YYYY-MM-DD)'] || row['Ngày sinh'] || row['DateOfBirth']);
      let joinedDate = this.formatDateCell(row['Ngày vào làm (YYYY-MM-DD)'] || row['Ngày vào làm'] || row['JoinedDate']);
      const idCardNumber = (row['Số CCCD'] || row['CCCD'] || row['IdCardNumber'] || '').toString().trim();

      // Validation
      const errors: string[] = [];
      if (!fullName) {
        errors.push('Thiếu họ tên');
      }
      if (!email) {
        errors.push('Thiếu email');
      } else if (!emailRegex.test(email)) {
        errors.push('Email không đúng định dạng');
      }

      const isValid = errors.length === 0;
      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
      }

      items.push({
        fullName,
        email,
        username: username || undefined,
        password: password || '123456',
        phone: phone || undefined,
        jobTitle: jobTitle || 'Nhân viên',
        departmentName: departmentName || undefined,
        gender,
        dateOfBirth: dateOfBirth || undefined,
        idCardNumber: idCardNumber || undefined,
        joinedDate: joinedDate || undefined,
        validationStatus: isValid ? 'VALID' : 'INVALID',
        validationMessage: errors.join(', ')
      });
    }

    this.importItems = items;
    this.importValidCount = validCount;
    this.importInvalidCount = invalidCount;
  }

  private formatDateCell(val: any): string | undefined {
    if (!val) return undefined;
    if (val instanceof Date) {
      return val.toISOString().split('T')[0];
    }
    const str = val.toString().trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }
    // Handle DD/MM/YYYY
    const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      return `${year}-${month}-${day}`;
    }
    return str;
  }

  submitImport() {
    const validItems = this.importItems.filter(item => item.validationStatus === 'VALID');
    if (validItems.length === 0) {
      this.toastService.warning('Chưa có dữ liệu hợp lệ', 'Không có bản ghi nhân sự nào hợp lệ để nhập vào hệ thống.');
      return;
    }

    this.isImporting = true;
    this.employeeService.importEmployees(validItems).subscribe({
      next: (res) => {
        this.isImporting = false;
        const data = res.data;
        const msg = `Đã nhập thành công ${data.successCount} nhân sự. Thất bại: ${data.failureCount}.`;
        if (data.failureCount > 0 && data.errors?.length > 0) {
          this.toastService.warning('Hoàn tất có cảnh báo', `${msg} Lỗi: ${data.errors[0]}`);
        } else {
          this.toastService.success('Thành công', msg);
        }
        this.closeImportModal();
        this.loadEmployees();
      },
      error: (err) => {
        this.isImporting = false;
        const msg = err.error?.message || 'Có lỗi xảy ra khi nhập dữ liệu nhân sự.';
        this.toastService.error('Lỗi import', msg);
      }
    });
  }

  // --- UI Helpers ---
  getStatusBadgeClass(status: string | number): string {
    const s = String(status).toUpperCase();
    if (s === 'ACTIVE' || s === '1') return 'badge-light-success text-success';
    if (s === 'INACTIVE' || s === '2') return 'badge-light-warning text-warning';
    if (s === 'DELETED' || s === '3') return 'badge-light-danger text-danger';
    return 'badge-light-secondary text-secondary';
  }

  getStatusText(status: string | number): string {
    const s = String(status).toUpperCase();
    if (s === 'ACTIVE' || s === '1') return 'Đang làm việc';
    if (s === 'INACTIVE' || s === '2') return 'Tạm nghỉ';
    if (s === 'DELETED' || s === '3') return 'Đã thôi việc';
    return 'Chưa rõ';
  }

  getGenderText(gender: string | number): string {
    const g = String(gender).toUpperCase();
    if (g === 'MALE' || g === '1') return 'Nam';
    if (g === 'FEMALE' || g === '2') return 'Nữ';
    return 'Khác';
  }

  getInitials(name: string): string {
    if (!name) return 'NV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
