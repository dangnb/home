import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../../core/hrm/services/asset.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

export interface AssetItem {
  id: number;
  tenantId: number;
  assetCode: string;
  name: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice: number;
  currentValue: number;
  assigneeId?: number;
  assigneeName?: string;
  status: string;
  createdAt: string;
}

export interface AssetSummary {
  totalAssets: number;
  availableAssets: number;
  inUseAssets: number;
  maintenanceAssets: number;
  totalAssetValue: number;
}

@Component({
  selector: 'app-assets-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit {
  private assetService = inject(AssetService);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);

  items = signal<AssetItem[]>([]);
  summary = signal<AssetSummary>({
    totalAssets: 0,
    availableAssets: 0,
    inUseAssets: 0,
    maintenanceAssets: 0,
    totalAssetValue: 0
  });
  employees = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filters
  filterKeyword: string = '';
  filterCategory: string = 'ALL';
  filterStatus: string = 'ALL';
  filterAssigneeId: number | null = null;
  filterFromDate: string = '';
  filterToDate: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  // Active Tab
  activeTab: 'ASSETS' | 'MAINTENANCE' | 'DEPRECIATION' = 'ASSETS';

  // Maintenance Tickets Data
  maintenanceTickets = signal<any[]>([]);
  isLoadingMaintenance = signal<boolean>(false);

  // Depreciation Data
  depreciations = signal<any[]>([]);
  isLoadingDepreciations = signal<boolean>(false);

  // Modal Create Asset
  isCreateModalOpen = false;
  isSubmittingCreate = false;
  createForm = {
    assetCode: '',
    name: '',
    category: 'IT',
    purchasePrice: 0,
    serialNumber: '',
    purchaseDate: ''
  };

  // Modal Allocate
  isAllocateModalOpen = false;
  isSubmittingAllocate = false;
  selectedAssetForAllocate: AssetItem | null = null;
  allocateForm = {
    assigneeUserId: 0,
    conditionNotes: ''
  };

  // Modal Transfer
  isTransferModalOpen = false;
  isSubmittingTransfer = false;
  selectedAssetForTransfer: AssetItem | null = null;
  transferForm = {
    targetUserId: 0,
    reason: ''
  };

  // Modal Dispose
  isDisposeModalOpen = false;
  isSubmittingDispose = false;
  selectedAssetForDispose: AssetItem | null = null;
  disposeForm = {
    disposalReason: '',
    salvageValue: 0
  };

  // Modal Maintenance Ticket
  isMaintenanceModalOpen = false;
  isSubmittingMaintenance = false;
  selectedAssetForMaintenance: AssetItem | null = null;
  maintenanceForm = {
    issueDescription: ''
  };

  // Modal Depreciation Run
  isDepreciateModalOpen = false;
  isSubmittingDepreciate = false;
  depreciateForm = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    usefulLifeMonths: 36
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
    this.loadEmployees();
    this.loadAssets();
  }

  loadEmployees() {
    this.employeeService.getEmployeeLookup({ limit: 1000 }).subscribe({
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

  loadAssets() {
    this.isLoading.set(true);
    this.assetService.getAssets({
      page: this.currentPage,
      pageSize: this.pageSize,
      keyword: this.filterKeyword.trim() || undefined,
      category: this.filterCategory !== 'ALL' ? this.filterCategory : undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      assigneeUserId: this.filterAssigneeId ? Number(this.filterAssigneeId) : undefined
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
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách tài sản.');
      }
    });
  }

  loadMaintenanceTickets() {
    this.isLoadingMaintenance.set(true);
    this.assetService.getMaintenanceTickets({
      page: 1,
      pageSize: 50,
      keyword: this.filterKeyword.trim() || undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      fromDate: this.filterFromDate || undefined,
      toDate: this.filterToDate || undefined
    }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.maintenanceTickets.set(res.data);
        }
        this.isLoadingMaintenance.set(false);
      },
      error: () => {
        this.isLoadingMaintenance.set(false);
      }
    });
  }

  loadDepreciations() {
    this.isLoadingDepreciations.set(true);
    this.assetService.getDepreciations(undefined, this.depreciateForm.year).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.depreciations.set(res.data);
        }
        this.isLoadingDepreciations.set(false);
      },
      error: () => {
        this.isLoadingDepreciations.set(false);
      }
    });
  }

  switchTab(tab: 'ASSETS' | 'MAINTENANCE' | 'DEPRECIATION') {
    this.activeTab = tab;
    if (tab === 'ASSETS') {
      this.loadAssets();
    } else if (tab === 'MAINTENANCE') {
      this.loadMaintenanceTickets();
    } else if (tab === 'DEPRECIATION') {
      this.loadDepreciations();
    }
  }

  onFilterChange() {
    this.currentPage = 1;
    if (this.activeTab === 'ASSETS') {
      this.loadAssets();
    } else if (this.activeTab === 'MAINTENANCE') {
      this.loadMaintenanceTickets();
    }
  }

  resetFilters() {
    this.filterKeyword = '';
    this.filterCategory = 'ALL';
    this.filterStatus = 'ALL';
    this.filterAssigneeId = null;
    this.filterFromDate = '';
    this.filterToDate = '';
    this.onFilterChange();
  }

  // --- Create Asset ---
  openCreateModal() {
    const code = 'AST-' + Math.floor(1000 + Math.random() * 9000);
    this.createForm = {
      assetCode: code,
      name: '',
      category: 'IT',
      purchasePrice: 0,
      serialNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  submitCreate() {
    if (!this.createForm.assetCode || !this.createForm.name || this.createForm.purchasePrice <= 0) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng điền mã, tên và giá mua tài sản.');
      return;
    }

    this.isSubmittingCreate = true;
    this.assetService.createAsset({
      assetCode: this.createForm.assetCode,
      name: this.createForm.name,
      category: this.createForm.category,
      purchasePrice: this.createForm.purchasePrice,
      serialNumber: this.createForm.serialNumber || undefined,
      purchaseDate: this.createForm.purchaseDate || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã khai báo hồ sơ tài sản mới thành công.');
        this.isSubmittingCreate = false;
        this.closeCreateModal();
        this.loadAssets();
      },
      error: (err) => {
        this.isSubmittingCreate = false;
        this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi khi khai báo tài sản.');
      }
    });
  }

  // --- Allocate ---
  openAllocateModal(item: AssetItem) {
    this.selectedAssetForAllocate = item;
    const defaultUserId = this.employees().length > 0 ? (this.employees()[0].userId || this.employees()[0].id) : 0;
    this.allocateForm = {
      assigneeUserId: defaultUserId,
      conditionNotes: 'Cấp phát mới, trạng thái hoạt động tốt.'
    };
    this.isAllocateModalOpen = true;
    this.closeDropdown();
  }

  closeAllocateModal() {
    this.isAllocateModalOpen = false;
    this.selectedAssetForAllocate = null;
  }

  submitAllocate() {
    if (!this.selectedAssetForAllocate || !this.allocateForm.assigneeUserId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn nhân sự tiếp nhận tài sản.');
      return;
    }

    this.isSubmittingAllocate = true;
    this.assetService.allocateAsset(this.selectedAssetForAllocate.id, {
      assigneeUserId: Number(this.allocateForm.assigneeUserId),
      conditionNotes: this.allocateForm.conditionNotes
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã thực hiện cấp phát tài sản thành công.');
        this.isSubmittingAllocate = false;
        this.closeAllocateModal();
        this.loadAssets();
      },
      error: (err) => {
        this.isSubmittingAllocate = false;
        this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi cấp phát tài sản.');
      }
    });
  }

  // --- Recover ---
  recoverAsset(item: AssetItem) {
    if (confirm(`Bạn có chắc chắn muốn thu hồi tài sản ${item.assetCode} - ${item.name} về kho?`)) {
      this.assetService.recoverAsset(item.id, { conditionNotes: 'Thu hồi về kho kho bãi.' }).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã thu hồi tài sản về kho thành công.');
          this.loadAssets();
        },
        error: (err) => {
          this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi thu hồi tài sản.');
        }
      });
    }
  }

  // --- Transfer ---
  openTransferModal(item: AssetItem) {
    this.selectedAssetForTransfer = item;
    const defaultUserId = this.employees().length > 0 ? (this.employees()[0].userId || this.employees()[0].id) : 0;
    this.transferForm = {
      targetUserId: defaultUserId,
      reason: 'Điều chuyển công tác nội bộ'
    };
    this.isTransferModalOpen = true;
    this.closeDropdown();
  }

  closeTransferModal() {
    this.isTransferModalOpen = false;
    this.selectedAssetForTransfer = null;
  }

  submitTransfer() {
    if (!this.selectedAssetForTransfer || !this.transferForm.targetUserId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn người tiếp nhận điều chuyển.');
      return;
    }

    this.isSubmittingTransfer = true;
    this.assetService.transferAsset(this.selectedAssetForTransfer.id, {
      targetUserId: Number(this.transferForm.targetUserId),
      reason: this.transferForm.reason
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã điều chuyển tài sản thành công.');
        this.isSubmittingTransfer = false;
        this.closeTransferModal();
        this.loadAssets();
      },
      error: (err) => {
        this.isSubmittingTransfer = false;
        this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi điều chuyển tài sản.');
      }
    });
  }

  // --- Dispose ---
  openDisposeModal(item: AssetItem) {
    this.selectedAssetForDispose = item;
    this.disposeForm = {
      disposalReason: 'Hết hạn sử dụng / Hư hỏng không thể phục hồi',
      salvageValue: 0
    };
    this.isDisposeModalOpen = true;
    this.closeDropdown();
  }

  closeDisposeModal() {
    this.isDisposeModalOpen = false;
    this.selectedAssetForDispose = null;
  }

  submitDispose() {
    if (!this.selectedAssetForDispose || !this.disposeForm.disposalReason) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập lý do thanh lý tài sản.');
      return;
    }

    this.isSubmittingDispose = true;
    this.assetService.disposeAsset(this.selectedAssetForDispose.id, {
      disposalReason: this.disposeForm.disposalReason,
      salvageValue: this.disposeForm.salvageValue
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã thanh lý tài sản thành công.');
        this.isSubmittingDispose = false;
        this.closeDisposeModal();
        this.loadAssets();
      },
      error: (err) => {
        this.isSubmittingDispose = false;
        this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi thanh lý tài sản.');
      }
    });
  }

  // --- Maintenance Ticket ---
  openMaintenanceModal(item: AssetItem) {
    this.selectedAssetForMaintenance = item;
    this.maintenanceForm = { issueDescription: '' };
    this.isMaintenanceModalOpen = true;
    this.closeDropdown();
  }

  closeMaintenanceModal() {
    this.isMaintenanceModalOpen = false;
    this.selectedAssetForMaintenance = null;
  }

  submitMaintenance() {
    if (!this.selectedAssetForMaintenance || !this.maintenanceForm.issueDescription) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng mô tả sự cố hư hỏng tài sản.');
      return;
    }

    this.isSubmittingMaintenance = true;
    this.assetService.createMaintenanceTicket(this.selectedAssetForMaintenance.id, {
      issueDescription: this.maintenanceForm.issueDescription
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã gửi phiếu báo hỏng & yêu cầu bảo trì.');
        this.isSubmittingMaintenance = false;
        this.closeMaintenanceModal();
        this.loadAssets();
      },
      error: (err) => {
        this.isSubmittingMaintenance = false;
        this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi báo hỏng tài sản.');
      }
    });
  }

  // --- Calculate Depreciation ---
  openDepreciateModal() {
    this.depreciateForm = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      usefulLifeMonths: 36
    };
    this.isDepreciateModalOpen = true;
  }

  closeDepreciateModal() {
    this.isDepreciateModalOpen = false;
  }

  submitDepreciate() {
    this.isSubmittingDepreciate = true;
    this.assetService.calculateDepreciation({
      month: Number(this.depreciateForm.month),
      year: Number(this.depreciateForm.year),
      usefulLifeMonths: Number(this.depreciateForm.usefulLifeMonths)
    }).subscribe({
      next: (res: any) => {
        this.toastService.success('Thành công', res.message || 'Đã tính khấu hao tự động thành công.');
        this.isSubmittingDepreciate = false;
        this.closeDepreciateModal();
        if (this.activeTab === 'DEPRECIATION') {
          this.loadDepreciations();
        } else {
          this.loadAssets();
        }
      },
      error: (err) => {
        this.isSubmittingDepreciate = false;
        this.toastService.error('Lỗi', err?.error?.detail || err?.error?.message || 'Lỗi tính khấu hao.');
      }
    });
  }

  // Label Helpers
  getCategoryLabel(category: string): string {
    switch (category) {
      case 'IT': return '💻 Thiết bị IT (Laptop/PC)';
      case 'MACHINERY': return '⚙️ Máy móc / Động cơ';
      case 'VEHICLE': return '🚗 Phương tiện vận tải';
      case 'OFFICE': return '🏢 Đồ dùng văn phòng';
      default: return category;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'DRAFT': return '📝 Bản nháp';
      case 'AVAILABLE': return '🟢 Sẵn sàng cấp phát';
      case 'IN_USE': return '🔵 Đang sử dụng';
      case 'MAINTENANCE': return '🟡 Đang bảo trì';
      case 'BROKEN': return '🔴 Đang báo hỏng';
      case 'DISPOSED': return '⚪ Đã thanh lý';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'AVAILABLE': return 'bg-green-100 text-green-800 border border-green-200';
      case 'IN_USE': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'MAINTENANCE': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'BROKEN': return 'bg-red-100 text-red-800 border border-red-200';
      case 'DISPOSED': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
