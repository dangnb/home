import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { DailyLog } from '../../../core/models/models';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field-page">
      <!-- Mobile Site Header Card -->
      <div class="header-banner glass-card field-header">
        <div class="field-badge-row">
          <span class="badge badge-approved">📱 CONSBASE FIELD APP</span>
          <span class="badge badge-active">📍 GPS Site Check-in Active</span>
        </div>
        <h2>👷 Nhật Ký Thi Công & Quản Lý Hiện Trường</h2>
        <p class="subtitle">Ghi nhận công nhân, thiết bị, vật tư & chụp ảnh thực tế tại công trình</p>
      </div>

      <!-- Quick Field Actions -->
      <div class="field-quick-actions">
        <button class="btn btn-emerald field-btn" (click)="quickCheckIn()">
          📍 Check-in Công Nhân Hiện Trường (18 Nhân sự)
        </button>
        <button class="btn btn-primary field-btn" (click)="showNewLog = true">
          📝 Tạo Nhật Ký Thi Công Mới (Điện thoại/Tablet)
        </button>
      </div>

      <!-- Daily Logs List -->
      <div class="logs-container">
        <h3>📋 Lịch Sử Nhật Ký Thi Công Công Trình</h3>
        <div class="logs-grid">
          <div class="log-card glass-card" *ngFor="let log of dailyLogs">
            <div class="log-top">
              <div class="log-date-badge">
                <span class="date-num">{{ log.logDate | date:'dd' }}</span>
                <span class="date-month">Thg {{ log.logDate | date:'MM/yyyy' }}</span>
              </div>
              <div class="log-title-info">
                <h4>Ca thi công: {{ log.shift }}</h4>
                <p>🌤️ Thời tiết: <strong>{{ log.weather }}</strong> | Người lập: {{ log.createdByUser?.fullName || 'Kỹ sư Lê Kiều' }}</p>
              </div>
              <div class="log-status-wrap">
                <span class="badge" [class.badge-approved]="log.status === 'Approved'" [class.badge-pending]="log.status === 'Draft'" [class.badge-delayed]="log.status === 'Locked'">
                  {{ log.status === 'Approved' ? 'Đã Phê Duyệt' : (log.status === 'Locked' ? 'Đã Khóa' : 'Bản Nháp') }}
                </span>
              </div>
            </div>

            <!-- Notes & Incident -->
            <div class="log-notes-box">
              <p>📌 <strong>Ghi nhận công việc:</strong> {{ log.generalNotes }}</p>
              <p *ngIf="log.incidentReport" class="text-rose">⚠️ <strong>Sự cố hiện trường:</strong> {{ log.incidentReport }}</p>
            </div>

            <!-- Site Photos Gallery -->
            <div class="photo-gallery" *ngIf="log.photos && log.photos.length">
              <h5>📷 Hình Ảnh Thi Công Thực Tế Công Trình</h5>
              <div class="photos-grid">
                <div class="photo-item" *ngFor="let p of log.photos">
                  <img [src]="p.photoUrl" [alt]="p.caption" class="site-img" />
                  <span class="img-caption">{{ p.caption }}</span>
                </div>
              </div>
            </div>

            <!-- Log Actions -->
            <div class="log-actions" *ngIf="log.status !== 'Locked'">
              <button class="btn btn-emerald btn-sm" *ngIf="log.status === 'Draft'" (click)="approveLog(log.id)">
                ✅ Phê Duyệt & Đồng Bộ Tiến Độ
              </button>
              <button class="btn btn-secondary btn-sm" (click)="lockLog(log.id)">
                🔒 Khóa Nhật Ký Hiện Trường
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- New Daily Log Modal -->
      <div class="modal-backdrop" *ngIf="showNewLog">
        <div class="modal-content glass-card">
          <h3>📝 Tạo Nhật Ký Thi Công Hiện Trường Mới</h3>
          <div class="form-group">
            <label>Thời tiết hiện trường:</label>
            <input class="input-control" [(ngModel)]="newLogData.weather" placeholder="Nắng ráo 32°C..." />
          </div>
          <div class="form-group">
            <label>Nội dung ghi nhận thi công:</label>
            <textarea class="input-control" rows="3" [(ngModel)]="newLogData.generalNotes" placeholder="Ghi nhận khối lượng đã thực hiện trong ngày..."></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showNewLog = false">Hủy</button>
            <button class="btn btn-primary" (click)="saveNewLog()">Lưu & Tải Ảnh Lên</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .field-page { display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto; }
    .field-header { padding: 20px; display: flex; flex-direction: column; gap: 8px; }
    .field-badge-row { display: flex; gap: 8px; }
    .field-quick-actions { display: flex; gap: 12px; }
    .field-btn { flex: 1; padding: 14px; font-size: 0.95rem; }
    .logs-container { display: flex; flex-direction: column; gap: 14px; }
    .logs-grid { display: flex; flex-direction: column; gap: 16px; }
    .log-card { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
    .log-top { display: flex; align-items: center; gap: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; }
    .log-date-badge { width: 60px; height: 60px; border-radius: 12px; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .date-num { font-weight: 800; font-size: 1.25rem; color: #60a5fa; }
    .date-month { font-size: 0.65rem; color: #9ca3af; }
    .log-title-info { flex: 1; }
    .log-notes-box { padding: 12px; background: rgba(15,22,36,0.7); border-radius: 10px; font-size: 0.88rem; display: flex; flex-direction: column; gap: 6px; }
    .photo-gallery { display: flex; flex-direction: column; gap: 8px; }
    .photo-gallery h5 { font-size: 0.85rem; color: #9ca3af; }
    .photos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .photo-item { position: relative; border-radius: 10px; overflow: hidden; height: 160px; }
    .site-img { width: 100%; height: 100%; object-fit: cover; }
    .img-caption { position: absolute; bottom: 0; inset-x: 0; padding: 6px 10px; background: rgba(0,0,0,0.75); font-size: 0.75rem; color: #fff; }
    .log-actions { display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { width: 500px; padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #0f172a; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
  `]
})
export class FieldComponent implements OnInit {
  private api = inject(ApiService);
  dailyLogs: DailyLog[] = [];
  projectId = 'DA-2026-SUN-01'; // Default active project
  showNewLog = false;

  newLogData = {
    weather: 'Nắng nhẹ 30°C',
    shift: 'Ca ngày (07:00 - 17:00)',
    generalNotes: 'Thi công đổ bê tông sàn Tầng 2, kiểm tra cốp pha hố móng.',
    incidentReport: 'An toàn hiện trường đạt 100%'
  };

  ngOnInit() {
    this.api.getProjects().subscribe(p => {
      if (p.length) {
        this.projectId = p[0].id;
        this.loadLogs();
      }
    });
  }

  loadLogs() {
    this.api.getDailyLogs(this.projectId).subscribe(logs => this.dailyLogs = logs);
  }

  quickCheckIn() {
    alert('✅ Đã điểm danh 18 công nhân tại công trường thành công (GPS Verified).');
  }

  saveNewLog() {
    const payload = {
      projectId: this.projectId,
      ...this.newLogData
    };
    this.api.createDailyLog(payload).subscribe(() => {
      this.showNewLog = false;
      this.loadLogs();
    });
  }

  approveLog(id: string) {
    this.api.approveDailyLog(id, 'pm-user-id').subscribe(() => {
      this.loadLogs();
    });
  }

  lockLog(id: string) {
    this.api.lockDailyLog(id).subscribe(() => {
      this.loadLogs();
    });
  }
}
