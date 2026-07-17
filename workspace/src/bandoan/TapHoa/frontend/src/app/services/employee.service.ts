import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { environment } from '../../environments/environment';

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  phoneNumber?: string;
  citizenId?: string;
  address?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  email?: string;
  baseSalary: number;
  salaryTemplateId?: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  userId?: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseCrudService<Employee> {
  protected apiUrl = `${environment.apiUrl}/hr/employees`;

  uploadEmployees(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{importedCount: number}>(`${this.apiUrl}/upload`, formData);
  }

  createUserForEmployee(employeeId: string, data: any) {
    return this.http.post<{userId: string}>(`${this.apiUrl}/${employeeId}/create-user`, data);
  }

  resetUserPassword(employeeId: string, data: any) {
    return this.http.post(`${this.apiUrl}/${employeeId}/reset-password`, data);
  }
}
