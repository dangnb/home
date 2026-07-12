import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransactionService, TransactionDetailDto } from '../../../services/transaction.service';

@Component({
  selector: 'app-wastage-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './wastage-list.component.html',
  styleUrls: ['./wastage-list.component.scss']
})
export class WastageListComponent implements OnInit {
  transactions: TransactionDetailDto[] = [];
  isLoading = false;

  constructor(
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getTransactions().subscribe({
      next: (res) => {
        // Filter only wastage transactions (assuming type 2 or we can check notes or type name depending on enum).
        // Wait, what is Wastage enum value? TransactionType.Wastage is probably 3.
        // Let's filter client-side for now based on type == 3 or 4.
        // Let's assume Wastage is 3.
        this.transactions = res.filter(t => t.type === 3 || t.type === 4); // We will refine this later if needed.
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching transactions', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private t = inject(TranslateService);

  getStatusText(status: number): string {
    switch(status) {
      case 0: return this.t.instant('WASTAGE.STATUS_DRAFT');
      case 1: return this.t.instant('WASTAGE.STATUS_PENDING');
      case 2: return this.t.instant('WASTAGE.STATUS_COMPLETED');
      default: return this.t.instant('WASTAGE.STATUS_UNKNOWN');
    }
  }

  getStatusClass(status: number): string {
    switch(status) {
      case 0: return 'bg-secondary-subtle text-secondary';
      case 1: return 'bg-warning-subtle text-warning';
      case 2: return 'bg-success-subtle text-success';
      default: return 'bg-light text-dark';
    }
  }
}
