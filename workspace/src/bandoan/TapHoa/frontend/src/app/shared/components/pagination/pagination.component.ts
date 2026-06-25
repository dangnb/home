import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {
    @Input() totalItems: number = 0;
    @Input() pageSize: number = 10;
    @Input() currentPage: number = 1;
    @Output() pageChange = new EventEmitter<number>();

    totalPages: number = 0;
    pages: number[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
            this.calculatePages();
        }
    }

    calculatePages() {
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);

        if (this.totalPages <= 1) {
            this.pages = [];
            return;
        }

        const result: number[] = [];

        for (let i = 1; i <= this.totalPages; i++) {
            if (
                i === 1 ||
                i === this.totalPages ||
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                result.push(i);
            } else if (
                i === this.currentPage - 2 ||
                i === this.currentPage + 2
            ) {
                result.push(-1); // -1 đại diện cho dấu "..."
            }
        }

        // Loại bỏ các dấu ... bị trùng lặp sát nhau
        this.pages = result.filter((val, index, arr) => val !== -1 || arr[index - 1] !== -1);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.pageChange.emit(page);
        }
    }
}
