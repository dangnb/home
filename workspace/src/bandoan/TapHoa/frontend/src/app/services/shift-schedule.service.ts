import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmployeeShiftDto {
  id: string;
  username: string;
  shiftDate: string; // ISO format date
  shiftType: string;
  startTime: string; // "HH:mm:ss"
  endTime: string;   // "HH:mm:ss"
  notes?: string;
}

export interface CreateEmployeeShiftCommand {
  username: string;
  shiftDate: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftScheduleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shift-schedules`;

  getSchedules(startDate: string, endDate: string, username?: string): Observable<EmployeeShiftDto[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
      
    if (username) {
      params = params.set('username', username);
    }
    
    return this.http.get<EmployeeShiftDto[]>(this.apiUrl, { params });
  }

  createSchedule(command: CreateEmployeeShiftCommand): Observable<{ id: string; message: string }> {
    return this.http.post<{ id: string; message: string }>(this.apiUrl, command);
  }

  deleteSchedule(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
