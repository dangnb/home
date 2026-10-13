import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ProjectService } from '../../../core/hrm/services/project.service';

type ViewMode = 'calendar' | 'kanban' | 'list';

@Component({
  selector: 'app-pm-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pm-schedule.component.html',
  styleUrls: ['./pm-schedule.component.scss']
})
export class PmScheduleComponent implements OnInit, OnDestroy {
  private svc = inject(ProjectService);
  private destroy$ = new Subject<void>();

  isLoading = false;
  viewMode: ViewMode = 'kanban';
  myTasks: any[] = [];
  selectedTask: any = null;
  showUpdateModal = false;
  updateForm = { progressPercent: 0, actualHours: 0, newStatus: 'IN_PROGRESS', blockedReason: '' };
  isSaving = false;
  errorMessage = '';

  // Calendar State
  calendarSubView: 'month' | 'week' | 'day' = 'month';
  currentDate = new Date();
  selectedDate: Date = new Date();
  calendarDays: { date: Date; tasks: any[]; isToday: boolean; isCurrentMonth: boolean }[] = [];
  dayDetailDate: Date | null = null;
  dayDetailTasks: any[] = [];
  showDayModal = false;

  // Kanban columns
  readonly kanbanCols = [
    { key: 'TODO',        label: 'Cần Làm',      icon: 'bi-circle',           color: '#64748b' },
    { key: 'IN_PROGRESS', label: 'Đang Làm',      icon: 'bi-play-circle-fill', color: '#818cf8' },
    { key: 'REVIEW',      label: 'Chờ Review',    icon: 'bi-eye-fill',         color: '#fbbf24' },
    { key: 'COMPLETED',   label: 'Hoàn Thành',    icon: 'bi-check-circle-fill',color: '#4ade80' },
    { key: 'BLOCKED',     label: 'Bị Chặn',       icon: 'bi-slash-circle-fill',color: '#f87171' },
  ];

  readonly statusNextMap: Record<string, string> = {
    TODO: 'IN_PROGRESS', IN_PROGRESS: 'REVIEW', REVIEW: 'COMPLETED'
  };

  filterStatus = 'ALL';
  filterProject = 'ALL';
  myProjects: string[] = [];

