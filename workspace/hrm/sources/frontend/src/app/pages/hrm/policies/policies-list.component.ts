import { Component, OnInit, inject, signal, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrPolicyService, HrPolicy, HrPolicySummary, CreateHrPolicyDto, UpdateHrPolicyDto } from '../../../core/hrm/services/hr-policy.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-policies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.scss']
})
export class PoliciesListComponent implements OnInit {
  private policyService = inject(HrPolicyService);
  private toastService = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  items = signal<HrPolicy[]>([]);
  summary = signal<HrPolicySummary>({
    totalPolicies: 0,
    publishedPolicies: 0,
    benefitsPolicies: 0,
    workingHoursPolicies: 0,
    insurancePolicies: 0
  });
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filters
  filterCategory: string = 'ALL';
  filterStatus: string = 'ALL';
  filterKeyword: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 12; // Grid card pagination
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [12, 24, 48];

  // Modal State
  isModalOpen = false;
  isEditing = false;
  editingId: number | null = null;
  isSubmitting = false;

  // Rich Text Editor State
  editorMode: 'visual' | 'code' = 'visual';

  @ViewChild('editorDiv') set editorDiv(content: ElementRef<HTMLDivElement> | undefined) {
    if (content && content.nativeElement) {
      if (content.nativeElement.innerHTML !== (this.formData.content || '')) {
        content.nativeElement.innerHTML = this.formData.content || '';
      }
    }
  }

  execCommand(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
    this.syncEditorContent();
  }

  setHeading(event: Event) {
    const select = event.target as HTMLSelectElement;
    const tag = select.value;
    if (tag) {
      document.execCommand('formatBlock', false, `<${tag}>`);
      this.syncEditorContent();
    }
  }

  setTextColor(color: string) {
    document.execCommand('foreColor', false, color);
    this.syncEditorContent();
  }

  insertLink() {
    const url = prompt('Nhập đường dẫn URL (vd: https://example.com):');
    if (url) {
      document.execCommand('createLink', false, url);
      this.syncEditorContent();
    }
  }

  onEditorInput(event: Event) {
    const target = event.target as HTMLElement;
    this.formData.content = target.innerHTML;
  }

  syncEditorContent() {
    const el = document.querySelector('.rich-editor-content') as HTMLElement;
    if (el) {
      this.formData.content = el.innerHTML;
    }
  }

