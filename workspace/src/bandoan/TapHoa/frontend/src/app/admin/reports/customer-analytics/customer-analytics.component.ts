import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { CustomerAnalytics } from '../../../models/report.model';

@Component({
  selector: 'app-customer-analytics',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-analytics.component.html',
  styleUrl: './customer-analytics.component.scss'
})
export class CustomerAnalyticsComponent implements OnInit {
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  fromDate: string;
  toDate: string;
  limit = 10;
  
  customers: CustomerAnalytics[] = [];
  isLoading = false;

  constructor() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = firstDay.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.reportService.getTopCustomers(this.fromDate, this.toDate, this.limit).subscribe({
      next: (res) => {
        this.customers = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo khách hàng:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
