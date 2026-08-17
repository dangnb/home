import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Customer, Opportunity } from '../../../core/models/models';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="crm-page">
      <div class="header-banner glass-card">
        <div>
          <h2>🤝 CRM – Quản Lý Khách Hàng & Cơ Hội Kinh Doanh</h2>
          <p class="subtitle">Theo dõi khách hàng cá nhân / doanh nghiệp & Pipeline chuyển đổi sang Báo giá / Hợp đồng</p>
        </div>
      </div>

      <div class="crm-grid">
        <!-- Customers Directory -->
        <div class="glass-card section-card">
          <div class="card-header">
            <h3>👤 Danh Sách Khách Hàng</h3>
            <span class="badge badge-active">{{ customers.length }} Khách hàng</span>
          </div>
          <div class="table-container">
            <table class="consbase-table">
              <thead>
                <tr>
                  <th>Mã KH</th>
                  <th>Tên Khách Hàng</th>
                  <th>Phân Loại</th>
                  <th>Số Điện Thoại</th>
                  <th>Mã Số Thuế</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of customers">
                  <td><strong>{{ c.code }}</strong></td>
                  <td>{{ c.name }}</td>
                  <td>
                    <span class="badge" [class.badge-approved]="c.type === 'Enterprise'" [class.badge-pending]="c.type === 'Individual'">
                      {{ c.type === 'Enterprise' ? 'Doanh Nghiệp' : 'Cá Nhân' }}
                    </span>
                  </td>
                  <td>{{ c.phone }}</td>
                  <td>{{ c.taxCode || '---' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Opportunities Pipeline -->
        <div class="glass-card section-card">
          <div class="card-header">
            <h3>🎯 Cơ Hội Bán Hàng & Tiến Độ Pipeline</h3>
            <span class="badge badge-approved">{{ opportunities.length }} Cơ hội</span>
          </div>
          <div class="pipeline-list">
            <div class="pipeline-item glass-card" *ngFor="let op of opportunities">
              <div class="op-header">
                <strong>{{ op.title }}</strong>
                <span class="badge badge-approved">{{ op.stage }}</span>
              </div>
              <p class="op-val">Giá trị dự kiến: <strong>{{ op.estimatedValue | number:'1.0-0' }} VNĐ</strong></p>
              <p class="op-notes">📌 {{ op.surveyNotes }}</p>
              <div class="op-actions">
                <button class="btn btn-primary btn-sm" (click)="convertToQuotation(op.id)">
                  🚀 Chuyển Thành Báo Giá BOQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .crm-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; }
    .crm-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; }
    .section-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; }
    .pipeline-list { display: flex; flex-direction: column; gap: 12px; }
    .pipeline-item { padding: 14px; border-radius: 12px; background: rgba(15,22,36,0.6); display: flex; flex-direction: column; gap: 6px; }
    .op-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; color: #fff; }
    .op-val { font-size: 0.85rem; color: #60a5fa; }
    .op-notes { font-size: 0.78rem; color: #9ca3af; }
    .op-actions { display: flex; justify-content: flex-end; margin-top: 6px; }
    .btn-sm { padding: 6px 12px; font-size: 0.78rem; }
  `]
})
export class CrmComponent implements OnInit {
  private api = inject(ApiService);
  customers: Customer[] = [];
  opportunities: Opportunity[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getCustomers().subscribe(c => this.customers = c);
    this.api.getOpportunities().subscribe(o => this.opportunities = o);
  }

  convertToQuotation(id: string) {
    this.api.convertOpportunityToQuotation(id).subscribe(res => {
      alert(`🎉 ${res.message}`);
      this.loadData();
    });
  }
}
