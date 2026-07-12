import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RevenueProfitReport, TopProductReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  private http = inject(HttpClient);

  getRevenueReport(fromDate: string, toDate: string, groupBy: string = 'day'): Observable<RevenueProfitReport> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('groupBy', groupBy);

    return this.http.get<RevenueProfitReport>(`${this.apiUrl}/revenue`, { params });
  }

  getTopProducts(fromDate: string, toDate: string, limit: number = 10, orderBy: string = 'quantity'): Observable<TopProductReport[]> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('limit', limit.toString())
      .set('orderBy', orderBy);

    return this.http.get<TopProductReport[]>(`${this.apiUrl}/top-products`, { params });
  }
}
