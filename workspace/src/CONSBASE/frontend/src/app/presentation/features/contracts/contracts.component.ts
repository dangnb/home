import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Contract } from '../../../core/models/models';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contracts-page">
      <div class="header-banner glass-card">
        <div>
          <h2>📑 Quản Lý Hợp Đồng Thi Công</h2>
          <p class="subtitle">Khởi tạo từ báo giá duyệt • Nguyên tắc nghiêm ngặt: <strong>1 Hợp đồng chỉ tạo 1 Dự án duy nhất</strong></p>
        </div>
      </div>

      <div class="contracts-list" *ngIf="contracts.length">
        <div class="contract-card glass-card" *ngFor="let c of contracts">
          <div class="contract-header">
            <div>
              <span class="c-num">{{ c.contractNumber }}</span>
              <h3>{{ c.title }}</h3>
              <p class="c-sub">Khách hàng: <strong>{{ c.customer?.name }}</strong> | Ký ngày: {{ c.signedDate | date:'dd/MM/yyyy' }}</p>
            </div>
            <div class="c-status">
              <span class="badge badge-approved">{{ c.status }}</span>
            </div>
          </div>

          <div class="contract-body-grid">
            <div class="info-box">
              <span class="lbl">Tổng Giá Trị Hợp Đồng</span>
              <span class="val text-cyan">{{ c.totalValue | number:'1.0-0' }} VNĐ</span>
            </div>
            <div class="info-box">
              <span class="lbl">Tạm Ứng Đợt 1 (Đã Nhận)</span>
              <span class="val text-emerald">{{ c.advancePayment | number:'1.0-0' }} VNĐ</span>
            </div>
            <div class="info-box">
              <span class="lbl">Liên Kết Dự Án (1-to-1)</span>
              <span class="val" *ngIf="c.projectId">
                <span class="badge badge-active">Đã khởi tạo Dự án</span>
              </span>
              <button class="btn btn-primary" *ngIf="!c.projectId" (click)="convertToProject(c.id)">
                🚀 Khởi Tạo Dự Án Duy Nhất
              </button>
            </div>
          </div>

          <!-- Payment Schedule -->
          <div class="payment-schedule">
            <h4>📅 Kế Hoạch & Tiến Độ Thanh Toán</h4>
            <div class="schedule-grid">
              <div class="schedule-item glass-card" *ngFor="let term of c.paymentTerms">
                <div class="term-top">
                  <span>Đợt {{ term.stageNumber }}: {{ term.description }}</span>
                  <span class="badge" [class.badge-approved]="term.isPaid" [class.badge-pending]="!term.isPaid">
                    {{ term.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán' }}
                  </span>
                </div>
                <div class="term-bot">
                  <strong>{{ term.amount | number:'1.0-0' }} VNĐ ({{ term.percentage }}%)</strong>
                  <span>Hạn thanh toán: {{ term.dueDate | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contracts-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; }
    .contracts-list { display: flex; flex-direction: column; gap: 16px; }
    .contract-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .contract-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .c-num { font-size: 0.75rem; color: #3b82f6; font-weight: 700; text-transform: uppercase; }
    .c-sub { font-size: 0.85rem; color: #9ca3af; margin-top: 4px; }
    .contract-body-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: rgba(15,22,36,0.6); padding: 16px; border-radius: 12px; }
    .info-box { display: flex; flex-direction: column; gap: 4px; }
    .lbl { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; }
    .val { font-size: 1.1rem; font-weight: 700; color: #fff; }
    .text-cyan { color: #38bdf8; }
    .text-emerald { color: #34d399; }
    .payment-schedule { display: flex; flex-direction: column; gap: 10px; }
    .payment-schedule h4 { font-size: 0.9rem; color: #e5e7eb; }
    .schedule-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .schedule-item { padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; }
    .term-top { display: flex; justify-content: space-between; align-items: center; color: #fff; }
    .term-bot { display: flex; justify-content: space-between; align-items: center; color: #9ca3af; }
  `]
})
export class ContractsComponent implements OnInit {
  private api = inject(ApiService);
  contracts: Contract[] = [];

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.api.getContracts().subscribe(c => this.contracts = c);
  }

  convertToProject(contractId: string) {
    this.api.convertToProject(contractId).subscribe(res => {
      alert(res.message);
      this.loadContracts();
    });
  }
}
