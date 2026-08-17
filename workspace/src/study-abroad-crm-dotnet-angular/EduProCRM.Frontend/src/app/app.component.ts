import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalJournalComponent } from './features/legal-journal/legal-journal.component';
import { ApprovalsComponent } from './features/approvals/approvals.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LegalJournalComponent, ApprovalsComponent],
  template: `
    <div class="angular-app-shell">
      <header class="top-nav">
        <div class="brand">
          <h1>🎓 EduPro CRM Angular 19 Client</h1>
          <span class="sub">Clean Architecture .NET 9 API Backend</span>
        </div>
        <div class="tabs">
          <button class="tab-btn" [class.active]="activeTab() === 'journal'" (click)="activeTab.set('journal')">
            📜 Nhật Ký Bằng Chứng Pháp Lý (Mục 7)
          </button>
          <button class="tab-btn" [class.active]="activeTab() === 'approvals'" (click)="activeTab.set('approvals')">
            🛡️ Phê Duyệt 2 Cấp (Mở Rộng #4)
          </button>
        </div>
      </header>

      <main class="main-body">
        @if (activeTab() === 'journal') {
          <app-legal-journal></app-legal-journal>
        } @else if (activeTab() === 'approvals') {
          <app-approvals></app-approvals>
        }
      </main>
    </div>
  `,
  styles: [`
    .angular-app-shell { font-family: 'Plus Jakarta Sans', sans-serif; background: #0b0f19; color: #fff; min-height: 100vh; }
    .top-nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #111827; border-bottom: 1px solid #374151; }
    .brand h1 { font-size: 18px; margin: 0; }
    .brand .sub { font-size: 11px; color: #9ca3af; }
    .tabs { display: flex; gap: 12px; }
    .tab-btn { padding: 8px 16px; background: #1f2937; border: 1px solid #374151; color: #9ca3af; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .tab-btn.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
  `]
})
export class AppComponent {
  activeTab = signal<'journal' | 'approvals'>('journal');
}
