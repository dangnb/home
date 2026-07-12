import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShiftDto {
  id: string;
  username: string;
  startTime: string;
  startingCash: number;
  status: string;
}

export interface OpenShiftCommand {
  startingCash: number;
}

export interface CloseShiftCommand {
  actualCash: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shifts`;

  getCurrentShift(): Observable<ShiftDto | null> {
    return this.http.get<ShiftDto | null>(`${this.apiUrl}/current`);
  }

  openShift(command: OpenShiftCommand): Observable<{ shiftId: string; message: string }> {
    return this.http.post<{ shiftId: string; message: string }>(`${this.apiUrl}/open`, command);
  }

  closeShift(command: CloseShiftCommand): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/close`, command);
  }
}
