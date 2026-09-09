import { Component, EventEmitter, HostListener, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
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

  // Active dropdown: 'theme' | 'user' | null
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

  logout(): void {
    this.closeAll();
    this.authService.logout();
  }
}
