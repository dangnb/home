import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Attendance, AttendanceSummary, CheckInDto, CheckOutDto } from '../models/hrm.models';

export interface AttendanceFilterParams {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private readUrl = `${environment.readApiUrl}/attendances`;
  private writeUrl = `${environment.writeApiUrl}/attendances`;

  // --- Read Operations (Dart Read Service - Port 5050) ---
  getAttendances(paramsObj?: AttendanceFilterParams): Observable<ApiResponse<Attendance[]>> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.pageSize) params = params.set('pageSize', paramsObj.pageSize.toString());
      if (paramsObj.employeeId) params = params.set('employeeId', paramsObj.employeeId);
      if (paramsObj.date) params = params.set('date', paramsObj.date);
      if (paramsObj.startDate) params = params.set('startDate', paramsObj.startDate);
      if (paramsObj.endDate) params = params.set('endDate', paramsObj.endDate);
      if (paramsObj.status !== undefined) params = params.set('status', paramsObj.status.toString());
    }
    return this.http.get<ApiResponse<Attendance[]>>(this.readUrl, { params });
  }

  getSummary(month?: number, year?: number): Observable<ApiResponse<AttendanceSummary>> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<ApiResponse<AttendanceSummary>>(`${this.readUrl}/summary`, { params });
  }

  // --- Write Operations (.NET 10 WebAPI - Port 5000) ---
  checkIn(dto: CheckInDto): Observable<any> {
    return this.http.post<any>(`${this.writeUrl}/check-in`, dto);
  }

  checkOut(dto: CheckOutDto): Observable<any> {
    return this.http.post<any>(`${this.writeUrl}/check-out`, dto);
  }
}
