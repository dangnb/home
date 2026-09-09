import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '../../../../core/services/ecommerce.service';
import { OrderItem } from '../../../../core/models/ecommerce.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  private ecommerceService = inject(EcommerceService);

  orders: OrderItem[] = [];
  searchTerm = '';
  statusFilter = 'All';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ecommerceService.getOrders().subscribe(list => {
      this.orders = list;
    });
  }

  get filteredOrders(): OrderItem[] {
    return this.orders.filter(o => {
      const matchSearch = !this.searchTerm ||
        o.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchStatus = this.statusFilter === 'All' || o.status === this.statusFilter;

      return matchSearch && matchStatus;
    });
  }
}
