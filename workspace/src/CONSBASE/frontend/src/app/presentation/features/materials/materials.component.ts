import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="materials-page">
      <div class="header-banner glass-card">
        <div>
          <h2>🛒 Mua Hàng & Quản Lý Vật Tư, Kho Hàng</h2>
          <p class="subtitle">Đề xuất vật tư từ công trường • Đơn mua hàng PO • Quản lý kho & Nhập xuất tồn</p>
        </div>
      </div>

      <div class="materials-grid">
        <!-- Requisitions -->
        <div class="glass-card section-card">
          <h3>📦 Đề Xuất Vật Tư Từ Công Trường</h3>
          <div class="req-list">
            <div class="req-item glass-card" *ngFor="let r of requisitions">
              <div class="req-top">
                <strong>{{ r.requisitionCode }}</strong>
                <span class="badge badge-pending">{{ r.status }}</span>
              </div>
              <p>Dự án: <strong>ConsBase Tower</strong></p>
              <ul class="item-sub-list">
                <li *ngFor="let item of r.items">
                  {{ item.materialName }} (Quy cách: {{ item.specification }}) - SL Yêu cầu: <strong>{{ item.requestedQuantity }} {{ item.unit }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Warehouses -->
        <div class="glass-card section-card">
          <h3>🏢 Danh Sách Kho & Tồn Kho Thực Tế</h3>
          <div class="wh-list">
            <div class="wh-item glass-card" *ngFor="let wh of warehouses">
              <div class="wh-name">{{ wh.name }} ({{ wh.code }})</div>
              <div class="wh-loc">📍 Vị trí: {{ wh.location }}</div>
              <span class="badge badge-active">Kho trung tâm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .materials-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; }
    .materials-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; }
    .section-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .req-list { display: flex; flex-direction: column; gap: 12px; }
    .req-item { padding: 14px; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; }
    .req-top { display: flex; justify-content: space-between; align-items: center; color: #fff; }
    .item-sub-list { margin-left: 20px; color: #9ca3af; font-size: 0.82rem; }
    .wh-list { display: flex; flex-direction: column; gap: 12px; }
    .wh-item { padding: 14px; display: flex; flex-direction: column; gap: 4px; }
    .wh-name { font-weight: 700; color: #fff; }
    .wh-loc { font-size: 0.8rem; color: #9ca3af; }
  `]
})
export class MaterialsComponent implements OnInit {
  private api = inject(ApiService);
  requisitions: any[] = [];
  warehouses: any[] = [];

  ngOnInit() {
    this.api.getMaterialRequisitions().subscribe(r => this.requisitions = r);
    this.api.getWarehouses().subscribe(w => this.warehouses = w);
  }
}
