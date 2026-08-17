import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LegalJournalDto {
  id: string;
  studentId: string;
  studentName: string;
  contractId: string;
  contractClauseName: string;
  actionDateTime: string;
  summary: string;
  content: string;
  portalUrl?: string;
  mentorName: string;
  isLocked: boolean;
  lockedAt: string;
  signatureHash: string;
}

export interface CreateLegalJournalCommand {
  studentId: string;
  contractId: string;
  clause: number;
  actionDateTime: string;
  summary: string;
  content: string;
  portalUrl?: string;
  mentorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class LegalJournalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/legal-journals';

  getByStudent(studentId: string): Observable<LegalJournalDto[]> {
    return this.http.get<LegalJournalDto[]>(`${this.apiUrl}/student/${studentId}`);
  }

  create(command: CreateLegalJournalCommand): Observable<{ id: string; message: string }> {
    return this.http.post<{ id: string; message: string }>(this.apiUrl, command);
  }
}
