import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'https://localhost:7194/api/v1/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: number, product: Product): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
