import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardSummaryDto } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummaryDto | null = null;
  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.isLoading = true;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
        this.isLoading = false;
      }
    });
  }

  // Helper method for progress bars
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
