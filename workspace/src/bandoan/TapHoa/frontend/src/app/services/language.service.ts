import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translate = inject(TranslateService);

    readonly languages: LanguageOption[] = [
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    init(): void {
        const saved = localStorage.getItem('app_lang');
        const lang = saved && this.languages.some(l => l.code === saved) ? saved : 'vi';
        this.translate.use(lang);
    }

    setLanguage(code: string): void {
        this.translate.use(code);
        localStorage.setItem('app_lang', code);
    }

    getCurrentLang(): string {
        return this.translate.currentLang() || 'vi';
    }

    getCurrentLanguage(): LanguageOption {
        return this.languages.find(l => l.code === this.getCurrentLang()) || this.languages[0];
    }
}
