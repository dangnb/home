import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseOrderService, PurchaseOrder } from '../../services/purchase-order.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  constructor(private poService: PurchaseOrderService) {}

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
      },
      error: (err) => {
        console.error('Error loading purchase orders:', err);
        this.isLoading = false;
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Draft': return 'bg-secondary text-white';
      case 'Processing': return 'bg-primary text-white';
      case 'Completed': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Draft': return 'Nháp';
      case 'Processing': return 'Đang xử lý';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
