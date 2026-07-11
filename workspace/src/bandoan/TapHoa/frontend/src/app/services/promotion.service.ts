import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/promotions`;

  getPagedPromotions(pageNumber: number, pageSize: number, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getActivePromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.apiUrl}/active`);
  }

  getPromotionById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  createPromotion(promotion: Partial<Promotion>): Observable<string> {
    return this.http.post<string>(this.apiUrl, promotion);
  }

  updatePromotion(id: string, promotion: Partial<Promotion>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, promotion);
  }

  togglePromotionStatus(id: string, isActive: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/toggle`, { id, isActive });
  }

  deletePromotion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
