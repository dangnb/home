import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EmployeeTransfer {
  id: number;
  tenantId: number;
  employeeId: number;
  employeeName: string;
  decisionNumber: string;
  changeType: 'DEPARTMENT_TRANSFER' | 'PROMOTION' | 'DEMOTION' | 'MANAGER_CHANGE' | 'RELOCATION';
  oldDepartmentId?: number;
  oldDepartmentName?: string;
  newDepartmentId?: number;
  newDepartmentName?: string;
  oldJobTitle?: string;
  newJobTitle?: string;
  oldManagerId?: number;
  oldManagerName?: string;
  newManagerId?: number;
  newManagerName?: string;
  effectiveDate: string;
  note?: string;
  approvalStatus: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approverId?: number;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;

  // Multi-Step Approval Properties
  currentStep?: number;
  currentManagerStatus?: string;
  currentManagerNote?: string;
  currentManagerApprovedAt?: string;
  newManagerStatus?: string;
  newManagerNote?: string;
  newManagerApprovedAt?: string;
  hrStatus?: string;
  hrNote?: string;
  hrApprovedAt?: string;
  directorStatus?: string;
  directorNote?: string;
  directorApprovedAt?: string;
  employeeAckStatus?: string;
  employeeAckNote?: string;
  employeeAcknowledgedAt?: string;
}

export interface EmployeeTransferSummary {
  totalTransfers: number;
  pendingTransfers: number;
  approvedTransfers: number;
  rejectedTransfers: number;
  departmentTransfers: number;
  promotions: number;
}

export interface EmployeeTransferFilterParams {
  page?: number;
  pageSize?: number;
  employeeId?: number;
  changeType?: string;
  approvalStatus?: string;
  keyword?: string;
}

export interface CreateEmployeeTransferDto {
  employeeId: number;
  decisionNumber?: string;
  changeType: number; // 1=DEPARTMENT_TRANSFER, 2=PROMOTION, 3=DEMOTION, 4=MANAGER_CHANGE, 5=RELOCATION
  newDepartmentId?: number;
  newJobTitle?: string;
  newManagerId?: number;
  effectiveDate: string;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeTransferService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/employee-transfers`;

  getTransfers(params?: EmployeeTransferFilterParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
      if (params.employeeId) httpParams = httpParams.set('employeeId', params.employeeId);
      if (params.changeType) httpParams = httpParams.set('changeType', params.changeType);
      if (params.approvalStatus) httpParams = httpParams.set('approvalStatus', params.approvalStatus);
      if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getSummary(): Observable<EmployeeTransferSummary> {
    return this.http.get<EmployeeTransferSummary>(`${this.apiUrl}/summary`);
  }

  createTransfer(dto: CreateEmployeeTransferDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  approveTransfer(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {});
  }

  approveTransferStep(id: number, step: number, note?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve-step`, { step, note });
  }

  acknowledgeTransfer(id: number, note?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/acknowledge`, { note });
  }

  rejectTransfer(id: number, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  deleteTransfer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
