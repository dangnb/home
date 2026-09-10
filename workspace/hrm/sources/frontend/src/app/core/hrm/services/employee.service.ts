import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/hrm.models';

export interface EmployeeFilterParams {
  page?: number;
  pageSize?: number;
  departmentId?: string | number;
  search?: string;
  keyword?: string;
  status?: string | number;
}

export interface EmployeeLookupDto {
  id: number;
  fullName: string;
  employeeCode?: string;
  departmentId?: number;
  departmentName?: string;
  jobTitle?: string;
  avatarUrl?: string;
}

export interface EmployeeLookupParams {
  keyword?: string;
  departmentId?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private readUrl = `${environment.readApiUrl}/employees`;
  private writeUrl = `${environment.writeApiUrl}/employees`;

  // --- Read Operations (Dart Read Service - Port 5050) ---
  getEmployees(paramsObj?: EmployeeFilterParams): Observable<ApiResponse<Employee[]>> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.departmentId) params = params.set('departmentId', paramsObj.departmentId.toString());
      const kw = paramsObj.keyword || paramsObj.search;
      if (kw) {
        params = params.set('keyword', kw);
        params = params.set('search', kw);
      }
      if (paramsObj.status !== undefined && paramsObj.status !== '') {
        params = params.set('status', paramsObj.status.toString());
      }
    }
    return this.http.get<ApiResponse<Employee[]>>(this.readUrl, { params });
  }

  // --- Lightweight Lookup Endpoint for All Authenticated Users / Select Lists ---
  getEmployeeLookup(paramsObj?: EmployeeLookupParams): Observable<EmployeeLookupDto[]> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.keyword) params = params.set('keyword', paramsObj.keyword);
      if (paramsObj.departmentId) params = params.set('departmentId', paramsObj.departmentId.toString());
      if (paramsObj.limit) params = params.set('limit', paramsObj.limit.toString());
    }
    return this.http.get<EmployeeLookupDto[]>(`${this.writeUrl}/lookup`, { params });
  }

  getEmployee(id: number | string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.readUrl}/${id}`);
  }

  // --- Write Operations (.NET 10 WebAPI - Port 5000) ---
  createEmployee(dto: CreateEmployeeDto): Observable<any> {
    return this.http.post<any>(this.writeUrl, dto);
  }

  updateEmployee(id: number | string, dto: UpdateEmployeeDto): Observable<any> {
    return this.http.put<any>(`${this.writeUrl}/${id}`, dto);
  }

  deleteEmployee(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.writeUrl}/${id}`);
  }

  importEmployees(items: any[]): Observable<any> {
    return this.http.post<any>(`${this.writeUrl}/import`, { items });
  }
}
