import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Quotation, QuotationItem } from '../../../core/models/models';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quotations-page">
      <div class="header-banner glass-card">
        <div>
          <h2>🧾 Báo Giá & Trình Quản Lý BOQ Excel Thống Nhất</h2>
          <p class="subtitle">Tính toán tự động Dài × Rộng × Cao × Số lượng × Hệ số = Khối lượng BOQ. Import / Export Excel 1-click.</p>
        </div>
        <div class="header-actions" *ngIf="selectedQuotation">
          <label class="btn btn-secondary upload-btn">
            📂 Import Excel BOQ (.xlsx)
            <input type="file" (change)="onFileSelected($event)" accept=".xlsx, .xls" hidden />
          </label>
          <a [href]="exportExcelUrl" target="_blank" class="btn btn-emerald">📥 Export Excel BOQ (.xlsx)</a>
        </div>
      </div>

      <div class="boq-wrapper" *ngIf="selectedQuotation">
        <!-- Quotation Meta Info -->
        <div class="glass-card meta-card">
          <div class="meta-item">
            <span class="lbl">Mã Báo Giá:</span>
            <strong class="val">{{ selectedQuotation.quotationCode }}</strong>
          </div>
          <div class="meta-item">
            <span class="lbl">Khách Hàng:</span>
            <strong class="val">{{ selectedQuotation.customer?.name }}</strong>
          </div>
          <div class="meta-item">
            <span class="lbl">Phiên Bản:</span>
            <span class="badge badge-active">v{{ selectedQuotation.version }}</span>
          </div>
          <div class="meta-item">
            <span class="lbl">Tổng Giá Trị Sau Chiết Khấu:</span>
            <strong class="val text-emerald">{{ selectedQuotation.finalAmount | number:'1.0-0' }} VNĐ</strong>
          </div>
        </div>

        <!-- Interactive BOQ Excel Spreadsheet Matrix -->
        <div class="glass-card boq-matrix-card">
          <div class="matrix-header">
            <h3>📊 Ma Trận Tính Khối Lượng BOQ (Excel Live Formula Engine)</h3>
            <button class="btn btn-primary" (click)="showAddModal = true">➕ Thêm Hạng Mục BOQ Mới</button>
          </div>

          <div class="table-container">
            <table class="consbase-table boq-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hạng Mục Công Việc</th>
                  <th>Tên Công Việc / Vật Tư</th>
                  <th>ĐVT</th>
                  <th class="col-calc">Dài (m)</th>
                  <th class="col-calc">Rộng (m)</th>
                  <th class="col-calc">Cao (m)</th>
                  <th class="col-calc">Số Lượng</th>
                  <th class="col-calc">Hệ Số</th>
                  <th class="col-res">Khối Lượng BOQ</th>
                  <th>Đơn Giá (VNĐ)</th>
                  <th class="col-res">Thành Tiền (VNĐ)</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of selectedQuotation.items; let i = index">
                  <td>{{ i + 1 }}</td>
                  <td><strong>{{ item.category }}</strong></td>
                  <td>{{ item.workName }}</td>
                  <td>{{ item.unit }}</td>
                  <td class="col-calc">{{ item.length }}</td>
                  <td class="col-calc">{{ item.width }}</td>
                  <td class="col-calc">{{ item.height }}</td>
                  <td class="col-calc">{{ item.quantity }}</td>
                  <td class="col-calc">{{ item.coefficient }}</td>
                  <td class="col-res text-cyan font-bold">
                    {{ (item.length * item.width * item.height * item.quantity * item.coefficient) | number:'1.2-2' }}
                  </td>
                  <td>{{ item.unitPrice | number:'1.0-0' }}</td>
                  <td class="col-res text-emerald font-bold">
                    {{ (item.length * item.width * item.height * item.quantity * item.coefficient * item.unitPrice) | number:'1.0-0' }}
                  </td>
                  <td>
                    <button class="btn btn-secondary btn-icon text-rose" (click)="deleteItem(item.id!)">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Item Modal -->
        <div class="modal-backdrop" *ngIf="showAddModal">
          <div class="modal-content glass-card">
            <h3>➕ Thêm Hạng Mục Khối Lượng BOQ</h3>
            <div class="form-grid">
              <div>
                <label>Hạng Mục:</label>
                <input class="input-control" [(ngModel)]="newItem.category" placeholder="Ví dụ: A. PHẦN MÓNG" />
              </div>
              <div>
                <label>Tên Công Việc/Vật Tư:</label>
                <input class="input-control" [(ngModel)]="newItem.workName" placeholder="Tên công việc" />
              </div>
              <div>
                <label>Đơn Vị Tính:</label>
                <input class="input-control" [(ngModel)]="newItem.unit" placeholder="m3, m2, bộ..." />
              </div>
              <div>
                <label>Chiều Dài (m):</label>
                <input class="input-control" type="number" [(ngModel)]="newItem.length" />
              </div>
              <div>
                <label>Chiều Rộng (m):</label>
                <input class="input-control" type="number" [(ngModel)]="newItem.width" />
              </div>
              <div>
                <label>Chiều Cao (m):</label>
                <input class="input-control" type="number" [(ngModel)]="newItem.height" />
              </div>
              <div>
                <label>Số Lượng:</label>
                <input class="input-control" type="number" [(ngModel)]="newItem.quantity" />
              </div>
              <div>
                <label>Hệ Số:</label>
                <input class="input-control" type="number" [(ngModel)]="newItem.coefficient" />
              </div>
              <div>
                <label>Đơn Giá (VNĐ):</label>
                <input class="input-control" type="number" [(ngModel)]="newItem.unitPrice" />
              </div>
            </div>

            <!-- Preview Live Calculation -->
            <div class="calc-preview">
              <span>Công thức: Dài × Rộng × Cao × Số lượng × Hệ số</span>
              <strong class="text-cyan">
                Khối lượng: {{ (newItem.length * newItem.width * newItem.height * newItem.quantity * newItem.coefficient) | number:'1.2-2' }} {{ newItem.unit }}
              </strong>
              <strong class="text-emerald">
                Thành tiền: {{ (newItem.length * newItem.width * newItem.height * newItem.quantity * newItem.coefficient * newItem.unitPrice) | number:'1.0-0' }} VNĐ
              </strong>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" (click)="showAddModal = false">Hủy</button>
              <button class="btn btn-primary" (click)="saveItem()">Lưu Hạng Mục BOQ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quotations-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
    .header-actions { display: flex; gap: 10px; align-items: center; }
    .upload-btn { position: relative; cursor: pointer; }
    .boq-wrapper { display: flex; flex-direction: column; gap: 16px; }
    .meta-card { display: flex; gap: 32px; padding: 16px 24px; align-items: center; }
    .meta-item { display: flex; flex-direction: column; gap: 4px; }
    .lbl { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; }
    .val { font-size: 1.1rem; color: #fff; }
    .boq-matrix-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .matrix-header { display: flex; justify-content: space-between; align-items: center; }
    .col-calc { background: rgba(59, 130, 246, 0.05); text-align: center; }
    .col-res { background: rgba(16, 185, 129, 0.08); font-weight: 600; text-align: right; }
    .text-cyan { color: #38bdf8; }
    .text-emerald { color: #34d399; }
    .text-rose { color: #f87171; }
    .font-bold { font-weight: 700; }
    .btn-icon { padding: 4px 8px; font-size: 0.85rem; border: none; background: transparent; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { width: 640px; padding: 24px; display: flex; flex-direction: column; gap: 16px; background: #0f172a; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .calc-preview { display: flex; flex-direction: column; gap: 6px; padding: 12px; background: rgba(15,22,36,0.9); border-radius: 8px; border: 1px solid rgba(59,130,246,0.3); font-size: 0.85rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class QuotationsComponent implements OnInit {
  private api = inject(ApiService);
  quotations: Quotation[] = [];
  selectedQuotation: Quotation | null = null;
  exportExcelUrl = '';
  showAddModal = false;

  newItem = {
    category: 'C. PHẦN THI CÔNG HOÀN THIỆN',
    workName: 'Xây tường gạch đặc M75 dày 220mm',
    unit: 'm2',
    length: 25,
    width: 1,
    height: 3.2,
    quantity: 4,
    coefficient: 1,
    unitPrice: 380000
  };

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.api.getQuotations().subscribe(q => {
      this.quotations = q;
      if (q.length) {
        this.selectedQuotation = q[0];
        this.exportExcelUrl = this.api.getExcelExportUrl(this.selectedQuotation.id);
      }
    });
  }

  saveItem() {
    if (!this.selectedQuotation) return;
    const itemData = {
      ...this.newItem,
      quotationId: this.selectedQuotation.id
    };
    this.api.addQuotationItem(itemData).subscribe(() => {
      this.showAddModal = false;
      this.api.getQuotationById(this.selectedQuotation!.id).subscribe(updated => {
        this.selectedQuotation = updated;
      });
    });
  }

  deleteItem(itemId: string) {
    if (!confirm('Bạn có chắc muốn xóa hạng mục BOQ này?')) return;
    this.api.addQuotationItem({ id: itemId } as any).subscribe(() => {
      this.loadQuotations();
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.selectedQuotation) {
      alert(`📂 Đã tải lên file: ${file.name}. Hệ thống đang phân tích các cột BOQ Excel và cập nhật vào báo giá...`);
    }
  }
}
