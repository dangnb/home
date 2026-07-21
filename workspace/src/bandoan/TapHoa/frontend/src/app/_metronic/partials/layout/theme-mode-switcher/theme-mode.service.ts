import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeModeComponent } from '../../../kt/layout';

export type ThemeModeType = 'dark' | 'light' | 'system';
const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark';

// Keys must match ThemeModeComponent's getParamName() which uses 'kt_metronic_theme_mode_*'
// because body has data-kt-name="metronic"
const themeModeLSKey = 'kt_metronic_theme_mode_value';
const themeMenuModeLSKey = 'kt_metronic_theme_mode_menu';

const getThemeModeFromLocalStorage = (lsKey: string): ThemeModeType => {
  if (!localStorage) {
    return 'light';
  }

  const data = localStorage.getItem(lsKey);
  if (!data) {
    return 'light';
  }

  if (data === 'light') {
    return 'light';
  }

  if (data === 'dark') {
    return 'dark';
  }

  return 'system';
};

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  public mode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      getThemeModeFromLocalStorage(themeModeLSKey)
    );
  public menuMode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      getThemeModeFromLocalStorage(themeMenuModeLSKey)
    );

  constructor() {}

  public updateMode(_mode: ThemeModeType) {
    const updatedMode = _mode === 'system' ? systemMode : _mode;
    this.mode.next(updatedMode);
    this.menuMode.next(updatedMode);

    if (localStorage) {
      localStorage.setItem(themeModeLSKey, updatedMode);
      localStorage.setItem(themeMenuModeLSKey, updatedMode);
    }

    // Apply data-bs-theme to <html> element — CSS [data-bs-theme="dark"] selectors respond to this
    document.documentElement.setAttribute('data-bs-theme', updatedMode);
    // Also apply to body for broader compatibility
    document.body.setAttribute('data-bs-theme', updatedMode);
  }

  public updateMenuMode(_menuMode: ThemeModeType) {
    this.menuMode.next(_menuMode);
    if (localStorage) {
      localStorage.setItem(themeMenuModeLSKey, _menuMode);
    }
  }

  public init() {
    const savedMode = getThemeModeFromLocalStorage(themeModeLSKey);
    this.updateMode(savedMode);
  }

  /** Toggle: saves to localStorage AND applies theme immediately (no reload needed) */
  public switchMode(_mode: ThemeModeType) {
    this.updateMode(_mode);
  }
}
