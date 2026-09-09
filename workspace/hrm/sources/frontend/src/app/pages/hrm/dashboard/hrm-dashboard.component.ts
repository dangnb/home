import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../core/hrm/services/attendance.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { LeaveRequestService } from '../../../core/hrm/services/leave-request.service';
import { ToastService } from '../../../core/services/toast.service';
import { AttendanceSummary, Employee, LeaveRequest, Attendance } from '../../../core/hrm/models/hrm.models';

@Component({
  selector: 'app-hrm-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hrm-dashboard.component.html'
})
export class HrmDashboardComponent implements OnInit, OnDestroy {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);
  private leaveRequestService = inject(LeaveRequestService);
  private toastService = inject(ToastService);

  summary = signal<AttendanceSummary>({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeaveToday: 0
  });

  employees = signal<Employee[]>([]);
  recentAttendances = signal<Attendance[]>([]);
  recentLeaveRequests = signal<LeaveRequest[]>([]);
  isLoading = signal<boolean>(false);

  // Quick Check-in Form
  selectedEmployeeId = '';
  checkInNotes = '';
  isSubmitting = false;

  // Real-time Clock
  currentTime = signal<string>('');
  currentDate = signal<string>('');
  private timer: any;

  ngOnInit() {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
    this.loadData();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateClock() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    this.currentDate.set(now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }

  loadData() {
    this.isLoading.set(true);

    // 1. Get summary from Dart Read Service
    this.attendanceService.getSummary().subscribe({
      next: (res) => {
        if (res.data) this.summary.set(res.data);
      },
      error: () => {}
    });

    // 2. Get active employees for Quick Attendance select
    this.employeeService.getEmployees({ pageSize: 50, status: 1 }).subscribe({
      next: (res) => {
        if (res.data) {
          this.employees.set(res.data);
          if (res.data.length > 0 && !this.selectedEmployeeId) {
            this.selectedEmployeeId = String(res.data[0].id);
          }
        }
      },
      error: () => {}
    });

    // 3. Get recent attendances
    const today = new Date().toISOString().split('T')[0];
    this.attendanceService.getAttendances({ date: today, pageSize: 5 }).subscribe({
      next: (res) => {
        if (res.data) this.recentAttendances.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    // 4. Get recent leave requests
    this.leaveRequestService.getLeaveRequests({ pageSize: 5 }).subscribe({
      next: (res) => {
        if (res.data) this.recentLeaveRequests.set(res.data);
      },
      error: () => {}
    });
  }

  onQuickCheckIn() {
    if (!this.selectedEmployeeId) {
      this.toastService.warning('Chưa chọn nhân viên', 'Vui lòng chọn nhân viên để chấm công vào.');
      return;
    }

    this.isSubmitting = true;
    this.attendanceService.checkIn({
      employeeId: this.selectedEmployeeId,
      notes: this.checkInNotes || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Check-in thành công', 'Đã ghi nhận chấm công vào ca.');
        this.isSubmitting = false;
        this.checkInNotes = '';
        this.loadData();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  onQuickCheckOut() {
    if (!this.selectedEmployeeId) {
      this.toastService.warning('Chưa chọn nhân viên', 'Vui lòng chọn nhân viên để chấm công ra.');
      return;
    }

    this.isSubmitting = true;
    this.attendanceService.checkOut({
      employeeId: this.selectedEmployeeId,
      notes: this.checkInNotes || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Check-out thành công', 'Đã ghi nhận chấm công ra ca.');
        this.isSubmitting = false;
        this.checkInNotes = '';
        this.loadData();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'badge-light-success';
      case 2: return 'badge-light-warning';
      case 3: return 'badge-light-info';
      case 4: return 'badge-light-danger';
      case 5: return 'badge-light-primary';
      default: return 'badge-light-secondary';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Có mặt đúng giờ';
      case 2: return 'Đi muộn';
      case 3: return 'Về sớm';
      case 4: return 'Vắng mặt';
      case 5: return 'Nửa ngày';
      default: return 'Chưa rõ';
    }
  }

  getLeaveStatusBadgeClass(status: number): string {
    switch (status) {
      case 1: return 'badge-light-warning';
      case 2: return 'badge-light-success';
      case 3: return 'badge-light-danger';
      case 4: return 'badge-light-secondary';
      default: return 'badge-light-info';
    }
  }

  getLeaveStatusText(status: number): string {
    switch (status) {
      case 1: return 'Chờ duyệt';
      case 2: return 'Đã duyệt';
      case 3: return 'Từ chối';
      case 4: return 'Đã hủy';
      default: return 'Chưa rõ';
    }
  }

  formatTime(val: any): string {
    if (!val) return '--:--';
    const s = String(val);
    if (s.length >= 16 && s.includes('T')) {
      return s.substring(11, 16);
    }
    return s.substring(0, 5);
  }
}
