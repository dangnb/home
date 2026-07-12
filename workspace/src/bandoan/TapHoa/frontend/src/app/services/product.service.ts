import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';
import { BaseCrudService } from './base-crud.service';

export interface ProductBatch {
    id: string;
    productId: string;
    batchNumber: string;
    mfgDate: Date;
    expiryDate: Date;
    stockQuantity: number;
}

export interface ExpiringBatch {
    batchId: string;
    productId: string;
    productName: string;
    productCode: string;
    batchNumber: string;
    mfgDate: Date;
    expiryDate: Date;
    stockQuantity: number;
    daysUntilExpiry: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseCrudService<Product> {
    protected override apiUrl = `${environment.apiUrl}/products`;

    // Compatbility mappings for existing code
    getProducts() { return this.getAll(); }
    getProduct(id: string) { return this.getById(id); }
    createProduct(product: Product) { return this.create(product); }
    updateProduct(id: string, product: Product) { return this.update(id, product); }
    deleteProduct(id: string) { return this.delete(id); }

    getLowStockProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
    }

    getProductBatches(productId: string): Observable<ProductBatch[]> {
        return this.http.get<ProductBatch[]>(`${this.apiUrl}/${productId}/batches`);
    }

    getExpiringBatches(days: number = 30): Observable<ExpiringBatch[]> {
        return this.http.get<ExpiringBatch[]>(`${this.apiUrl}/expiring-batches?days=${days}`);
    }

    // Đặc thù của Product
    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
    }
}
