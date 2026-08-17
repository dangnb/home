import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeModeService, ThemeModeType } from './theme-mode.service';

@Component({ standalone: false,
  selector: 'app-theme-mode-switcher',
  templateUrl: './theme-mode-switcher.component.html',
})
export class ThemeModeSwitcherComponent implements OnInit {
  @Input() toggleBtnClass: string = '';
  @Input() toggleBtnIconClass: string = 'svg-icon-2';
  mode$: Observable<ThemeModeType>;
  menuMode$: Observable<ThemeModeType>;

  constructor(private modeService: ThemeModeService) {}

  ngOnInit(): void {
    this.mode$ = this.modeService.mode.asObservable();
    this.menuMode$ = this.modeService.menuMode.asObservable();
  }

  /** Simple toggle: light → dark → light */
  toggleMode(currentMode: ThemeModeType): void {
    const nextMode: ThemeModeType = currentMode === 'dark' ? 'light' : 'dark';
    this.modeService.switchMode(nextMode);
  }

  switchMode(_mode: ThemeModeType): void {
    this.modeService.switchMode(_mode);
  }
}
