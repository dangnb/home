import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockTakeService, StockTakeDto, StockTakeStatus } from '../../core/services/stock-take.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-stock-takes',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './stock-takes.component.html',
  styleUrls: ['./stock-takes.component.scss']
})
export class StockTakesComponent implements OnInit {
  stockTakes: StockTakeDto[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  isLoading = false;
  StockTakeStatus = StockTakeStatus;

  constructor(
    private stockTakeService: StockTakeService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadStockTakes();
  }

  loadStockTakes(): void {
    this.isLoading = true;
    this.stockTakeService.getStockTakes(this.pageIndex, this.pageSize).subscribe({
      next: (res: any) => {
        console.log('StockTakes API Response:', res);
        this.stockTakes = res.items || res.Items || [];
        this.totalCount = res.totalCount || res.TotalCount || 0;
        this.totalPages = res.totalPages || res.TotalPages || 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading stock takes', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: StockTakeStatus): string {
    switch (status) {
      case StockTakeStatus.Draft: return 'badge-secondary';
      case StockTakeStatus.InProgress: return 'badge-primary';
      case StockTakeStatus.Completed: return 'badge-success';
      case StockTakeStatus.Cancelled: return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: StockTakeStatus): string {
    switch (status) {
      case StockTakeStatus.Draft: return this.translate.instant('STOCK_TAKES.STATUS_DRAFT');
      case StockTakeStatus.InProgress: return this.translate.instant('STOCK_TAKES.STATUS_IN_PROGRESS');
      case StockTakeStatus.Completed: return this.translate.instant('STOCK_TAKES.STATUS_COMPLETED');
      case StockTakeStatus.Cancelled: return this.translate.instant('STOCK_TAKES.STATUS_CANCELLED');
      default: return 'Unknown';
    }
  }

  previousPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadStockTakes();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.loadStockTakes();
    }
  }
}
