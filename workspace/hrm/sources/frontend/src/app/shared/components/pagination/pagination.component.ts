import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-4 border-top mt-2">
      <!-- Info & Page Size Select -->
      <div class="d-flex align-items-center gap-3">
        <span class="fs-7 text-gray-600">
          Hiển thị <strong>{{ displayCount }}</strong> / <strong>{{ totalCount }}</strong> bản ghi (Trang {{ currentPage }}/{{ totalPages }})
        </span>

        @if (showPageSizeSelect) {
          <div class="d-flex align-items-center gap-2 ms-2">
            <span class="fs-7 text-gray-500">Hiển thị:</span>
            <select 
              class="form-select form-select-solid fs-7 py-1 px-2 w-75px" 
              [ngModel]="pageSize" 
              (ngModelChange)="onSizeChange($event)"
            >
              @for (size of pageSizeOptions; track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
          </div>
        }
      </div>

      <!-- Navigation Page Buttons -->
      <ul class="pagination pagination-outline mb-0">
        <!-- Previous Page Button -->
        <li class="page-item previous" [class.disabled]="currentPage <= 1">
          <a 
            href="javascript:void(0)" 
            class="page-link py-1 px-3" 
            (click)="selectPage(currentPage - 1)"
            [attr.aria-disabled]="currentPage <= 1"
          >
            <i class="bi bi-chevron-left fs-7"></i>
          </a>
        </li>

        <!-- Page Numbers -->
        @for (p of visiblePages; track p) {
          <li class="page-item" [class.active]="p === currentPage">
            <a href="javascript:void(0)" class="page-link py-1 px-3" (click)="selectPage(p)">{{ p }}</a>
          </li>
        }

        <!-- Next Page Button -->
        <li class="page-item next" [class.disabled]="currentPage >= totalPages">
          <a 
            href="javascript:void(0)" 
            class="page-link py-1 px-3" 
            (click)="selectPage(currentPage + 1)"
            [attr.aria-disabled]="currentPage >= totalPages"
          >
            <i class="bi bi-chevron-right fs-7"></i>
          </a>
        </li>
      </ul>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalCount: number = 0;
  @Input() itemCount?: number; // Optional count of items on current page
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];
  @Input() showPageSizeSelect: boolean = true;
  @Input() maxVisiblePages: number = 5;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get displayCount(): number {
    if (this.itemCount !== undefined) {
      return this.itemCount;
    }
    if (!this.totalCount) return 0;
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalCount);
    return end >= start ? (end - start + 1) : 0;
  }

  get totalPages(): number {
    if (!this.totalCount || this.totalCount <= 0) return 1;
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const pages: number[] = [];
    const max = this.maxVisiblePages;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end = Math.min(total, start + max - 1);

    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  selectPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onSizeChange(newSize: any) {
    const size = Number(newSize);
    if (size !== this.pageSize) {
      this.pageSizeChange.emit(size);
    }
  }
}
