import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EmployeeContract {
  id: number;
  tenantId: number;
  employeeId: number;
  employeeName: string;
  jobTitle?: string;
  departmentName?: string;
  contractNumber: string;
  contractType: 'PROBATION' | 'DEFINITE_TERM' | 'INDEFINITE_TERM' | 'INTERNSHIP' | 'ADDENDUM';
  signDate: string;
  startDate: string;
  endDate?: string;
  basicSalary: number;
  insuranceSalary: number;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'TERMINATED';
  note?: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface EmployeeContractSummary {
  totalContracts: number;
  activeContracts: number;
  expiringSoonContracts: number;
  probationContracts: number;
  definiteTermContracts: number;
  indefiniteTermContracts: number;
}

export interface EmployeeContractFilterParams {
  page?: number;
  pageSize?: number;
  employeeId?: number;
  contractType?: string;
  status?: string;
  isExpiringSoon?: boolean;
  keyword?: string;
}

export interface CreateEmployeeContractDto {
  employeeId: number;
  contractNumber?: string;
  contractType: number; // 1=PROBATION, 2=DEFINITE_TERM, 3=INDEFINITE_TERM, 4=INTERNSHIP, 5=ADDENDUM
  signDate: string;
  startDate: string;
  endDate?: string;
  basicSalary: number;
  insuranceSalary: number;
  note?: string;
  attachmentUrl?: string;
}

export interface UpdateEmployeeContractDto {
  id?: number;
  contractType: number;
  signDate: string;
  startDate: string;
  endDate?: string;
  basicSalary: number;
  insuranceSalary: number;
  status: number; // 1=ACTIVE, 2=EXPIRING_SOON, 3=EXPIRED, 4=TERMINATED
  note?: string;
  attachmentUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeContractService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/employee-contracts`;

  getContracts(params?: EmployeeContractFilterParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
      if (params.employeeId) httpParams = httpParams.set('employeeId', params.employeeId);
      if (params.contractType) httpParams = httpParams.set('contractType', params.contractType);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.isExpiringSoon) httpParams = httpParams.set('isExpiringSoon', params.isExpiringSoon);
      if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getSummary(): Observable<EmployeeContractSummary> {
    return this.http.get<EmployeeContractSummary>(`${this.apiUrl}/summary`);
  }

  getContractById(id: number): Observable<EmployeeContract> {
    return this.http.get<EmployeeContract>(`${this.apiUrl}/${id}`);
  }

  createContract(dto: CreateEmployeeContractDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  updateContract(id: number, dto: UpdateEmployeeContractDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  deleteContract(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
