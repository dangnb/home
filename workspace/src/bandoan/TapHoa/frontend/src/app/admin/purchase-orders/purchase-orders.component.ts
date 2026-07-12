import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseOrderService, PurchaseOrder } from '../../services/purchase-order.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, TranslateModule],
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
      case 'Draft': return 'bg-secondary text-white';
      case 'Processing': return 'bg-primary text-white';
      case 'Completed': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  }
}
