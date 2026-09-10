import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../../../core/hrm/services/equipment.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

export interface EquipmentItem {
  id: number;
  tenantId: number;
  code: string;
  name: string;
  category: string;
  serialNumber?: string;
  specifications?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  status: string;
  currentUserId?: number;
  currentUserName?: string;
  departmentName?: string;
  assignedDate?: string;
  daysAssigned?: number;
  note?: string;
  createdAt: string;
}

export interface EquipmentSummary {
  totalEquipments: number;
  availableEquipments: number;
  assignedEquipments: number;
  brokenEquipments: number;
}

@Component({
  selector: 'app-equipments-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss']
})
export class EquipmentsListComponent implements OnInit {
  private equipmentService = inject(EquipmentService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  items = signal<EquipmentItem[]>([]);
  summary = signal<EquipmentSummary>({
    totalEquipments: 0,
    availableEquipments: 0,
    assignedEquipments: 0,
    brokenEquipments: 0
  });
  employees = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filter params
  filterKeyword: string = '';
  filterCategory: string = 'ALL';
  filterStatus: string = 'ALL';
  isAdvancedFilterOpen = signal<boolean>(false);

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  // Modal Create Equipment
  isCreateModalOpen = false;
  isSubmittingCreate = false;
  createForm = {
    code: '',
    name: '',
    category: 'LAPTOP',
    serialNumber: '',
    specifications: '',
    purchaseDate: '',
    warrantyEndDate: '',
    note: ''
  };

  // Modal Handover (Bàn Giao)
  isHandoverModalOpen = false;
  isSubmittingHandover = false;
  selectedEquipmentForHandover: EquipmentItem | null = null;
  handoverForm = {
    targetUserId: 0,
    conditionStatus: 'Mới 100% / Đang hoạt động tốt',
    note: ''
  };

  // Modal Revoke (Thu Hồi)
  isRevokeModalOpen = false;
  isSubmittingRevoke = false;
  selectedEquipmentForRevoke: EquipmentItem | null = null;
  revokeForm = {
    conditionStatus: 'Hoạt động bình thường',
    note: ''
  };

  // Modal Report Broken (Báo Hỏng)
  isBrokenModalOpen = false;
  isSubmittingBroken = false;
  selectedEquipmentForBroken: EquipmentItem | null = null;
  brokenForm = {
    description: '',
    note: ''
  };

  // View Detail & History Modal
  isViewModalOpen = false;
  selectedEquipmentDetail: any = null;
  isLoadingDetail = false;

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
    this.loadEmployees();
    this.loadItems();
  }

