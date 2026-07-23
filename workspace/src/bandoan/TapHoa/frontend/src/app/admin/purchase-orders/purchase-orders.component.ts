import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PurchaseOrderService, PurchaseOrder } from '../../services/purchase-order.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, TranslatePipe],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent implements OnInit {
  private poService = inject(PurchaseOrderService);
  private cdr = inject(ChangeDetectorRef);

  purchaseOrders: PurchaseOrder[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.isLoading = true;
    this.poService.getAll().subscribe({
      next: (res) => {
        this.purchaseOrders = res;
        this.totalCount = res.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading purchase orders:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  autoDraft(): void {
    if (!confirm('Bạn có chắc chắn muốn hệ thống tự động quét tồn kho và tạo Phiếu Nhập nháp?')) {
      return;
    }
    
    this.isLoading = true;
    this.poService.autoDraftPurchaseOrders().subscribe({
      next: (res) => {
        alert(res.message);
        this.loadPurchaseOrders();
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra: ' + (err.error?.title || err.message));
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPurchaseOrders();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadPurchaseOrders();
  }

  getEnumString(status: any): string {
    if (typeof status === 'string') return status;
    const map: Record<number, string> = {
      0: 'Draft',
      1: 'Processing',
      2: 'Completed',
      3: 'Cancelled'
    };
    return map[status] || 'Draft';
  }

  getStatusBadgeClass(status: any): string {
    const s = this.getEnumString(status);
    switch (s) {
      case 'Draft': return 'badge-light-secondary text-gray-800 fw-bold border border-secondary-subtle';
      case 'Processing': return 'badge-light-primary text-primary fw-bold border border-primary-subtle';
      case 'Completed': return 'badge-light-success text-success fw-bold border border-success-subtle';
      case 'Cancelled': return 'badge-light-danger text-danger fw-bold border border-danger-subtle';
      default: return 'badge-light-secondary text-gray-700 fw-bold';
    }
  }

  getStatusText(status: any): string {
    const s = this.getEnumString(status);
    switch (s) {
      case 'Draft': return 'Bản nháp';
      case 'Processing': return 'Đang xử lý';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return 'Khác';
    }
  }
}
