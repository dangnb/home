import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../core/hrm/services/attendance.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { Attendance, Employee, AttendanceSummary } from '../../../core/hrm/models/hrm.models';

@Component({
  selector: 'app-attendances-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendances-list.component.html'
})
export class AttendancesListComponent implements OnInit {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  attendances = signal<Attendance[]>([]);
  employees = signal<Employee[]>([]);
  summary = signal<AttendanceSummary>({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeaveToday: 0
  });
  isLoading = signal<boolean>(false);

  // Filters
  filterDate = new Date().toISOString().split('T')[0];
  filterEmployeeId = '';
  filterStatus: number | '' = '';

  // Check In Modal
  isCheckInModalOpen = false;
  selectedEmployeeId = '';
  checkInNotes = '';
  isSubmitting = false;

  ngOnInit() {
    this.loadEmployees();
    this.loadSummary();
    this.loadAttendances();
  }

  loadEmployees() {
    this.employeeService.getEmployees({ pageSize: 100, status: 1 }).subscribe({
      next: (res) => {
        if (res.data) this.employees.set(res.data);
      },
      error: () => {}
    });
  }

  loadSummary() {
    this.attendanceService.getSummary().subscribe({
      next: (res) => {
        if (res.data) this.summary.set(res.data);
      },
      error: () => {}
    });
  }

  loadAttendances() {
    this.isLoading.set(true);
    this.attendanceService.getAttendances({
      date: this.filterDate || undefined,
      employeeId: this.filterEmployeeId || undefined,
      status: this.filterStatus !== '' ? Number(this.filterStatus) : undefined,
      pageSize: 50
    }).subscribe({
      next: (res) => {
        if (res.data) this.attendances.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilterChange() {
    this.loadAttendances();
  }

  openCheckInModal() {
    this.selectedEmployeeId = this.employees().length > 0 ? this.employees()[0].id : '';
    this.checkInNotes = '';
    this.isCheckInModalOpen = true;
  }

  closeCheckInModal() {
    this.isCheckInModalOpen = false;
  }

  performCheckIn() {
    if (!this.selectedEmployeeId) {
      this.toastService.warning('Chưa chọn nhân viên', 'Vui lòng chọn nhân viên để check-in.');
      return;
    }

    this.isSubmitting = true;
    this.attendanceService.checkIn({
      employeeId: this.selectedEmployeeId,
      notes: this.checkInNotes || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Check-in thành công', 'Đã ghi nhận giờ vào ca.');
        this.isSubmitting = false;
        this.closeCheckInModal();
        this.loadSummary();
        this.loadAttendances();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  performCheckOut() {
    if (!this.selectedEmployeeId) {
      this.toastService.warning('Chưa chọn nhân viên', 'Vui lòng chọn nhân viên để check-out.');
      return;
    }

    this.isSubmitting = true;
    this.attendanceService.checkOut({
      employeeId: this.selectedEmployeeId,
      notes: this.checkInNotes || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Check-out thành công', 'Đã ghi nhận giờ ra ca.');
        this.isSubmitting = false;
        this.closeCheckInModal();
        this.loadSummary();
        this.loadAttendances();
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
}
