import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { DebtRecord } from '../../../core/models/models';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="finance-page">
      <div class="header-banner glass-card">
        <div>
          <h2>💰 Quản Lý Tài Chính, Chi Phí & Kiểm Soát Ngân Sách</h2>
          <p class="subtitle">Ngân sách dự án • Đề nghị thanh toán • Công nợ Phải thu / Phải trả • Cảnh báo Vượt ngân sách</p>
        </div>
      </div>

      <!-- Cost Overrun Analysis Banner -->
      <div class="glass-card overrun-card" *ngIf="costAnalysis">
        <div class="overrun-left">
          <span class="badge" [class.badge-delayed]="costAnalysis.isOverrun" [class.badge-approved]="!costAnalysis.isOverrun">
            {{ costAnalysis.status }}
          </span>
          <h3>Kiểm Soát Ngân Sách: {{ costAnalysis.name }}</h3>
          <p>Mã dự án: <strong>{{ costAnalysis.projectCode }}</strong></p>
        </div>
        <div class="overrun-metrics">
          <div class="metric">
            <span class="lbl">Ngân Sách Được Duyệt</span>
            <span class="val text-cyan">{{ costAnalysis.budget | number:'1.0-0' }} VNĐ</span>
          </div>
          <div class="metric">
            <span class="lbl">Chi Phí Thực Tế Đã Chi</span>
            <span class="val text-rose">{{ costAnalysis.actualCost | number:'1.0-0' }} VNĐ</span>
          </div>
          <div class="metric">
            <span class="lbl">Chênh Lệch</span>
            <span class="val" [class.text-rose]="costAnalysis.variance > 0" [class.text-emerald]="costAnalysis.variance <= 0">
              {{ costAnalysis.variance | number:'1.0-0' }} VNĐ ({{ costAnalysis.overrunPercentage }}%)
            </span>
          </div>
        </div>
      </div>

      <div class="finance-grid">
        <!-- Payment Requests Approval Flow -->
        <div class="glass-card section-card">
          <h3>📝 Đề Nghị Thanh Toán & Phê Duyệt</h3>
          <div class="req-list">
            <div class="req-item glass-card" *ngFor="let p of paymentRequests">
              <div class="req-top">
                <strong>{{ p.requestCode }} - {{ p.payeeName }}</strong>
                <span class="badge" [class.badge-approved]="p.status === 'Approved'" [class.badge-pending]="p.status !== 'Approved'">
                  {{ p.status }}
                </span>
              </div>
              <p>Lý do: {{ p.reason }}</p>
              <div class="req-bot">
                <span class="text-emerald font-bold">Số tiền: {{ p.requestedAmount | number:'1.0-0' }} VNĐ</span>
                <button class="btn btn-emerald btn-sm" *ngIf="p.status !== 'Approved'" (click)="approvePaymentRequest(p.id)">
                  ✅ Phê Duyệt & Giải Ngân
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Debt Table -->
        <div class="glass-card section-card">
          <h3>💳 Công Nợ Phải Thu / Phải Trả</h3>
          <div class="table-container">
            <table class="consbase-table">
              <thead>
                <tr>
                  <th>Đối Tác</th>
                  <th>Phân Loại</th>
                  <th>Tổng Giá Trị</th>
                  <th>Còn Nợ</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of debts">
                  <td><strong>{{ d.partnerName }}</strong></td>
                  <td>
                    <span class="badge" [class.badge-approved]="d.type === 'Receivable'" [class.badge-delayed]="d.type === 'Payable'">
                      {{ d.type === 'Receivable' ? 'Phải Thu' : 'Phải Trả' }}
                    </span>
                  </td>
                  <td>{{ d.originalAmount | number:'1.0-0' }}</td>
                  <td class="text-rose font-bold">{{ d.remainingDebt | number:'1.0-0' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .finance-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; }
    .overrun-card { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; background: rgba(15,22,36,0.8); border: 1px solid rgba(59,130,246,0.3); }
    .overrun-metrics { display: flex; gap: 32px; }
    .metric { display: flex; flex-direction: column; gap: 4px; }
    .lbl { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; }
    .val { font-size: 1.1rem; font-weight: 700; color: #fff; }
    .finance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .section-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .req-list { display: flex; flex-direction: column; gap: 12px; }
    .req-item { padding: 14px; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; }
    .req-top { display: flex; justify-content: space-between; align-items: center; color: #fff; }
    .req-bot { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
    .text-cyan { color: #38bdf8; }
    .text-emerald { color: #34d399; }
    .text-rose { color: #f87171; }
    .font-bold { font-weight: 700; }
    .btn-sm { padding: 6px 12px; font-size: 0.78rem; }
  `]
})
export class FinanceComponent implements OnInit {
  private api = inject(ApiService);
  debts: DebtRecord[] = [];
  paymentRequests: any[] = [];
  costAnalysis: any = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getDebts().subscribe(d => this.debts = d);
    this.api.getPaymentRequests().subscribe(p => this.paymentRequests = p);
    this.api.getProjects().subscribe(projects => {
      if (projects.length) {
        this.api.getCostOverrunAnalysis(projects[0].id).subscribe(res => this.costAnalysis = res);
      }
    });
  }

  approvePaymentRequest(id: string) {
    this.api.approvePaymentRequest(id).subscribe(res => {
      alert(`✅ ${res.message}`);
      this.loadData();
    });
  }
}
