import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { RevenueProfitReport, TopProductReport } from '../../models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, TranslatePipe],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = true;
  
  // Filters
  filterType: string = 'thisMonth';
  customFromDate: string = '';
  customToDate: string = '';
  groupBy: string = 'day'; // day, week, month

  // Data
  summary: RevenueProfitReport = { totalRevenue: 0, totalProfit: 0, totalOrders: 0, chartData: [] };
  topProducts: TopProductReport[] = [];

  // Charts
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      { data: [], label: 'Doanh thu (₫)', borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.1)', fill: true },
      { data: [], label: 'Lợi nhuận (₫)', borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }
    ],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 } // smooth curves
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  public lineChartType: ChartType = 'line';

  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      { data: [], label: 'Doanh thu (₫)', backgroundColor: '#3b82f6' }
    ],
    labels: []
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };
  public barChartType: ChartType = 'bar';

  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private reportService: ReportService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.applyFilter();
  }

  onFilterChange() {
    this.applyFilter();
  }

  applyFilter() {
    let fromDate = new Date();
    let toDate = new Date();
    
    switch (this.filterType) {
      case 'today':
        this.groupBy = 'day';
        break;
      case 'thisWeek':
        fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1); // Monday
        this.groupBy = 'day';
        break;
      case 'thisMonth':
        fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
        this.groupBy = 'day';
        break;
      case 'thisYear':
        fromDate = new Date(fromDate.getFullYear(), 0, 1);
        this.groupBy = 'month';
        break;
      case 'custom':
        if (!this.customFromDate || !this.customToDate) return;
        fromDate = new Date(this.customFromDate);
        toDate = new Date(this.customToDate);
        // auto choose group by
        const diffDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 60) this.groupBy = 'month';
        else if (diffDays > 14) this.groupBy = 'week';
        else this.groupBy = 'day';
        break;
    }

    const fromStr = this.datePipe.transform(fromDate, 'yyyy-MM-dd')!;
    const toStr = this.datePipe.transform(toDate, 'yyyy-MM-dd')!;

    this.loadData(fromStr, toStr);
  }

  loadData(fromDate: string, toDate: string) {
    this.isLoading = true;
    let pendingRequests = 2;

    const checkComplete = () => {
      pendingRequests--;
      if (pendingRequests === 0) {
        this.isLoading = false;
      }
    };

    // Load Revenue
    this.reportService.getRevenueReport(fromDate, toDate, this.groupBy).subscribe({
      next: (data) => {
        this.summary = data;
        this.updateLineChart();
        checkComplete();
      },
      error: (err) => {
        console.error('Error loading revenue:', err);
        checkComplete();
      }
    });

    // Load Top Products
    this.reportService.getTopProducts(fromDate, toDate, 10, 'revenue').subscribe({
      next: (data) => {
        this.topProducts = data;
        this.updateBarChart();
        checkComplete();
      },
      error: (err) => {
        console.error('Error loading top products:', err);
        checkComplete();
      }
    });
  }

  private updateLineChart() {
    const data = this.summary?.chartData || [];
    this.lineChartData = {
      labels: data.map(d => d.label),
      datasets: [
        {
          data: data.map(d => d.revenue),
          label: 'Doanh thu (₫)',
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
        },
        {
          data: data.map(d => d.profit),
          label: 'Lợi nhuận (₫)',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
        }
      ]
    };
  }

  private updateBarChart() {
    const data = this.topProducts || [];
    this.barChartData = {
      labels: data.map(p => p.productName.length > 20 ? p.productName.substring(0, 20) + '...' : p.productName),
      datasets: [
        {
          data: data.map(p => p.totalRevenue),
          label: 'Doanh thu (₫)',
          backgroundColor: '#3b82f6',
        }
      ]
    };
  }
}
