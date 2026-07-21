import { Component, OnInit } from '@angular/core';

@Component({ standalone: false,
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  isRoot = false;

  constructor() {}

  ngOnInit(): void {
    this.checkIsRoot();
  }

  private checkIsRoot(): void {
    try {
      // Fallback: check từ token trực tiếp
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes('authf649fc9a5f57')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const tokenData = JSON.parse(stored);
            const jwt = tokenData?.authToken;
            if (jwt && typeof jwt === 'string' && jwt.includes('.')) {
              const payload = JSON.parse(atob(jwt.split('.')[1]));
              const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';
              this.isRoot = username.toLowerCase() === 'root';
              return;
            }
          }
        }
      }
      this.isRoot = false;
    } catch {
      this.isRoot = false;
    }
  }
}
