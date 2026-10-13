import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ProjectService } from '../../../core/hrm/services/project.service';

type ModalType = 'detail' | 'assignMember' | 'updateTechStatus' | 'createTask' | null;

@Component({
  selector: 'app-pm-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pm-department.component.html',
  styleUrls: ['./pm-department.component.scss']
})
export class PmDepartmentComponent implements OnInit, OnDestroy {
  private svc = inject(ProjectService);
  private destroy$ = new Subject<void>();

  isLoading = false;
  isSaving = false;
  projects: any[] = [];
  stats: any = {};
  selectedProject: any = null;
  activeModal: ModalType = null;
  errorMessage = '';

  filterStatus = 'ALL';
  filters = { techStatus: 'ALL', salesStatus: 'CONTRACT_SIGNED', page: 1, pageSize: 50 };

  assignForm = { userIds: '' as string, roles: 'DEV' };
  techStatusForm = { newTechStatus: '' };
  createTaskForm = this.defaultTask();

  // Workload table (demo)
  workload: any[] = [];

  readonly techStatusMap: Record<string, { label: string; color: string; icon: string; next?: string }> = {
    PENDING_ASSIGNMENT: { label: 'Chờ Phân Công', color: '#fb923c', icon: 'bi-clock', next: 'PLANNING' },
    PLANNING:           { label: 'Lập KH',        color: '#60a5fa', icon: 'bi-calendar3', next: 'IN_PROGRESS' },
    IN_PROGRESS:        { label: 'Triển Khai',     color: '#a78bfa', icon: 'bi-play-circle', next: 'TESTING_UAT' },
    TESTING_UAT:        { label: 'Kiểm Thử',       color: '#fbbf24', icon: 'bi-bug', next: 'HANDOVER_PENDING' },
    HANDOVER_PENDING:   { label: 'Chờ Bàn Giao',   color: '#2dd4bf', icon: 'bi-arrow-right-circle', next: 'COMPLETED' },
    COMPLETED:          { label: 'Hoàn Thành',      color: '#4ade80', icon: 'bi-check-circle' },
    WARRANTY:           { label: 'Bảo Hành',        color: '#818cf8', icon: 'bi-shield-check' },
    NOT_APPLICABLE:     { label: '—',               color: '#475569', icon: 'bi-dash-circle' },
  };

  ngOnInit() { this.loadProjects(); }
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadProjects() {
    this.isLoading = true;
    const p = { ...this.filters } as any;
    if (p.salesStatus === 'ALL') delete p.salesStatus;
    if (p.techStatus === 'ALL') delete p.techStatus;
    this.svc.getProjects(p).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({ next: r => { this.projects = r.data || []; this.stats = r.stats; this.buildWorkload(); } });
  }

  buildWorkload() {
    // Demo workload table — in production call /my-team-tasks endpoint
    this.workload = [
      { name: 'Nguyễn Văn A', role: 'Senior Dev', tasks: 5, inProgress: 2, totalHours: 48, utilization: 85 },
      { name: 'Trần Thị B', role: 'UI/UX Designer', tasks: 3, inProgress: 1, totalHours: 24, utilization: 60 },
      { name: 'Lê Minh C', role: 'Backend Dev', tasks: 7, inProgress: 4, totalHours: 64, utilization: 95 },
      { name: 'Phạm Thị D', role: 'QA Tester', tasks: 4, inProgress: 2, totalHours: 32, utilization: 70 },
    ];
  }

  onFilter() { this.filters.page = 1; this.loadProjects(); }

  // ── Modals ──────────────────────────────────────────────────────────────
  openDetail(p: any) {
    this.isLoading = true;
    this.svc.getProject(p.id).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({ next: data => { this.selectedProject = data; this.activeModal = 'detail'; } });
  }

  openAssignMember(p: any) {
    this.selectedProject = p;
    this.assignForm = { userIds: '', roles: 'DEV' };
    this.errorMessage = '';
    this.activeModal = 'assignMember';
  }

  openUpdateTechStatus(p: any) {
    this.selectedProject = p;
    this.techStatusForm.newTechStatus = this.techStatusMap[p.techStatus]?.next || '';
    this.errorMessage = '';
    this.activeModal = 'updateTechStatus';
  }

  openCreateTask(p: any) {
    this.selectedProject = p;
    this.createTaskForm = this.defaultTask();
    this.errorMessage = '';
    this.activeModal = 'createTask';
  }

  close() { this.activeModal = null; this.errorMessage = ''; }

  saveAssignMember() {
    if (!this.assignForm.userIds?.trim()) { this.errorMessage = 'Vui lòng nhập ít nhất 1 ID nhân viên.'; return; }
    const ids = this.assignForm.userIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (ids.length === 0) { this.errorMessage = 'ID nhân viên không hợp lệ.'; return; }
    this.isSaving = true;
    // First member = tech lead if none exists, rest = DEV
    const techLeadId = ids[0];
    const memberIds = ids.slice(1);
    this.svc.assignTechTeam(this.selectedProject.id, { techLeadUserId: techLeadId, memberUserIds: memberIds })
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); this.loadProjects(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra.'; } });
  }

  saveTechStatus() {
    if (!this.techStatusForm.newTechStatus) { this.errorMessage = 'Chọn trạng thái tiếp theo.'; return; }
    this.isSaving = true;
    this.svc.updateTechStatus(this.selectedProject.id, this.techStatusForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); this.loadProjects(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi.'; } });
  }

  saveCreateTask() {
    if (!this.createTaskForm.title?.trim()) { this.errorMessage = 'Vui lòng nhập tiêu đề task.'; return; }
    this.isSaving = true;
    this.svc.createTask(this.selectedProject.id, this.createTaskForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi.'; } });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  getTech(s: string) { return this.techStatusMap[s] || { label: s, color: '#64748b', icon: 'bi-question' }; }
  getNextStatus(s: string) { return this.techStatusMap[s]?.next; }
  fmt(v?: number) { if (!v) return '—'; return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v); }
  getUtilizationClass(u: number) { if (u >= 90) return 'util-red'; if (u >= 70) return 'util-orange'; return 'util-green'; }

  private defaultTask() {
    return { title: '', description: '', taskType: 'DEVELOPMENT', priority: 'MEDIUM', assigneeUserId: null as number | null, estimatedHours: 8, dueDate: '', tags: '' };
  }
}
