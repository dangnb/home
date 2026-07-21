import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { OperatingExpenseService } from '../../services/operating-expense.service';
import { AlertService } from '../../services/alert.service';
import { OperatingExpense, ExpenseSummary, OperatingExpenseType, ExpensePaymentStatus } from '../../models/operating-expense.model';

@Component({
  selector: 'app-operating-expenses',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './operating-expenses.component.html',
  styleUrl: './operating-expenses.component.scss'
})
export class OperatingExpensesComponent implements OnInit {
  private expenseService = inject(OperatingExpenseService);
  private alertService = inject(AlertService);
  private t = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  expenses: OperatingExpense[] = [];
  summary: ExpenseSummary | null = null;
  
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;

  filterMonth: number;
  filterYear: number;
  filterStatus: number | null = null;
  searchTerm = '';

  showModal = false;
  isEditMode = false;
  isSubmitting = false;

  editingExpense: Partial<OperatingExpense> = {};

  Math = Math;

  constructor() {
    const now = new Date();
    this.filterMonth = now.getMonth() + 1;
    this.filterYear = now.getFullYear();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadExpenses();
    this.loadSummary();
  }

  loadExpenses() {
    this.expenseService.getExpenses(
      this.currentPage, 
      this.pageSize, 
      this.filterMonth, 
      this.filterYear, 
      this.filterStatus || undefined, 
      this.searchTerm
    ).subscribe({
      next: (res) => {
        this.expenses = res.items;
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.alertService.error(this.t.instant('COMMON.ERROR'), 'Không thể tải danh sách chi phí');
        this.cdr.detectChanges();
      }
    });
  }

  loadSummary() {
    this.expenseService.getSummary(this.filterMonth, this.filterYear).subscribe({
      next: (res) => {
        this.summary = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load summary', err);
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadData();
  }

  resetFilter() {
    this.filterStatus = null;
    this.searchTerm = '';
    const now = new Date();
    this.filterMonth = now.getMonth() + 1;
    this.filterYear = now.getFullYear();
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadExpenses();
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingExpense = {
      type: 1,
      month: this.filterMonth,
      year: this.filterYear,
      amount: 0,
      name: ''
    };
    this.showModal = true;
  }

  openEditModal(expense: OperatingExpense) {
    this.isEditMode = true;
    this.editingExpense = { ...expense };
    if (this.editingExpense.dueDate) {
      this.editingExpense.dueDate = new Date(this.editingExpense.dueDate).toISOString().split('T')[0];
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  saveExpense() {
    if (!this.editingExpense.name || !this.editingExpense.amount || this.editingExpense.amount <= 0) {
      this.alertService.warning(this.t.instant('COMMON.WARNING'), 'Vui lòng nhập tên chi phí và số tiền hợp lệ');
      return;
    }

    this.isSubmitting = true;

    const payload = { ...this.editingExpense };
    if (payload.dueDate) {
      payload.dueDate = new Date(payload.dueDate).toISOString();
    }

    if (this.isEditMode && payload.id) {
      this.expenseService.updateExpense(payload.id, payload).subscribe({
        next: () => {
          this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã cập nhật chi phí');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.alertService.error(this.t.instant('COMMON.ERROR'), 'Lỗi cập nhật chi phí');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.expenseService.createExpense(payload).subscribe({
        next: () => {
          this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã thêm chi phí mới');
          this.closeModal();
          this.currentPage = 1;
          this.loadData();
        },
        error: (err) => {
          this.alertService.error(this.t.instant('COMMON.ERROR'), 'Lỗi thêm chi phí');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  markAsPaid(id: string) {
    this.alertService.confirm(this.t.instant('COMMON.CONFIRM'), 'Xác nhận đã thanh toán khoản chi phí này?').then((res: any) => {
      if (res.isConfirmed) {
        const paidDate = new Date().toISOString();
        this.expenseService.markAsPaid(id, paidDate).subscribe({
          next: () => {
            this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã đánh dấu thanh toán');
            this.loadData();
          },
          error: (err) => {
            this.alertService.error(this.t.instant('COMMON.ERROR'), 'Lỗi khi cập nhật trạng thái');
          }
        });
      }
    });
  }

  deleteExpense(id: string) {
    this.alertService.confirm(this.t.instant('COMMON.CONFIRM'), 'Bạn có chắc chắn muốn xóa chi phí này?').then((res: any) => {
      if (res.isConfirmed) {
        this.expenseService.deleteExpense(id).subscribe({
          next: () => {
            this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã xóa chi phí');
            this.loadData();
          },
          error: (err) => {
            this.alertService.error(this.t.instant('COMMON.ERROR'), 'Không thể xóa chi phí');
          }
        });
      }
    });
  }
}
