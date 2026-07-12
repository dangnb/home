import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SupplierDebtDto {
  id: string;
  supplierId: string;
  supplierName: string;
  phoneNumber?: string;
  totalDebt: number;
}

export enum SupplierDebtTransactionType {
  Debt = 0,
  Payment = 1
}

export interface SupplierDebtTransactionDto {
  id: string;
  supplierId: string;
  type: SupplierDebtTransactionType;
  amount: number;
  paidAmount: number;
  note?: string;
  relatedDebtId?: string;
  dueDate?: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierLedgerService {
  private apiUrl = `${environment.apiUrl}/supplier-ledger`;

  private http = inject(HttpClient);

  getSupplierDebts(): Observable<SupplierDebtDto[]> {
    return this.http.get<SupplierDebtDto[]>(this.apiUrl);
  }

  getTransactions(supplierId: string): Observable<SupplierDebtTransactionDto[]> {
    return this.http.get<SupplierDebtTransactionDto[]>(`${this.apiUrl}/${supplierId}/transactions`);
  }

  recordDebt(data: { supplierId: string, amount: number, note?: string, dueDate?: string }): Observable<{ debtId: string }> {
    return this.http.post<{ debtId: string }>(`${this.apiUrl}/record`, data);
  }

  payDebt(data: { supplierId: string, amount: number, note?: string }): Observable<{ debtId: string }> {
    return this.http.post<{ debtId: string }>(`${this.apiUrl}/pay`, data);
  }

  paySpecificDebt(data: { supplierId: string, debtTransactionId: string, amount: number, note?: string }): Observable<{ debtId: string }> {
    return this.http.post<{ debtId: string }>(`${this.apiUrl}/pay-specific`, data);
  }
}
