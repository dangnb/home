import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../hrm/models/hrm.models';
import { ManagedUser, CreateUserDto, UpdateUserDto, RoleOption } from '../models/user-management.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);
  private readUrl = `${environment.readApiUrl}/users`;
  private writeUrl = `${environment.writeApiUrl}/users`;

  readonly users = signal<ManagedUser[]>([]);

  // --- Read Operations (Dart Read Service - Port 5050) ---

  getUsers(options?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Observable<any> {
    let params = new HttpParams();
    if (options?.search) {
      params = params.set('search', options.search.trim());
    }
    if (options?.role && options.role !== 'All') {
      params = params.set('role', options.role);
    }
    if (options?.status && options.status !== 'All') {
      params = params.set('status', options.status);
    }
    if (options?.page) {
      params = params.set('page', options.page.toString());
    }
    if (options?.pageSize) {
      params = params.set('pageSize', options.pageSize.toString());
    }
    return this.http.get<any>(this.readUrl, { params }).pipe(
      tap((res) => {
        if (res && res.data) {
          this.users.set(res.data);
        }
      })
    );
  }

  getUserById(id: string | number): Observable<ApiResponse<ManagedUser>> {
    return this.http.get<ApiResponse<ManagedUser>>(`${this.readUrl}/${id}`);
  }

  getRoles(): Observable<ApiResponse<RoleOption[]>> {
    return this.http.get<ApiResponse<RoleOption[]>>(`${this.readUrl}/roles`);
  }

  // --- Write Operations (.NET 10 WebAPI - Port 5000) ---

  createUser(dto: CreateUserDto): Observable<any> {
    return this.http.post<any>(this.writeUrl, dto);
  }

  updateUser(id: string | number, dto: UpdateUserDto): Observable<any> {
    return this.http.put<any>(`${this.writeUrl}/${id}`, dto);
  }

  deleteUser(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.writeUrl}/${id}`);
  }

  deleteUsers(ids: (string | number)[]): Observable<any[]> {
    const requests = ids.map(id => this.deleteUser(id));
    return forkJoin(requests);
  }
}
