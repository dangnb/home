import { Component, inject, signal, computed, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PayrollService, AttendanceDto, CreateAttendanceCommand } from '../../services/payroll.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  private payrollService = inject(PayrollService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  attendances = signal<AttendanceDto[]>([]);
  isLoading = signal(true);
  todayAttendance = signal<AttendanceDto | null>(null);
  checkingIn = signal(false);
  checkingOut = signal(false);

  // Filters
  selectedMonth = signal(new Date().getMonth() + 1);
  selectedYear = signal(new Date().getFullYear());

  // Modal
  showModal = signal(false);
  editingAttendance: CreateAttendanceCommand = this.getEmptyAttendance();

  months = Array.from({ length: 12 }, (_, i) => i + 1);
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  statusOptions = [
    { value: 1, label: 'Có mặt', color: '#34C759' },
    { value: 2, label: 'Đi muộn', color: '#FF9500' },
    { value: 3, label: 'Về sớm', color: '#FF9500' },
    { value: 4, label: 'Vắng mặt', color: '#FF3B30' },
    { value: 5, label: 'Nghỉ phép', color: '#5AC8FA' },
  ];

  // Summary
  summary = computed(() => {
    const list = this.attendances();
    return {
      total: list.length,
      present: list.filter(a => a.status === 1).length,
      late: list.filter(a => a.status === 2).length,
      absent: list.filter(a => a.status === 4).length,
      totalHours: list.reduce((sum, a) => sum + a.totalHours, 0).toFixed(1),
      overtimeHours: list.reduce((sum, a) => sum + a.overtimeHours, 0).toFixed(1),
    };
  });

  ngOnInit() {
    this.loadData();
    this.loadTodayAttendance();
  }

  loadData() {
    this.isLoading.set(true);
    this.payrollService.getAttendances(this.selectedMonth(), this.selectedYear()).subscribe({
      next: (data) => {
        this.attendances.set(data);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  loadTodayAttendance() {
    this.payrollService.getMyAttendanceToday().subscribe({
      next: (data) => {
        this.todayAttendance.set(data);
        this.cdr.markForCheck();
      },
    });
  }

  doCheckIn() {
    this.checkingIn.set(true);
    this.payrollService.checkIn().subscribe({
      next: () => {
        this.alertService.success('Check-in thành công!');
        this.checkingIn.set(false);
        this.loadTodayAttendance();
        this.loadData();
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Check-in thất bại');
        this.checkingIn.set(false);
      },
    });
  }

  doCheckOut() {
    this.checkingOut.set(true);
    this.payrollService.checkOut().subscribe({
      next: () => {
        this.alertService.success('Check-out thành công!');
        this.checkingOut.set(false);
        this.loadTodayAttendance();
        this.loadData();
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Check-out thất bại');
        this.checkingOut.set(false);
      },
    });
  }

  onMonthChange() {
    this.loadData();
  }

  // Modal
  openCreateModal() {
    this.editingAttendance = this.getEmptyAttendance();
    this.showModal.set(true);
  }

  openEditModal(a: AttendanceDto) {
    this.editingAttendance = {
      id: a.id,
      username: a.username,
      date: a.date,
      checkIn: a.checkIn,
      checkOut: a.checkOut,
      totalHours: a.totalHours,
      overtimeHours: a.overtimeHours,
      lateMinutes: a.lateMinutes,
      earlyLeaveMinutes: a.earlyLeaveMinutes,
      status: a.status,
      notes: a.notes || undefined,
    };
    this.showModal.set(true);
  }

  // Import
  showImportModal = signal(false);
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  importResult = signal<{ successCount: number; errorCount: number; errors: string[] } | null>(null);

  openImportModal() {
    this.importResult.set(null);
    this.selectedFile.set(null);
    this.showImportModal.set(true);
  }

  downloadTemplate() {
    this.payrollService.downloadAttendanceTemplate();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  uploadFile() {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.importResult.set(null);

    this.payrollService.importAttendance(file).subscribe({
      next: (result) => {
        this.importResult.set(result);
        this.isUploading.set(false);
        if (result.successCount > 0) {
          this.alertService.success(`Import thành công ${result.successCount} bản ghi`);
          this.loadData();
        }
      },
      error: (err) => {
        this.isUploading.set(false);
        this.alertService.error(err?.error?.message || 'Lỗi khi upload file');
      }
    });
  }

  saveAttendance() {
    this.payrollService.createAttendance(this.editingAttendance).subscribe({
      next: () => {
        this.alertService.success('Lưu chấm công thành công!');
        this.showModal.set(false);
        this.loadData();
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Lỗi khi lưu');
      },
    });
  }

  getStatusLabel(status: number): string {
    return this.statusOptions.find(s => s.value === status)?.label || 'N/A';
  }

  getStatusColor(status: number): string {
    return this.statusOptions.find(s => s.value === status)?.color || '#8E8E93';
  }

  formatTime(dateStr: string | null): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  private getEmptyAttendance(): CreateAttendanceCommand {
    return {
      username: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: null,
      checkOut: null,
      totalHours: 0,
      overtimeHours: 0,
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      status: 1,
    };
  }
}
