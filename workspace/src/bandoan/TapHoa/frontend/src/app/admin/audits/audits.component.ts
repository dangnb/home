import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-audits',
    standalone: true,
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
               <tr *ngFor="let log of logs">
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
               <tr *ngIf="logs.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">Chưa có nhật ký hoạt động nào</td>
               </tr>
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
    private http = inject(HttpClient);
    logs: any[] = [];

    ngOnInit() {
        this.http.get<any[]>('http://localhost:5222/api/v1/audits').subscribe({
            next: (data) => this.logs = data,
            error: (err) => console.error(err)
        });
    }
}