  loadEmployees() {
    this.employeeService.getEmployeeLookup({ limit: 500 }).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.employees.set(res);
        } else if (res && res.data) {
          this.employees.set(res.data);
        }
      },
      error: () => {}
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.equipmentService.getEquipments({
      page: this.currentPage,
      pageSize: this.pageSize,
      keyword: this.filterKeyword.trim() || undefined,
      category: this.filterCategory !== 'ALL' ? this.filterCategory : undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined
    }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.items.set(res.data);
          if (res.summary) {
            this.summary.set(res.summary);
          }
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
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách trang thiết bị.');
      }
    });
  }

  toggleAdvancedFilter() {
    this.isAdvancedFilterOpen.update(v => !v);
  }

  get activeAdvancedFilterCount(): number {
    let count = 0;
    if (this.filterCategory !== 'ALL') count++;
    if (this.filterStatus !== 'ALL') count++;
    return count;
  }

  clearSingleFilter(type: string) {
    if (type === 'category') this.filterCategory = 'ALL';
    if (type === 'status') this.filterStatus = 'ALL';
    if (type === 'keyword') this.filterKeyword = '';
    this.onFilterChange();
  }

  resetFilters() {
    this.filterKeyword = '';
    this.filterCategory = 'ALL';
    this.filterStatus = 'ALL';
    this.onFilterChange();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadItems();
  }

  // --- Handlers Modal Create ---
  openCreateModal() {
    const randomCode = 'EQ-' + Math.floor(100 + Math.random() * 900);
    this.createForm = {
      code: randomCode,
      name: '',
      category: 'LAPTOP',
      serialNumber: '',
      specifications: '',
      purchaseDate: '',
      warrantyEndDate: '',
      note: ''
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  submitCreate() {
    if (!this.createForm.code.trim() || !this.createForm.name.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập Mã và Tên trang thiết bị.');
      return;
    }

    this.isSubmittingCreate = true;
    this.equipmentService.createEquipment({
      code: this.createForm.code.trim(),
      name: this.createForm.name.trim(),
      category: this.createForm.category,
      serialNumber: this.createForm.serialNumber.trim() || undefined,
      specifications: this.createForm.specifications.trim() || undefined,
      purchaseDate: this.createForm.purchaseDate || undefined,
      warrantyEndDate: this.createForm.warrantyEndDate || undefined,
      note: this.createForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã khai báo trang thiết bị mới thành công.');
        this.isSubmittingCreate = false;
        this.closeCreateModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingCreate = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi tạo thiết bị.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal Handover ---
  openHandoverModal(item: EquipmentItem) {
    this.selectedEquipmentForHandover = item;
    const defaultUserId = this.employees().length > 0 ? (this.employees()[0].userId || this.employees()[0].id) : 0;
    this.handoverForm = {
      targetUserId: defaultUserId,
      conditionStatus: 'Mới 100% / Đang hoạt động tốt',
      note: ''
    };
    this.isHandoverModalOpen = true;
  }

  closeHandoverModal() {
    this.isHandoverModalOpen = false;
    this.selectedEquipmentForHandover = null;
  }

  submitHandover() {
    if (!this.selectedEquipmentForHandover) return;
    if (!this.handoverForm.targetUserId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn nhân sự nhận bàn giao.');
      return;
    }

    this.isSubmittingHandover = true;
    this.equipmentService.handoverEquipment(this.selectedEquipmentForHandover.id, {
      targetUserId: Number(this.handoverForm.targetUserId),
      conditionStatus: this.handoverForm.conditionStatus.trim(),
      note: this.handoverForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã bàn giao trang thiết bị cho nhân sự sử dụng.');
        this.isSubmittingHandover = false;
        this.closeHandoverModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingHandover = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi bàn giao thiết bị.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal Revoke ---
  openRevokeModal(item: EquipmentItem) {
    this.selectedEquipmentForRevoke = item;
    this.revokeForm = {
      conditionStatus: 'Hoạt động bình thường',
      note: ''
    };
    this.isRevokeModalOpen = true;
  }

  closeRevokeModal() {
    this.isRevokeModalOpen = false;
    this.selectedEquipmentForRevoke = null;
  }

  submitRevoke() {
    if (!this.selectedEquipmentForRevoke) return;

    this.isSubmittingRevoke = true;
    this.equipmentService.revokeEquipment(this.selectedEquipmentForRevoke.id, {
      conditionStatus: this.revokeForm.conditionStatus.trim(),
      note: this.revokeForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã thu hồi trang thiết bị về kho thành công.');
        this.isSubmittingRevoke = false;
        this.closeRevokeModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingRevoke = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi thu hồi thiết bị.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal Report Broken ---
  openBrokenModal(item: EquipmentItem) {
    this.selectedEquipmentForBroken = item;
    this.brokenForm = {
      description: '',
      note: ''
    };
    this.isBrokenModalOpen = true;
  }

  closeBrokenModal() {
    this.isBrokenModalOpen = false;
    this.selectedEquipmentForBroken = null;
  }

  submitBroken() {
    if (!this.selectedEquipmentForBroken) return;
    if (!this.brokenForm.description.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập mô tả sự cố hư hỏng thiết bị.');
      return;
    }

    this.isSubmittingBroken = true;
    this.equipmentService.reportBrokenEquipment(this.selectedEquipmentForBroken.id, {
      description: this.brokenForm.description.trim(),
      note: this.brokenForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã ghi nhận báo hỏng trang thiết bị.');
        this.isSubmittingBroken = false;
        this.closeBrokenModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingBroken = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi báo hỏng thiết bị.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal View Detail ---
  viewDetail(item: EquipmentItem) {
    this.isLoadingDetail = true;
    this.isViewModalOpen = true;
    this.equipmentService.getEquipment(item.id).subscribe({
      next: (res) => {
        this.selectedEquipmentDetail = res;
        this.isLoadingDetail = false;
      },
      error: () => {
        this.isLoadingDetail = false;
        this.toastService.error('Lỗi', 'Không thể tải chi tiết trang thiết bị.');
      }
    });
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedEquipmentDetail = null;
  }

  // Helpers
  getCategoryLabel(category: string): string {
    switch (category) {
      case 'LAPTOP': return '💻 Laptop';
      case 'MONITOR': return '🖥️ Màn hình';
      case 'PHONE': return '📱 Điện thoại';
      case 'DESK_CHAIR': return '🪑 Bàn ghế';
      case 'PERIPHERAL': return '⌨️ Linh kiện/Phụ kiện';
      case 'OTHER': return '📦 Khác';
      default: return category;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'AVAILABLE': return '🟢 Sẵn sàng trong kho';
      case 'ASSIGNED': return '🔵 Đang cấp phát';
      case 'BROKEN': return '🔴 Đang báo hỏng';
      case 'MAINTENANCE': return '🟡 Đang bảo trì';
      case 'DISPOSED': return '⚪ Đã thanh lý';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'badge-light-success text-success fw-bold';
      case 'ASSIGNED': return 'badge-light-primary text-primary fw-bold';
      case 'BROKEN': return 'badge-light-danger text-danger fw-bold border border-danger border-dashed';
      case 'MAINTENANCE': return 'badge-light-warning text-warning fw-bold';
      case 'DISPOSED': return 'badge-light-dark text-dark';
      default: return 'badge-light-secondary';
    }
  }

  getActionTypeLabel(action: string): string {
    switch (action) {
      case 'HANDOVER': return '💼 Bàn giao sử dụng';
      case 'REVOKE': return '🔄 Thu hồi về kho';
      case 'REPORT_BROKEN': return '⚠️ Báo hỏng sự cố';
      case 'REPAIR_COMPLETED': return '🔧 Hoàn tất sửa chữa';
      case 'DISPOSE': return '🗑️ Thanh lý thiết bị';
      default: return action;
    }
  }

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'HANDOVER': return 'badge-light-primary text-primary';
      case 'REVOKE': return 'badge-light-success text-success';
      case 'REPORT_BROKEN': return 'badge-light-danger text-danger';
      case 'REPAIR_COMPLETED': return 'badge-light-info text-info';
      case 'DISPOSE': return 'badge-light-dark text-dark';
      default: return 'badge-light-secondary';
    }
  }
}
