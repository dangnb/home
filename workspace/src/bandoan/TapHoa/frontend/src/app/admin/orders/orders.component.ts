import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderDto, OrderStatus, PaymentMethod } from '../../models/order.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: OrderDto[] = [];
  searchTerm = '';
  
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
    this.orderService.getPagedOrders(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (res: any) => {
        console.log('Orders API Response:', res);
        this.orders = res.items || res.Items || res.data?.items || res.data?.Items || [];
        this.totalCount = res.totalCount || res.TotalCount || res.data?.totalCount || res.data?.TotalCount || 0;
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
