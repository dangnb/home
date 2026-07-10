import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransactionService, TransactionDetailDto } from '../../services/transaction.service';

@Component({
    selector: 'app-transaction-detail',
    imports: [CommonModule, RouterModule],
    templateUrl: './transaction-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './transaction-detail.component.scss' // can re-use the specific styles
})
export class TransactionDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private transactionService = inject(TransactionService);

    transaction: TransactionDetailDto | null = null;
    isLoading = true;
    error = '';

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam && idParam !== 'create' && idParam !== 'edit') {
            this.fetchDetail(idParam);
        }
    }

    fetchDetail(id: string) {
        this.transactionService.getTransactionById(id).subscribe({
            next: (res) => {
                this.transaction = res;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Không tìm thấy hoặc có lỗi xảy ra.';
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    getTypeLabel(type: number) {
        if (type === 1) return 'Phiếu Nhập (Inbound)';
        if (type === 2) return 'Phiếu Xuất (Outbound)';
        if (type === 3) return 'Phiếu Điều Chỉnh (Adjustment)';
        if (type === 5) return 'Phiếu Hủy (Wastage)';
        return 'Khác';
    }

    getStatusLabel(status: number) {
        if (status === 1) return 'Bản Nháp';
        if (status === 2) return 'Chờ Duyệt';
        return 'Hoàn Thành';
    }

    getStatusBadgeClass(status: number) {
        if (status === 1) return 'bg-secondary';
        if (status === 2) return 'bg-warning text-dark';
        return 'bg-success';
    }

    get totalAmount() {
        if (!this.transaction || !this.transaction.lines) return 0;
        return this.transaction.lines.reduce((sum, line) => sum + (line.quantity * line.unitCost), 0);
    }
}
