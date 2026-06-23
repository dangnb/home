import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
    private transactionService = inject(TransactionService);

    transactions: any[] = [];
    isLoading = true;
    error = '';

    ngOnInit() {
        this.fetchTransactions();
    }

    fetchTransactions() {
        this.transactionService.getTransactions().subscribe({
            next: (data) => {
                this.transactions = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Không thể tải danh sách giao dịch';
                this.isLoading = false;
            }
        });
    }

    getTypeClass(type: number): string {
        return ''; // unused now
    }

    getTypeLabel(type: number): string {
        if (type === 0) return 'Nhập kho nội bộ'; // For design matching
        if (type === 1) return 'Xuất kho bán lẻ';
        return 'Điều chỉnh tồn';
    }

    getTypeIconClass(type: number): string {
        if (type === 0) return 'type-in';
        if (type === 1) return 'type-out';
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
