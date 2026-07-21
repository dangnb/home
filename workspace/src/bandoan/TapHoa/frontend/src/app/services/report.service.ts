import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RevenueProfitReport, TopProductReport, ProfitLossReport, DeadStockReport, CustomerAnalytics, EmployeePerformance } from '../models/report.model';

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

  getProfitLossReport(month: number, year: number): Observable<ProfitLossReport> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<ProfitLossReport>(`${this.apiUrl}/profit-loss`, { params });
  }

  getDeadStock(daysThreshold: number = 30): Observable<DeadStockReport[]> {
    const params = new HttpParams().set('daysThreshold', daysThreshold.toString());
    return this.http.get<DeadStockReport[]>(`${this.apiUrl}/dead-stock`, { params });
  }

  getTopCustomers(fromDate: string, toDate: string, limit: number = 10): Observable<CustomerAnalytics[]> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('limit', limit.toString());
    return this.http.get<CustomerAnalytics[]>(`${this.apiUrl}/top-customers`, { params });
  }

  getEmployeePerformance(fromDate: string, toDate: string): Observable<EmployeePerformance[]> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<EmployeePerformance[]>(`${this.apiUrl}/employee-performance`, { params });
  }
}
