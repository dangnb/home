import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit.service';

@Component({
    selector: 'app-audits',
    imports: [CommonModule],
    template: `
    <div class="page-header">
      <h2>Nhật ký hoạt động (Audit Logs)</h2>
    </div>
    <div class="card p-3">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Thời gian</th>
              <th>Người dùng</th>
              <th>Hành động</th>
              <th>Request</th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs; track log) {
              <tr>
                <td>{{ log.timestamp | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                <td><span class="badge bg-secondary">{{ log.username }}</span></td>
                <td>
                  <span class="badge"
                    [ngClass]="{'bg-success': log.action === 'Create', 'bg-warning text-dark': log.action === 'Update', 'bg-danger': log.action === 'Delete', 'bg-info': log.action === 'Unknown'}">
                    {{ log.action }}
                  </span>
                </td>
                <td><code>{{ log.requestName }}</code></td>
              </tr>
            }
            @if (logs.length === 0) {
              <tr>
                <td colspan="4" class="text-center text-muted py-4">Chưa có nhật ký hoạt động nào</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    `,
    styles: [`
    .page-header { margin-bottom: 20px; }
  `]
})
export class AuditsComponent implements OnInit {
   private auditService = inject(AuditService);
   logs: any[] = [];

   ngOnInit() {
      this.auditService.getAudits().subscribe({
         next: (data: any[]) => this.logs = data,
         error: (err: any) => console.error(err)
      });
   }
}
