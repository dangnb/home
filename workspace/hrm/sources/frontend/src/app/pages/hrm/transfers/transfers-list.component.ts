import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeTransferService, EmployeeTransfer, EmployeeTransferSummary, CreateEmployeeTransferDto } from '../../../core/hrm/services/employee-transfer.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { DepartmentService } from '../../../core/hrm/services/department.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-transfers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './transfers-list.component.html',
  styleUrls: ['./transfers-list.component.scss']
})
export class TransfersListComponent implements OnInit {
  private transferService = inject(EmployeeTransferService);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);
  private notificationService = inject(NotificationService);

  items = signal<EmployeeTransfer[]>([]);
  summary = signal<EmployeeTransferSummary>({
    totalTransfers: 0,
    pendingTransfers: 0,
    approvedTransfers: 0,
    rejectedTransfers: 0,
    departmentTransfers: 0,
    promotions: 0
  });
  employees = signal<any[]>([]);
  departments = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filters
  filterChangeType: string = 'ALL';
  filterApprovalStatus: string = 'ALL';
  filterKeyword: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  // Modal State
  isModalOpen = false;
  isSubmitting = false;

  // Approve Modal State
  isApproveModalOpen = false;
  selectedTransferForApprove: EmployeeTransfer | null = null;
  approveNote = '';
  isApproving = false;

  // Reject Modal State
  isRejectModalOpen = false;
  selectedTransferForReject: EmployeeTransfer | null = null;
  rejectReason = '';
  isRejecting = false;

  // View Modal State
  isViewModalOpen = false;
  selectedTransferForView: EmployeeTransfer | null = null;

  formData = {
    employeeId: 0,
    decisionNumber: '',
    changeType: 1, // 1 = DEPARTMENT_TRANSFER
    newDepartmentId: 0,
    newJobTitle: '',
    newManagerId: 0,
    effectiveDate: new Date().toISOString().split('T')[0],
    note: ''
  };

  selectedEmployeeInfo: any = null;

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
    this.loadDepartments();
    this.loadSummary();
    this.loadItems();
  }

  loadEmployees() {
    this.employeeService.getEmployeeLookup({ limit: 500 }).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.employees.set(res);
        } else if (res && res.data) {
          this.employees.set(res.data);
        }
      },
      error: () => { }
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.departments.set(res.data);
        }
      },
      error: () => { }
    });
  }

  loadSummary() {
    this.transferService.getSummary().subscribe({
      next: (res) => {
        if (res) this.summary.set(res);
      },
      error: () => { }
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.transferService.getTransfers({
      page: this.currentPage,
      pageSize: this.pageSize,
      changeType: this.filterChangeType !== 'ALL' ? this.filterChangeType : undefined,
      approvalStatus: this.filterApprovalStatus !== 'ALL' ? this.filterApprovalStatus : undefined,
      keyword: this.filterKeyword ? this.filterKeyword : undefined,
      fromDate: this.filterFromDate || undefined,
      toDate: this.filterToDate || undefined
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
        this.toastService.error('Lỗi', 'Không thể tải danh sách lệnh điều động.');
      }
    });
  }

  isAdvancedFilterOpen = signal<boolean>(false);

  toggleAdvancedFilter() {
    this.isAdvancedFilterOpen.update(val => !val);
  }

  get activeAdvancedFilterCount(): number {
    let count = 0;
    if (this.filterChangeType !== 'ALL') count++;
    if (this.filterApprovalStatus !== 'ALL') count++;
    if (this.filterFromDate) count++;
    if (this.filterToDate) count++;
    return count;
  }

  clearSingleFilter(type: string) {
    if (type === 'changeType') this.filterChangeType = 'ALL';
    if (type === 'approvalStatus') this.filterApprovalStatus = 'ALL';
    if (type === 'fromDate') this.filterFromDate = '';
    if (type === 'toDate') this.filterToDate = '';
    if (type === 'keyword') this.filterKeyword = '';
    this.applyFilter();
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadItems();
  }

  resetFilters() {
    this.filterChangeType = 'ALL';
    this.filterApprovalStatus = 'ALL';
    this.filterKeyword = '';
    this.filterFromDate = '';
    this.filterToDate = '';
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

  // View Detail Modal
  viewTransferDetail(item: EmployeeTransfer) {
    this.selectedTransferForView = item;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedTransferForView = null;
  }

  // Modal Actions
  openCreateModal() {
    const empId = this.employees().length > 0 ? this.employees()[0].id : 0;

    this.formData = {
      employeeId: empId,
      decisionNumber: '',
      changeType: 1,
      newDepartmentId: 0,
      newJobTitle: '',
      newManagerId: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      note: ''
    };

    this.onEmployeeSelected();
    this.isModalOpen = true;
  }

  onEmployeeSelected() {
    if (this.formData.employeeId) {
      const emp = this.employees().find(e => e.id == this.formData.employeeId);
      this.selectedEmployeeInfo = emp || null;
      if (emp) {
        this.formData.newDepartmentId = emp.departmentId || 0;
        this.formData.newJobTitle = emp.jobTitle || '';
        this.formData.newManagerId = emp.managerId || 0;
      }
    } else {
      this.selectedEmployeeInfo = null;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveTransfer() {
    if (!this.formData.employeeId || this.formData.employeeId <= 0) {
      this.toastService.warning('Cảnh báo', 'Vui lòng chọn nhân viên điều động.');
      return;
    }

    if (!this.formData.effectiveDate) {
      this.toastService.warning('Cảnh báo', 'Vui lòng chọn ngày có hiệu lực.');
      return;
    }

    this.isSubmitting = true;

    const dto: CreateEmployeeTransferDto = {
      employeeId: Number(this.formData.employeeId),
      decisionNumber: this.formData.decisionNumber ? this.formData.decisionNumber.trim() : undefined,
      changeType: Number(this.formData.changeType),
      newDepartmentId: this.formData.newDepartmentId ? Number(this.formData.newDepartmentId) : undefined,
      newJobTitle: this.formData.newJobTitle ? this.formData.newJobTitle.trim() : undefined,
      newManagerId: this.formData.newManagerId ? Number(this.formData.newManagerId) : undefined,
      effectiveDate: this.formData.effectiveDate,
      note: this.formData.note
    };

    this.transferService.createTransfer(dto).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã trình duyệt Lệnh điều động nhân sự thành công!');
        this.isSubmitting = false;
        this.closeModal();
        this.loadItems();
        this.loadSummary();
        this.notificationService.loadNotifications(true);
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || err.error?.detail || 'Không thể tạo mới lệnh điều động.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // Approval Actions
  openApproveModal(item: EmployeeTransfer) {
    this.selectedTransferForApprove = item;
    this.approveNote = '';
    this.isApproveModalOpen = true;
  }

  closeApproveModal() {
    this.isApproveModalOpen = false;
    this.selectedTransferForApprove = null;
    this.approveNote = '';
  }

  confirmApproveTransfer() {
    if (!this.selectedTransferForApprove) return;

    const item = this.selectedTransferForApprove;
    const step = item.currentStep || 1;
    this.isApproving = true;

    if (step <= 4) {
      this.transferService.approveTransferStep(item.id, step, this.approveNote.trim()).subscribe({
        next: () => {
          const stepName = this.getStepName(step);
          this.toastService.success('Thành công', `Đã duyệt thành công ${stepName} cho Lệnh ${item.decisionNumber}!`);
          this.isApproving = false;
          this.closeApproveModal();
          this.loadItems();
          this.loadSummary();
          this.loadEmployees();
          this.notificationService.loadNotifications(true);
        },
        error: (err) => {
          this.isApproving = false;
          const msg = err.error?.message || 'Không thể duyệt cấp lệnh điều động.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else if (step === 5) {
      this.transferService.acknowledgeTransfer(item.id, this.approveNote.trim()).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Nhân viên đã xác nhận đồng ý nhận Lệnh ${item.decisionNumber}!`);
          this.isApproving = false;
          this.closeApproveModal();
          this.loadItems();
          this.loadSummary();
          this.notificationService.loadNotifications(true);
        },
        error: (err) => {
          this.isApproving = false;
          const msg = err.error?.message || 'Không thể xác nhận lệnh điều động.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  getStepName(step: number): string {
    switch (step) {
      case 1: return 'Cấp 1: Quản lý phòng cũ (Giải phóng)';
      case 2: return 'Cấp 2: Quản lý phòng mới (Tiếp nhận)';
      case 3: return 'Cấp 3: Phòng Nhân sự (Cấp QĐ & Quỹ)';
      case 4: return 'Cấp 4: Ban Giám Đốc (Phê duyệt QĐ)';
      case 5: return 'Cấp 5: Xác nhận Nhân viên';
      case 6: return 'Hoàn tất 5 Cấp Duyệt';
      default: return `Cấp ${step}`;
    }
  }

  openRejectModal(item: EmployeeTransfer) {
    this.selectedTransferForReject = item;
    this.rejectReason = '';
    this.isRejectModalOpen = true;
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.selectedTransferForReject = null;
  }

  confirmRejectTransfer() {
    if (!this.selectedTransferForReject) return;
    if (!this.rejectReason.trim()) {
      this.toastService.warning('Cảnh báo', 'Vui lòng nhập lý do từ chối.');
      return;
    }

    this.isRejecting = true;
    this.transferService.rejectTransfer(this.selectedTransferForReject.id, this.rejectReason.trim()).subscribe({
      next: () => {
        this.toastService.success('Thành công', `Đã từ chối Lệnh điều động ${this.selectedTransferForReject?.decisionNumber}.`);
        this.isRejecting = false;
        this.closeRejectModal();
        this.loadItems();
        this.loadSummary();
        this.notificationService.loadNotifications(true);
      },
      error: (err) => {
        this.isRejecting = false;
        const msg = err.error?.message || 'Không thể từ chối lệnh điều động.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  deleteTransfer(item: EmployeeTransfer) {
    if (confirm(`Bạn có chắc chắn muốn xóa Quyết định điều động "${item.decisionNumber}" của ${item.employeeName}?`)) {
      this.transferService.deleteTransfer(item.id).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Đã xóa Lệnh điều động ${item.decisionNumber}.`);
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          const msg = err.error?.message || 'Không thể xóa Lệnh điều động.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  // Label & Badge Helpers
  getChangeTypeLabel(type: string): string {
    switch (type) {
      case 'DEPARTMENT_TRANSFER': return 'Điều chuyển phòng ban';
      case 'PROMOTION': return 'Bổ nhiệm / Thăng chức';
      case 'DEMOTION': return 'Giáng chức / Chuyển vị trí';
      case 'MANAGER_CHANGE': return 'Thay đổi Quản lý';
      case 'RELOCATION': return 'Chuyển địa điểm làm việc';
      case 'RESIGNATION': return 'Cho thôi việc / Nghỉ việc';
      case 'TERMINATION': return 'Chấm dứt HĐ / Sa thải';
      default: return type;
    }
  }

  getChangeTypeBadgeClass(type: string): string {
    switch (type) {
      case 'DEPARTMENT_TRANSFER': return 'badge-light-primary text-primary';
      case 'PROMOTION': return 'badge-light-success text-success';
      case 'DEMOTION': return 'badge-light-warning text-warning';
      case 'MANAGER_CHANGE': return 'badge-light-info text-info';
      case 'RELOCATION': return 'badge-light-secondary text-dark';
      case 'RESIGNATION': return 'badge-light-danger text-danger';
      case 'TERMINATION': return 'badge-light-danger text-danger fw-bold';
      default: return 'badge-light-primary';
    }
  }

  getApprovalStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING_APPROVAL': return 'Chờ phê duyệt';
      case 'APPROVED': return 'Đã phê duyệt';
      case 'REJECTED': return 'Từ chối';
      case 'DRAFT': return 'Bản nháp';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }

  getApprovalStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING_APPROVAL': return 'badge-light-warning text-warning';
      case 'APPROVED': return 'badge-light-success text-success';
      case 'REJECTED': return 'badge-light-danger text-danger';
      case 'DRAFT': return 'badge-light-secondary text-secondary';
      case 'CANCELLED': return 'badge-light-dark text-dark';
      default: return 'badge-light-primary';
    }
  }
}
