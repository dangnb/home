import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Role } from '../models/role';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    // We will connect to real API later, for now we can mock if endpoint doesn't exist, 
    // but building the real API endpoint is better. We will point to real API.
    private apiUrl = `${environment.apiUrl}/roles`;

  private http = inject(HttpClient);

    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.apiUrl);
    }

    createRole(role: Role): Observable<Role> {
        return this.http.post<Role>(this.apiUrl, role);
    }

    updateRole(id: string, role: Role): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, role);
    }

    deleteRole(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
