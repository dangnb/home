import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, LeaveRequest, CreateLeaveRequestDto, ApproveLeaveRequestDto, RejectLeaveRequestDto } from '../models/hrm.models';

export interface LeaveRequestFilterParams {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  status?: number;
  leaveType?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private http = inject(HttpClient);
  private readUrl = `${environment.readApiUrl}/leave-requests`;
  private writeUrl = `${environment.writeApiUrl}/leave-requests`;

  // --- Read Operations (Dart Read Service - Port 5050) ---
  getLeaveRequests(paramsObj?: LeaveRequestFilterParams): Observable<ApiResponse<LeaveRequest[]>> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.employeeId) params = params.set('employeeId', paramsObj.employeeId);
      if (paramsObj.status !== undefined) params = params.set('status', paramsObj.status.toString());
      if (paramsObj.leaveType !== undefined) params = params.set('leaveType', paramsObj.leaveType.toString());
    }
    return this.http.get<ApiResponse<LeaveRequest[]>>(this.readUrl, { params });
  }

  getLeaveRequest(id: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.get<ApiResponse<LeaveRequest>>(`${this.readUrl}/${id}`);
  }

  // --- Write Operations (.NET 10 WebAPI - Port 5000) ---
  createLeaveRequest(dto: CreateLeaveRequestDto): Observable<any> {
    return this.http.post<any>(this.writeUrl, dto);
  }

  approveLeaveRequest(id: string, dto: ApproveLeaveRequestDto): Observable<any> {
    return this.http.put<any>(`${this.writeUrl}/${id}/approve`, dto);
  }

  rejectLeaveRequest(id: string, dto: RejectLeaveRequestDto): Observable<any> {
    return this.http.put<any>(`${this.writeUrl}/${id}/reject`, dto);
  }
}
