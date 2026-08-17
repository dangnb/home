import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StockTakeService, StockTakeDetailDto, StockTakeStatus, StockTakeLineDto } from '../../../core/services/stock-take.service';
import Swal from 'sweetalert2';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stock-take-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './stock-take-detail.component.html',
  styleUrls: ['./stock-take-detail.component.scss']
})
export class StockTakeDetailComponent implements OnInit {
  stockTake: StockTakeDetailDto | null = null;
  isLoading = true;
  isSaving = false;
  isCompleting = false;
  StockTakeStatus = StockTakeStatus;
  searchQuery = '';
  activeFilterTab: 'all' | 'unchecked' | 'matched' | 'discrepancy' = 'all';

  get totalItems(): number {
    return this.stockTake?.lines.length || 0;
  }

  get checkedCount(): number {
    return this.stockTake?.lines.filter(l => l.actualQuantity !== null && l.actualQuantity !== undefined).length || 0;
  }

  get matchedCount(): number {
    return this.stockTake?.lines.filter(l => l.actualQuantity !== null && l.actualQuantity !== undefined && l.difference === 0).length || 0;
  }

  get discrepancyCount(): number {
    return this.stockTake?.lines.filter(l => l.actualQuantity !== null && l.actualQuantity !== undefined && l.difference !== 0).length || 0;
  }

  get surplusCount(): number {
    return this.stockTake?.lines.filter(l => (l.difference ?? 0) > 0).length || 0;
  }

  get deficitCount(): number {
    return this.stockTake?.lines.filter(l => (l.difference ?? 0) < 0).length || 0;
  }

  get progressPercentage(): number {
    if (!this.totalItems) return 0;
    return Math.round((this.checkedCount / this.totalItems) * 100);
  }

  get filteredLines(): StockTakeLineDto[] {
    if (!this.stockTake) return [];
    let lines = this.stockTake.lines;

    // Filter by active tab
    if (this.activeFilterTab === 'unchecked') {
      lines = lines.filter(l => l.actualQuantity === null || l.actualQuantity === undefined);
    } else if (this.activeFilterTab === 'matched') {
      lines = lines.filter(l => l.actualQuantity !== null && l.actualQuantity !== undefined && l.difference === 0);
    } else if (this.activeFilterTab === 'discrepancy') {
      lines = lines.filter(l => l.actualQuantity !== null && l.actualQuantity !== undefined && l.difference !== 0);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      lines = lines.filter(l =>
        (l.productName && l.productName.toLowerCase().includes(q)) ||
        (l.sku && l.sku.toLowerCase().includes(q))
      );
    }
    return lines;
  }

  get isReadyToComplete(): boolean {
    if (!this.stockTake) return false;
    return this.stockTake.lines.every(l => l.actualQuantity !== null && l.actualQuantity !== undefined);
  }

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stockTakeService = inject(StockTakeService);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStockTake(id);
    }
  }

  loadStockTake(id: string): void {
    this.isLoading = true;
    this.stockTakeService.getStockTakeById(id).subscribe({
      next: (data: any) => {
        this.stockTake = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading stock take', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onQuantityChange(line: StockTakeLineDto): void {
    if (line.actualQuantity === null || line.actualQuantity === undefined) {
      line.difference = 0;
      return;
    }
    line.difference = line.actualQuantity - line.expectedQuantity;
    this.saveLine(line);
  }

  adjustQuantity(line: StockTakeLineDto, delta: number): void {
    if (this.stockTake?.status === StockTakeStatus.Completed || this.stockTake?.status === StockTakeStatus.Cancelled) return;
    const current = line.actualQuantity ?? line.expectedQuantity ?? 0;
    line.actualQuantity = Math.max(0, current + delta);
    this.onQuantityChange(line);
  }

  quickFillMatching(): void {
    if (!this.stockTake || this.stockTake.status === StockTakeStatus.Completed || this.stockTake.status === StockTakeStatus.Cancelled) return;

    Swal.fire({
      title: 'Tự động điền khớp kho?',
      text: 'Hệ thống sẽ gán Số lượng thực tế = Tồn dự kiến cho các mặt hàng chưa kiểm kê.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockTake!.lines.forEach(line => {
          if (line.actualQuantity === null || line.actualQuantity === undefined) {
            line.actualQuantity = line.expectedQuantity;
            line.difference = 0;
            this.saveLine(line);
          }
        });
        this.cdr.detectChanges();
      }
    });
  }

  saveLine(line: StockTakeLineDto): void {
    if (!this.stockTake) return;
    if (line.actualQuantity === null || line.actualQuantity === undefined) return;

    this.isSaving = true;
    this.stockTakeService.updateStockTakeLine(this.stockTake.id, {
      lineId: line.id,
      actualQuantity: line.actualQuantity,
      reason: line.reason
    }).subscribe({
      next: () => {
        this.isSaving = false;
        if (this.stockTake!.status === StockTakeStatus.Draft) {
          this.stockTake!.status = StockTakeStatus.InProgress;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving line', err);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  completeStockTake(): void {
    if (!this.stockTake) return;

    Swal.fire({
      title: 'Xác nhận hoàn tất',
      text: 'Bạn có chắc chắn muốn HOÀN TẤT phiếu kiểm kê này? Các số lượng DƯ/THIẾU sẽ được tự động ĐIỀU CHỈNH vào kho và KHÔNG THỂ HOÀN TÁC.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý hoàn tất',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isCompleting = true;
        this.cdr.detectChanges();
        this.stockTakeService.completeStockTake(this.stockTake!.id).subscribe({
          next: () => {
            this.isCompleting = false;
            this.cdr.detectChanges();
            Swal.fire(
              'Thành công!',
              'Phiếu kiểm kê đã hoàn tất và kho đã được điều chỉnh thành công!',
              'success'
            ).then(() => {
              this.router.navigate(['/admin/stock-takes']);
            });
          },
          error: (err: any) => {
            console.error('Error completing stock take', err);
            this.isCompleting = false;
            this.cdr.detectChanges();
            
            let errorMsg = 'Có lỗi xảy ra khi hoàn tất phiếu kiểm kê.';
            if (err.error) {
              if (typeof err.error === 'string') {
                errorMsg = err.error;
              } else if (err.error.message) {
                errorMsg = err.error.message;
              } else if (err.error.detail) {
                errorMsg = err.error.detail;
              }
            }
            
            Swal.fire(
              'Lỗi!',
              errorMsg,
              'error'
            );
          }
        });
      }
    });
  }

  getStatusClass(status: StockTakeStatus): string {
    switch (status) {
      case StockTakeStatus.Draft: return 'badge-light-secondary text-gray-700';
      case StockTakeStatus.InProgress: return 'badge-light-primary text-primary';
      case StockTakeStatus.Completed: return 'badge-light-success text-success';
      case StockTakeStatus.Cancelled: return 'badge-light-danger text-danger';
      default: return 'badge-light-secondary';
    }
  }

  getStatusText(status: StockTakeStatus): string {
    switch (status) {
      case StockTakeStatus.Draft: return 'Bản nháp';
      case StockTakeStatus.InProgress: return 'Đang kiểm kê';
      case StockTakeStatus.Completed: return 'Hoàn tất';
      case StockTakeStatus.Cancelled: return 'Đã hủy';
      default: return 'Không xác định';
    }
  }
}
