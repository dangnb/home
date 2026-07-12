import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummaryDto {
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  lowStockCount: number;
  totalStockValue: number;
  recentTransactions: DashboardRecentTransactionDto[];
  topProducts: DashboardTopProductDto[];
}

export interface DashboardRecentTransactionDto {
  transactionCode: string;
  createdAt: string;
  type: number;
  createdBy: string;
  totalValue: number;
}

export interface DashboardTopProductDto {
  productId: string;
  productName: string;
  category: string;
  totalExportQuantity: number;
  totalExportValue: number;
  unit: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  private http = inject(HttpClient);

  getSummary(): Observable<DashboardSummaryDto> {
    return this.http.get<DashboardSummaryDto>(`${this.apiUrl}/summary`);
  }
}
