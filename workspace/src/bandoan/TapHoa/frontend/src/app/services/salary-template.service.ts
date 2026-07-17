import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SalaryTemplate, CreateSalaryTemplateCommand, UpdateSalaryTemplateCommand } from '../models/salary-template.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryTemplateService {
  private apiUrl = `${environment.apiUrl}/salary-templates`;

  constructor(private http: HttpClient) { }

  getTemplates(): Observable<SalaryTemplate[]> {
    return this.http.get<SalaryTemplate[]>(this.apiUrl);
  }

  createTemplate(command: CreateSalaryTemplateCommand): Observable<string> {
    return this.http.post<string>(this.apiUrl, command);
  }

  updateTemplate(id: string, command: UpdateSalaryTemplateCommand): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, command);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
