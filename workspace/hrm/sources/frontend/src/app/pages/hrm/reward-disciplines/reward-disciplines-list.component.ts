import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RewardDisciplineService, RewardDiscipline, RewardDisciplineSummary, CreateRewardDisciplineDto, UpdateRewardDisciplineDto } from '../../../core/hrm/services/reward-discipline.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reward-disciplines-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reward-disciplines-list.component.html',
  styleUrls: ['./reward-disciplines-list.component.scss']
})
export class RewardDisciplinesListComponent implements OnInit {
  private rewardService = inject(RewardDisciplineService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  Number = Number;

  items = signal<RewardDiscipline[]>([]);
  summary = signal<RewardDisciplineSummary>({
    totalRewardsCount: 0,
    totalRewardAmount: 0,
    totalDisciplinesCount: 0,
    totalDisciplineAmount: 0,
    netAmount: 0,
    totalDecisions: 0
  });
  employees = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filters
  filterType: string = 'ALL';
  filterCategory: string = 'ALL';
  filterStatus: string = 'ALL';
  filterKeyword: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;

  // Modal State
  isModalOpen = false;
  isEditing = false;
  editingId: number | null = null;
  isSubmitting = false;

  // Approve Modal State
  isApproveModalOpen = false;
  selectedForApprove: RewardDiscipline | null = null;
  isApproving = false;

  // Reject Modal State
  isRejectModalOpen = false;
  selectedForReject: RewardDiscipline | null = null;
  rejectReason = '';
  isRejecting = false;

  formData = {
    employeeId: 0,
    type: 1, // 1 = REWARD, 2 = DISCIPLINE
    category: 1, // 1 = PERFORMANCE, 4 = LATE_VIOLATION
    title: '',
    decisionNumber: '',
    decisionDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    amount: 0,
    reason: '',
    attachmentUrl: '',
    status: 1 // 1 = PENDING (Chờ duyệt)
  };

  ngOnInit() {
    this.loadEmployees();
    this.loadSummary();
    this.loadItems();
  }

  loadEmployees() {
    this.employeeService.getEmployees({ pageSize: 100 }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.employees.set(res.data);
        }
      },
      error: () => {}
    });
  }

  loadSummary() {
    this.rewardService.getSummary().subscribe({
      next: (res) => {
        if (res) this.summary.set(res);
      },
      error: () => {}
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.rewardService.getRewardDisciplines({
      page: this.currentPage,
      pageSize: this.pageSize,
      type: this.filterType !== 'ALL' ? this.filterType : undefined,
      category: this.filterCategory !== 'ALL' ? this.filterCategory : undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      keyword: this.filterKeyword.trim() || undefined
    }).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.items.set(res.data);
          if (res.pagination) {
            this.totalCount = res.pagination.totalCount;
            this.totalPages = res.pagination.totalPages;
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSearchKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onFilterChange();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadItems();
    }
  }

  openCreateModal() {
    this.isEditing = false;
    this.editingId = null;
    const defaultEmpId = this.employees().length > 0 ? this.employees()[0].id : 0;

    this.formData = {
      employeeId: defaultEmpId,
      type: 1,
      category: 1,
      title: '',
      decisionNumber: '', // Tự động sinh nếu để trống
      decisionDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      amount: 1000000,
      reason: '',
      attachmentUrl: '',
      status: 1 // 1 = PENDING (Chờ duyệt)
    };
    this.isModalOpen = true;
  }

  openEditModal(item: RewardDiscipline) {
    this.isEditing = true;
    this.editingId = item.id;

    this.formData = {
      employeeId: item.employeeId,
      type: item.type === 'REWARD' ? 1 : 2,
      category: this.getCategoryEnumVal(item.category),
      title: item.title,
      decisionNumber: item.decisionNumber || '',
      decisionDate: item.decisionDate,
      effectiveDate: item.effectiveDate,
      amount: item.amount,
      reason: item.reason || '',
      attachmentUrl: item.attachmentUrl || '',
      status: item.status === 'APPROVED' ? 2 : 1
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onTypeChangeInForm() {
    if (Number(this.formData.type) === 1) {
      this.formData.category = 1; // PERFORMANCE
    } else {
      this.formData.category = 4; // LATE_VIOLATION
    }
  }

  save() {
    if (!this.formData.employeeId || Number(this.formData.employeeId) <= 0) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn nhân viên áp dụng.');
      return;
    }
    if (!this.formData.title.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập tiêu đề quyết định.');
      return;
    }
    if (this.formData.amount < 0) {
      this.toastService.warning('Số tiền không hợp lệ', 'Số tiền thưởng/phạt không được là số âm.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditing && this.editingId) {
      const dto: UpdateRewardDisciplineDto = {
        id: this.editingId,
        type: Number(this.formData.type),
        category: Number(this.formData.category),
        title: this.formData.title.trim(),
        decisionNumber: this.formData.decisionNumber.trim() || undefined,
        decisionDate: this.formData.decisionDate,
        effectiveDate: this.formData.effectiveDate,
        amount: Number(this.formData.amount),
        reason: this.formData.reason.trim() || undefined,
        attachmentUrl: this.formData.attachmentUrl.trim() || undefined
      };

      this.rewardService.update(this.editingId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Cập nhật quyết định khen thưởng / kỷ luật thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadSummary();
          this.loadItems();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      const dto: CreateRewardDisciplineDto = {
        employeeId: Number(this.formData.employeeId),
        type: Number(this.formData.type),
        category: Number(this.formData.category),
        title: this.formData.title.trim(),
        decisionNumber: this.formData.decisionNumber.trim() || undefined,
        decisionDate: this.formData.decisionDate,
        effectiveDate: this.formData.effectiveDate,
        amount: Number(this.formData.amount),
        reason: this.formData.reason.trim() || undefined,
        attachmentUrl: this.formData.attachmentUrl.trim() || undefined,
        status: Number(this.formData.status)
      };

      this.rewardService.create(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã tạo quyết định thưởng/phạt mới thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadSummary();
          this.loadItems();
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteItem(item: RewardDiscipline) {
    if (!confirm(`Bạn có chắc chắn muốn xóa quyết định "${item.title}" của nhân viên ${item.employeeName}?`)) {
      return;
    }

    this.rewardService.delete(item.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa', 'Quyết định đã được xóa khỏi hệ thống.');
        this.loadSummary();
        this.loadItems();
      },
      error: () => {}
    });
  }

  // Approval Actions
  openApproveModal(item: RewardDiscipline) {
    this.selectedForApprove = item;
    this.isApproveModalOpen = true;
  }

  closeApproveModal() {
    this.isApproveModalOpen = false;
    this.selectedForApprove = null;
  }

  confirmApprove() {
    if (!this.selectedForApprove) return;

    this.isApproving = true;
    const typeLabel = this.selectedForApprove.type === 'REWARD' ? 'Khen Thưởng' : 'Kỷ Luật';

    this.rewardService.approve(this.selectedForApprove.id).subscribe({
      next: () => {
        this.toastService.success('Thành công', `Đã phê duyệt Quyết định ${typeLabel} "${this.selectedForApprove?.title}"!`);
        this.isApproving = false;
        this.closeApproveModal();
        this.loadSummary();
        this.loadItems();
      },
      error: (err) => {
        this.isApproving = false;
        const msg = err.error?.message || 'Không thể phê duyệt quyết định.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  openRejectModal(item: RewardDiscipline) {
    this.selectedForReject = item;
    this.rejectReason = '';
    this.isRejectModalOpen = true;
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.selectedForReject = null;
    this.rejectReason = '';
  }

  confirmReject() {
    if (!this.selectedForReject) return;
    if (!this.rejectReason.trim()) {
      this.toastService.warning('Cảnh báo', 'Vui lòng nhập lý do từ chối.');
      return;
    }

    this.isRejecting = true;
    this.rewardService.reject(this.selectedForReject.id, this.rejectReason.trim()).subscribe({
      next: () => {
        this.toastService.success('Thành công', `Đã từ chối Quyết định "${this.selectedForReject?.title}".`);
        this.isRejecting = false;
        this.closeRejectModal();
        this.loadSummary();
        this.loadItems();
      },
      error: (err) => {
        this.isRejecting = false;
        const msg = err.error?.message || 'Không thể từ chối quyết định.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  exportWord(item: RewardDiscipline) {
    const url = this.rewardService.getExportWordUrl(item.id);
    window.open(url, '_blank');
  }

  exportPdf(item: RewardDiscipline) {
    const url = this.rewardService.getExportHtmlUrl(item.id);
    window.open(url, '_blank');
  }

  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    if (this.openDropdownId() === id) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(id);
    }
  }

  closeDropdown() {
    this.openDropdownId.set(null);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeDropdown();
  }

  getCategoryEnumVal(cat: string): number {
    switch (cat) {
      case 'PERFORMANCE': return 1;
      case 'EXCELLENCE': return 2;
      case 'INNOVATION': return 3;
      case 'LATE_VIOLATION': return 4;
      case 'SAFETY_VIOLATION': return 5;
      case 'DISCIPLINE_BREACH': return 6;
      case 'BONUS': return 7;
      default: return 99;
    }
  }

  getCategoryLabel(cat: string): string {
    switch (cat) {
      case 'PERFORMANCE': return 'Hiệu suất xuất sắc';
      case 'EXCELLENCE': return 'Cá nhân xuất sắc';
      case 'INNOVATION': return 'Sáng kiến đột phá';
      case 'LATE_VIOLATION': return 'Vi phạm giờ giấc';
      case 'SAFETY_VIOLATION': return 'Vi phạm an toàn';
      case 'DISCIPLINE_BREACH': return 'Vi phạm kỷ luật';
      case 'BONUS': return 'Thưởng đột xuất / Lễ tết';
      default: return 'Khác';
    }
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  }
}
