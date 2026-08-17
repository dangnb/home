import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { ProfitLossReport } from '../../../models/report.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pl-report',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './pl-report.component.html',
  styleUrl: './pl-report.component.scss'
})
export class PlReportComponent implements OnInit {
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  month: number;
  year: number;
  
  report: ProfitLossReport | null = null;
  isLoading = false;

  Math = Math;

  constructor() {
    const now = new Date();
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();
  }

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;
    this.reportService.getProfitLossReport(this.month, this.year).subscribe({
      next: (res) => {
        this.report = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo P&L:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
