import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface TenantInfo {
  id: string;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly storageKey = 'hrm_current_tenant';

  currentTenant = signal<TenantInfo>(this.getInitialTenant());

  private getInitialTenant(): TenantInfo {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && !String(parsed.id).includes('-')) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return {
      id: environment.defaultTenantId,
      code: environment.defaultTenantCode,
      name: 'Default Enterprise (HQ)'
    };
  }

  setTenant(tenant: TenantInfo) {
    this.currentTenant.set(tenant);
    localStorage.setItem(this.storageKey, JSON.stringify(tenant));
  }

  getTenantId(): string {
    return this.currentTenant().id;
  }

  getTenantCode(): string {
    return this.currentTenant().code;
  }
}
