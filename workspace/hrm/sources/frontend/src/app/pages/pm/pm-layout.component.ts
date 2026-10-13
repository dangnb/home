import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-pm-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<div class="pm-app">
  <!-- Sidebar -->
  <nav class="pm-sidebar" [class.collapsed]="isCollapsed">
    <div class="pm-sidebar-header">
      <div class="pm-logo" *ngIf="!isCollapsed">
        <div class="pm-logo-icon"><i class="bi bi-kanban-fill"></i></div>
        <div class="pm-logo-text">
          <div class="pm-logo-title">Project Hub</div>
          <div class="pm-logo-sub">Quản Lý Dự Án</div>
        </div>
      </div>
      <div class="pm-logo" *ngIf="isCollapsed" style="justify-content:center">
        <div class="pm-logo-icon"><i class="bi bi-kanban-fill"></i></div>
      </div>
      <button class="pm-collapse-btn" (click)="isCollapsed = !isCollapsed">
        <i class="bi" [ngClass]="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>

    <div class="pm-nav">
      <div class="pm-nav-label" *ngIf="!isCollapsed">MENU CHÍNH</div>

      <a class="pm-nav-item" routerLink="/pm/dashboard" [class.active]="isActive('/pm/dashboard')" [title]="isCollapsed ? 'Tổng Quan Dự Án' : ''">
        <div class="pm-nav-icon"><i class="bi bi-grid-1x2-fill"></i></div>
        <span *ngIf="!isCollapsed">Tổng Quan Dự Án</span>
        <span class="pm-badge" *ngIf="!isCollapsed && stats.pendingAssignment > 0">{{stats.pendingAssignment}}</span>
      </a>

      <a class="pm-nav-item" routerLink="/pm/my-schedule" [class.active]="isActive('/pm/my-schedule')" [title]="isCollapsed ? 'Lịch Làm Việc Của Tôi' : ''">
        <div class="pm-nav-icon"><i class="bi bi-calendar3-week-fill"></i></div>
        <span *ngIf="!isCollapsed">Lịch Làm Việc Của Tôi</span>
      </a>

      <a class="pm-nav-item" routerLink="/pm/department" [class.active]="isActive('/pm/department')" [title]="isCollapsed ? 'Quản Lý Phòng Ban' : ''">
        <div class="pm-nav-icon"><i class="bi bi-building-fill-gear"></i></div>
        <span *ngIf="!isCollapsed">Quản Lý Phòng Ban</span>
      </a>

      <div class="pm-nav-divider"></div>
      <div class="pm-nav-label" *ngIf="!isCollapsed">HỆ THỐNG</div>

      <!-- Theme Toggle -->
      <button class="pm-nav-item pm-theme-btn" (click)="toggleTheme()" [title]="isCollapsed ? 'Chuyển sáng/tối' : ''">
        <div class="pm-nav-icon">
          <i class="bi" [ngClass]="isDark() ? 'bi-sun-fill' : 'bi-moon-stars-fill'"
             [style.color]="isDark() ? '#fbbf24' : '#818cf8'"></i>
        </div>
        <span *ngIf="!isCollapsed">{{ isDark() ? 'Chế Độ Sáng' : 'Chế Độ Tối' }}</span>
      </button>

      <a class="pm-nav-item" routerLink="/hrm/dashboard" [title]="isCollapsed ? 'Quay lại HRM' : ''">
        <div class="pm-nav-icon"><i class="bi bi-arrow-left-circle"></i></div>
        <span *ngIf="!isCollapsed">Quay Lại HRM</span>
      </a>
    </div>

    <!-- User info -->
    <div class="pm-sidebar-footer" *ngIf="!isCollapsed">
      <div class="pm-user-card">
        <div class="pm-user-avatar"><i class="bi bi-person-fill"></i></div>
        <div class="pm-user-info">
          <div class="pm-user-name">Project Manager</div>
          <div class="pm-user-role">PM Module</div>
        </div>
      </div>
    </div>
  </nav>

  <main class="pm-main" [class.sidebar-collapsed]="isCollapsed">
    <router-outlet></router-outlet>
  </main>
</div>
  `,
  styles: [`
    .pm-app { display: flex; min-height: 100vh; background: var(--pm-bg); font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; transition: background 0.3s; }

    .pm-sidebar { width: 240px; min-height: 100vh; background: var(--pm-sidebar-bg); border-right: 1px solid var(--pm-sidebar-border); display: flex; flex-direction: column; transition: width 0.25s ease; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
    .pm-sidebar.collapsed { width: 64px; }

    .pm-sidebar-header { padding: 20px 14px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--pm-sidebar-border); min-height: 72px; }
    .pm-logo { display: flex; align-items: center; gap: 10px; overflow: hidden; flex: 1; }
    .pm-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; flex-shrink: 0; }
    .pm-logo-title { font-size: 0.95rem; font-weight: 700; color: #f1f5f9; white-space: nowrap; }
    .pm-logo-sub { font-size: 0.68rem; color: rgba(255,255,255,0.4); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.05em; }
    .pm-collapse-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--pm-collapse-border); background: var(--pm-collapse-btn); color: rgba(255,255,255,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 0.7rem; flex-shrink: 0; }
    .pm-collapse-btn:hover { background: rgba(99,102,241,0.3); color: white; border-color: rgba(99,102,241,0.5); }

    .pm-nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
    .pm-nav-label { font-size: 0.62rem; font-weight: 700; color: var(--pm-sidebar-label); text-transform: uppercase; letter-spacing: 0.1em; padding: 10px 8px 6px; }
    .pm-nav-divider { height: 1px; background: var(--pm-sidebar-border); margin: 8px 0; }
    .pm-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 8px; border-radius: 9px; color: var(--pm-sidebar-nav-color); text-decoration: none; transition: all 0.15s; margin-bottom: 2px; cursor: pointer; position: relative; white-space: nowrap; overflow: hidden; border: 1px solid transparent; width: 100%; box-sizing: border-box; }
    .pm-nav-item:hover { background: var(--pm-sidebar-nav-hover); color: rgba(255,255,255,0.9); }
    .pm-nav-item.active { background: var(--pm-sidebar-nav-active); color: #c7d2fe; border-color: var(--pm-sidebar-nav-active-border); }
    .pm-nav-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 7px; font-size: 0.95rem; flex-shrink: 0; }
    .pm-nav-item span { font-size: 0.85rem; font-weight: 500; }
    .pm-badge { margin-left: auto; background: #ef4444; color: white; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 10px; }
    .pm-theme-btn { background: transparent; text-align: left; }

    .pm-sidebar-footer { padding: 12px 10px; border-top: 1px solid var(--pm-sidebar-footer-border); }
    .pm-user-card { display: flex; align-items: center; gap: 10px; padding: 8px; background: var(--pm-sidebar-user-card); border-radius: 9px; }
    .pm-user-avatar { width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.9rem; flex-shrink: 0; }
    .pm-user-name { font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.85); }
    .pm-user-role { font-size: 0.66rem; color: rgba(255,255,255,0.4); }

    .pm-main { flex: 1; margin-left: 240px; transition: margin-left 0.25s ease; min-height: 100vh; }
    .pm-main.sidebar-collapsed { margin-left: 64px; }
  `]
})
export class PmLayoutComponent implements OnInit {
  private router = inject(Router);
  readonly themeService = inject(ThemeService);
  isCollapsed = false;
  stats = { pendingAssignment: 0 };

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {});
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  isDark(): boolean {
    const t = this.themeService.currentTheme();
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    this.themeService.setTheme(this.isDark() ? 'light' : 'dark');
  }
}