  ngOnInit() { this.loadMyTasks(); }
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadMyTasks() {
    this.isLoading = true;
    this.svc.getProjects({ pageSize: 100, techStatus: 'IN_PROGRESS' })
      .pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.myTasks = this.generateSampleTasks();
          this.myProjects = [...new Set(this.myTasks.map((t: any) => t.projectCode))];
          this.buildCalendar();
        }
      });
  }

  // Tạo sample tasks để demo UI với ngày tháng phong phú
  private generateSampleTasks(): any[] {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const d = (offset: number) => { const r = new Date(today); r.setDate(r.getDate() + offset); return r; };
    return [
      { id: 1, title: 'Thiết kế màn hình Dashboard & Metronic Calendar', description: 'Figma prototype cho màn Dashboard chính và Calendar phong cách Metronic', taskType: 'DESIGN', priority: 'HIGH', taskStatus: 'IN_PROGRESS', progressPercent: 65, estimatedHours: 16, actualHours: 9.5, dueDate: fmt(today), projectCode: 'DPA-2026-0001', projectName: 'Hệ thống CRM ABC', tags: 'Design,UI' },
      { id: 2, title: 'API tích hợp thanh toán VNPay', description: 'Kết nối cổng thanh toán VNPay và xử lý callback IPN', taskType: 'DEVELOPMENT', priority: 'CRITICAL', taskStatus: 'TODO', progressPercent: 0, estimatedHours: 24, actualHours: 0, dueDate: fmt(d(2)), projectCode: 'DPA-2026-0001', projectName: 'Hệ thống CRM ABC', tags: 'Backend,API' },
      { id: 3, title: 'Viết test cases module Quản lý Dự Án', description: 'Test case cho luồng tạo dự án, phân bổ nhân sự và đính kèm tài liệu', taskType: 'TESTING', priority: 'MEDIUM', taskStatus: 'TODO', progressPercent: 0, estimatedHours: 8, actualHours: 0, dueDate: fmt(d(4)), projectCode: 'DPA-2026-0002', projectName: 'HRM Nội Bộ', tags: 'Testing,QA' },
      { id: 4, title: 'Báo cáo nghiệm thu giai đoạn 1', description: 'Soạn tài liệu nghiệm thu Phase 1 cùng khách hàng', taskType: 'DOCUMENT', priority: 'HIGH', taskStatus: 'REVIEW', progressPercent: 100, estimatedHours: 4, actualHours: 4, dueDate: fmt(d(-1)), projectCode: 'DPA-2026-0002', projectName: 'HRM Nội Bộ', tags: 'Docs' },
      { id: 5, title: 'Fix bug biểu đồ phân tích trên Safari', description: 'Bug: biểu đồ Chart.js không scale đúng trên thiết bị iOS/macOS', taskType: 'BUGFIX', priority: 'CRITICAL', taskStatus: 'BLOCKED', progressPercent: 20, estimatedHours: 6, actualHours: 2, dueDate: fmt(today), projectCode: 'DPA-2026-0001', projectName: 'Hệ thống CRM ABC', blockedReason: 'Chờ access vào server staging để debug', tags: 'Bug,Frontend' },
      { id: 6, title: 'Deploy hệ thống lên Staging Cloud', description: 'Thiết lập CI/CD pipeline tự động build docker container lên môi trường Test', taskType: 'DEPLOYMENT', priority: 'MEDIUM', taskStatus: 'TODO', progressPercent: 0, estimatedHours: 3, actualHours: 0, dueDate: fmt(d(5)), projectCode: 'DPA-2026-0001', projectName: 'Hệ thống CRM ABC', tags: 'DevOps' },
      { id: 7, title: 'Họp Kickoff Ban Chỉ Đạo Dự Án', description: 'Họp thống nhất milestone và bàn giao tài liệu kỹ thuật', taskType: 'MEETING', priority: 'HIGH', taskStatus: 'COMPLETED', progressPercent: 100, estimatedHours: 2, actualHours: 2.5, dueDate: fmt(d(-3)), projectCode: 'DPA-2026-0002', projectName: 'HRM Nội Bộ', tags: 'Meeting' },
      { id: 8, title: 'Tối ưu hiệu năng truy vấn Dapper SQL', description: 'Đánh index cho bảng ProjectTasks và EmployeeProjects', taskType: 'DEVELOPMENT', priority: 'HIGH', taskStatus: 'IN_PROGRESS', progressPercent: 40, estimatedHours: 12, actualHours: 5, dueDate: fmt(d(1)), projectCode: 'DPA-2026-0001', projectName: 'Hệ thống CRM ABC', tags: 'Database,SQL' },
      { id: 9, title: 'Soạn hướng dẫn sử dụng cho Khách hàng', description: 'Tài liệu hướng dẫn quản trị và vận hành', taskType: 'DOCUMENT', priority: 'LOW', taskStatus: 'TODO', progressPercent: 0, estimatedHours: 6, actualHours: 0, dueDate: fmt(d(7)), projectCode: 'DPA-2026-0002', projectName: 'HRM Nội Bộ', tags: 'Documentation' }
    ];
  }

  buildCalendar() {
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: typeof this.calendarDays = [];
    // Leading days from prev month
    const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(y, m, -i);
      const dStr = this.formatDate(d);
      const tasks = this.filteredTasks.filter(t => t.dueDate === dStr);
      days.push({ date: d, tasks, isToday: false, isCurrentMonth: false });
    }
    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(y, m, d);
      const dStr = this.formatDate(date);
      const tasks = this.filteredTasks.filter(t => t.dueDate === dStr);
      const isToday = date.getTime() === today.getTime();
      days.push({ date, tasks, isToday, isCurrentMonth: true });
    }
    // Trailing days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(y, m + 1, d);
      const dStr = this.formatDate(date);
      const tasks = this.filteredTasks.filter(t => t.dueDate === dStr);
      days.push({ date, tasks, isToday: false, isCurrentMonth: false });
    }
    this.calendarDays = days;
  }

  // Helper date formatter: YYYY-MM-DD local
  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Navigation handlers
  prevPeriod() {
    if (this.calendarSubView === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    } else if (this.calendarSubView === 'week') {
      this.currentDate = new Date(this.currentDate.getTime() - 7 * 86400000);
    } else {
      this.currentDate = new Date(this.currentDate.getTime() - 86400000);
    }
    this.selectedDate = new Date(this.currentDate);
    this.buildCalendar();
  }

  nextPeriod() {
    if (this.calendarSubView === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    } else if (this.calendarSubView === 'week') {
      this.currentDate = new Date(this.currentDate.getTime() + 7 * 86400000);
    } else {
      this.currentDate = new Date(this.currentDate.getTime() + 86400000);
    }
    this.selectedDate = new Date(this.currentDate);
    this.buildCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.buildCalendar();
  }

  get currentPeriodLabel(): string {
    if (this.calendarSubView === 'month') {
      return this.currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
    } else if (this.calendarSubView === 'week') {
      const week = this.weekDaysList;
      if (week.length < 7) return '';
      const start = week[0].date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      const end = week[6].date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${start} — ${end}`;
    } else {
      return this.selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }

  get weekDays() { return ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật']; }

  // Get current 7 days of the selected week
  get weekDaysList(): { date: Date; name: string; isToday: boolean; tasks: any[] }[] {
    const curr = new Date(this.currentDate);
    const dayOfWeek = (curr.getDay() + 6) % 7; // Mon = 0
    const mon = new Date(curr);
    mon.setDate(curr.getDate() - dayOfWeek);
    mon.setHours(0, 0, 0, 0);

    const todayStr = this.formatDate(new Date());
    const list = [];
    const names = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const dStr = this.formatDate(d);
      list.push({
        date: d,
        name: names[i],
        isToday: dStr === todayStr,
        tasks: this.filteredTasks.filter(t => t.dueDate === dStr)
      });
    }
    return list;
  }

  // Day view tasks
  get dayTasks(): any[] {
    const dStr = this.formatDate(this.selectedDate);
    return this.filteredTasks.filter(t => t.dueDate === dStr);
  }

  selectDay(d: Date) {
    this.selectedDate = new Date(d);
  }

  openDayDetail(date: Date, tasks: any[]) {
    this.dayDetailDate = date;
    this.dayDetailTasks = tasks;
    this.showDayModal = true;
  }

  closeDayModal() {
    this.showDayModal = false;
    this.dayDetailDate = null;
    this.dayDetailTasks = [];
  }

  setFilterStatus(status: string) {
    this.filterStatus = this.filterStatus === status ? 'ALL' : status;
    this.buildCalendar();
  }

  get filteredTasks(): any[] {
    return this.myTasks.filter(t => {
      if (this.filterStatus !== 'ALL' && t.taskStatus !== this.filterStatus) return false;
      if (this.filterProject !== 'ALL' && t.projectCode !== this.filterProject) return false;
      return true;
    });
  }

  getColTasks(col: string) { return this.filteredTasks.filter(t => t.taskStatus === col); }

  openUpdateModal(task: any) {
    this.selectedTask = task;
    this.updateForm = { progressPercent: task.progressPercent, actualHours: task.actualHours, newStatus: task.taskStatus, blockedReason: task.blockedReason || '' };
    this.errorMessage = '';
    this.showUpdateModal = true;
  }

  closeModal() { this.showUpdateModal = false; this.errorMessage = ''; }

  saveUpdate() {
    if (!this.selectedTask) return;
    this.isSaving = true;
    this.svc.updateTaskProgress(this.selectedTask.id, this.updateForm)
      .pipe(finalize(() => this.isSaving = false), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update locally
          const t = this.myTasks.find(x => x.id === this.selectedTask.id);
          if (t) { Object.assign(t, { progressPercent: this.updateForm.progressPercent, actualHours: this.updateForm.actualHours, taskStatus: this.updateForm.newStatus, blockedReason: this.updateForm.blockedReason }); }
          this.buildCalendar();
          this.closeModal();
        },
        error: (e) => { this.errorMessage = e?.error?.message || 'Có lỗi xảy ra.'; }
      });
  }

  quickAdvance(task: any) {
    const next = this.statusNextMap[task.taskStatus];
    if (!next) return;
    const form = { progressPercent: next === 'COMPLETED' ? 100 : task.progressPercent, actualHours: task.actualHours, newStatus: next, blockedReason: '' };
    this.svc.updateTaskProgress(task.id, form).pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => { task.taskStatus = next; if (next === 'COMPLETED') task.progressPercent = 100; this.buildCalendar(); } });
  }

  // Helpers
  readonly taskTypeIcon: Record<string, string> = { DESIGN: 'bi-palette', DEVELOPMENT: 'bi-code-slash', TESTING: 'bi-bug', DEPLOYMENT: 'bi-cloud-upload', DOCUMENT: 'bi-file-earmark-text', BUGFIX: 'bi-wrench', MEETING: 'bi-people' };
  readonly priorityClass: Record<string, string> = { LOW: 'p-low', MEDIUM: 'p-med', HIGH: 'p-high', CRITICAL: 'p-crit', URGENT: 'p-crit' };
  readonly statusColor: Record<string, string> = { TODO: '#64748b', IN_PROGRESS: '#818cf8', REVIEW: '#fbbf24', COMPLETED: '#4ade80', BLOCKED: '#f87171' };
  readonly statusLabels: Record<string, string> = { TODO: 'Cần Làm', IN_PROGRESS: 'Đang Làm', REVIEW: 'Chờ Review', COMPLETED: 'Hoàn Thành', BLOCKED: 'Bị Chặn' };
  getTaskIcon(type: string) { return this.taskTypeIcon[type] || 'bi-list-check'; }
  isOverdue(t: any) { if (!t.dueDate || t.taskStatus === 'COMPLETED') return false; return new Date(t.dueDate) < new Date(); }
  get summaryDone() { return this.filteredTasks.filter(t => t.taskStatus === 'COMPLETED').length; }
  get summaryInProg() { return this.filteredTasks.filter(t => t.taskStatus === 'IN_PROGRESS').length; }
  get summaryBlocked() { return this.filteredTasks.filter(t => t.taskStatus === 'BLOCKED').length; }
  get totalHours() { return this.filteredTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0); }
}
