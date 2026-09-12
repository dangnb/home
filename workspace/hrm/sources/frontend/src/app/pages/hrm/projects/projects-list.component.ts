import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ProjectService } from '../../../core/hrm/services/project.service';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = 'all' | 'sales' | 'tech';
type ModalType = 'create' | 'edit' | 'detail' | 'signContract' | 'assignTech' | 'createTask' | 'createMilestone' | null;

interface Project {
  id: number; code: string; name: string; customerName: string; customerContactName?: string;
  customerPhone?: string; projectType: string; priority: string;
  salesStatus: string; techStatus: string;
  salesUserId: number; salesUserName?: string; salesDepartmentName?: string;
  techLeadUserId?: number; techLeadUserName?: string; techDepartmentName?: string;
  quotedValue?: number; contractValue?: number; contractSignedDate?: string;
  plannedStartDate?: string; plannedEndDate?: string; actualStartDate?: string; actualEndDate?: string;
  overallProgressPercent: number; warrantyMonths: number;
  totalTasks: number; completedTasks: number; blockedTasks: number;
  totalMilestones: number; completedMilestones: number;
  isOverdue: boolean; daysUntilDeadline?: number;
  createdAt: string;
}

interface Stats {
  totalProjects: number; activeTechProjects: number; overdueProjects: number;
  pendingAssignmentProjects: number; totalContractValue: number;
  totalQuotedValue: number; wonProjects: number; lostProjects: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  // ── State ──────────────────────────────────────────────────────────────────
  isLoading = false;
  isSaving = false;
  projects: Project[] = [];
  stats: Stats = { totalProjects: 0, activeTechProjects: 0, overdueProjects: 0, pendingAssignmentProjects: 0, totalContractValue: 0, totalQuotedValue: 0, wonProjects: 0, lostProjects: 0 };
  selectedProject: any = null;

  // ── Filter ─────────────────────────────────────────────────────────────────
  filters = {
    keyword: '', salesStatus: 'ALL', techStatus: 'ALL',
    priority: 'ALL', projectType: 'ALL', isOverdue: undefined as boolean | undefined,
    page: 1, pageSize: 20
  };
  totalCount = 0;
  totalPages = 1;

  // ── Tabs ───────────────────────────────────────────────────────────────────
  activeTab: ActiveTab = 'all';

  // ── Modal ──────────────────────────────────────────────────────────────────
  activeModal: ModalType = null;
  createForm = this.defaultCreateForm();
  signContractForm = this.defaultSignContractForm();
  assignTechForm: any = {};
  createTaskForm = this.defaultTaskForm();
  createMilestoneForm = this.defaultMilestoneForm();
  errorMessage = '';

