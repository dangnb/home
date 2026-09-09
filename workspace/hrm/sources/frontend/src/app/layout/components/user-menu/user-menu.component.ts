import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeMode } from '../../../core/models/theme.model';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  isOpen = false;
  isThemeSubmenuOpen = false;

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
    this.isThemeSubmenuOpen = false;
  }

  setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }
}
