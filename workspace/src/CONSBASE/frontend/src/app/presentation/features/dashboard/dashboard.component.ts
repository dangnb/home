import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ExecutiveStats } from '../../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <div class="header-banner glass-card">
        <div>
          <h2>📊 Dashboard Điều Hành Doanh Nghiệp Realtime</h2>
          <p class="subtitle">Kiểm soát tổng quan Hợp đồng, Dự án, Chi phí, Dòng tiền & Tiến độ hiện trường</p>
        </div>
        <button class="btn btn-primary" (click)="loadStats()">🔄 Cập nhật dữ liệu</button>
      </div>

      <!-- KPI Stat Grid -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card glass-card">
          <div class="stat-icon blue">🏢</div>
          <div class="stat-details">
            <span class="stat-label">Tổng Dự Án Đang Khởi Tạo</span>
            <span class="stat-value">{{ stats.totalProjects }}</span>
            <span class="stat-sub text-emerald">Active: {{ stats.activeProjects }} dự án thi công</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon cyan">📜</div>
          <div class="stat-details">
            <span class="stat-label">Tổng Giá Trị Hợp Đồng</span>
            <span class="stat-value">{{ stats.totalContractValue | number:'1.0-0' }} VNĐ</span>
            <span class="stat-sub">Đã thu: {{ stats.totalReceived | number:'1.0-0' }} VNĐ ({{ stats.cashflowRatio }}%)</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon emerald">💰</div>
          <div class="stat-details">
            <span class="stat-label">Công Nợ Phải Thu Chủ Đầu Tư</span>
            <span class="stat-value text-emerald">{{ stats.totalReceivables | number:'1.0-0' }} VNĐ</span>
            <span class="stat-sub">Phải trả NCC: {{ stats.totalPayables | number:'1.0-0' }} VNĐ</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon rose">⚠️</div>
          <div class="stat-details">
            <span class="stat-label">Cảnh Báo Chậm Tiến Độ</span>
            <span class="stat-value text-rose">{{ stats.delayedTasks }} Đầu việc</span>
            <span class="badge badge-delayed">Cần xử lý ngay</span>
          </div>
        </div>
      </div>

      <!-- Visual Charts / Analytics Summary -->
      <div class="analytics-row">
        <div class="analytics-card glass-card">
          <h3>📈 Tiến Độ & Hiệu Quả Thi Công Dự Án</h3>
          <div class="project-progress-list" *ngIf="projects.length">
            <div class="project-item" *ngFor="let p of projects">
              <div class="pj-info">
                <span class="pj-name">{{ p.name }}</span>
                <span class="pj-code">{{ p.projectCode }} | Manager: {{ p.projectManagerId ? 'Trần Hoàng' : 'Admin' }}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" [style.width.%]="p.progressPercentage"></div>
              </div>
              <span class="pj-pct">{{ p.progressPercentage }}%</span>
            </div>
          </div>
        </div>

        <div class="analytics-card glass-card">
          <h3>⚡ Nhật Ký Thi Công Hiện Trường Gần Đây (ConsBase Field)</h3>
          <div class="log-mini-list">
            <div class="log-mini-item">
              <span class="badge badge-approved">Duyệt</span>
              <div>
                <strong>ConsBase Tower (Tầng 4)</strong>
                <p>Nắng ráo 32°C • 18 Công nhân • Đã gia công 4.5T thép M1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; }
    .subtitle { color: #9ca3af; font-size: 0.875rem; margin-top: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .stat-card { display: flex; align-items: center; gap: 16px; padding: 20px; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(255,255,255,0.05); }
    .stat-label { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; display: block; }
    .stat-value { font-size: 1.35rem; font-weight: 700; color: #fff; margin: 4px 0; display: block; }
    .stat-sub { font-size: 0.75rem; color: #6b7280; }
    .text-emerald { color: #34d399 !important; }
    .text-rose { color: #f87171 !important; }
    .analytics-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .analytics-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .project-progress-list { display: flex; flex-direction: column; gap: 14px; }
    .project-item { display: flex; align-items: center; gap: 12px; }
    .pj-info { width: 200px; display: flex; flex-direction: column; }
    .pj-name { font-weight: 600; font-size: 0.9rem; color: #fff; }
    .pj-code { font-size: 0.75rem; color: #9ca3af; }
    .progress-bar-wrap { flex: 1; height: 10px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%); transition: width 0.5s ease; }
    .pj-pct { font-weight: 700; font-size: 0.85rem; color: #34d399; width: 45px; text-align: right; }
    .log-mini-list { display: flex; flex-direction: column; gap: 12px; }
    .log-mini-item { display: flex; gap: 12px; padding: 12px; background: rgba(15,22,36,0.5); border-radius: 10px; font-size: 0.85rem; }
    .log-mini-item p { color: #9ca3af; font-size: 0.75rem; margin-top: 4px; }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats: ExecutiveStats | null = null;
  projects: any[] = [];

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.api.getExecutiveStats().subscribe(s => this.stats = s);
    this.api.getProjects().subscribe(p => this.projects = p);
  }
}