  // ── Status labels ──────────────────────────────────────────────────────────
  readonly salesStatusMap: Record<string, { label: string; class: string; icon: string }> = {
    LEAD:            { label: 'Lead',         class: 'badge-lead',       icon: 'bi-lightbulb' },
    PROPOSAL_SENT:   { label: 'Báo Giá',      class: 'badge-proposal',   icon: 'bi-file-earmark-text' },
    NEGOTIATION:     { label: 'Đàm Phán',     class: 'badge-negotiation',icon: 'bi-chat-dots' },
    CONTRACT_SIGNED: { label: 'Đã Ký HĐ',    class: 'badge-contract',   icon: 'bi-pen' },
    CLOSED_WON:      { label: 'Thắng Thầu',  class: 'badge-won',        icon: 'bi-trophy' },
    CLOSED_LOST:     { label: 'Thua Thầu',   class: 'badge-lost',       icon: 'bi-x-circle' },
  };
  readonly techStatusMap: Record<string, { label: string; class: string; icon: string }> = {
    NOT_APPLICABLE:    { label: '-',            class: 'badge-na',        icon: 'bi-dash-circle' },
    PENDING_ASSIGNMENT:{ label: 'Chờ Phân Công',class: 'badge-pending',   icon: 'bi-clock' },
    PLANNING:          { label: 'Lập KH',       class: 'badge-planning',  icon: 'bi-calendar3' },
    IN_PROGRESS:       { label: 'Triển Khai',   class: 'badge-inprog',    icon: 'bi-play-circle' },
    TESTING_UAT:       { label: 'Kiểm Thử',     class: 'badge-testing',   icon: 'bi-bug' },
    HANDOVER_PENDING:  { label: 'Chờ Bàn Giao', class: 'badge-handover',  icon: 'bi-arrow-right-circle' },
    COMPLETED:         { label: 'Hoàn Thành',   class: 'badge-done',      icon: 'bi-check-circle' },
    WARRANTY:          { label: 'Bảo Hành',     class: 'badge-warranty',  icon: 'bi-shield-check' },
  };
  readonly priorityMap: Record<string, { label: string; class: string }> = {
    LOW: { label: 'Thấp', class: 'priority-low' }, MEDIUM: { label: 'TB', class: 'priority-medium' },
    HIGH: { label: 'Cao', class: 'priority-high' }, CRITICAL: { label: '🔥 KẨN', class: 'priority-critical' }
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => { this.filters.page = 1; this.loadProjects(); });
  }

  // ── Data ───────────────────────────────────────────────────────────────────
  loadProjects(): void {
    this.isLoading = true;
    const params = { ...this.filters };
    if (params.salesStatus === 'ALL') delete (params as any).salesStatus;
    if (params.techStatus === 'ALL') delete (params as any).techStatus;
    if (params.priority === 'ALL') delete (params as any).priority;
    if (params.projectType === 'ALL') delete (params as any).projectType;

    this.projectService.getProjects(params)
      .pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.projects = res.data || [];
          this.stats = res.stats || this.stats;
          this.totalCount = res.pagination?.totalCount || 0;
          this.totalPages = res.pagination?.totalPages || 1;
        },
        error: (err) => console.error('Lỗi tải dự án:', err)
      });
  }

  onSearch(value: string): void { this.searchSubject$.next(value); }
  onFilterChange(): void { this.filters.page = 1; this.loadProjects(); }

  setTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.filters.salesStatus = 'ALL';
    this.filters.techStatus = 'ALL';
    if (tab === 'sales') { this.filters.salesStatus = 'ALL'; }
    else if (tab === 'tech') { this.filters.techStatus = 'ALL'; }
    this.filters.page = 1;
    this.loadProjects();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.filters.page = page;
    this.loadProjects();
  }

  get pagesArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.filters.page - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // ── Modal: Create ──────────────────────────────────────────────────────────
  openCreateModal(): void { this.createForm = this.defaultCreateForm(); this.errorMessage = ''; this.activeModal = 'create'; }
  closeModal(): void { this.activeModal = null; this.errorMessage = ''; }

  saveCreate(): void {
    if (!this.createForm.name.trim() || !this.createForm.customerName.trim()) {
      this.errorMessage = 'Vui lòng điền tên dự án và tên khách hàng.'; return;
    }
    this.isSaving = true;
    this.projectService.createProject(this.createForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.filters.page = 1; this.loadProjects(); },
        error: (e) => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'; }
      });
  }

  // ── Modal: Detail / Sign Contract / Assign Tech ───────────────────────────
  openDetail(project: Project): void {
    this.isLoading = true;
    this.projectService.getProject(project.id)
      .pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({ next: (data) => { this.selectedProject = data; this.activeModal = 'detail'; }, error: () => {} });
  }

  openSignContract(project: Project): void {
    this.selectedProject = project;
    this.signContractForm = this.defaultSignContractForm();
    this.errorMessage = '';
    this.activeModal = 'signContract';
  }

  saveSignContract(): void {
    if (!this.signContractForm.contractValue || this.signContractForm.contractValue <= 0) {
      this.errorMessage = 'Vui lòng nhập giá trị hợp đồng hợp lệ.'; return;
    }
    this.isSaving = true;
    this.projectService.signContract(this.selectedProject.id, this.signContractForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.closeModal(); this.loadProjects(); }, error: (e) => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra.'; } });
  }

  openAssignTech(project: Project): void {
    this.selectedProject = project;
    this.assignTechForm = { techLeadUserId: null, techDepartmentId: null };
    this.errorMessage = '';
    this.activeModal = 'assignTech';
  }

  saveAssignTech(): void {
    if (!this.assignTechForm.techLeadUserId) { this.errorMessage = 'Vui lòng nhập ID PM kỹ thuật.'; return; }
    this.isSaving = true;
    this.projectService.assignTechTeam(this.selectedProject.id, this.assignTechForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.closeModal(); this.loadProjects(); }, error: (e) => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra.'; } });
  }

  openCreateTask(project: Project): void {
    this.selectedProject = project;
    this.createTaskForm = this.defaultTaskForm();
    this.errorMessage = '';
    this.activeModal = 'createTask';
  }

  saveCreateTask(): void {
    if (!this.createTaskForm.title.trim()) { this.errorMessage = 'Vui lòng nhập tiêu đề task.'; return; }
    this.isSaving = true;
    this.projectService.createTask(this.selectedProject.id, this.createTaskForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.closeModal(); this.loadProjects(); }, error: (e) => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra.'; } });
  }

  advanceSalesStatus(project: Project, newStatus: string): void {
    if (!confirm(`Xác nhận chuyển trạng thái sang "${this.salesStatusMap[newStatus]?.label}"?`)) return;
    this.projectService.advanceSalesStatus(project.id, { newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.loadProjects(), error: () => {} });
  }

  closeLost(project: Project): void {
    const reason = prompt('Nhập lý do thua thầu / hủy dự án:');
    if (!reason?.trim()) return;
    this.projectService.closeLost(project.id, { reason })
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.loadProjects(), error: () => {} });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  formatCurrency(value?: number): string {
    if (!value) return '—';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
  }

  getProgressClass(percent: number): string {
    if (percent >= 80) return 'bg-success';
    if (percent >= 50) return 'bg-info';
    if (percent >= 20) return 'bg-warning';
    return 'bg-danger';
  }

  getSalesStatus(status: string) { return this.salesStatusMap[status] || { label: status, class: 'badge-secondary', icon: 'bi-question-circle' }; }
  getTechStatus(status: string) { return this.techStatusMap[status] || { label: status, class: 'badge-secondary', icon: 'bi-question-circle' }; }
  getPriority(priority: string) { return this.priorityMap[priority] || { label: priority, class: '' }; }

  canSignContract(project: Project): boolean {
    return project.salesStatus === 'NEGOTIATION' || project.salesStatus === 'PROPOSAL_SENT';
  }

  canAssignTech(project: Project): boolean {
    return project.techStatus === 'PENDING_ASSIGNMENT';
  }

  canCreateTask(project: Project): boolean {
    return ['PLANNING', 'IN_PROGRESS', 'TESTING_UAT'].includes(project.techStatus);
  }

  // ── Form defaults ─────────────────────────────────────────────────────────
  private defaultCreateForm() {
    return { name: '', customerName: '', customerContactName: '', customerPhone: '', customerEmail: '',
      salesUserId: null as number | null, salesDepartmentId: null as number | null,
      projectType: 'FIXED_PRICE', priority: 'MEDIUM', quotedValue: null as number | null,
      plannedStartDate: '', plannedEndDate: '', description: '', internalNote: '' };
  }

  private defaultSignContractForm() {
    const today = new Date().toISOString().split('T')[0];
    return { contractValue: null as number | null, contractSignedDate: today, contractFileRef: '',
      warrantyMonths: 12, plannedStartDate: '', plannedEndDate: '' };
  }

  private defaultTaskForm() {
    return { title: '', description: '', taskType: 'DEVELOPMENT', priority: 'MEDIUM',
      assigneeUserId: null as number | null, estimatedHours: 8, dueDate: '', milestoneId: null, tags: '' };
  }

  private defaultMilestoneForm() {
    return { title: '', description: '', dueDate: '', paymentPercent: 0, paymentAmount: 0, sortOrder: 0 };
  }
}
