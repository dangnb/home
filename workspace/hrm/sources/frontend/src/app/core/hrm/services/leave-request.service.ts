import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LeaveRequestFilterParams {
  page?: number;
  pageSize?: number;
  userId?: number;
  status?: string;
  leaveType?: string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/leave-requests`;

  getLeaveRequests(paramsObj?: LeaveRequestFilterParams): Observable<any> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.userId) params = params.set('userId', paramsObj.userId.toString());
      if (paramsObj.status && paramsObj.status !== 'ALL') params = params.set('status', paramsObj.status);
      if (paramsObj.leaveType && paramsObj.leaveType !== 'ALL') params = params.set('leaveType', paramsObj.leaveType);
      if (paramsObj.keyword) params = params.set('keyword', paramsObj.keyword);
      if (paramsObj.fromDate) params = params.set('fromDate', paramsObj.fromDate);
      if (paramsObj.toDate) params = params.set('toDate', paramsObj.toDate);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getLeaveRequest(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createLeaveRequest(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  approveLeaveRequest(id: number, dto: { isApproved: boolean; comment?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, dto);
  }
}
