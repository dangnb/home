import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modules-page">
      <div class="header-banner glass-card">
        <div>
          <h2>🦺 QC, HSE, Phát Sinh, Nghiệm Thu & Nhà Thầu Phụ</h2>
          <p class="subtitle">Kiểm soát an toàn lao động HSE • Phát sinh Change Orders • Nghiệm thu bàn giao • Quản lý nhà thầu phụ</p>
        </div>
      </div>

      <div class="modules-grid">
        <!-- Change Orders -->
        <div class="glass-card module-card">
          <h3>🔧 Quản Lý Phát Sinh & Thay Đổi (Change Orders)</h3>
          <div class="item-list">
            <div class="item glass-card" *ngFor="let co of changeOrders">
              <div class="top-row">
                <strong>{{ co.changeOrderCode }}</strong>
                <span class="badge" [class.badge-approved]="co.status === 'Approved'" [class.badge-pending]="co.status !== 'Approved'">
                  {{ co.status }}
                </span>
              </div>
              <p>{{ co.description }}</p>
              <div class="act-row">
                <span class="text-rose font-bold">Chi phí phát sinh: +{{ co.additionalCost | number:'1.0-0' }} VNĐ (+{{ co.extensionDays }} ngày)</span>
                <button class="btn btn-emerald btn-sm" *ngIf="co.status !== 'Approved'" (click)="approveChangeOrder(co.id)">
                  ✅ Phê Duyệt Phụ Lục VO
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acceptance & Warranty -->
        <div class="glass-card module-card">
          <h3>✅ Nghiệm Thu, Bàn Giao & Bảo Hành</h3>
          <div class="item-list">
            <div class="item glass-card" *ngFor="let acc of acceptances">
              <div class="top-row">
                <strong>{{ acc.recordCode }}: {{ acc.workCategory }}</strong>
                <span class="badge badge-approved">{{ acc.status }}</span>
              </div>
              <p>Khối lượng nghiệm thu: {{ acc.acceptedVolume }} m3</p>
              <span class="text-emerald font-bold">Biên bản: {{ acc.inspectionReport }}</span>
            </div>
          </div>
        </div>

        <!-- QC & HSE -->
        <div class="glass-card module-card">
          <h3>🛡️ Chất Lượng & An Toàn HSE</h3>
          <div class="item-list">
            <div class="item glass-card" *ngFor="let q of qcHseIncidents">
              <div class="top-row">
                <strong>{{ q.title }}</strong>
                <span class="badge" [class.badge-approved]="q.isResolved" [class.badge-delayed]="!q.isResolved">
                  {{ q.isResolved ? 'Đã Khắc Phục' : 'Chưa Khắc Phục' }}
                </span>
              </div>
              <p>{{ q.description }}</p>
              <div class="act-row">
                <span class="text-emerald" *ngIf="q.isResolved">Phương án: {{ q.correctiveAction }}</span>
                <button class="btn btn-primary btn-sm" *ngIf="!q.isResolved" (click)="resolveIncident(q.id)">
                  🛠️ Ghi Nhận Phương Án Khắc Phục
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Subcontractors -->
        <div class="glass-card module-card">
          <h3>👷 Nhà Thầu Phụ & Tổ Đội Thi Công</h3>
          <div class="item-list">
            <div class="item glass-card" *ngFor="let sub of subcontractors">
              <div class="top-row">
                <strong>{{ sub.name }} ({{ sub.code }})</strong>
                <span class="badge badge-active">{{ sub.specialty }}</span>
              </div>
              <p>MST: {{ sub.taxCode }} | SĐT: {{ sub.phone }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modules-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; }
    .modules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .module-card { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
    .item-list { display: flex; flex-direction: column; gap: 10px; }
    .item { padding: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; }
    .top-row { display: flex; justify-content: space-between; align-items: center; color: #fff; }
    .act-row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
    .text-rose { color: #f87171; }
    .text-emerald { color: #34d399; }
    .font-bold { font-weight: 700; }
    .btn-sm { padding: 4px 8px; font-size: 0.75rem; }
  `]
})
export class ModulesComponent implements OnInit {
  private api = inject(ApiService);
  changeOrders: any[] = [];
  acceptances: any[] = [];
  qcHseIncidents: any[] = [];
  subcontractors: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getChangeOrders().subscribe(c => this.changeOrders = c);
    this.api.getAcceptanceRecords().subscribe(a => this.acceptances = a);
    this.api.getQcHseIncidents().subscribe(q => this.qcHseIncidents = q);
    this.api.getSubcontractors().subscribe(s => this.subcontractors = s);
  }

  approveChangeOrder(id: string) {
    this.api.approveChangeOrder(id).subscribe(res => {
      alert(`✅ ${res.message}`);
      this.loadData();
    });
  }

  resolveIncident(id: string) {
    const action = prompt('Nhập phương án khắc phục an toàn / chất lượng:');
    if (action) {
      this.api.resolveQcHseIncident(id, action).subscribe(res => {
        alert(`✅ ${res.message}`);
        this.loadData();
      });
    }
  }
}
