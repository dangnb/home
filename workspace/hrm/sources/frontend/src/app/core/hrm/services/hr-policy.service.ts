import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HrPolicy {
  id: number;
  tenantId: number;
  policyCode: string;
  title: string;
  category: 'BENEFITS' | 'WORKING_HOURS' | 'INSURANCE_WELFARE' | 'CODE_OF_CONDUCT' | 'SAFETY_HEALTH' | 'OTHER';
  effectiveDate: string;
  expiryDate?: string;
  summary?: string;
  content?: string;
  attachmentUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
}

export interface HrPolicySummary {
  totalPolicies: number;
  publishedPolicies: number;
  benefitsPolicies: number;
  workingHoursPolicies: number;
  insurancePolicies: number;
}

export interface HrPolicyFilterParams {
  page?: number;
  pageSize?: number;
  category?: string;
  status?: string;
  keyword?: string;
}

export interface CreateHrPolicyDto {
  policyCode?: string;
  title: string;
  category: number; // 1=BENEFITS, 2=WORKING_HOURS, 3=INSURANCE_WELFARE, 4=CODE_OF_CONDUCT, 5=SAFETY_HEALTH, 6=OTHER
  effectiveDate: string;
  expiryDate?: string;
  summary?: string;
  content?: string;
  attachmentUrl?: string;
  status?: number; // 1=DRAFT, 2=PUBLISHED, 3=ARCHIVED
}

export interface UpdateHrPolicyDto {
  id?: number;
  title: string;
  category: number;
  effectiveDate: string;
  expiryDate?: string;
  summary?: string;
  content?: string;
  attachmentUrl?: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class HrPolicyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/hr-policies`;

  getPolicies(params?: HrPolicyFilterParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getSummary(): Observable<HrPolicySummary> {
    return this.http.get<HrPolicySummary>(`${this.apiUrl}/summary`);
  }

  getPolicyById(id: number): Observable<HrPolicy> {
    return this.http.get<HrPolicy>(`${this.apiUrl}/${id}`);
  }

  createPolicy(dto: CreateHrPolicyDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  updatePolicy(id: number, dto: UpdateHrPolicyDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  deletePolicy(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
