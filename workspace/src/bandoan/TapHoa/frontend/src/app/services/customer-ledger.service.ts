import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface CustomerDebt {
  customerId: string;
  totalDebt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerLedgerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customer-ledger`;

  getDebts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTransactions(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${customerId}/transactions`);
  }

  paySpecificDebt(transactionId: string, amount: number, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions/${transactionId}/pay`, { transactionId, amount, note });
  }

  recordDebt(customerId: string, amount: number, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { customerId, amount, note });
  }

  recordPayment(customerId: string, amount: number, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${customerId}/pay`, { debtId: customerId, amount, note });
  }
}
