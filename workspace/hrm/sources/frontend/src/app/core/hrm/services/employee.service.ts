import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/hrm.models';

export interface EmployeeFilterParams {
  page?: number;
  pageSize?: number;
  departmentId?: string;
  search?: string;
  status?: number;
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
      if (paramsObj.departmentId) params = params.set('departmentId', paramsObj.departmentId);
      if (paramsObj.search) params = params.set('search', paramsObj.search);
      if (paramsObj.status !== undefined) params = params.set('status', paramsObj.status.toString());
    }
    return this.http.get<ApiResponse<Employee[]>>(this.readUrl, { params });
  }

  getEmployee(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.readUrl}/${id}`);
  }

  // --- Write Operations (.NET 10 WebAPI - Port 5000) ---
  createEmployee(dto: CreateEmployeeDto): Observable<any> {
    return this.http.post<any>(this.writeUrl, dto);
  }

  updateEmployee(id: string, dto: UpdateEmployeeDto): Observable<any> {
    return this.http.put<any>(`${this.writeUrl}/${id}`, dto);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.writeUrl}/${id}`);
  }
}
