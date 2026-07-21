import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OperatingExpense, ExpenseSummary } from '../models/operating-expense.model';

@Injectable({
  providedIn: 'root'
})
export class OperatingExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) { }

  getExpenses(page: number, size: number, month?: number, year?: number, paymentStatus?: number, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());

    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    if (paymentStatus) params = params.set('paymentStatus', paymentStatus.toString());
    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getSummary(month: number, year: number): Observable<ExpenseSummary> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/summary`, { params });
  }

  createExpense(expense: Partial<OperatingExpense>): Observable<any> {
    return this.http.post<any>(this.apiUrl, expense);
  }

  updateExpense(id: string, expense: Partial<OperatingExpense>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, expense);
  }

  markAsPaid(id: string, paidDate: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/pay`, { paidDate });
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
