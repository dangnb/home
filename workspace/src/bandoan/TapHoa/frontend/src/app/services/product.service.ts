import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';
import { BaseCrudService } from './base-crud.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseCrudService<Product> {
    constructor(protected override http: HttpClient) {
        super(http, `${environment.apiUrl}/products`);
    }

    // Compatbility mappings for existing code
    getProducts() { return this.getAll(); }
    getProduct(id: string) { return this.getById(id); }
    createProduct(product: Product) { return this.create(product); }
    updateProduct(id: string, product: Product) { return this.update(id, product); }
    deleteProduct(id: string) { return this.delete(id); }

    getLowStockProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
    }

    // Đặc thù của Product
    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
    }
}
