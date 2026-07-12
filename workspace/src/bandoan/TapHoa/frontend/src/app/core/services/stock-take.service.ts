import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum StockTakeStatus {
  Draft = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export interface StockTakeDto {
  id: string;
  documentNo: string;
  status: StockTakeStatus;
  notes?: string;
  createdDate: string;
  createdBy: string;
  totalLines: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  pageIndex: number;
}

export interface StockTakeLineDto {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  expectedQuantity: number;
  actualQuantity?: number;
  difference: number;
  reason?: string;
}

export interface StockTakeDetailDto extends StockTakeDto {
  lines: StockTakeLineDto[];
}

export interface CreateStockTakeCommand {
  documentNo: string;
  notes?: string;
  categoryId?: string;
  productIds?: string[];
}

export interface UpdateStockTakeLineRequest {
  lineId: string;
  actualQuantity: number;
  reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockTakeService {
  private apiUrl = `${environment.apiUrl}/stock-takes`;

  private http = inject(HttpClient);

  getStockTakes(pageIndex: number = 1, pageSize: number = 10): Observable<PagedResult<StockTakeDto>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<StockTakeDto>>(this.apiUrl, { params });
  }

  getStockTakeById(id: string): Observable<StockTakeDetailDto> {
    return this.http.get<StockTakeDetailDto>(`${this.apiUrl}/${id}`);
  }

  createStockTake(command: CreateStockTakeCommand): Observable<{ id: string, message: string }> {
    return this.http.post<{ id: string, message: string }>(this.apiUrl, command);
  }

  updateStockTakeLine(stockTakeId: string, request: UpdateStockTakeLineRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${stockTakeId}/lines`, request);
  }

  completeStockTake(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/complete`, {});
  }
}
