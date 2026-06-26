import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResultDto } from '../models/auth-result';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    login(loginData: any): Observable<AuthResultDto> {
        return this.http.post<AuthResultDto>(`${this.apiUrl}/login`, loginData, { withCredentials: true });
    }

    refreshToken(): Observable<AuthResultDto> {
        return this.http.post<AuthResultDto>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true });
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/revoke`, {}, { withCredentials: true });
    }
}
