import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../hrm/models/hrm.models';
import { SystemPermission, RoleDetail, CreateRoleDto, UpdateRoleDto } from '../models/rbac.model';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {
  private http = inject(HttpClient);
  private permissionsUrl = `${environment.writeApiUrl}/permissions`;
  private rolesUrl = `${environment.writeApiUrl}/roles`;

  // --- Permissions API ---
  getPermissions(module?: string, search?: string): Observable<ApiResponse<SystemPermission[]>> {
    let params = new HttpParams();
    if (module && module !== 'ALL') {
      params = params.set('module', module);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ApiResponse<SystemPermission[]>>(this.permissionsUrl, { params });
  }

  // --- Roles API ---
  getRoles(): Observable<ApiResponse<RoleDetail[]>> {
    return this.http.get<ApiResponse<RoleDetail[]>>(this.rolesUrl);
  }

  getRoleById(id: number): Observable<ApiResponse<RoleDetail>> {
    return this.http.get<ApiResponse<RoleDetail>>(`${this.rolesUrl}/${id}`);
  }

  createRole(dto: CreateRoleDto): Observable<any> {
    return this.http.post<any>(this.rolesUrl, dto);
  }

  updateRole(id: number, dto: UpdateRoleDto): Observable<any> {
    return this.http.put<any>(`${this.rolesUrl}/${id}`, dto);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.rolesUrl}/${id}`);
  }
}
