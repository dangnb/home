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
        const payload = JSON.parse(atob(token.split('.')[1]));
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
