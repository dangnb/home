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
}
