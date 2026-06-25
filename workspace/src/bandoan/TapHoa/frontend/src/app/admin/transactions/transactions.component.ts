import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
    selector: 'app-transactions',
    imports: [CommonModule, RouterModule],
    templateUrl: './transactions.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
    private transactionService = inject(TransactionService);

    transactions: any[] = [];
    paginatedTransactions: any[] = [];
    isLoading = true;
    error = '';

    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    get paginationArray() {
        const pages = [];
        let start = Math.max(1, this.currentPage - 2);
        let end = Math.min(this.totalPages, this.currentPage + 2);

        // Adjust if we are at edge cases to always show up to 5 pages if available
        if (start === 1) end = Math.min(this.totalPages, 5);
        if (end === this.totalPages) start = Math.max(1, this.totalPages - 4);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }

    ngOnInit() {
        this.fetchTransactions();
    }

    fetchTransactions() {
        this.transactionService.getTransactions().subscribe({
            next: (data) => {
                this.transactions = data;
                this.updatePagination();
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Không thể tải danh sách giao dịch';
                this.isLoading = false;
            }
        });
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.transactions.length / this.pageSize) || 1;
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.paginatedTransactions = this.transactions.slice(startIndex, startIndex + this.pageSize);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    getTypeClass(type: number): string {
        return ''; // unused now
    }

    getTypeLabel(type: number): string {
        if (type === 1) return 'Nhập kho thông thường';
        if (type === 2) return 'Xuất kho bán hàng';
        if (type === 3) return 'Điều chỉnh tồn';
        if (type === 4) return 'Luân chuyển nội bộ';
        return 'Khác';
    }

    getTypeIconClass(type: number): string {
        if (type === 1) return 'type-in';
        if (type === 2) return 'type-out';
        return 'type-adj';
    }

    getInitials(name: string): string {
        if (!name) return 'A';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    getStatusClass(status: number): string {
        return ''; // unused
    }

    getStatusPillClass(status: number): string {
        if (status === 0) return 'status-draft'; // Draft
        if (status === 1) return 'status-pending'; // PendingApproval
        return 'status-success'; // Completed
    }

    getStatusLabel(status: number): string {
        if (status === 0) return 'Đã lưu nháp';
        if (status === 1) return 'Đang xử lý';
        return 'Hoàn thành';
    }
}
