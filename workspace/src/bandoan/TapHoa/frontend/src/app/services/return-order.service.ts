import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReturnOrderDto {
  id: string;
  returnCode: string;
  originalOrderId: string;
  originalOrderCode: string;
  customerName: string;
  returnDate: string;
  reason?: string;
  status: number;
  refundAmount: number;
  createdBy: string;
  details: ReturnOrderDetailDto[];
}

export interface ReturnOrderDetailDto {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  refundPrice: number;
  subTotal: number;
}

export interface CreateReturnOrderCommand {
  originalOrderId: string;
  reason?: string;
  items: ReturnItemDto[];
}

export interface ReturnItemDto {
  productId: string;
  quantity: number;
}

export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReturnOrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/return-orders`;

  getReturnOrders(page: number, pageSize: number, searchTerm?: string): Observable<PaginatedList<ReturnOrderDto>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedList<ReturnOrderDto>>(this.apiUrl, { params });
  }

  getReturnOrderById(id: string): Observable<ReturnOrderDto> {
    return this.http.get<ReturnOrderDto>(`${this.apiUrl}/${id}`);
  }

  createReturnOrder(command: CreateReturnOrderCommand): Observable<string> {
    return this.http.post<string>(this.apiUrl, command);
  }

  approveReturnOrder(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {});
  }
}
