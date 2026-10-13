import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EquipmentPartFilterParams {
  keyword?: string;
  category?: string;
  lowStockOnly?: boolean;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentPartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/equipment-parts`;

  getParts(params?: EquipmentPartFilterParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.lowStockOnly !== undefined && params.lowStockOnly !== null) {
        httpParams = httpParams.set('lowStockOnly', params.lowStockOnly.toString());
      }
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getLookup(keyword?: string, limit: number = 100): Observable<any> {
    let httpParams = new HttpParams().set('limit', limit.toString());
    if (keyword) httpParams = httpParams.set('keyword', keyword);
    return this.http.get<any>(`${this.apiUrl}/lookup`, { params: httpParams });
  }

  createPart(payload: {
    code: string;
    name: string;
    category?: string;
    unit?: string;
    stockQuantity?: number;
    minStockQuantity?: number;
    unitPrice?: number;
    specifications?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updatePart(id: number, payload: {
    name: string;
    category?: string;
    unit?: string;
    stockQuantity?: number;
    minStockQuantity?: number;
    unitPrice?: number;
    specifications?: string;
    status?: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  adjustStock(id: number, deltaQuantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/stock-adjust`, { deltaQuantity });
  }

  deletePart(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
