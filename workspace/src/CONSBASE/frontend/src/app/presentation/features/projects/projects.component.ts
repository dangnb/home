import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Project, ProjectTask } from '../../../core/models/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="projects-page">
      <div class="header-banner glass-card">
        <div>
          <h2>🏢 Quản Lý Dự Án & Tiến Độ Gantt / Kanban</h2>
          <p class="subtitle">Theo dõi trạng thái, tiến độ baseline, mốc hoàn thành và phân công công việc</p>
        </div>
        <div class="view-tabs">
          <button class="btn" [class.btn-primary]="activeView === 'gantt'" [class.btn-secondary]="activeView !== 'gantt'" (click)="activeView = 'gantt'">
            📊 Biểu Đồ Gantt
          </button>
          <button class="btn" [class.btn-primary]="activeView === 'kanban'" [class.btn-secondary]="activeView !== 'kanban'" (click)="activeView = 'kanban'">
            📋 Kanban Board
          </button>
          <button class="btn" [class.btn-primary]="activeView === 'list'" [class.btn-secondary]="activeView !== 'list'" (click)="activeView = 'list'">
            📝 Danh Sách Đầu Việc
          </button>
        </div>
      </div>

      <div class="project-content" *ngIf="selectedProject">
        <!-- Project Summary Card -->
        <div class="glass-card pj-summary-card">
          <div class="summary-left">
            <span class="pj-code">{{ selectedProject.projectCode }}</span>
            <h3>{{ selectedProject.name }}</h3>
            <p class="pj-sub">Chủ đầu tư: <strong>{{ selectedProject.customer?.name }}</strong> | Ngân sách: {{ selectedProject.budget | number:'1.0-0' }} VNĐ</p>
          </div>
          <div class="summary-right">
            <div class="pct-circle">
              <span class="pct-val">{{ selectedProject.progressPercentage }}%</span>
              <span class="pct-lbl">Hoàn thành</span>
            </div>
          </div>
        </div>

        <!-- 1. GANTT CHART VIEW -->
        <div class="glass-card view-container" *ngIf="activeView === 'gantt'">
          <h3>📊 Biểu Đồ Gantt Tiến Độ Dự Án (Planned vs Actual Timeline)</h3>
          <div class="gantt-chart">
            <div class="gantt-header-row">
              <div class="gantt-task-col">Tên Đầu Việc Thi Công</div>
              <div class="gantt-timeline-header">
                <span>Tuần 1</span><span>Tuần 2</span><span>Tuần 3</span><span>Tuần 4</span><span>Tuần 5</span><span>Tuần 6</span>
              </div>
            </div>
            <div class="gantt-body-row" *ngFor="let t of selectedProject.tasks; let i = index">
              <div class="gantt-task-col">
                <strong>{{ t.taskCode }}: {{ t.title }}</strong>
                <span class="task-unit">KL: {{ t.actualVolume }}/{{ t.plannedVolume }} {{ t.unit }}</span>
              </div>
              <div class="gantt-timeline-track">
                <div class="gantt-bar" 
                     [style.left.%]="i * 25" 
                     [style.width.%]="40"
                     [class.bar-completed]="isTaskStatus(t.status, 'Completed')"
                     [class.bar-inprogress]="isTaskStatus(t.status, 'InProgress')"
                     [class.bar-todo]="isTaskStatus(t.status, 'Todo')">
                  <span class="bar-label">{{ t.progressPercentage }}% - {{ t.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. KANBAN BOARD VIEW -->
        <div class="glass-card view-container" *ngIf="activeView === 'kanban'">
          <h3>📋 Bảng Kanban Tiến Độ Đầu Việc</h3>
          <div class="kanban-grid">
            <!-- Todo Column -->
            <div class="kanban-col">
              <div class="col-head todo-head">📌 Cần Làm (Todo)</div>
              <div class="kanban-card glass-card" *ngFor="let t of getTasksByStatus('Todo')">
                <div class="k-title">{{ t.title }}</div>
                <div class="k-meta">KL Kế hoạch: {{ t.plannedVolume }} {{ t.unit }}</div>
                <button class="btn btn-secondary btn-sm" (click)="changeStatus(t.id, 'InProgress')">➡️ Bắt đầu thi công</button>
              </div>
            </div>

            <!-- In Progress Column -->
            <div class="kanban-col">
              <div class="col-head progress-head">🚧 Đang Thi Công (InProgress)</div>
              <div class="kanban-card glass-card" *ngFor="let t of getTasksByStatus('InProgress')">
                <div class="k-title">{{ t.title }}</div>
                <div class="k-meta">Tiến độ: {{ t.progressPercentage }}% ({{ t.actualVolume }}/{{ t.plannedVolume }} {{ t.unit }})</div>
                <button class="btn btn-emerald btn-sm" (click)="changeStatus(t.id, 'Completed')">✅ Nghiệm thu xong</button>
              </div>
            </div>

            <!-- Completed Column -->
            <div class="kanban-col">
              <div class="col-head done-head">✅ Đã Hoàn Thành (Completed)</div>
              <div class="kanban-card glass-card" *ngFor="let t of getTasksByStatus('Completed')">
                <div class="k-title">{{ t.title }}</div>
                <div class="k-meta text-emerald">Đã nghiệm thu 100%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. LIST VIEW -->
        <div class="glass-card view-container" *ngIf="activeView === 'list'">
          <h3>📝 Danh Sách Chi Tiết Đầu Việc</h3>
          <div class="table-container">
            <table class="consbase-table">
              <thead>
                <tr>
                  <th>Mã CV</th>
                  <th>Tên Đầu Việc</th>
                  <th>Khối Lượng KH</th>
                  <th>Khối Lượng TT</th>
                  <th>ĐVT</th>
                  <th>Tiến Độ (%)</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of selectedProject.tasks">
                  <td><strong>{{ t.taskCode }}</strong></td>
                  <td>{{ t.title }}</td>
                  <td>{{ t.plannedVolume }}</td>
                  <td>{{ t.actualVolume }}</td>
                  <td>{{ t.unit }}</td>
                  <td class="text-emerald font-bold">{{ t.progressPercentage }}%</td>
                  <td>
                    <span class="badge badge-approved">
                      {{ t.status }}
                    </span>
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
    .projects-page { display: flex; flex-direction: column; gap: 16px; }
    .header-banner { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
    .view-tabs { display: flex; gap: 8px; }
    .project-content { display: flex; flex-direction: column; gap: 16px; }
    .pj-summary-card { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
    .pj-code { font-size: 0.75rem; color: #3b82f6; font-weight: 700; }
    .pj-sub { font-size: 0.85rem; color: #9ca3af; margin-top: 4px; }
    .pct-circle { width: 72px; height: 72px; border-radius: 50%; border: 4px solid #10b981; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(16,185,129,0.1); }
    .pct-val { font-weight: 800; font-size: 1.1rem; color: #34d399; }
    .pct-lbl { font-size: 0.65rem; color: #9ca3af; }
    .view-container { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .gantt-chart { display: flex; flex-direction: column; gap: 10px; background: rgba(15,22,36,0.6); padding: 16px; border-radius: 12px; }
    .gantt-header-row { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; font-weight: 700; color: #9ca3af; font-size: 0.8rem; }
    .gantt-task-col { width: 320px; }
    .gantt-timeline-header { flex: 1; display: flex; justify-content: space-between; padding: 0 10px; }
    .gantt-body-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .gantt-timeline-track { flex: 1; position: relative; height: 32px; background: rgba(255,255,255,0.03); border-radius: 6px; }
    .gantt-bar { position: absolute; top: 3px; height: 26px; border-radius: 6px; display: flex; align-items: center; padding: 0 10px; font-size: 0.75rem; color: white; font-weight: 600; }
    .bar-completed { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
    .bar-inprogress { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }
    .bar-todo { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
    .task-unit { display: block; font-size: 0.75rem; color: #9ca3af; }
    .kanban-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .kanban-col { display: flex; flex-direction: column; gap: 12px; background: rgba(15,22,36,0.6); padding: 14px; border-radius: 12px; min-height: 300px; }
    .col-head { font-weight: 700; font-size: 0.9rem; padding-bottom: 8px; border-bottom: 2px solid; }
    .todo-head { border-color: #f59e0b; color: #fbbf24; }
    .progress-head { border-color: #3b82f6; color: #60a5fa; }
    .done-head { border-color: #10b981; color: #34d399; }
    .kanban-card { padding: 12px; display: flex; flex-direction: column; gap: 8px; background: rgba(30,41,59,0.8); }
    .k-title { font-weight: 600; color: #fff; font-size: 0.9rem; }
    .k-meta { font-size: 0.78rem; color: #9ca3af; }
    .btn-sm { padding: 4px 8px; font-size: 0.75rem; }
  `]
})
export class ProjectsComponent implements OnInit {
  private api = inject(ApiService);
  projects: Project[] = [];
  selectedProject: Project | null = null;
  activeView: 'gantt' | 'kanban' | 'list' = 'gantt';

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.api.getProjects().subscribe(p => {
      this.projects = p;
      if (p.length) this.selectedProject = p[0];
    });
  }

  isTaskStatus(status: any, target: string): boolean {
    if (target === 'Todo') return status === 'Todo' || status === 0 || status === '0';
    if (target === 'InProgress') return status === 'InProgress' || status === 1 || status === '1';
    if (target === 'Completed') return status === 'Completed' || status === 3 || status === '3' || status === 2 || status === '2';
    return false;
  }

  getTasksByStatus(status: string): ProjectTask[] {
    return this.selectedProject?.tasks.filter(t => this.isTaskStatus(t.status, status)) || [];
  }

  changeStatus(taskId: string, newStatus: string) {
    this.api.updateTaskStatus(taskId, newStatus).subscribe(() => {
      this.loadProjects();
    });
  }
}
