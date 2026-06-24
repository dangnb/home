import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const alertService = inject(AlertService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token is expired or invalid
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('authInfo');

                // Show an alert using the shared AlertService before redirecting
                alertService.warning('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại để tiếp tục.');

                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
