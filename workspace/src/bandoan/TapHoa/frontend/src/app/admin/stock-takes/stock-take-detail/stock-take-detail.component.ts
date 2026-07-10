import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StockTakeService, StockTakeDetailDto, StockTakeStatus, StockTakeLineDto } from '../../../core/services/stock-take.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-take-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  get filteredLines(): StockTakeLineDto[] {
    if (!this.stockTake) return [];
    if (!this.searchQuery) return this.stockTake.lines;
    const q = this.searchQuery.toLowerCase();
    return this.stockTake.lines.filter(l =>
      l.productName.toLowerCase().includes(q) ||
      l.sku.toLowerCase().includes(q)
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockTakeService: StockTakeService,
    private cdr: ChangeDetectorRef
  ) { }

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

  saveLine(line: StockTakeLineDto): void {
    if (!this.stockTake) return;

    // Only save if actualQuantity is filled
    if (line.actualQuantity === null || line.actualQuantity === undefined) return;

    this.isSaving = true;
    this.stockTakeService.updateStockTakeLine(this.stockTake.id, {
      lineId: line.id,
      actualQuantity: line.actualQuantity,
      reason: line.reason
    }).subscribe({
      next: () => {
        this.isSaving = false;
        // Optionally update the overall status locally if it just transitioned from Draft to InProgress
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
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isCompleting = true;
        this.cdr.detectChanges();
        this.stockTakeService.completeStockTake(this.stockTake.id).subscribe({
          next: () => {
            this.isCompleting = false;
            this.cdr.detectChanges();
            Swal.fire(
              'Thành công!',
              'Phiếu kiểm kê đã hoàn tất và kho đã được điều chỉnh!',
              'success'
            ).then(() => {
              this.router.navigate(['/admin/stock-takes']);
            });
          },
          error: (err: any) => {
            console.error('Error completing stock take', err);
            this.isCompleting = false;
            this.cdr.detectChanges();
            Swal.fire(
              'Lỗi!',
              'Có lỗi xảy ra khi hoàn tất phiếu kiểm kê.',
              'error'
            );
          }
        });
      }
    });
  }

  getStatusClass(status: StockTakeStatus): string {
    switch (status) {
      case StockTakeStatus.Draft: return 'badge-secondary';
      case StockTakeStatus.InProgress: return 'badge-primary';
      case StockTakeStatus.Completed: return 'badge-success';
      case StockTakeStatus.Cancelled: return 'badge-danger';
      default: return 'badge-secondary';
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
