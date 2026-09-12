import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AssetFilterParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  status?: string;
  assigneeUserId?: number;
}

export interface MaintenanceTicketFilterParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  assetId?: number;
  fromDate?: string;
  toDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.writeApiUrl}/assets`;

  getAssets(paramsObj?: AssetFilterParams): Observable<any> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.keyword) params = params.set('keyword', paramsObj.keyword);
      if (paramsObj.category && paramsObj.category !== 'ALL') params = params.set('category', paramsObj.category);
      if (paramsObj.status && paramsObj.status !== 'ALL') params = params.set('status', paramsObj.status);
      if (paramsObj.assigneeUserId) params = params.set('assigneeUserId', paramsObj.assigneeUserId.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  getMyAssets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-assets`);
  }

  createAsset(dto: {
    assetCode: string;
    name: string;
    category: string;
    purchasePrice: number;
    serialNumber?: string;
    purchaseDate?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  allocateAsset(id: number, dto: { assigneeUserId: number; conditionNotes?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/allocate`, dto);
  }

  recoverAsset(id: number, dto: { conditionNotes?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/recover`, dto);
  }

  offboardingRecoverAssets(dto: { employeeUserId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/offboarding-recover`, dto);
  }

  transferAsset(id: number, dto: { targetUserId: number; reason?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/transfer`, dto);
  }

  disposeAsset(id: number, dto: { disposalReason: string; salvageValue?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/dispose`, dto);
  }

  createMaintenanceTicket(id: number, dto: { issueDescription: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/maintenance-tickets`, dto);
  }

  resolveMaintenanceTicket(ticketId: number, dto: { resolutionNotes: string; repairCost: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/maintenance-tickets/${ticketId}/resolve`, dto);
  }

  getMaintenanceTickets(paramsObj?: MaintenanceTicketFilterParams): Observable<any> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.keyword) params = params.set('keyword', paramsObj.keyword);
      if (paramsObj.status && paramsObj.status !== 'ALL') params = params.set('status', paramsObj.status);
      if (paramsObj.assetId) params = params.set('assetId', paramsObj.assetId.toString());
      if (paramsObj.fromDate) params = params.set('fromDate', paramsObj.fromDate);
      if (paramsObj.toDate) params = params.set('toDate', paramsObj.toDate);
    }
    return this.http.get<any>(`${this.apiUrl}/maintenance-tickets`, { params });
  }

  calculateDepreciation(dto: { month: number; year: number; usefulLifeMonths?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/depreciate`, dto);
  }

  getDepreciations(assetId?: number, year?: number): Observable<any> {
    let params = new HttpParams();
    if (assetId) params = params.set('assetId', assetId.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<any>(`${this.apiUrl}/depreciations`, { params });
  }
}
