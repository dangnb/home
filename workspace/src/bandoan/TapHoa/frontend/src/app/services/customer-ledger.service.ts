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

  getDebts(): Observable<CustomerDebt[]> {
    return this.http.get<CustomerDebt[]>(this.apiUrl);
  }

  recordDebt(customerId: string, amount: number, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/record`, { customerId, amount, note });
  }

  recordPayment(customerId: string, amount: number, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/pay`, { customerId, amount, note });
  }
}
