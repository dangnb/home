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
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Pad the base64 string with '=' so its length is a multiple of 4
        while (base64.length % 4) {
            base64 += '=';
        }

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
