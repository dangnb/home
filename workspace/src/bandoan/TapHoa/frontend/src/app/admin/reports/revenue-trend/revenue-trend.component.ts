import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { ReportService } from '../../../services/report.service';
import { RevenueProfitReport } from '../../../models/report.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-revenue-trend',
  imports: [CommonModule, FormsModule, NgApexchartsModule, TranslatePipe],
  templateUrl: './revenue-trend.component.html',
  styleUrl: './revenue-trend.component.scss'
})
export class RevenueTrendComponent implements OnInit {
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  fromDate: string;
  toDate: string;
  groupBy: 'day' | 'week' | 'month' = 'day';

  report: RevenueProfitReport | null = null;
  isLoading = false;

  public chartOptions: any;

  constructor() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = firstDay.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;
    this.reportService.getRevenueReport(this.fromDate, this.toDate, this.groupBy).subscribe({
      next: (res) => {
        this.report = res;
        this.initChart();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo doanh thu:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initChart() {
    if (!this.report?.chartData) return;

    const labels = this.report.chartData.map(d => d.label);
    const revenue = this.report.chartData.map(d => d.revenue);
    const profit = this.report.chartData.map(d => d.profit);

    this.chartOptions = {
      series: [
        {
          name: "Doanh thu",
          data: revenue
        },
        {
          name: "Lợi nhuận",
          data: profit
        }
      ],
      chart: {
        height: 400,
        type: "area",
        toolbar: { show: false }
      },
      colors: ["#3699FF", "#1BC5BD"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: labels,
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
          }
        }
      }
    };
  }
}
