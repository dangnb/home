import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CashBookEntry, CashBookSummary } from '../models/cashbook.model';

@Injectable({
  providedIn: 'root'
})
export class CashBookService {
  private apiUrl = `${environment.apiUrl}/cashbook`;

  constructor(private http: HttpClient) { }

  getEntries(page: number, size: number, fromDate?: string, toDate?: string, type?: number, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());

    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    if (type) params = params.set('type', type.toString());
    if (category) params = params.set('category', category);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getSummary(fromDate: string, toDate: string): Observable<CashBookSummary> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<CashBookSummary>(`${this.apiUrl}/summary`, { params });
  }

  createEntry(entry: Partial<CashBookEntry>): Observable<any> {
    return this.http.post<any>(this.apiUrl, entry);
  }

  updateEntry(id: string, entry: Partial<CashBookEntry>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, entry);
  }

  deleteEntry(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
