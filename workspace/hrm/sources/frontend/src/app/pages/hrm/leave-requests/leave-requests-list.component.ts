import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../../core/hrm/services/leave-request.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

export interface LeaveRequestItem {
  id: number;
  tenantId: number;
  userId: number;
  employeeName: string;
  departmentName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: string;
  approverId?: number;
  approverName?: string;
  createdAt: string;
}

@Component({
  selector: 'app-leave-requests-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './leave-requests-list.component.html',
  styleUrls: ['./leave-requests-list.component.scss']
})
export class LeaveRequestsListComponent implements OnInit {
  private leaveService = inject(LeaveRequestService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  items = signal<LeaveRequestItem[]>([]);
  employees = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filters
  filterKeyword: string = '';
  filterLeaveType: string = 'ALL';
  filterStatus: string = 'ALL';
  filterFromDate: string = '';
  filterToDate: string = '';
  isAdvancedFilterOpen = signal<boolean>(false);

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  // Modal Create
  isCreateModalOpen = false;
  isSubmitting = false;

  formData = {
    targetUserId: 0,
    leaveType: 'ANNUAL', // ANNUAL, SICK, UNPAID, MATERNITY, RESIGNATION
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  };

  // Modal Approve/Reject
  isApproveModalOpen = false;
  selectedRequest: LeaveRequestItem | null = null;
  approveIsApproved = true;
  approveComment = '';
  isApproving = false;

  // View Detail Modal
  isViewModalOpen = false;
  selectedRequestForView: LeaveRequestItem | null = null;

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
      error: () => {}
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.leaveService.getLeaveRequests({
      page: this.currentPage,
      pageSize: this.pageSize,
      keyword: this.filterKeyword.trim() || undefined,
      leaveType: this.filterLeaveType !== 'ALL' ? this.filterLeaveType : undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
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
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách đơn nghỉ phép.');
      }
    });
  }

  toggleAdvancedFilter() {
    this.isAdvancedFilterOpen.update(v => !v);
  }

  get activeAdvancedFilterCount(): number {
    let count = 0;
    if (this.filterLeaveType !== 'ALL') count++;
    if (this.filterStatus !== 'ALL') count++;
    if (this.filterFromDate) count++;
    if (this.filterToDate) count++;
    return count;
  }

  clearSingleFilter(type: string) {
    if (type === 'leaveType') this.filterLeaveType = 'ALL';
    if (type === 'status') this.filterStatus = 'ALL';
    if (type === 'fromDate') this.filterFromDate = '';
    if (type === 'toDate') this.filterToDate = '';
    if (type === 'keyword') this.filterKeyword = '';
    this.onFilterChange();
  }

  resetFilters() {
    this.filterKeyword = '';
    this.filterLeaveType = 'ALL';
    this.filterStatus = 'ALL';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.onFilterChange();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  openCreateModal(defaultType: string = 'ANNUAL') {
    const defaultUserId = this.employees().length > 0 ? this.employees()[0].userId || this.employees()[0].id : 0;
    this.formData = {
      targetUserId: defaultUserId,
      leaveType: defaultType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  submitCreate() {
    if (!this.formData.reason.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập lý do xin nghỉ phép / thôi việc.');
      return;
    }

    this.isSubmitting = true;
    const enumVal = this.getLeaveTypeEnumValue(this.formData.leaveType);

    this.leaveService.createLeaveRequest({
      targetUserId: Number(this.formData.targetUserId) || undefined,
      leaveType: enumVal,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      reason: this.formData.reason.trim()
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đơn xin nghỉ phép / thôi việc đã được gửi trình duyệt thành công.');
        this.isSubmitting = false;
        this.closeCreateModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err?.error?.message || 'Có lỗi xảy ra khi tạo đơn.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  openApproveModal(item: LeaveRequestItem, isApproved: boolean) {
    this.selectedRequest = item;
    this.approveIsApproved = isApproved;
    this.approveComment = isApproved ? 'Đã duyệt qua hệ thống Quản trị HRM' : 'Từ chối bởi Quản trị viên';
    this.isApproveModalOpen = true;
  }

  closeApproveModal() {
    this.isApproveModalOpen = false;
    this.selectedRequest = null;
  }

  submitApprove() {
    if (!this.selectedRequest) return;

    this.isApproving = true;
    this.leaveService.approveLeaveRequest(this.selectedRequest.id, {
      isApproved: this.approveIsApproved,
      comment: this.approveComment.trim()
    }).subscribe({
      next: () => {
        const actionText = this.approveIsApproved ? 'phê duyệt' : 'từ chối';
        this.toastService.success('Thành công', `Đã ${actionText} đơn nghỉ phép / thôi việc thành công.`);
        this.isApproving = false;
        this.closeApproveModal();
        this.loadItems();
      },
      error: (err) => {
        this.isApproving = false;
        const msg = err?.error?.message || 'Có lỗi xảy ra khi xét duyệt đơn.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  viewDetail(item: LeaveRequestItem) {
    this.selectedRequestForView = item;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedRequestForView = null;
  }

  getLeaveTypeLabel(type: string): string {
    switch (type) {
      case 'ANNUAL': return 'Nghỉ phép năm';
      case 'SICK': return 'Nghỉ ốm đau';
      case 'UNPAID': return 'Nghỉ không lương';
      case 'MATERNITY': return 'Nghỉ thai sản';
      case 'RESIGNATION': return '🛑 Xin Thôi Việc / Nghỉ Việc';
      default: return type;
    }
  }

  getLeaveTypeBadgeClass(type: string): string {
    switch (type) {
      case 'ANNUAL': return 'badge-light-primary text-primary';
      case 'SICK': return 'badge-light-info text-info';
      case 'UNPAID': return 'badge-light-warning text-warning';
      case 'MATERNITY': return 'badge-light-success text-success';
      case 'RESIGNATION': return 'badge-light-danger text-danger fw-bold border border-danger border-dashed';
      default: return 'badge-light-secondary text-dark';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return '🟡 Chờ duyệt';
      case 'APPROVED': return '🟢 Đã phê duyệt';
      case 'REJECTED': return '🔴 Từ chối';
      case 'CANCELLED': return '⚪ Đã hủy';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-light-warning text-warning fw-bold';
      case 'APPROVED': return 'badge-light-success text-success fw-bold';
      case 'REJECTED': return 'badge-light-danger text-danger fw-bold';
      case 'CANCELLED': return 'badge-light-dark text-dark';
      default: return 'badge-light-primary';
    }
  }

  getLeaveTypeEnumValue(type: string): number {
    switch (type) {
      case 'ANNUAL': return 1;
      case 'SICK': return 2;
      case 'UNPAID': return 3;
      case 'MATERNITY': return 4;
      case 'RESIGNATION': return 5;
      default: return 1;
    }
  }
}
