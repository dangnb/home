import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PayrollService, PayrollPeriodDto, PayrollDetailDto, PayrollEntryDto } from '../../services/payroll.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  private payrollService = inject(PayrollService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  periods = signal<PayrollPeriodDto[]>([]);
  isLoading = signal(true);
  selectedYear = signal(new Date().getFullYear());
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  // Create modal
  showCreateModal = signal(false);
  newPeriodMonth = new Date().getMonth() + 1;
  newPeriodYear = new Date().getFullYear();
  months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Detail view
  showDetail = signal(false);
  detail = signal<PayrollDetailDto | null>(null);
  loadingDetail = signal(false);

  // Calculate modal
  showCalcModal = signal(false);
  calcConfig = { defaultBaseSalary: 5000000, overtimeRate: 1.5, defaultAllowance: 500000 };
  calcPeriodId = '';

  // Edit entry modal
  showEditModal = signal(false);
  editEntry: PayrollEntryDto | null = null;
  editForm = { baseSalary: 0, bonus: 0, deduction: 0, allowance: 0, notes: '' };

  ngOnInit() {
    this.loadPeriods();
  }

  loadPeriods() {
    this.isLoading.set(true);
    this.payrollService.getPayrollPeriods(this.selectedYear()).subscribe({
      next: (data) => {
        this.periods.set(data);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  onYearChange() {
    this.loadPeriods();
  }

  openCreateModal() {
    this.newPeriodMonth = new Date().getMonth() + 1;
    this.newPeriodYear = new Date().getFullYear();
    this.showCreateModal.set(true);
  }

  createPeriod() {
    this.payrollService.createPayrollPeriod(this.newPeriodMonth, this.newPeriodYear).subscribe({
      next: () => {
        this.alertService.success('Tạo kỳ lương thành công!');
        this.showCreateModal.set(false);
        this.loadPeriods();
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Lỗi tạo kỳ lương');
      },
    });
  }

  viewDetail(period: PayrollPeriodDto) {
    this.loadingDetail.set(true);
    this.showDetail.set(true);
    this.payrollService.getPayrollDetail(period.id).subscribe({
      next: (data) => {
        this.detail.set(data);
        this.loadingDetail.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingDetail.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  backToList() {
    this.showDetail.set(false);
    this.detail.set(null);
  }

  openCalcModal(periodId: string) {
    this.calcPeriodId = periodId;
    this.calcConfig = { defaultBaseSalary: 5000000, overtimeRate: 1.5, defaultAllowance: 500000 };
    this.showCalcModal.set(true);
  }

  doCalculate() {
    this.payrollService.calculatePayroll(this.calcPeriodId, this.calcConfig).subscribe({
      next: () => {
        this.alertService.success('Tính lương thành công!');
        this.showCalcModal.set(false);
        this.loadPeriods();
        if (this.detail()?.period?.id === this.calcPeriodId) {
          this.viewDetail(this.detail()!.period);
        }
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Lỗi tính lương');
      },
    });
  }

  doApprove(periodId: string) {
    if (!confirm('Bạn chắc chắn muốn duyệt bảng lương này?')) return;
    this.payrollService.approvePayroll(periodId).subscribe({
      next: () => {
        this.alertService.success('Đã duyệt bảng lương!');
        this.loadPeriods();
        if (this.detail()?.period?.id === periodId) {
          this.viewDetail(this.detail()!.period);
        }
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Lỗi duyệt');
      },
    });
  }

  openEditEntry(entry: PayrollEntryDto) {
    this.editEntry = entry;
    this.editForm = {
      baseSalary: entry.baseSalary,
      bonus: entry.bonus,
      deduction: entry.deduction,
      allowance: entry.allowance,
      notes: entry.notes || '',
    };
    this.showEditModal.set(true);
  }

  saveEntry() {
    if (!this.editEntry) return;
    this.payrollService.updatePayrollEntry(this.editEntry.id, this.editForm).subscribe({
      next: () => {
        this.alertService.success('Cập nhật thành công!');
        this.showEditModal.set(false);
        if (this.detail()) {
          this.viewDetail(this.detail()!.period);
        }
      },
      error: (err) => {
        this.alertService.error(err?.error?.message || 'Lỗi cập nhật');
      },
    });
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-draft';
      case 2: return 'status-calculated';
      case 3: return 'status-approved';
      case 4: return 'status-paid';
      default: return '';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
  }

  getTotalNetSalary(): number {
    return this.detail()?.entries?.reduce((sum, e) => sum + e.netSalary, 0) || 0;
  }
}
