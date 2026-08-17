import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { DocumentRecord } from '../../../core/models/models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documents-page">
      <div class="header-banner glass-card">
        <div>
          <h2>📂 Quản Lý Tài Liệu Tập Trung (DMS)</h2>
          <p class="subtitle">Bản vẽ thiết kế • Biên bản nghiệm thu • Hợp đồng • Phân quyền & Quản lý phiên bản</p>
        </div>
      </div>

      <div class="docs-grid">
        <div class="glass-card section-card">
          <h3>📁 Kho Hồ Sơ & Tài Liệu Dự Án</h3>
          <div class="table-container">
            <table class="consbase-table">
              <thead>
                <tr>
                  <th>Tên Tài Liệu</th>
                  <th>Phân Loại</th>
                  <th>Phiên Bản</th>
                  <th>Kích Thước</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let doc of documents">
                  <td>📄 <strong>{{ doc.documentName }}</strong></td>
                  <td><span class="badge badge-active">{{ doc.category }}</span></td>
                  <td>v{{ doc.version }}</td>
                  <td>{{ (doc.fileSizeBytes / 1024 / 1024) | number:'1.2-2' }} MB</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" (click)="preview(doc)">👁️ Xem trước (PDF/Word/Excel)</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; }
    .section-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .btn-sm { padding: 4px 8px; font-size: 0.75rem; }
  `]
})
export class DocumentsComponent implements OnInit {
  private api = inject(ApiService);
  documents: DocumentRecord[] = [];

  ngOnInit() {
    this.api.getDocuments().subscribe(d => this.documents = d);
  }

  preview(doc: DocumentRecord) {
    alert(`👁️ Đang mở trình xem trước trực tuyến cho tài liệu: ${doc.documentName} (Phiên bản v${doc.version})`);
  }
}
