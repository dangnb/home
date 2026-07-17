import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Role {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  createRole(role: Role): Observable<any> {
    return this.http.post(this.apiUrl, role);
  }

  updateRole(id: string, role: Role): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllPermissions(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/permissions`);
  }
}