  getSafeHtml(content: string | undefined): SafeHtml {
    if (!content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // View Detail Modal State
  selectedPolicyForView: HrPolicy | null = null;
  isViewModalOpen = false;

  formData = {
    policyCode: '',
    title: '',
    category: 1, // 1 = BENEFITS
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    summary: '',
    content: '',
    attachmentUrl: '',
    status: 2 // 2 = PUBLISHED
  };

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownId.set(null);
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

  ngOnInit() {
    this.loadSummary();
    this.loadItems();
  }

  loadSummary() {
    this.policyService.getSummary().subscribe({
      next: (res) => {
        if (res) this.summary.set(res);
      },
      error: () => {}
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.policyService.getPolicies({
      page: this.currentPage,
      pageSize: this.pageSize,
      category: this.filterCategory !== 'ALL' ? this.filterCategory : undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      keyword: this.filterKeyword ? this.filterKeyword : undefined
    }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.items.set(res.data);
          if (res.pagination) {
            this.totalCount = res.pagination.totalCount;
            this.totalPages = res.pagination.totalPages;
          } else {
            this.totalCount = res.data.length;
            this.totalPages = 1;
          }
        } else {
          this.items.set([]);
          this.totalCount = 0;
          this.totalPages = 1;
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách chính sách công ty.');
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadItems();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadItems();
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // View Policy Detail
  viewPolicyDetail(item: HrPolicy) {
    this.selectedPolicyForView = item;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedPolicyForView = null;
  }

  // Create / Edit Modal
  openCreateModal() {
    this.isEditing = false;
    this.editingId = null;
    this.editorMode = 'visual';
    this.formData = {
      policyCode: '',
      title: '',
      category: 1,
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      summary: '',
      content: '',
      attachmentUrl: '',
      status: 2
    };
    this.isModalOpen = true;
  }

  openEditModal(item: HrPolicy) {
    this.isEditing = true;
    this.editingId = item.id;
    this.editorMode = 'visual';
    this.formData = {
      policyCode: item.policyCode,
      title: item.title,
      category: this.getCategoryNumeric(item.category),
      effectiveDate: item.effectiveDate,
      expiryDate: item.expiryDate || '',
      summary: item.summary || '',
      content: item.content || '',
      attachmentUrl: item.attachmentUrl || '',
      status: this.getStatusNumeric(item.status)
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  savePolicy() {
    if (!this.formData.title.trim()) {
      this.toastService.warning('Cảnh báo', 'Vui lòng nhập tên chính sách.');
      return;
    }

    if (!this.formData.effectiveDate) {
      this.toastService.warning('Cảnh báo', 'Vui lòng chọn ngày ban hành.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditing && this.editingId) {
      const dto: UpdateHrPolicyDto = {
        title: this.formData.title.trim(),
        category: Number(this.formData.category),
        effectiveDate: this.formData.effectiveDate,
        expiryDate: this.formData.expiryDate ? this.formData.expiryDate : undefined,
        summary: this.formData.summary,
        content: this.formData.content,
        attachmentUrl: this.formData.attachmentUrl,
        status: Number(this.formData.status)
      };

      this.policyService.updatePolicy(this.editingId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã cập nhật bài viết chính sách thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể cập nhật chính sách.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else {
      const dto: CreateHrPolicyDto = {
        policyCode: this.formData.policyCode ? this.formData.policyCode.trim() : undefined,
        title: this.formData.title.trim(),
        category: Number(this.formData.category),
        effectiveDate: this.formData.effectiveDate,
        expiryDate: this.formData.expiryDate ? this.formData.expiryDate : undefined,
        summary: this.formData.summary,
        content: this.formData.content,
        attachmentUrl: this.formData.attachmentUrl,
        status: Number(this.formData.status)
      };

      this.policyService.createPolicy(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã ban hành chính sách công ty mới thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể ban hành chính sách.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  deletePolicy(item: HrPolicy) {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết chính sách "${item.title}" (${item.policyCode})?`)) {
      this.policyService.deletePolicy(item.id).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Đã xóa chính sách ${item.policyCode}.`);
          this.loadItems();
          this.loadSummary();
        },
        error: (err) => {
          const msg = err.error?.message || 'Không thể xóa chính sách.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  // Label & Badge Helpers
  getCategoryLabel(cat: string): string {
    switch (cat) {
      case 'BENEFITS': return 'Chế độ & Phụ cấp';
      case 'WORKING_HOURS': return 'Thời giờ làm việc & OT';
      case 'INSURANCE_WELFARE': return 'Bảo hiểm & Phúc lợi';
      case 'CODE_OF_CONDUCT': return 'Quy tắc ứng xử';
      case 'SAFETY_HEALTH': return 'An toàn & Sức khỏe';
      case 'OTHER': return 'Quy định khác';
      default: return cat;
    }
  }

  getCategoryBadgeClass(cat: string): string {
    switch (cat) {
      case 'BENEFITS': return 'badge-light-success text-success';
      case 'WORKING_HOURS': return 'badge-light-primary text-primary';
      case 'INSURANCE_WELFARE': return 'badge-light-info text-info';
      case 'CODE_OF_CONDUCT': return 'badge-light-warning text-warning';
      case 'SAFETY_HEALTH': return 'badge-light-danger text-danger';
      default: return 'badge-light-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'badge-light-success text-success';
      case 'DRAFT': return 'badge-light-warning text-warning';
      case 'ARCHIVED': return 'badge-light-secondary text-secondary';
      default: return 'badge-light-primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Đã ban hành';
      case 'DRAFT': return 'Bản nháp';
      case 'ARCHIVED': return 'Đã hết hiệu lực';
      default: return status;
    }
  }

  getCategoryNumeric(cat: string): number {
    switch (cat) {
      case 'BENEFITS': return 1;
      case 'WORKING_HOURS': return 2;
      case 'INSURANCE_WELFARE': return 3;
      case 'CODE_OF_CONDUCT': return 4;
      case 'SAFETY_HEALTH': return 5;
      default: return 6;
    }
  }

  getStatusNumeric(status: string): number {
    switch (status) {
      case 'DRAFT': return 1;
      case 'PUBLISHED': return 2;
      case 'ARCHIVED': return 3;
      default: return 2;
    }
  }
}
