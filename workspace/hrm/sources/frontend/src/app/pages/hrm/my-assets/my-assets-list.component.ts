import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../../core/hrm/services/asset.service';

@Component({
  selector: 'app-my-assets-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-assets-list.component.html',
  styleUrls: []
})
export class MyAssetsListComponent implements OnInit {
  private assetService = inject(AssetService);

  myAssets: any[] = [];
  loading = false;

  // Modal report issue state
  showModal = false;
  selectedAsset: any = null;
  issueDescription = '';
  submitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMyAssets();
  }

  loadMyAssets(): void {
    this.loading = true;
    this.assetService.getMyAssets().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.myAssets = res.data;
        } else {
          this.myAssets = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch my assets:', err);
        this.myAssets = [];
        this.loading = false;
      }
    });
  }

  get normalAssetsCount(): number {
    return this.myAssets.filter(a => a.status === 'IN_USE' || a.status === 'AVAILABLE').length;
  }

  get maintenanceAssetsCount(): number {
    return this.myAssets.filter(a => a.status === 'BROKEN' || a.status === 'MAINTENANCE').length;
  }

  getCategoryIcon(category: string): string {
    switch (category?.toUpperCase()) {
      case 'IT': return 'bi-laptop';
      case 'MACHINERY': return 'bi-cpu';
      case 'VEHICLE': return 'bi-truck';
      case 'OFFICE': return 'bi-briefcase';
      default: return 'bi-box-seam';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'IN_USE': return 'bg-success bg-opacity-10 text-success border border-success';
      case 'AVAILABLE': return 'bg-primary bg-opacity-10 text-primary border border-primary';
      case 'BROKEN': return 'bg-danger bg-opacity-10 text-danger border border-danger';
      case 'MAINTENANCE': return 'bg-warning bg-opacity-10 text-warning border border-warning';
      default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'IN_USE': return 'Đang sử dụng';
      case 'AVAILABLE': return 'Sẵn sàng';
      case 'BROKEN': return 'Báo hỏng';
      case 'MAINTENANCE': return 'Đang bảo trì';
      default: return status || 'N/A';
    }
  }

  openReportModal(asset: any): void {
    this.selectedAsset = asset;
    this.issueDescription = '';
    this.errorMessage = '';
    this.showModal = true;
  }

  closeReportModal(): void {
    this.showModal = false;
    this.selectedAsset = null;
    this.issueDescription = '';
    this.errorMessage = '';
  }

  submitReportIssue(): void {
    if (!this.selectedAsset || !this.issueDescription.trim()) return;

    this.submitting = true;
    this.errorMessage = '';

    this.assetService.createMaintenanceTicket(this.selectedAsset.id, {
      issueDescription: this.issueDescription.trim()
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success) {
          this.closeReportModal();
          this.loadMyAssets();
        } else {
          this.errorMessage = res.message || 'Không thể tạo phiếu báo hỏng.';
        }
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi tạo phiếu báo hỏng.';
      }
    });
  }
}
