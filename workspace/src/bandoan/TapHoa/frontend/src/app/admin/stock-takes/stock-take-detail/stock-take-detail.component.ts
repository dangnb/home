import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StockTakeService, StockTakeDetailDto, StockTakeStatus, StockTakeLineDto } from '../../../core/services/stock-take.service';

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
    private stockTakeService: StockTakeService
  ) {}

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
      },
      error: (err) => {
        console.error('Error loading stock take', err);
        this.isLoading = false;
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
      },
      error: (err) => {
        console.error('Error saving line', err);
        this.isSaving = false;
      }
    });
  }

  completeStockTake(): void {
    if (!this.stockTake) return;
    
    if (confirm('Bạn có chắc chắn muốn HOÀN TẤT phiếu kiểm kê này? Các số lượng DƯ/THIẾU sẽ được tự động ĐIỀU CHỈNH vào kho và KHÔNG THỂ HOÀN TÁC.')) {
      this.isCompleting = true;
      this.stockTakeService.completeStockTake(this.stockTake.id).subscribe({
        next: () => {
          this.isCompleting = false;
          alert('Phiếu kiểm kê đã hoàn tất và kho đã được điều chỉnh!');
          this.router.navigate(['/admin/stock-takes']);
        },
        error: (err: any) => {
          console.error('Error completing stock take', err);
          this.isCompleting = false;
          alert('Có lỗi xảy ra khi hoàn tất phiếu kiểm kê.');
        }
      });
    }
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
