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
        if (type === 0) return 'bg-primary';
        if (type === 1) return 'bg-info text-dark';
        return 'bg-warning text-dark';
    }

    getTypeLabel(type: number): string {
        if (type === 0) return 'Nhập Kho';
        if (type === 1) return 'Xuất Kho';
        return 'Điều Chỉnh';
    }

    getStatusClass(status: number): string {
        if (status === 0) return 'bg-secondary';
        if (status === 1) return 'bg-warning text-dark';
        return 'bg-success';
    }

    getStatusLabel(status: number): string {
        if (status === 0) return 'Bản Nháp';
        if (status === 1) return 'Chờ Duyệt';
        return 'Hoàn Thành';
    }
}
