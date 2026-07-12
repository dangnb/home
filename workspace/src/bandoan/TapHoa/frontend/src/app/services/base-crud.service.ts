import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class BaseCrudService<T> {
    protected http = inject(HttpClient);
    protected abstract apiUrl: string;

    getAll(queryParams?: any): Observable<T[]> {
        let params = new HttpParams();
        if (queryParams) {
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] !== null && queryParams[key] !== undefined) {
                    params = params.append(key, queryParams[key]);
                }
            });
        }
        return this.http.get<T[]>(this.apiUrl, { params });
    }

    // Phân trang Server-side (Chuẩn bị sẵn cho bước scale API)
    getPaged(pageIndex: number, pageSize: number, queryParams?: any): Observable<{ items: T[], totalCount: number }> {
        let params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        if (queryParams) {
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] !== null && queryParams[key] !== undefined) {
                    params = params.append(key, queryParams[key]);
                }
            });
        }
        return this.http.get<{ items: T[], totalCount: number }>(`${this.apiUrl}/paged`, { params });
    }

    getById(id: string | number): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${id}`);
    }

    create(item: T): Observable<T> {
        return this.http.post<T>(this.apiUrl, item);
    }

    update(id: string | number, item: T): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, item);
    }

    delete(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
