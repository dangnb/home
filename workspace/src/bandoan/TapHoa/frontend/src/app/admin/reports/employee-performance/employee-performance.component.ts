import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { EmployeePerformance } from '../../../models/report.model';

@Component({
  selector: 'app-employee-performance',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-performance.component.html',
  styleUrl: './employee-performance.component.scss'
})
export class EmployeePerformanceComponent implements OnInit {
  private reportService = inject(ReportService);
  private cdr = inject(ChangeDetectorRef);

  fromDate: string;
  toDate: string;
  
  employees: EmployeePerformance[] = [];
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
    this.reportService.getEmployeePerformance(this.fromDate, this.toDate).subscribe({
      next: (res) => {
        this.employees = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải báo cáo nhân viên:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
