import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
    id: string;
    code: string;
    name: string;
}

export interface TransactionSummary {
    id: string;
    code: string;
    type: string;
    warehouseName: string;
    status: string;
    totalItems: number;
    createdAt: string;
}

export interface TransactionDetailDto {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface CreateTransactionDto {
    code: string;
    type: string;
    warehouseId: string;
    note: string;
    details: TransactionDetailDto[];
}

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private apiUrl = 'http://localhost:5062/api/inventory';

    constructor(private http: HttpClient) { }

    getWarehouses(): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(`${this.apiUrl}/warehouses`);
    }

    getTransactions(): Observable<TransactionSummary[]> {
        return this.http.get<TransactionSummary[]>(`${this.apiUrl}/transactions`);
    }

    createTransaction(dto: CreateTransactionDto): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(`${this.apiUrl}/transactions`, dto);
    }

    approveTransaction(id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/transactions/${id}/approve`, {});
    }
}
