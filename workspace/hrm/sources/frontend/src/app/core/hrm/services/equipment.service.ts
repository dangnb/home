import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EquipmentFilterParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  status?: string;
  departmentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/equipments`;

  getEquipments(paramsObj?: EquipmentFilterParams): Observable<any> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.keyword) params = params.set('keyword', paramsObj.keyword);
      if (paramsObj.category && paramsObj.category !== 'ALL') params = params.set('category', paramsObj.category);
      if (paramsObj.status && paramsObj.status !== 'ALL') params = params.set('status', paramsObj.status);
      if (paramsObj.departmentId) params = params.set('departmentId', paramsObj.departmentId.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getEquipment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEquipment(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  handoverEquipment(id: number, dto: { targetUserId: number; conditionStatus?: string; note?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/handover`, dto);
  }

  revokeEquipment(id: number, dto: { conditionStatus?: string; note?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/revoke`, dto);
  }

  reportBrokenEquipment(id: number, dto: { description: string; note?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/report-broken`, dto);
  }
}
