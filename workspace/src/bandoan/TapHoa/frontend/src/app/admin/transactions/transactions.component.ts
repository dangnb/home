import { Component, OnInit, inject, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-transactions',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './transactions.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
    private transactionService = inject(TransactionService);
    private alertService = inject(AlertService);

    transactions: any[] = [];
    paginatedTransactions: any[] = [];
    isLoading = true;
    error = '';

    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    searchTerm = '';
    filteredTransactions: any[] = [];

    activeDropdownRowId: string | null = null;

    toggleDropdown(id: string, event: Event) {
        event.stopPropagation();
        this.activeDropdownRowId = this.activeDropdownRowId === id ? null : id;
    }

    @HostListener('document:click')
    closeDropdown() {
        this.activeDropdownRowId = null;
    }

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
                this.transactions = data || [];
                this.onSearchChange();
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = 'Không thể tải danh sách giao dịch';
                this.isLoading = false;
            }
        });
    }

    onSearchChange() {
        if (!this.searchTerm) {
            this.filteredTransactions = [...this.transactions];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredTransactions = this.transactions.filter(t => 
                (t.code && t.code.toLowerCase().includes(term)) ||
                (t.createdBy && t.createdBy.toLowerCase().includes(term))
            );
        }
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.paginatedTransactions = this.filteredTransactions.slice(startIndex, startIndex + this.pageSize);
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
        if (type === 5) return 'Xuất hủy hàng (Wastage)';
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
        if (status === 1) return 'status-draft'; // Draft
        if (status === 2) return 'status-pending'; // PendingApproval
        return 'status-success'; // Completed
    }

    getStatusLabel(status: number): string {
        if (status === 1) return 'Đã lưu nháp';
        if (status === 2) return 'Đang xử lý';
        return 'Hoàn thành';
    }

    approveTransaction(id: string, type: number = 1) {
        const title = type === 1 ? 'Duyệt phiếu nhập' : 'Duyệt phiếu xuất';
        const msg = type === 1 ? 'số lượng hàng hóa sẽ chính thức được cộng vào kho.' : 'số lượng hàng hóa sẽ chính thức bị trừ khỏi kho.';

        this.alertService.confirm(title, `Bằng cách duyệt phiếu này, ${msg} Bạn có chắc chắn số liệu đã chính xác?`, 'Có, duyệt ngay', 'Hủy').then((result: any) => {
            if (result.isConfirmed) {
                this.transactionService.approveTransaction(id).subscribe({
                    next: (res: any) => {
                        this.alertService.success('Thành công', 'Đã duyệt phiếu và cập nhật tồn kho thành công!');
                        this.fetchTransactions(); // Reload data
                    },
                    error: (err: any) => {
                        console.error(err);
                        this.alertService.error('Lỗi', 'Không thể duyệt phiếu: ' + (err.error?.message || err.message));
                    }
                });
            }
        });
    }

    deleteTransaction(id: string) {
        this.alertService.confirm('Xóa phiếu giao dịch', 'Bạn có chắc chắn muốn xóa vĩnh viễn phiếu giao dịch này? Hành động này không thể hoàn tác.', 'Có, xóa ngay', 'Hủy').then((result: any) => {
            if (result.isConfirmed) {
                this.transactionService.deleteTransaction(id).subscribe({
                    next: (res: any) => {
                        this.alertService.success('Thành công', 'Đã xóa phiếu giao dịch!');
                        this.fetchTransactions();
                    },
                    error: (err: any) => {
                        console.error(err);
                        this.alertService.error('Lỗi', 'Không thể xóa phiếu: ' + (err.error?.message || err.message));
                    }
                });
            }
        });
    }
}
