import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { OrderDto, OrderStatus, PaymentMethod } from '../../models/order.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe, TranslatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderDto[] = [];
  searchTerm = '';
  fromDate = '';
  toDate = '';
  status: number | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  OrderStatus = OrderStatus;
  PaymentMethod = PaymentMethod;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getPagedOrders(this.currentPage, this.pageSize, this.searchTerm, this.fromDate, this.toDate, this.status || undefined).subscribe({
      next: (res: any) => {
        console.log('Orders API Response:', res);
        
        // Handle both object {items: ...} and flat array responses just in case
        if (Array.isArray(res)) {
          this.orders = res;
          this.totalCount = res.length;
        } else {
          this.orders = res.items || res.Items || res.data?.items || res.data?.Items || [];
          this.totalCount = res.totalCount || res.TotalCount || res.data?.totalCount || res.data?.TotalCount || 0;
        }
        
        // Force angular to update the view
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadOrders();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadOrders();
  }
}
