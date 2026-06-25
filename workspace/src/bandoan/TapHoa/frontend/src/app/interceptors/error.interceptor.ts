import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { AuthResultDto } from '../models/auth-result';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const alertService = inject(AlertService);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Intercept 401 Unauthorized errors
            if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh-token')) {
                // Get tokens for refreshing
                let currentToken = '';
                let currentRefreshToken = '';
                const authInfoStr = localStorage.getItem('authInfo');

                if (authInfoStr) {
                    try {
                        const authInfo = JSON.parse(authInfoStr);
                        if (authInfo) {
                            currentToken = authInfo.token || '';
                            currentRefreshToken = authInfo.refreshToken || '';
                        }
                    } catch (e) { }
                }

                return handle401Error(req, next, authService, router, alertService, currentToken, currentRefreshToken);
            }

            return throwError(() => error);
        })
    );
};

function handle401Error(
    req: any,
    next: any,
    authService: AuthService,
    router: Router,
    alertService: AlertService,
    token: string,
    refreshToken: string
): Observable<any> {
    if (!isRefreshing) {
        if (!refreshToken) {
            forceLogout(router, alertService);
            return throwError(() => new Error('No refresh token available'));
        }

        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken(token, refreshToken).pipe(
            switchMap((newAuthResult: AuthResultDto) => {
                isRefreshing = false;

                localStorage.setItem('jwtToken', newAuthResult.token);
                localStorage.setItem('authInfo', JSON.stringify(newAuthResult));

                refreshTokenSubject.next(newAuthResult.token);

                return next(req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${newAuthResult.token}`)
                }));
            }),
            catchError((err) => {
                isRefreshing = false;
                forceLogout(router, alertService);
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter(newToken => newToken !== null),
            take(1),
            switchMap(newToken => {
                return next(req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                }));
            })
        );
    }
}

function forceLogout(router: Router, alertService: AlertService) {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('authInfo');
    alertService.warning('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại để tiếp tục.');
    router.navigate(['/login']);
}
