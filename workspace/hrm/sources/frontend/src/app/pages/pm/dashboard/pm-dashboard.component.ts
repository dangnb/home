import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ProjectService } from '../../../core/hrm/services/project.service';

type ModalType = 'create' | 'signContract' | 'salesStatus' | 'closeLost' | 'documents' | null;

const SALES_STAGES = [
  { key: 'LEAD',            label: 'Lead',        icon: 'bi-lightbulb',         color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  { key: 'PROPOSAL_SENT',   label: 'Báo Giá',     icon: 'bi-file-earmark-text', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)' },
  { key: 'NEGOTIATION',     label: 'Đàm Phán',    icon: 'bi-chat-dots',         color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
  { key: 'CONTRACT_SIGNED', label: 'Đã Ký HĐ',   icon: 'bi-pen',               color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
  { key: 'CLOSED_WON',      label: 'Thắng Thầu',  icon: 'bi-trophy',            color: '#4ade80', bg: 'rgba(34,197,94,0.12)' },
  { key: 'CLOSED_LOST',     label: 'Thua Thầu',   icon: 'bi-x-circle',          color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
];

@Component({
  selector: 'app-pm-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pm-dashboard.component.html',
  styleUrls: ['./pm-dashboard.component.scss']
})
export class PmDashboardComponent implements OnInit, OnDestroy {
  private svc = inject(ProjectService);
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  isLoading = false;
  isSaving = false;
  projects: any[] = [];
  stats: any = { totalProjects: 0, activeTechProjects: 0, overdueProjects: 0, pendingAssignmentProjects: 0, totalContractValue: 0, totalQuotedValue: 0, wonProjects: 0, lostProjects: 0 };
  selectedProject: any = null;
  activeModal: ModalType = null;
  errorMessage = '';
  pipelineView = true;

  // Documents
  projectDocuments: any[] = [];
  isLoadingDocs = false;
  isUploadingDoc = false;
  uploadDocForm = { documentType: 'OTHER', description: '' };
  uploadError = '';
  selectedFile: File | null = null;
  readonly backendBase = 'http://localhost:5000'; // true = pipeline cards view, false = table view

  filters = { keyword: '', salesStatus: 'ALL', priority: 'ALL', projectType: 'ALL', page: 1, pageSize: 50 };
  totalCount = 0;
  totalPages = 1;

  salesStages = SALES_STAGES;
  createForm = this.defaultCreate();
  signContractForm = this.defaultSignContract();
  salesStatusForm = { newStatus: '', note: '' };
  closeLostForm = { reason: '' };

  readonly salesStatusMap: Record<string, any> = Object.fromEntries(SALES_STAGES.map(s => [s.key, s]));
  readonly priorityMap: Record<string, { label: string; cls: string }> = {
    LOW: { label: 'Thấp', cls: 'p-low' }, MEDIUM: { label: 'TB', cls: 'p-medium' },
    HIGH: { label: 'Cao', cls: 'p-high' }, CRITICAL: { label: '🔥 Khẩn', cls: 'p-critical' }
  };

  ngOnInit() {
    this.search$.pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => { this.filters.page = 1; this.load(); });
    this.load();
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  load() {
    this.isLoading = true;
    const p = { ...this.filters } as any;
    if (p.salesStatus === 'ALL') delete p.salesStatus;
    if (p.priority === 'ALL') delete p.priority;
    if (p.projectType === 'ALL') delete p.projectType;
    this.svc.getProjects(p).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({ next: r => { this.projects = r.data || []; this.stats = r.stats; this.totalCount = r.pagination?.totalCount || 0; this.totalPages = r.pagination?.totalPages || 1; } });
  }

  onSearch(v: string) { this.search$.next(v); }
  onFilter() { this.filters.page = 1; this.load(); }

  getStageProjects(stageKey: string) { return this.projects.filter(p => p.salesStatus === stageKey); }

  // ── Modals ──────────────────────────────────────────────────────────
  openCreate() { this.createForm = this.defaultCreate(); this.errorMessage = ''; this.activeModal = 'create'; }
  openSignContract(p: any) { this.selectedProject = p; this.signContractForm = this.defaultSignContract(); this.errorMessage = ''; this.activeModal = 'signContract'; }
  openSalesStatus(p: any, next: string) { this.selectedProject = p; this.salesStatusForm = { newStatus: next, note: '' }; this.errorMessage = ''; this.activeModal = 'salesStatus'; }
  openCloseLost(p: any) { this.selectedProject = p; this.closeLostForm = { reason: '' }; this.errorMessage = ''; this.activeModal = 'closeLost'; }
  openDocuments(p: any) {
    this.selectedProject = p;
    this.projectDocuments = [];
    this.uploadDocForm = { documentType: 'OTHER', description: '' };
    this.selectedFile = null;
    this.uploadError = '';
    this.activeModal = 'documents';
    this.loadDocuments();
  }
  close() { this.activeModal = null; this.errorMessage = ''; }

  saveCreate() {
    if (!this.createForm.name?.trim() || !this.createForm.customerName?.trim()) { this.errorMessage = 'Vui lòng điền đầy đủ Tên dự án và Tên khách hàng.'; return; }
    if (!this.createForm.salesUserId) { this.errorMessage = 'Vui lòng nhập ID nhân viên kinh doanh phụ trách.'; return; }
    this.isSaving = true;
    this.svc.createProject(this.createForm).pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); this.load(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra.'; } });
  }

  saveSignContract() {
    if (!this.signContractForm.contractValue || this.signContractForm.contractValue <= 0) { this.errorMessage = 'Vui lòng nhập giá trị hợp đồng hợp lệ.'; return; }
    this.isSaving = true;
    this.svc.signContract(this.selectedProject.id, this.signContractForm).pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); this.load(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi.'; } });
  }

  saveSalesStatus() {
    this.isSaving = true;
    this.svc.advanceSalesStatus(this.selectedProject.id, this.salesStatusForm).pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); this.load(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi.'; } });
  }

  saveCloseLost() {
    if (!this.closeLostForm.reason?.trim()) { this.errorMessage = 'Vui lòng nhập lý do.'; return; }
    this.isSaving = true;
    this.svc.closeLost(this.selectedProject.id, this.closeLostForm).pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({ next: () => { this.close(); this.load(); }, error: e => { this.errorMessage = e?.error?.message || 'Có lỗi.'; } });
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  fmt(v?: number) { if (!v) return '—'; return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v); }
  fmtShort(v?: number) { if (!v) return '—'; if (v >= 1e9) return (v/1e9).toFixed(1)+'tỷ'; if (v >= 1e6) return (v/1e6).toFixed(0)+'tr'; return v.toLocaleString(); }
  getSales(s: string) { return this.salesStatusMap[s] || { label: s, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: 'bi-question' }; }
  getPriority(p: string) { return this.priorityMap[p] || { label: p, cls: '' }; }

  // Document methods
  loadDocuments() {
    if (!this.selectedProject) return;
    this.isLoadingDocs = true;
    this.svc.getProjectDocuments(this.selectedProject.id)
      .pipe(finalize(() => this.isLoadingDocs = false), takeUntil(this.destroy$))
      .subscribe({ next: r => { this.projectDocuments = r.data || []; } });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    this.uploadError = '';
  }

  uploadDocument() {
    if (!this.selectedFile) { this.uploadError = 'Vui lòng chọn file.'; return; }
    this.isUploadingDoc = true;
    this.svc.uploadDocument(this.selectedProject.id, this.selectedFile, this.uploadDocForm.documentType, this.uploadDocForm.description)
      .pipe(finalize(() => this.isUploadingDoc = false), takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          this.selectedFile = null;
          this.uploadDocForm = { documentType: 'OTHER', description: '' };
          this.uploadError = '';
          this.loadDocuments();
        },
        error: (e) => { this.uploadError = e?.error?.message || 'Upload thất bại.'; }
      });
  }

  deleteDocument(docId: number) {
    if (!confirm('Xác nhận xóa tài liệu này?')) return;
    this.svc.deleteDocument(docId).pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.loadDocuments() });
  }

  getDocUrl(doc: any) { return `${this.backendBase}/${doc.downloadUrl || doc.storedPath}`; }
  fmtSize(bytes: number) { if (bytes < 1024) return bytes + ' B'; if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB'; return (bytes/1048576).toFixed(1) + ' MB'; }
  getDocIcon(mimeType: string) {
    if (mimeType?.includes('pdf')) return 'bi-file-earmark-pdf';
    if (mimeType?.includes('word') || mimeType?.includes('doc')) return 'bi-file-earmark-word';
    if (mimeType?.includes('excel') || mimeType?.includes('sheet') || mimeType?.includes('xls')) return 'bi-file-earmark-excel';
    if (mimeType?.includes('image')) return 'bi-file-earmark-image';
    if (mimeType?.includes('zip') || mimeType?.includes('rar')) return 'bi-file-earmark-zip';
    if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) return 'bi-file-earmark-ppt';
    return 'bi-file-earmark';
  }

  nextStageOptions(current: string) {
    const order = ['LEAD','PROPOSAL_SENT','NEGOTIATION','CONTRACT_SIGNED','CLOSED_WON'];
    const idx = order.indexOf(current);
    return idx >= 0 && idx < order.length - 1 ? [order[idx + 1]] : [];
  }
  canSign(p: any) { return ['PROPOSAL_SENT','NEGOTIATION'].includes(p.salesStatus); }
  canClose(p: any) { return !['CLOSED_WON','CLOSED_LOST'].includes(p.salesStatus); }

  private defaultCreate() {
    return { name: '', customerName: '', customerContactName: '', customerPhone: '', customerEmail: '',
      salesUserId: null as number | null, salesDepartmentId: null as number | null,
      projectType: 'FIXED_PRICE', priority: 'MEDIUM', quotedValue: null as number | null,
      plannedStartDate: '', plannedEndDate: '', description: '', internalNote: '' };
  }
  private defaultSignContract() {
    return { contractValue: null as number | null, contractSignedDate: new Date().toISOString().split('T')[0],
      contractFileRef: '', warrantyMonths: 12, plannedStartDate: '', plannedEndDate: '' };
  }
}
