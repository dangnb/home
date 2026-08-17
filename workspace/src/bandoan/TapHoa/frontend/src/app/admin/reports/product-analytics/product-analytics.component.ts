import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { TopProductReport, DeadStockReport } from '../../../models/report.model';

@Component({
  selector: 'app-product-analytics',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-analytics.component.html',
  styleUrl: './product-analytics.component.scss'
})
export class ProductAnalyticsComponent implements OnInit {
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  fromDate: string;
  toDate: string;
  topLimit = 10;
  topOrderBy: 'quantity' | 'revenue' = 'quantity';
  
  deadStockDaysThreshold = 30;

  topProducts: TopProductReport[] = [];
  deadStock: DeadStockReport[] = [];

  isLoadingTop = false;
  isLoadingDeadStock = false;

  constructor() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = firstDay.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadTopProducts();
    this.loadDeadStock();
  }

  loadTopProducts() {
    this.isLoadingTop = true;
    this.reportService.getTopProducts(this.fromDate, this.toDate, this.topLimit, this.topOrderBy).subscribe({
      next: (res) => {
        this.topProducts = res;
        this.isLoadingTop = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo top sản phẩm:', err);
        this.isLoadingTop = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadDeadStock() {
    this.isLoadingDeadStock = true;
    this.reportService.getDeadStock(this.deadStockDaysThreshold).subscribe({
      next: (res) => {
        this.deadStock = res;
        this.isLoadingDeadStock = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo hàng chậm luân chuyển:', err);
        this.isLoadingDeadStock = false;
        this.cdr.detectChanges();
      }
    });
  }
}
