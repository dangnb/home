import { Component, EventEmitter, HostListener, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ThemeMode } from '../../../core/models/theme.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleMobileSidebar = new EventEmitter<void>();

  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  readonly tenantService = inject(TenantService);
  readonly notificationService = inject(NotificationService);

  // Active dropdown: 'theme' | 'user' | 'notification' | null
  readonly activeDropdown = signal<string | null>(null);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.app-navbar-item') && !target.closest('.app-header-menu')) {
      this.closeAll();
    }
  }

  onMobileToggle(): void {
    this.toggleMobileSidebar.emit();
  }

  toggleDropdown(name: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.activeDropdown() === name) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(name);
    }
  }

  closeAll(): void {
    this.activeDropdown.set(null);
  }

  setTheme(mode: ThemeMode, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.themeService.setTheme(mode);
    this.closeAll();
  }

  onNotificationClick(notif: any): void {
    if (!notif.isRead) {
      this.notificationService.markAsRead(notif.id);
    }
    this.closeAll();
  }

  onMarkAllRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead();
  }

  logout(): void {
    this.closeAll();
    this.authService.logout();
  }
}
