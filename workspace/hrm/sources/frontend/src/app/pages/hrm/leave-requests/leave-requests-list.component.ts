import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../../core/hrm/services/leave-request.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { LeaveRequest, Employee, CreateLeaveRequestDto, LeaveType, LeaveRequestStatus } from '../../../core/hrm/models/hrm.models';

@Component({
  selector: 'app-leave-requests-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-requests-list.component.html'
})
export class LeaveRequestsListComponent implements OnInit {
  private leaveRequestService = inject(LeaveRequestService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  leaveRequests = signal<LeaveRequest[]>([]);
  employees = signal<Employee[]>([]);
  isLoading = signal<boolean>(false);

  // Filters
  filterEmployeeId = '';
  filterStatus: number | '' = '';
  filterLeaveType: number | '' = '';

  // Create Modal State
  isCreateModalOpen = false;
  isSubmitting = false;

  formData = {
    employeeId: '',
    leaveType: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  };

  ngOnInit() {
    this.loadEmployees();
    this.loadLeaveRequests();
  }

  loadEmployees() {
    this.employeeService.getEmployees({ pageSize: 100, status: 1 }).subscribe({
      next: (res) => {
        if (res.data) this.employees.set(res.data);
      },
      error: () => {}
    });
  }

  loadLeaveRequests() {
    this.isLoading.set(true);
    this.leaveRequestService.getLeaveRequests({
      employeeId: this.filterEmployeeId || undefined,
      status: this.filterStatus !== '' ? Number(this.filterStatus) : undefined,
      leaveType: this.filterLeaveType !== '' ? Number(this.filterLeaveType) : undefined,
      pageSize: 50
    }).subscribe({
      next: (res) => {
        if (res.data) this.leaveRequests.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilterChange() {
    this.loadLeaveRequests();
  }

  openCreateModal() {
    this.formData = {
      employeeId: this.employees().length > 0 ? String(this.employees()[0].id) : '',
      leaveType: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  submitLeaveRequest() {
    if (!this.formData.employeeId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn nhân viên làm đơn.');
      return;
    }
    if (!this.formData.reason.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập lý do xin nghỉ phép.');
      return;
    }

    this.isSubmitting = true;
    const dto: CreateLeaveRequestDto = {
      employeeId: this.formData.employeeId,
      leaveType: Number(this.formData.leaveType),
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      reason: this.formData.reason.trim()
    };

    this.leaveRequestService.createLeaveRequest(dto).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đơn xin nghỉ phép đã được gửi duyệt.');
        this.isSubmitting = false;
        this.closeCreateModal();
        this.loadLeaveRequests();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  approve(item: LeaveRequest) {
    if (!confirm(`Bạn có đồng ý DUYỆT đơn xin nghỉ của "${item.employeeName || 'nhân viên'}"?`)) {
      return;
    }

    const currentEmp = this.employees()[0];
    const approverId = currentEmp ? String(currentEmp.id) : String(item.employeeId);

    this.leaveRequestService.approveLeaveRequest(item.id, {
      approverId: approverId,
      comment: 'Đã duyệt qua hệ thống Quản trị HRM'
    }).subscribe({
      next: () => {
        this.toastService.success('Đã duyệt', 'Đơn nghỉ phép đã được phê duyệt thành công.');
        this.loadLeaveRequests();
      },
      error: () => {}
    });
  }

  reject(item: LeaveRequest) {
    const reason = prompt('Nhập lý do từ chối đơn nghỉ phép:', 'Kế hoạch công việc phát sinh đột xuất');
    if (reason === null) return;

    const currentEmp = this.employees()[0];
    const approverId = currentEmp ? String(currentEmp.id) : String(item.employeeId);

    this.leaveRequestService.rejectLeaveRequest(item.id, {
      approverId: approverId,
      reason: reason || 'Từ chối bởi Quản trị'
    }).subscribe({
      next: () => {
        this.toastService.warning('Đã từ chối', 'Đơn nghỉ phép đã được đánh dấu từ chối.');
        this.loadLeaveRequests();
      },
      error: () => {}
    });
  }

  getLeaveTypeName(type: number): string {
    switch (type) {
      case 1: return 'Nghỉ phép năm';
      case 2: return 'Nghỉ ốm';
      case 3: return 'Nghỉ không lương';
      case 4: return 'Nghỉ thai sản';
      case 5: return 'Nghỉ việc hiếu/hỉ';
      default: return 'Khác';
    }
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'badge-light-warning';
      case 2: return 'badge-light-success';
      case 3: return 'badge-light-danger';
      case 4: return 'badge-light-secondary';
      default: return 'badge-light-info';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Chờ duyệt';
      case 2: return 'Đã duyệt';
      case 3: return 'Từ chối';
      case 4: return 'Đã hủy';
      default: return 'Chưa rõ';
    }
  }
}
