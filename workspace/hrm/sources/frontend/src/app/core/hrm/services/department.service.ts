import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Department, CreateDepartmentDto, UpdateDepartmentDto } from '../models/hrm.models';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  private readUrl = `${environment.readApiUrl}/departments`;
  private writeUrl = `${environment.writeApiUrl}/departments`;

  // --- Read Operations (Dart Read Service - Port 5050) ---
  getDepartments(status?: string): Observable<ApiResponse<Department[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Department[]>>(this.readUrl, { params });
  }

  getDepartment(id: number | string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.readUrl}/${id}`);
  }

  // --- Write Operations (.NET 10 WebAPI - Port 5000) ---
  createDepartment(dto: CreateDepartmentDto): Observable<any> {
    return this.http.post<any>(this.writeUrl, dto);
  }

  updateDepartment(id: number | string, dto: UpdateDepartmentDto): Observable<any> {
    return this.http.put<any>(`${this.writeUrl}/${id}`, dto);
  }

  deleteDepartment(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.writeUrl}/${id}`);
  }
}
