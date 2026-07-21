import { Component, OnInit, inject, ChangeDetectionStrategy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-transactions',
    imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
    templateUrl: './transactions.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
    private transactionService = inject(TransactionService);
    private alertService = inject(AlertService);
    private t = inject(TranslateService);
    private cdr = inject(ChangeDetectorRef);

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
        this.cdr.detectChanges();
    }

    @HostListener('document:click')
    closeDropdown() {
        this.activeDropdownRowId = null;
        this.cdr.detectChanges();
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
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.error = this.t.instant('TRANSACTIONS.LOAD_ERROR');
                this.isLoading = false;
                this.cdr.detectChanges();
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
        if (type === 1) return this.t.instant('TRANSACTIONS.TYPE_INBOUND');
        if (type === 2) return this.t.instant('TRANSACTIONS.TYPE_OUTBOUND');
        if (type === 3) return this.t.instant('TRANSACTIONS.TYPE_ADJUSTMENT');
        if (type === 4) return this.t.instant('TRANSACTIONS.TYPE_TRANSFER');
        if (type === 5) return this.t.instant('TRANSACTIONS.TYPE_WASTAGE');
        return this.t.instant('COMMON.OTHER');
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
        if (status === 1) return this.t.instant('TRANSACTIONS.STATUS_DRAFT');
        if (status === 2) return this.t.instant('TRANSACTIONS.STATUS_PENDING');
        return this.t.instant('TRANSACTIONS.STATUS_COMPLETED');
    }

    approveTransaction(id: string, type: number = 1) {
        const title = type === 1 ? this.t.instant('TRANSACTIONS.APPROVE_INBOUND_TITLE') : this.t.instant('TRANSACTIONS.APPROVE_OUTBOUND_TITLE');
        const msg = type === 1 ? this.t.instant('TRANSACTIONS.APPROVE_INBOUND_MSG') : this.t.instant('TRANSACTIONS.APPROVE_OUTBOUND_MSG');

        this.alertService.confirm(title, this.t.instant('TRANSACTIONS.APPROVE_CONFIRM', { msg }), this.t.instant('TRANSACTIONS.YES_APPROVE'), this.t.instant('COMMON.CANCEL')).then((result: any) => {
            if (result.isConfirmed) {
                this.transactionService.approveTransaction(id).subscribe({
                    next: (res: any) => {
                        this.alertService.success(this.t.instant('COMMON.SUCCESS'), this.t.instant('TRANSACTIONS.APPROVE_SUCCESS'));
                        this.fetchTransactions(); // Reload data
                    },
                    error: (err: any) => {
                        console.error(err);
                        this.alertService.error(this.t.instant('COMMON.ERROR'), this.t.instant('TRANSACTIONS.APPROVE_ERROR') + ' ' + (err.error?.message || err.message));
                    }
                });
            }
        });
    }

    deleteTransaction(id: string) {
        this.alertService.confirm(this.t.instant('TRANSACTIONS.DELETE_TITLE'), this.t.instant('TRANSACTIONS.DELETE_CONFIRM'), this.t.instant('TRANSACTIONS.YES_DELETE'), this.t.instant('COMMON.CANCEL')).then((result: any) => {
            if (result.isConfirmed) {
                this.transactionService.deleteTransaction(id).subscribe({
                    next: (res: any) => {
                        this.alertService.success(this.t.instant('COMMON.SUCCESS'), this.t.instant('TRANSACTIONS.DELETE_SUCCESS'));
                        this.fetchTransactions();
                    },
                    error: (err: any) => {
                        console.error(err);
                        this.alertService.error(this.t.instant('COMMON.ERROR'), this.t.instant('TRANSACTIONS.DELETE_ERROR') + ' ' + (err.error?.message || err.message));
                    }
                });
            }
        });
    }
}
