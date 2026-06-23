import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface SalesOrder {
  id: string;
  code: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="card card-flush">
      <div class="card-header align-items-center py-5 gap-2 gap-md-5">
        <div class="card-title">
          <h2>🏷️ Sales Orders</h2>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-primary" (click)="loadOrders()">+ Create Order</button>
        </div>
      </div>
      <div class="card-body pt-0">
        <table class="table align-middle table-row-dashed fs-6 gy-5 table-hover">
          <thead>
            <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
              <th>Order Code</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody class="fw-bold text-gray-600">
            @for (order of orders; track order.id) {
              <tr>
                <td class="text-dark">{{ order.code }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.orderDate | date:'mediumDate' }}</td>
                <td class="text-primary">{{ order.totalAmount | currency:'USD' }}</td>
                <td>
                  <span class="badge" [class.badge-light-success]="order.status === 'APPROVED'" [class.badge-light-warning]="order.status === 'DRAFT'">
                    {{ order.status }}
                  </span>
                </td>
                <td class="text-end">
                  @if (order.status === 'DRAFT') {
                    <button class="btn btn-sm btn-light-primary" (click)="approveOrder(order.id)">Approve</button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-center text-muted py-10">No sales orders found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [` `]
})
export class SalesComponent implements OnInit {
  orders: SalesOrder[] = [];
  apiUrl = 'http://localhost:5062/api/salesorders'; // Will be proxied in real app

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<SalesOrder[]>(this.apiUrl).subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error fetching sales orders', err)
    });
  }

  approveOrder(id: string) {
    if (confirm("Are you sure you want to approve this order? This will generate a WMS Outbound Transaction automatically.")) {
      // Mocking a default warehouse GUID (can be dynamic in real implementation)
      const warehouseId = '00000000-0000-0000-0000-000000000000';
      this.http.post(`${this.apiUrl}/${id}/approve`, `"${warehouseId}"`, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: () => {
          alert('Sales Order approved successfully!');
          this.loadOrders();
        },
        error: (err) => {
          alert('Error approving order. Make sure you use a valid Warehouse ID format if your backend requires it.');
          console.error(err);
        }
      });
    }
  }
}
