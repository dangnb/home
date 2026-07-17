import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Attendance DTOs ──
export interface AttendanceDto {
  id: string;
  username: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  overtimeHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  status: number;
  statusText: string;
  notes: string | null;
}

export interface CreateAttendanceCommand {
  id?: string;
  username: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  overtimeHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  status: number;
  notes?: string;
}

// ── Payroll DTOs ──
export interface PayrollPeriodDto {
  id: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: number;
  statusText: string;
  notes: string | null;
  employeeCount: number;
  totalNetSalary: number;
}

export interface PayrollEntryDto {
  id: string;
  username: string;
  employeeName: string;
  workDays: number;
  totalHours: number;
  overtimeHours: number;
  baseSalary: number;
  overtimePay: number;
  allowance: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  notes: string | null;
}

export interface PayrollDetailDto {
  period: PayrollPeriodDto;
  entries: PayrollEntryDto[];
}

export interface CalculatePayrollCommand {
  periodId?: string;
  defaultBaseSalary: number;
  overtimeRate: number;
  defaultAllowance: number;
  formula: string;
  customVariables?: { [key: string]: number };
}

export interface UpdatePayrollEntryCommand {
  id?: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  allowance: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private http = inject(HttpClient);
  private attendanceUrl = `${environment.apiUrl}/attendances`;
  private payrollUrl = `${environment.apiUrl}/payroll`;

  // ── Attendance ──
  checkIn(shiftStart: string = '07:00:00'): Observable<{ id: string; message: string }> {
    return this.http.post<{ id: string; message: string }>(`${this.attendanceUrl}/check-in`, { shiftStart });
  }

  checkOut(shiftEnd: string = '17:00:00', standardHoursPerDay: number = 8): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.attendanceUrl}/check-out`, { shiftEnd, standardHoursPerDay });
  }

  getMyAttendanceToday(): Observable<AttendanceDto | null> {
    return this.http.get<AttendanceDto | null>(`${this.attendanceUrl}/today`);
  }

  getAttendances(month: number, year: number, username?: string): Observable<AttendanceDto[]> {
    let params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    if (username) params = params.set('username', username);
    return this.http.get<AttendanceDto[]>(this.attendanceUrl, { params });
  }

  createAttendance(command: CreateAttendanceCommand): Observable<{ id: string; message: string }> {
    return this.http.post<{ id: string; message: string }>(`${this.attendanceUrl}/manual`, command);
  }

  importAttendance(file: File): Observable<{ successCount: number; errorCount: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ successCount: number; errorCount: number; errors: string[] }>(`${this.attendanceUrl}/import`, formData);
  }

  downloadAttendanceTemplate(): void {
    window.open(`${this.attendanceUrl}/template`, '_blank');
  }

  // ── Payroll ──
  getPayrollPeriods(year?: number): Observable<PayrollPeriodDto[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    return this.http.get<PayrollPeriodDto[]>(`${this.payrollUrl}/periods`, { params });
  }

  getPayrollDetail(periodId: string): Observable<PayrollDetailDto> {
    return this.http.get<PayrollDetailDto>(`${this.payrollUrl}/periods/${periodId}`);
  }

  createPayrollPeriod(month: number, year: number, notes?: string): Observable<{ id: string; message: string }> {
    return this.http.post<{ id: string; message: string }>(`${this.payrollUrl}/periods`, { month, year, notes });
  }

  calculatePayroll(periodId: string, command: CalculatePayrollCommand): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.payrollUrl}/periods/${periodId}/calculate`, command);
  }

  approvePayroll(periodId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.payrollUrl}/periods/${periodId}/approve`, {});
  }

  updatePayrollEntry(entryId: string, command: UpdatePayrollEntryCommand): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.payrollUrl}/entries/${entryId}`, command);
  }
}
