import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const permissionGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    try {
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        while (base64.length % 4) {
            base64 += '=';
        }

        const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));

        // Extract required permission from route data
        const requiredPermission = route.data?.['permission'] as string;
        if (!requiredPermission) {
            // If no permission is required, let it pass
            return true;
        }

        let userPermissions: string[] = [];
        if (payload.Permissions) {
            try {
                // Permissions is a JSON string of array
                var parsed = JSON.parse(payload.Permissions);
                if (Array.isArray(parsed)) {
                    userPermissions = parsed;
                } else if (typeof parsed === 'string') {
                    // Just in case it's a single string instead of array
                    userPermissions = [parsed];
                }
            } catch {
                userPermissions = [];
            }
        }

        // Check if user has wildcard or the required permission
        if (userPermissions && (userPermissions.includes('*') || userPermissions.includes(requiredPermission))) {
            return true;
        }

        // Unauthorized
        console.warn('Unauthorized access to route:', state.url);
        router.navigate(['/admin/dashboard']); // Redirect to dashboard or a 403 page
        return false;
    } catch (e) {
        return false;
    }
};
