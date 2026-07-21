import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CashBookService } from '../../services/cashbook.service';
import { AlertService } from '../../services/alert.service';
import { CashBookEntry, CashBookEntryType, CashBookSummary } from '../../models/cashbook.model';

@Component({
  selector: 'app-cashbook',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './cashbook.component.html',
  styleUrl: './cashbook.component.scss'
})
export class CashbookComponent implements OnInit {
  private cashBookService = inject(CashBookService);
  private alertService = inject(AlertService);
  private t = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  entries: CashBookEntry[] = [];
  summary: CashBookSummary | null = null;
  
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;

  filterFromDate = '';
  filterToDate = '';
  filterType: number | null = null;
  filterCategory = '';

  showModal = false;
  isEditMode = false;
  isSubmitting = false;

  editingEntry: Partial<CashBookEntry> = {};

  Math = Math;

  ngOnInit() {
    // Default to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.filterFromDate = firstDay.toISOString().split('T')[0];
    this.filterToDate = lastDay.toISOString().split('T')[0];

    this.loadData();
  }

  loadData() {
    this.loadEntries();
    this.loadSummary();
  }

  loadEntries() {
    this.cashBookService.getEntries(
      this.currentPage, 
      this.pageSize, 
      this.filterFromDate, 
      this.filterToDate, 
      this.filterType || undefined, 
      this.filterCategory
    ).subscribe({
      next: (res) => {
        this.entries = res.items;
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.alertService.error(this.t.instant('COMMON.ERROR'), 'Không thể tải sổ quỹ');
        this.cdr.detectChanges();
      }
    });
  }

  loadSummary() {
    this.cashBookService.getSummary(this.filterFromDate, this.filterToDate).subscribe({
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
    this.filterType = null;
    this.filterCategory = '';
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadEntries();
  }

  openAddModal(type: CashBookEntryType) {
    this.isEditMode = false;
    this.editingEntry = {
      type: type,
      entryDate: new Date().toISOString().split('T')[0],
      amount: 0,
      category: '',
      description: ''
    };
    this.showModal = true;
  }

  openEditModal(entry: CashBookEntry) {
    this.isEditMode = true;
    this.editingEntry = { ...entry };
    if (this.editingEntry.entryDate) {
      this.editingEntry.entryDate = new Date(this.editingEntry.entryDate).toISOString().split('T')[0];
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  saveEntry() {
    if (!this.editingEntry.category || !this.editingEntry.amount || this.editingEntry.amount <= 0) {
      this.alertService.warning(this.t.instant('COMMON.WARNING'), 'Vui lòng nhập đầy đủ thông tin bắt buộc và số tiền hợp lệ');
      return;
    }

    this.isSubmitting = true;

    // Convert date back to full ISO string
    const payload = { ...this.editingEntry };
    if (payload.entryDate) {
      payload.entryDate = new Date(payload.entryDate).toISOString();
    }

    if (this.isEditMode && payload.id) {
      this.cashBookService.updateEntry(payload.id, payload).subscribe({
        next: () => {
          this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã cập nhật bút toán');
          this.closeModal();
          this.loadData();
        },
        error: (err) => {
          this.alertService.error(this.t.instant('COMMON.ERROR'), 'Lỗi khi cập nhật bút toán');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cashBookService.createEntry(payload).subscribe({
        next: () => {
          this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã tạo bút toán mới');
          this.closeModal();
          this.currentPage = 1;
          this.loadData();
        },
        error: (err) => {
          this.alertService.error(this.t.instant('COMMON.ERROR'), 'Lỗi khi tạo bút toán');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteEntry(id: string) {
    this.alertService.confirm(this.t.instant('COMMON.CONFIRM'), 'Bạn có chắc chắn muốn xóa bút toán này?').then((res: any) => {
      if (res.isConfirmed) {
        this.cashBookService.deleteEntry(id).subscribe({
          next: () => {
            this.alertService.success(this.t.instant('COMMON.SUCCESS'), 'Đã xóa bút toán');
            this.loadData();
          },
          error: (err) => {
            this.alertService.error(this.t.instant('COMMON.ERROR'), 'Không thể xóa bút toán');
          }
        });
      }
    });
  }
}
