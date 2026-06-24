import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:5222/api/v1/products';

    constructor(private http: HttpClient) { }

    private get headers() {
        const authInfo = JSON.parse(localStorage.getItem('authInfo') || '{}');
        const token = authInfo.token;
        return { headers: { Authorization: `Bearer ${token}` } };
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl, this.headers);
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`, this.headers);
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product, this.headers);
    }

    updateProduct(id: number, product: Product): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, product, this.headers);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, this.headers);
    }

    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData, this.headers);
    }
}
