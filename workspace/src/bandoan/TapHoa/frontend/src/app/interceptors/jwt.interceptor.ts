import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    // Get the auth info from local storage
    const authInfoStr = localStorage.getItem('authInfo');

    if (authInfoStr) {
        try {
            const authInfo = JSON.parse(authInfoStr);
            if (authInfo && authInfo.token) {
                // Clone the request to add the Authorization header
                const authReq = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${authInfo.token}`)
                });
                return next(authReq);
            }
        } catch (e) {
            console.error('Error parsing authInfo from localStorage', e);
        }
    }

    // If no token, pass the original request
    return next(req);
};
