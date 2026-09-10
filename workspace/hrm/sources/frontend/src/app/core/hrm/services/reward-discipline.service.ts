import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RewardDiscipline {
  id: number;
  tenantId: number;
  employeeId: number;
  employeeName: string;
  jobTitle?: string;
  departmentName?: string;
  type: 'REWARD' | 'DISCIPLINE';
  category: string;
  title: string;
  decisionNumber?: string;
  decisionDate: string;
  effectiveDate: string;
  amount: number;
  reason?: string;
  attachmentUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approverId?: number;
  approverName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface RewardDisciplineSummary {
  totalRewardsCount: number;
  totalRewardAmount: number;
  totalDisciplinesCount: number;
  totalDisciplineAmount: number;
  netAmount: number;
  totalDecisions: number;
}

export interface RewardDisciplineFilterParams {
  page?: number;
  pageSize?: number;
  employeeId?: number;
  type?: string;
  category?: string;
  status?: string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreateRewardDisciplineDto {
  employeeId: number;
  type: number; // 1 = REWARD, 2 = DISCIPLINE
  category: number;
  title: string;
  decisionNumber?: string;
  decisionDate: string;
  effectiveDate: string;
  amount: number;
  reason?: string;
  attachmentUrl?: string;
  status?: number;
}

export interface UpdateRewardDisciplineDto {
  id: number;
  type: number;
  category: number;
  title: string;
  decisionNumber?: string;
  decisionDate: string;
  effectiveDate: string;
  amount: number;
  reason?: string;
  attachmentUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RewardDisciplineService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/reward-disciplines`;

  getRewardDisciplines(paramsObj?: RewardDisciplineFilterParams): Observable<any> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.employeeId) params = params.set('employeeId', paramsObj.employeeId.toString());
      if (paramsObj.type) params = params.set('type', paramsObj.type);
      if (paramsObj.category) params = params.set('category', paramsObj.category);
      if (paramsObj.status) params = params.set('status', paramsObj.status);
      if (paramsObj.keyword) params = params.set('keyword', paramsObj.keyword);
      if (paramsObj.fromDate) params = params.set('fromDate', paramsObj.fromDate);
      if (paramsObj.toDate) params = params.set('toDate', paramsObj.toDate);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getSummary(): Observable<RewardDisciplineSummary> {
    return this.http.get<RewardDisciplineSummary>(`${this.apiUrl}/summary`);
  }

  getById(id: number): Observable<RewardDiscipline> {
    return this.http.get<RewardDiscipline>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateRewardDisciplineDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateRewardDisciplineDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  approve(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getExportWordUrl(id: number): string {
    return `${this.apiUrl}/${id}/export/word`;
  }

  getExportHtmlUrl(id: number): string {
    return `${this.apiUrl}/${id}/export/html`;
  }
}
