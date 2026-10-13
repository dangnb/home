import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ProjectFilterParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  salesStatus?: string;
  techStatus?: string;
  priority?: string;
  projectType?: string;
  salesUserId?: string | number;
  techLeadUserId?: string | number;
  salesDepartmentId?: string | number;
  techDepartmentId?: string | number;
  contractSignedFrom?: string;
  contractSignedTo?: string;
  isOverdue?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/projects`;

  getProjects(params?: ProjectFilterParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
      if (params.salesStatus && params.salesStatus !== 'ALL') httpParams = httpParams.set('salesStatus', params.salesStatus);
      if (params.techStatus && params.techStatus !== 'ALL') httpParams = httpParams.set('techStatus', params.techStatus);
      if (params.priority && params.priority !== 'ALL') httpParams = httpParams.set('priority', params.priority);
      if (params.projectType && params.projectType !== 'ALL') httpParams = httpParams.set('projectType', params.projectType);
      if (params.salesUserId) httpParams = httpParams.set('salesUserId', params.salesUserId.toString());
      if (params.techLeadUserId) httpParams = httpParams.set('techLeadUserId', params.techLeadUserId.toString());
      if (params.salesDepartmentId) httpParams = httpParams.set('salesDepartmentId', params.salesDepartmentId.toString());
      if (params.techDepartmentId) httpParams = httpParams.set('techDepartmentId', params.techDepartmentId.toString());
      if (params.contractSignedFrom) httpParams = httpParams.set('contractSignedFrom', params.contractSignedFrom);
      if (params.contractSignedTo) httpParams = httpParams.set('contractSignedTo', params.contractSignedTo);
      if (params.isOverdue !== undefined) httpParams = httpParams.set('isOverdue', params.isOverdue.toString());
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getProject(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProject(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  updateProject(id: string | number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  signContract(id: string | number, dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/sign-contract`, dto);
  }

  advanceSalesStatus(id: string | number, dto: { newStatus: string; note?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/sales-status`, dto);
  }

  closeLost(id: string | number, dto: { reason: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/close-lost`, dto);
  }

  assignTechTeam(id: string | number, dto: { techLeadUserId: string | number; techDepartmentId?: string | number; memberUserIds?: (string | number)[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/assign-tech`, dto);
  }

  updateTechStatus(id: string | number, dto: { newTechStatus: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/tech-status`, dto);
  }

  createMilestone(projectId: string | number, dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/milestones`, dto);
  }

  createTask(projectId: string | number, dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/tasks`, dto);
  }

  updateTaskProgress(taskId: string | number, dto: { progressPercent: number; actualHours: number; newStatus: string; blockedReason?: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/tasks/${taskId}/progress`, dto);
  }

  // ─── Documents ────────────────────────────────────────────────────────────
  getProjectDocuments(projectId: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}/documents`);
  }

  uploadDocument(projectId: string | number, file: File, documentType: string, description?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (description) formData.append('description', description);
    return this.http.post<any>(`${this.apiUrl}/${projectId}/documents`, formData);
  }

  deleteDocument(documentId: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/documents/${documentId}`);
  }
}

