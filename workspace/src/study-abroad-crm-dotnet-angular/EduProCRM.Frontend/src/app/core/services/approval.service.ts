import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApprovalRequestDto {
  id: string;
  requestType: string;
  studentId: string;
  studentName: string;
  contractId: string;
  amount: number;
  proposerName: string;
  createdAt: string;
  statusLevel1: string;
  statusLevel2: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/approvals';

  getApprovals(): Observable<ApprovalRequestDto[]> {
    return this.http.get<ApprovalRequestDto[]>(this.apiUrl);
  }

  approve(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/approve`, {});
  }
}
