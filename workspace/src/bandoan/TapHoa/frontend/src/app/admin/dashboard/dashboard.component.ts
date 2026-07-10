import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService, DashboardSummaryDto } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummaryDto | null = null;
  isLoading = true;

  // Chart configuration for Stock Value
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0']
    }]
  };
  public pieChartType: ChartType = 'pie';

  // Bar chart for Top Products
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Số lượng xuất', backgroundColor: '#3f51b5' }
    ]
  };
  public barChartType: ChartType = 'bar';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.isLoading = true;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.processChartData(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  processChartData(data: DashboardSummaryDto) {
    if (data.topProducts && data.topProducts.length > 0) {
      this.barChartData.labels = data.topProducts.map(p => p.productName);
      this.barChartData.datasets[0].data = data.topProducts.map(p => p.totalExportQuantity);
      
      this.pieChartData.labels = data.topProducts.map(p => p.productName);
      this.pieChartData.datasets[0].data = data.topProducts.map(p => p.totalExportQuantity);
    }
  }

  getMaxExportQuantity(): number {
    if (!this.summary || !this.summary.topProducts || this.summary.topProducts.length === 0) {
      return 1;
    }
    return Math.max(...this.summary.topProducts.map(p => p.totalExportQuantity));
  }

  getPercentage(quantity: number): number {
    const max = this.getMaxExportQuantity();
    return Math.round((quantity / max) * 100);
  }
}
