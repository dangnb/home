import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const tenantId = tenantService.getTenantId();
  const tenantCode = tenantService.getTenantCode();

  const cloned = req.clone({
    setHeaders: {
      'X-Tenant-Id': tenantId,
      'X-Tenant-Code': tenantCode
    }
  });

  return next(cloned);
};
