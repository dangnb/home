import { Injectable, signal, effect } from '@angular/core';
import { ThemeMode } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'data-theme';
  readonly currentTheme = signal<ThemeMode>('light');

  constructor() {
    this.initTheme();
    // Effect to reactively update DOM attribute
    effect(() => {
      const mode = this.currentTheme();
      this.applyTheme(mode);
    });

    // Listen to system dark/light changes if in system mode
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  private initTheme(): void {
    const saved = (localStorage.getItem(this.THEME_KEY) || localStorage.getItem('kt_theme_mode_value')) as ThemeMode | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      this.currentTheme.set(saved);
    } else {
      this.currentTheme.set('light');
    }
  }

  setTheme(mode: ThemeMode): void {
    localStorage.setItem(this.THEME_KEY, mode);
    localStorage.setItem('kt_theme_mode_value', mode);
    this.currentTheme.set(mode);
  }

  private applyTheme(mode: ThemeMode): void {
    let resolvedMode = mode;
    if (mode === 'system') {
      resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolvedMode);
    document.documentElement.setAttribute('data-bs-theme', resolvedMode);
    document.documentElement.setAttribute('data-theme-mode', mode);

    if (typeof document !== 'undefined' && document.body) {
      document.body.setAttribute('data-theme', resolvedMode);
      document.body.setAttribute('data-bs-theme', resolvedMode);
      document.body.setAttribute('data-theme-mode', mode);
    }
  }
}

