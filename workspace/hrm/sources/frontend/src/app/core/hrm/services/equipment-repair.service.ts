import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EquipmentRepairFilterParams {
  keyword?: string;
  status?: string;
  priority?: string;
  technicianUserId?: number;
  equipmentId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentRepairService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/equipment-repairs`;

  getRepairs(params?: EquipmentRepairFilterParams): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.priority) httpParams = httpParams.set('priority', params.priority);
      if (params.technicianUserId) httpParams = httpParams.set('technicianUserId', params.technicianUserId.toString());
      if (params.equipmentId) httpParams = httpParams.set('equipmentId', params.equipmentId.toString());
      if (params.fromDate) httpParams = httpParams.set('fromDate', params.fromDate);
      if (params.toDate) httpParams = httpParams.set('toDate', params.toDate);
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getRepair(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRepair(payload: {
    equipmentId: number;
    issueDescription: string;
    priority?: string;
    note?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  assignTechnician(id: number, technicianUserId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/assign`, { technicianUserId });
  }

  updateProgress(id: number, payload: {
    status: string;
    actualError?: string;
    solutionDetail?: string;
    replacedParts?: string;
    repairCost?: number;
    note?: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/progress`, payload);
  }
}
