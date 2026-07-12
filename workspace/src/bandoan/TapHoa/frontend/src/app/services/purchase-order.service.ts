import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseCrudService } from './base-crud.service';

export interface PurchaseOrderDetail {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  costPrice: number;
  subTotal?: number;
}

export interface PurchaseOrder {
  id: string;
  orderCode: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  totalAmount: number;
  amountPaid: number;
  status: 'Draft' | 'Processing' | 'Completed' | 'Cancelled';
  notes?: string;
  details: PurchaseOrderDetail[];
}

export interface CreatePurchaseOrderDto {
  supplierId: string;
  expectedDeliveryDate?: Date;
  notes?: string;
  details: {
    productId: string;
    quantity: number;
    costPrice: number;
  }[];
}

export interface UpdatePurchaseOrderStatusDto {
  status: 'Draft' | 'Processing' | 'Completed' | 'Cancelled';
  amountPaid?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService extends BaseCrudService<PurchaseOrder> {
  protected apiUrl = `${environment.apiUrl}/purchase-orders`;

  createPurchaseOrder(dto: CreatePurchaseOrderDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, dto);
  }

  updateStatus(id: string, dto: UpdatePurchaseOrderStatusDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, dto);
  }
}
