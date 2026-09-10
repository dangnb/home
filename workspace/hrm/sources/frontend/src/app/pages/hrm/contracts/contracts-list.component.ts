import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeContractService, EmployeeContract, EmployeeContractSummary, CreateEmployeeContractDto, UpdateEmployeeContractDto } from '../../../core/hrm/services/employee-contract.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-contracts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss']
})
export class ContractsListComponent implements OnInit {
  private contractService = inject(EmployeeContractService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  Number = Number;

  items = signal<EmployeeContract[]>([]);
  summary = signal<EmployeeContractSummary>({
    totalContracts: 0,
    activeContracts: 0,
    expiringSoonContracts: 0,
    probationContracts: 0,
    definiteTermContracts: 0,
    indefiniteTermContracts: 0
  });
  employees = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filters
  filterContractType: string = 'ALL';
  filterStatus: string = 'ALL';
  filterKeyword: string = '';
  filterExpiringSoon: boolean = false;

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  // Modal State
  isModalOpen = false;
  isEditing = false;
  editingId: number | null = null;
  isSubmitting = false;

  formData = {
    employeeId: 0,
    contractNumber: '',
    contractType: 2, // 2 = DEFINITE_TERM
    signDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    basicSalary: 10000000,
    insuranceSalary: 5000000,
    status: 1, // 1 = ACTIVE
    note: '',
    attachmentUrl: ''
  };

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownId.set(null);
  }

  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.openDropdownId() === id) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(id);
    }
  }

  closeDropdown() {
    this.openDropdownId.set(null);
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadSummary();
    this.loadItems();
  }

  loadEmployees() {
    this.employeeService.getEmployees({ pageSize: 100 }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.employees.set(res.data);
        }
      },
      error: () => {}
    });
  }

  loadSummary() {
    this.contractService.getSummary().subscribe({
      next: (res) => {
        if (res) this.summary.set(res);
      },
      error: () => {}
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.contractService.getContracts({
      page: this.currentPage,
      pageSize: this.pageSize,
      contractType: this.filterContractType !== 'ALL' ? this.filterContractType : undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      isExpiringSoon: this.filterExpiringSoon ? true : undefined,
      keyword: this.filterKeyword ? this.filterKeyword : undefined
    }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.items.set(res.data);
          if (res.pagination) {
            this.totalCount = res.pagination.totalCount;
            this.totalPages = res.pagination.totalPages;
          } else {
            this.totalCount = res.data.length;
            this.totalPages = 1;
          }
        } else {
          this.items.set([]);
          this.totalCount = 0;
          this.totalPages = 1;
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách hợp đồng lao động.');
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadItems();
  }

  toggleExpiringSoonFilter() {
    this.filterExpiringSoon = !this.filterExpiringSoon;
    this.applyFilter();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadItems();
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal Actions
  openCreateModal() {
    this.isEditing = false;
    this.editingId = null;
    const empId = this.employees().length > 0 ? this.employees()[0].id : 0;
    
    // Auto set endDate to 1 year from startDate for Definite-term
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    this.formData = {
      employeeId: empId,
      contractNumber: '',
      contractType: 2,
      signDate: today.toISOString().split('T')[0],
      startDate: today.toISOString().split('T')[0],
      endDate: nextYear.toISOString().split('T')[0],
      basicSalary: 10000000,
      insuranceSalary: 5000000,
      status: 1,
      note: '',
      attachmentUrl: ''
    };
    this.isModalOpen = true;
  }

  openEditModal(item: EmployeeContract) {
    this.isEditing = true;
    this.editingId = item.id;
    this.formData = {
      employeeId: item.employeeId,
      contractNumber: item.contractNumber,
      contractType: this.getContractTypeNumeric(item.contractType),
      signDate: item.signDate,
      startDate: item.startDate,
      endDate: item.endDate || '',
      basicSalary: item.basicSalary,
      insuranceSalary: item.insuranceSalary,
      status: this.getStatusNumeric(item.status),
      note: item.note || '',
      attachmentUrl: item.attachmentUrl || ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveContract() {
    if (!this.formData.employeeId || this.formData.employeeId <= 0) {
      this.toastService.warning('Cảnh báo', 'Vui lòng chọn nhân viên ký hợp đồng.');
      return;
    }

    if (!this.formData.startDate) {
      this.toastService.warning('Cảnh báo', 'Vui lòng chọn ngày bắt đầu hợp đồng.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditing && this.editingId) {
      const dto: UpdateEmployeeContractDto = {
        contractType: Number(this.formData.contractType),
        signDate: this.formData.signDate,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate ? this.formData.endDate : undefined,
        basicSalary: Number(this.formData.basicSalary),
        insuranceSalary: Number(this.formData.insuranceSalary),
        status: Number(this.formData.status),
        note: this.formData.note,
        attachmentUrl: this.formData.attachmentUrl
      };

      this.contractService.updateContract(this.editingId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã cập nhật hợp đồng lao động thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể cập nhật hợp đồng.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else {
      const dto: CreateEmployeeContractDto = {
        employeeId: Number(this.formData.employeeId),
        contractNumber: this.formData.contractNumber ? this.formData.contractNumber.trim() : undefined,
        contractType: Number(this.formData.contractType),
        signDate: this.formData.signDate,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate ? this.formData.endDate : undefined,
        basicSalary: Number(this.formData.basicSalary),
        insuranceSalary: Number(this.formData.insuranceSalary),
        note: this.formData.note,
        attachmentUrl: this.formData.attachmentUrl
      };

      this.contractService.createContract(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã tạo mới hợp đồng lao động thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể tạo mới hợp đồng.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  deleteContract(item: EmployeeContract) {
    if (confirm(`Bạn có chắc chắn muốn xóa hợp đồng "${item.contractNumber}" của nhân viên ${item.employeeName}?`)) {
      this.contractService.deleteContract(item.id).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Đã xóa hợp đồng ${item.contractNumber}.`);
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          const msg = err.error?.message || 'Không thể xóa hợp đồng.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  // Label & Badge Helpers
  getContractTypeLabel(type: string): string {
    switch (type) {
      case 'PROBATION': return 'Thử việc';
      case 'DEFINITE_TERM': return 'Xác định thời hạn';
      case 'INDEFINITE_TERM': return 'Không xác định thời hạn';
      case 'INTERNSHIP': return 'Học việc / Thực tập';
      case 'ADDENDUM': return 'Phụ lục hợp đồng';
      default: return type;
    }
  }

  getContractTypeBadgeClass(type: string): string {
    switch (type) {
      case 'PROBATION': return 'badge-light-info text-info';
      case 'DEFINITE_TERM': return 'badge-light-primary text-primary';
      case 'INDEFINITE_TERM': return 'badge-light-success text-success';
      case 'INTERNSHIP': return 'badge-light-warning text-warning';
      case 'ADDENDUM': return 'badge-light-secondary text-secondary';
      default: return 'badge-light-primary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-light-success text-success';
      case 'EXPIRING_SOON': return 'badge-light-warning text-warning';
      case 'EXPIRED': return 'badge-light-danger text-danger';
      case 'TERMINATED': return 'badge-light-secondary text-secondary';
      default: return 'badge-light-primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Đang hiệu lực';
      case 'EXPIRING_SOON': return 'Sắp hết hạn';
      case 'EXPIRED': return 'Đã hết hạn';
      case 'TERMINATED': return 'Đã chấm dứt';
      default: return status;
    }
  }

  getContractTypeNumeric(type: string): number {
    switch (type) {
      case 'PROBATION': return 1;
      case 'DEFINITE_TERM': return 2;
      case 'INDEFINITE_TERM': return 3;
      case 'INTERNSHIP': return 4;
      case 'ADDENDUM': return 5;
      default: return 2;
    }
  }

  getStatusNumeric(status: string): number {
    switch (status) {
      case 'ACTIVE': return 1;
      case 'EXPIRING_SOON': return 2;
      case 'EXPIRED': return 3;
      case 'TERMINATED': return 4;
      default: return 1;
    }
  }

  formatCurrency(val?: number): string {
    if (!val) return '0 ₫';
    return val.toLocaleString('vi-VN') + ' ₫';
  }
}
