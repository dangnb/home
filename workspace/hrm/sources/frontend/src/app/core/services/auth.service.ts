import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError, finalize } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface LoginApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
      id: number;
      username: string;
      email: string;
      fullName: string;
      tenantId: number | null;
      isSuperAdmin: boolean;
      roles: string[];
      permissions: string[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'hrm_auth_token';
  private readonly USER_KEY = 'hrm_auth_user';

  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadInitialSession();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadInitialSession(): void {
    const token = this.getToken();
    const rawUser = localStorage.getItem(this.USER_KEY);

    if (token && rawUser) {
      try {
        const user: User = JSON.parse(rawUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.clearSession();
      }
    } else {
      this.clearSession();
    }
  }

  login(usernameOrEmail: string, password: string): Observable<User> {
    this.isLoading.set(true);

    const payload = {
      usernameOrEmail: usernameOrEmail.trim(),
      password: password
    };

    return this.http.post<LoginApiResponse>(`${environment.writeApiUrl}/auth/login`, payload).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error('Đăng nhập thất bại.');
        }

        const data = response.data;
        const apiUser = data.user;

        const user: User = {
          id: apiUser.id,
          name: apiUser.fullName || apiUser.username,
          username: apiUser.username,
          email: apiUser.email,
          avatar: 'assets/media/avatars/300-1.jpg',
          role: apiUser.roles?.[0] || (apiUser.isSuperAdmin ? 'Super Administrator' : 'User'),
          company: apiUser.tenantId ? `Tenant #${apiUser.tenantId}` : 'Core Platform',
          tenantId: apiUser.tenantId,
          isSuperAdmin: apiUser.isSuperAdmin,
          roles: apiUser.roles || [],
          permissions: apiUser.permissions || []
        };

        // Lưu trữ Token và User vào localStorage
        localStorage.setItem(this.TOKEN_KEY, data.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        this.currentUser.set(user);
        this.isAuthenticated.set(true);

        return user;
      }),
      catchError(err => {
        let msg = 'Đăng nhập không thành công. Vui lòng thử lại.';
        if (err?.error?.detail) {
          msg = err.error.detail;
        } else if (err?.error?.message) {
          msg = err.error.message;
        } else if (err?.status === 0) {
          msg = 'Không thể kết nối đến máy chủ Backend (Port 5000).';
        }
        return throwError(() => new Error(msg));
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    );
  }

  logout(): void {
    // Gọi backend logout nếu có token (fire and forget)
    const token = this.getToken();
    if (token) {
      this.http.post(`${environment.writeApiUrl}/auth/logout`, {}).subscribe({
        error: () => {} // Bỏ qua lỗi khi logout
      });
    }

    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
