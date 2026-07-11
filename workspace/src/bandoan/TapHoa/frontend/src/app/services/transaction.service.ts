import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TransactionLineDto {
    productId: string;
    quantity: number;
    unitCost: number;
    locationCode?: string;
    batchNumber?: string;
    mfgDate?: string;
    expiryDate?: string;
}

export interface CreateInboundTransactionRequest {
    referenceId: string;
    notes: string;
    lines: TransactionLineDto[];
    amountPaid?: number;
    supplierId?: string;
    customerId?: string;
}

export interface CreateWastageTransactionRequest {
    referenceId: string;
    notes: string;
    lines: {
        productId: string;
        quantity: number;
        unitPrice: number;
        locationCode?: string;
        batchNumber?: string;
        productBatchId?: string;
    }[];
}

export interface TransactionDetailDto {
    id: string;
    code: string;
    type: number; // 1=Inbound, 2=Outbound, 3=Adjustment, 4=Transfer, 5=Wastage
    referenceId: string;
    createdBy: string;
    notes: string;
    status: number; // 1=Draft, 2=PendingApproval, 3=Completed, 4=Cancelled
    createdAt: string;
    amountPaid: number;
    supplierId?: string;
    customerId?: string;
    lines: {
        productId: string;
        productName: string;
        quantity: number;
        unitCost: number;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http = inject(HttpClient);
    private backendUrl = environment.apiUrl;

    createInboundTransaction(payload: CreateInboundTransactionRequest): Observable<any> {
        return this.http.post(`${this.backendUrl}/transactions/inbound`, payload);
    }

    createOutboundTransaction(payload: CreateInboundTransactionRequest): Observable<any> {
        return this.http.post(`${this.backendUrl}/transactions/outbound`, payload);
    }

    createWastageTransaction(payload: CreateWastageTransactionRequest): Observable<any> {
        return this.http.post(`${this.backendUrl}/transactions/wastage`, payload);
    }

    getTransactions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.backendUrl}/transactions`);
    }

    getTransactionById(id: string): Observable<TransactionDetailDto> {
        return this.http.get<TransactionDetailDto>(`${this.backendUrl}/transactions/${id}`);
    }

    getProductTransactionHistory(productId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.backendUrl}/transactions/product/${productId}`);
    }

    approveTransaction(id: string): Observable<any> {
        return this.http.post(`${this.backendUrl}/transactions/${id}/approve`, {});
    }

    updateTransaction(id: string, payload: any): Observable<any> {
        return this.http.put(`${this.backendUrl}/transactions/${id}`, payload);
    }

    deleteTransaction(id: string): Observable<any> {
        return this.http.delete(`${this.backendUrl}/transactions/${id}`);
    }
}
