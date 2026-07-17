import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { environment } from '../../environments/environment';

export interface Department {
  id?: string;
  name: string;
  description?: string;
  parentId?: string;
  parentName?: string;
}

export interface CreateDepartmentCommand {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateDepartmentCommand {
  id?: string;
  name: string;
  description?: string;
  parentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseCrudService<Department> {
  protected apiUrl = `${environment.apiUrl}/hr/departments`;
}
