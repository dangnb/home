import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateOrderCommand, OrderDto } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  createOrder(command: CreateOrderCommand): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, command);
  }

  getPagedOrders(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    fromDate?: string,
    toDate?: string,
    status?: number
  ): Observable<{ items: OrderDto[], totalCount: number, pageIndex: number, pageSize: number }> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    if (status) params = params.set('status', status);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
