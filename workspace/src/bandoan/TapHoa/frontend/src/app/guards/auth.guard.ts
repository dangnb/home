import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    try {
        // Fix Base64Url decoding (replace - with +, _ with /)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        const expiry = payload.exp * 1000; // exp is in seconds
        const now = new Date().getTime();

        if (now >= expiry) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('authInfo');
            router.navigate(['/login']);
            return false;
        }
    } catch (e) {
        // If token parsing fails, it's invalid
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('authInfo');
        router.navigate(['/login']);
        return false;
    }

    return true;
};
