import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionLineDto {
    productId: number;
    quantity: number;
    unitCost: number;
}

export interface CreateInboundTransactionRequest {
    referenceId: string;
    notes: string;
    lines: TransactionLineDto[];
}

export interface TransactionDetailDto {
    id: number;
    code: string;
    type: number; // 0=Inbound, 1=Outbound, 2=Adjustment
    referenceId: string;
    createdBy: string;
    notes: string;
    status: number; // 0=Draft, 1=PendingApproval, 2=Completed
    createdAt: string;
    lines: {
        productId: number;
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
    private backendUrl = 'http://localhost:5222/api/v1';

    private get headers() {
        const authInfo = JSON.parse(localStorage.getItem('authInfo') || '{}');
        const token = authInfo.token;
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    createInboundTransaction(payload: CreateInboundTransactionRequest): Observable<any> {
        return this.http.post(`${this.backendUrl}/transactions/inbound`, payload, { headers: this.headers });
    }

    getTransactions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.backendUrl}/transactions`, { headers: this.headers });
    }

    getTransactionById(id: number): Observable<TransactionDetailDto> {
        return this.http.get<TransactionDetailDto>(`${this.backendUrl}/transactions/${id}`, { headers: this.headers });
    }
}
