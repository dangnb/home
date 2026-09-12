import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentRepairService } from '../../../core/hrm/services/equipment-repair.service';
import { EquipmentService } from '../../../core/hrm/services/equipment.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

import { EquipmentPartService } from '../../../core/hrm/services/equipment-part.service';

export interface EquipmentRepairItem {
  id: number;
  tenantId: number;
  code: string;
  equipmentId: number;
  equipmentCode: string;
  equipmentName: string;
  equipmentCategory: string;
  serialNumber?: string;
  reporterUserId: number;
  reporterUserName: string;
  reporterDepartmentName?: string;
  reportedDate: string;
  issueDescription: string;
  priority: string;
  technicianUserId?: number;
  technicianUserName?: string;
  assignedDate?: string;
  status: string;
  actualError?: string;
  solutionDetail?: string;
  replacedParts?: string;
  repairCost: number;
  startedAt?: string;
  completedAt?: string;
  note?: string;
  createdAt: string;
}

export interface ReplacedPartItem {
  name: string;
  serialNumber?: string;
  quantity: number;
  unitPrice: number;
}

export interface EquipmentRepairSummary {
  totalRepairs: number;
  pendingRepairs: number;
  inProgressRepairs: number;
  completedRepairs: number;
  totalRepairCost: number;
}

export interface EquipmentPartItem {
  id: number;
  tenantId: number;
  code: string;
  name: string;
  category: string;
  unit: string;
  stockQuantity: number;
  minStockQuantity: number;
  unitPrice: number;
  totalValue: number;
  specifications?: string;
  status: string;
  isLowStock: boolean;
  createdAt: string;
}

export interface EquipmentPartSummary {
  totalParts: number;
  totalStockQuantity: number;
  lowStockParts: number;
  totalStockValue: number;
}

@Component({
  selector: 'app-equipment-repairs-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './equipment-repairs-list.component.html',
  styleUrls: ['./equipment-repairs-list.component.scss']
})
export class EquipmentRepairsListComponent implements OnInit {
  private repairService = inject(EquipmentRepairService);
  private equipmentService = inject(EquipmentService);
  private employeeService = inject(EmployeeService);
  private partService = inject(EquipmentPartService);
  private toastService = inject(ToastService);

  activeTab = signal<'repairs' | 'parts'>('repairs');

  items = signal<EquipmentRepairItem[]>([]);
  summary = signal<EquipmentRepairSummary>({
    totalRepairs: 0,
    pendingRepairs: 0,
    inProgressRepairs: 0,
    completedRepairs: 0,
    totalRepairCost: 0
  });

  employees = signal<any[]>([]);
  equipments = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Filter params
  filterKeyword: string = '';
  filterStatus: string = 'ALL';
  filterPriority: string = 'ALL';
  filterTechnicianUserId: number | null = null;
  filterFromDate: string = '';
  filterToDate: string = '';
  isAdvancedFilterOpen = signal<boolean>(false);

  // Searchable Select State
  assignTechSearch = signal<string>('');
  isAssignTechDropdownOpen = signal<boolean>(false);

  createEquipmentSearch = signal<string>('');
  isCreateEquipmentDropdownOpen = signal<boolean>(false);

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  pageSizeOptions = [10, 20, 50, 100];

  // Modal 1: Create Repair Request
  isCreateModalOpen = false;
  isSubmittingCreate = false;
  createForm = {
    equipmentId: 0,
    issueDescription: '',
    priority: 'MEDIUM',
    note: ''
  };

  // Modal 2: Assign Technician
  isAssignModalOpen = false;
  isSubmittingAssign = false;
  selectedRepairForAssign: EquipmentRepairItem | null = null;
  selectedTechnicianUserId: number = 0;

  // Modal 3: Update Progress & Fix Result
  isProgressModalOpen = false;
  isSubmittingProgress = false;
  selectedRepairForProgress: EquipmentRepairItem | null = null;
  progressForm = {
    status: 'IN_PROGRESS', // IN_PROGRESS, COMPLETED, UNREPAIRABLE
    actualError: '',
    solutionDetail: '',
    replacedParts: '',
    repairCost: 0,
    note: ''
  };

  // Modal 4: View Detail Modal
  isViewModalOpen = false;
  selectedRepairDetail: EquipmentRepairItem | null = null;

  // --- Parts Inventory State & Methods ---
  parts = signal<EquipmentPartItem[]>([]);
  partsSummary = signal<EquipmentPartSummary>({
    totalParts: 0,
    totalStockQuantity: 0,
    lowStockParts: 0,
    totalStockValue: 0
  });
  isPartsLoading = signal<boolean>(false);
  catalogPartsLookup = signal<any[]>([]);

  // Filters for Parts Tab
  partFilterKeyword: string = '';
  partFilterCategory: string = 'ALL';
  partFilterLowStockOnly: boolean = false;
  partCurrentPage = 1;
  partPageSize = 20;
  partTotalCount = 0;
  partTotalPages = 1;

  // Modal Create/Edit Part
  isPartModalOpen = false;
  isSubmittingPart = false;
  editingPartId: number | null = null;
  partForm = {
    code: '',
    name: '',
    category: 'OTHER',
    unit: 'Cái',
    stockQuantity: 0,
    minStockQuantity: 2,
    unitPrice: 0,
    specifications: '',
    status: 'ACTIVE'
  };

  // Modal Adjust Stock
  isStockAdjustModalOpen = false;
  isSubmittingStockAdjust = false;
  selectedPartForStockAdjust: EquipmentPartItem | null = null;
  stockAdjustDelta: number = 0;

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownId.set(null);
    this.isAssignTechDropdownOpen.set(false);
    this.isCreateEquipmentDropdownOpen.set(false);
  }

  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.isAssignTechDropdownOpen.set(false);
    this.isCreateEquipmentDropdownOpen.set(false);
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
    this.loadEquipments();
    this.loadItems();
    this.loadCatalogPartsLookup();
    this.loadParts();
  }

  switchTab(tab: 'repairs' | 'parts') {
    this.activeTab.set(tab);
    if (tab === 'parts') {
      this.loadParts();
    } else {
      this.loadItems();
    }
  }

  loadCatalogPartsLookup() {
    this.partService.getLookup().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.catalogPartsLookup.set(res);
        }
      },
      error: () => {}
    });
  }

  loadParts() {
    this.isPartsLoading.set(true);
    this.partService.getParts({
      page: this.partCurrentPage,
      pageSize: this.partPageSize,
      keyword: this.partFilterKeyword.trim() || undefined,
      category: this.partFilterCategory !== 'ALL' ? this.partFilterCategory : undefined,
      lowStockOnly: this.partFilterLowStockOnly ? true : undefined
    }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.parts.set(res.data);
          if (res.summary) {
            this.partsSummary.set(res.summary);
          }
          if (res.pagination) {
            this.partTotalCount = res.pagination.totalCount;
            this.partTotalPages = res.pagination.totalPages;
          }
        } else {
          this.parts.set([]);
          this.partTotalCount = 0;
          this.partTotalPages = 1;
        }
        this.isPartsLoading.set(false);
      },
      error: () => {
        this.isPartsLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh mục kho linh kiện IT.');
      }
    });
  }

  onPartFilterChange() {
    this.partCurrentPage = 1;
    this.loadParts();
  }

  onPartPageSizeChange() {
    this.partCurrentPage = 1;
    this.loadParts();
  }

  resetPartFilters() {
    this.partFilterKeyword = '';
    this.partFilterCategory = 'ALL';
    this.partFilterLowStockOnly = false;
    this.onPartFilterChange();
  }

  // --- Handlers Modal Create / Edit Part ---
  openCreatePartModal() {
    this.editingPartId = null;
    const randomNum = Math.floor(Math.random() * 900) + 100;
    this.partForm = {
      code: `PART-IT-${randomNum}`,
      name: '',
      category: 'OTHER',
      unit: 'Cái',
      stockQuantity: 5,
      minStockQuantity: 2,
      unitPrice: 0,
      specifications: '',
      status: 'ACTIVE'
    };
    this.isPartModalOpen = true;
  }

  openEditPartModal(part: EquipmentPartItem) {
    this.editingPartId = part.id;
    this.partForm = {
      code: part.code,
      name: part.name,
      category: part.category,
      unit: part.unit,
      stockQuantity: part.stockQuantity,
      minStockQuantity: part.minStockQuantity,
      unitPrice: part.unitPrice,
      specifications: part.specifications || '',
      status: part.status
    };
    this.isPartModalOpen = true;
  }

  closePartModal() {
    this.isPartModalOpen = false;
    this.editingPartId = null;
  }

  submitPart() {
    if (!this.partForm.code.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập mã linh kiện.');
      return;
    }
    if (!this.partForm.name.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập tên linh kiện / vật tư.');
      return;
    }

    this.isSubmittingPart = true;
    if (this.editingPartId) {
      this.partService.updatePart(this.editingPartId, {
        name: this.partForm.name.trim(),
        category: this.partForm.category,
        unit: this.partForm.unit,
        stockQuantity: Number(this.partForm.stockQuantity) || 0,
        minStockQuantity: Number(this.partForm.minStockQuantity) || 0,
        unitPrice: Number(this.partForm.unitPrice) || 0,
        specifications: this.partForm.specifications.trim() || undefined,
        status: this.partForm.status
      }).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Cập nhật linh kiện IT thành công.');
          this.isSubmittingPart = false;
          this.closePartModal();
          this.loadParts();
          this.loadCatalogPartsLookup();
        },
        error: (err) => {
          this.isSubmittingPart = false;
          const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi cập nhật linh kiện.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else {
      this.partService.createPart({
        code: this.partForm.code.trim(),
        name: this.partForm.name.trim(),
        category: this.partForm.category,
        unit: this.partForm.unit,
        stockQuantity: Number(this.partForm.stockQuantity) || 0,
        minStockQuantity: Number(this.partForm.minStockQuantity) || 0,
        unitPrice: Number(this.partForm.unitPrice) || 0,
        specifications: this.partForm.specifications.trim() || undefined
      }).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Thêm mới linh kiện IT vào kho thành công.');
          this.isSubmittingPart = false;
          this.closePartModal();
          this.loadParts();
          this.loadCatalogPartsLookup();
        },
        error: (err) => {
          this.isSubmittingPart = false;
          const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi tạo linh kiện.';
          this.toastService.error('Lỗi', msg);
        }
      });
    }
  }

  // --- Handlers Modal Stock Adjust ---
  openStockAdjustModal(part: EquipmentPartItem) {
    this.selectedPartForStockAdjust = part;
    this.stockAdjustDelta = 1;
    this.isStockAdjustModalOpen = true;
  }

  closeStockAdjustModal() {
    this.isStockAdjustModalOpen = false;
    this.selectedPartForStockAdjust = null;
  }

  submitStockAdjust() {
    if (!this.selectedPartForStockAdjust) return;
    if (this.stockAdjustDelta === 0) {
      this.toastService.warning('Thông báo', 'Số lượng điều chỉnh phải khác 0.');
      return;
    }

    this.isSubmittingStockAdjust = true;
    this.partService.adjustStock(this.selectedPartForStockAdjust.id, this.stockAdjustDelta).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã điều chỉnh số lượng tồn kho linh kiện.');
        this.isSubmittingStockAdjust = false;
        this.closeStockAdjustModal();
        this.loadParts();
      },
      error: (err) => {
        this.isSubmittingStockAdjust = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi điều chỉnh kho.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  deletePart(part: EquipmentPartItem) {
    if (!confirm(`Bạn có chắc chắn muốn xóa linh kiện "${part.name}" (${part.code}) khỏi hệ thống?`)) return;

    this.partService.deletePart(part.id).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã xóa linh kiện khỏi kho.');
        this.loadParts();
        this.loadCatalogPartsLookup();
      },
      error: () => {
        this.toastService.error('Lỗi', 'Không thể xóa linh kiện.');
      }
    });
  }

  selectCatalogPartForRepair(index: number, catalogPart: any) {
    const list = [...this.replacedPartsList()];
    if (list[index]) {
      list[index].name = catalogPart.name;
      list[index].unitPrice = catalogPart.unitPrice || 0;
      if (!list[index].quantity) list[index].quantity = 1;
      this.replacedPartsList.set(list);
      this.recalculateTotalRepairCost();
    }
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

  loadEquipments() {
    this.equipmentService.getEquipments({ pageSize: 500 }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.equipments.set(res.data);
        }
      },
      error: () => {}
    });
  }

  loadItems() {
    this.isLoading.set(true);
    this.repairService.getRepairs({
      page: this.currentPage,
      pageSize: this.pageSize,
      keyword: this.filterKeyword.trim() || undefined,
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      priority: this.filterPriority !== 'ALL' ? this.filterPriority : undefined,
      technicianUserId: this.filterTechnicianUserId ? Number(this.filterTechnicianUserId) : undefined,
      fromDate: this.filterFromDate || undefined,
      toDate: this.filterToDate || undefined
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
        this.toastService.error('Lỗi', 'Không thể tải danh sách phiếu báo hỏng IT.');
      }
    });
  }

  toggleAdvancedFilter() {
    this.isAdvancedFilterOpen.update(v => !v);
  }

  get activeAdvancedFilterCount(): number {
    let count = 0;
    if (this.filterStatus !== 'ALL') count++;
    if (this.filterPriority !== 'ALL') count++;
    if (this.filterTechnicianUserId) count++;
    if (this.filterFromDate) count++;
    if (this.filterToDate) count++;
    return count;
  }

  clearSingleFilter(type: string) {
    if (type === 'keyword') this.filterKeyword = '';
    if (type === 'status') this.filterStatus = 'ALL';
    if (type === 'priority') this.filterPriority = 'ALL';
    if (type === 'technician') this.filterTechnicianUserId = null;
    if (type === 'fromDate') this.filterFromDate = '';
    if (type === 'toDate') this.filterToDate = '';
    this.onFilterChange();
  }

  resetFilters() {
    this.filterKeyword = '';
    this.filterStatus = 'ALL';
    this.filterPriority = 'ALL';
    this.filterTechnicianUserId = null;
    this.filterFromDate = '';
    this.filterToDate = '';
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

  // --- Handlers Searchable Selects ---
  toggleAssignTechDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isCreateEquipmentDropdownOpen.set(false);
    this.isAssignTechDropdownOpen.update(v => !v);
  }

  getFilteredTechnicians(): any[] {
    const query = this.assignTechSearch().trim().toLowerCase();
    const list = this.employees();
    if (!query) return list;
    return list.filter(emp => 
      (emp.fullName && emp.fullName.toLowerCase().includes(query)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(query)) ||
      (emp.departmentName && emp.departmentName.toLowerCase().includes(query)) ||
      (emp.jobTitle && emp.jobTitle.toLowerCase().includes(query))
    );
  }

  selectTechnician(emp: any) {
    this.selectedTechnicianUserId = emp.userId || emp.id;
    this.isAssignTechDropdownOpen.set(false);
    this.assignTechSearch.set('');
  }

  getSelectedTechnician(): any {
    if (!this.selectedTechnicianUserId) return null;
    const targetId = Number(this.selectedTechnicianUserId);
    return this.employees().find(e => (e.userId === targetId || e.id === targetId));
  }

  toggleCreateEquipmentDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isAssignTechDropdownOpen.set(false);
    this.isCreateEquipmentDropdownOpen.update(v => !v);
  }

  getFilteredCreateEquipments(): any[] {
    const query = this.createEquipmentSearch().trim().toLowerCase();
    const list = this.equipments();
    if (!query) return list;
    return list.filter(eq => 
      (eq.code && eq.code.toLowerCase().includes(query)) ||
      (eq.name && eq.name.toLowerCase().includes(query)) ||
      (eq.serialNumber && eq.serialNumber.toLowerCase().includes(query))
    );
  }

  selectCreateEquipment(eq: any) {
    this.createForm.equipmentId = eq.id;
    this.isCreateEquipmentDropdownOpen.set(false);
    this.createEquipmentSearch.set('');
  }

  getSelectedCreateEquipment(): any {
    if (!this.createForm.equipmentId) return null;
    return this.equipments().find(e => e.id === this.createForm.equipmentId);
  }

  // --- Handlers Modal Create ---
  openCreateModal() {
    this.createForm = {
      equipmentId: this.equipments().length > 0 ? this.equipments()[0].id : 0,
      issueDescription: '',
      priority: 'MEDIUM',
      note: ''
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  submitCreate() {
    if (!this.createForm.equipmentId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn trang thiết bị báo hỏng.');
      return;
    }
    if (!this.createForm.issueDescription.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập mô tả chi tiết sự cố.');
      return;
    }

    this.isSubmittingCreate = true;
    this.repairService.createRepair({
      equipmentId: this.createForm.equipmentId,
      issueDescription: this.createForm.issueDescription.trim(),
      priority: this.createForm.priority,
      note: this.createForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã ghi nhận phiếu báo hỏng thiết bị IT mới.');
        this.isSubmittingCreate = false;
        this.closeCreateModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingCreate = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi tạo phiếu báo hỏng.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal Assign Technician ---
  openAssignModal(item: EquipmentRepairItem) {
    this.selectedRepairForAssign = item;
    this.selectedTechnicianUserId = item.technicianUserId || (this.employees().length > 0 ? (this.employees()[0].userId || this.employees()[0].id) : 0);
    this.isAssignModalOpen = true;
  }

  closeAssignModal() {
    this.isAssignModalOpen = false;
    this.selectedRepairForAssign = null;
  }

  submitAssign() {
    if (!this.selectedRepairForAssign) return;
    if (!this.selectedTechnicianUserId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn kỹ thuật viên IT tiếp nhận.');
      return;
    }

    this.isSubmittingAssign = true;
    this.repairService.assignTechnician(this.selectedRepairForAssign.id, this.selectedTechnicianUserId).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã phân công nhân viên IT tiếp nhận sửa chữa.');
        this.isSubmittingAssign = false;
        this.closeAssignModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingAssign = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi phân công kỹ thuật viên.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // Multi-part replacement parts state
  replacedPartsList = signal<ReplacedPartItem[]>([]);

  addReplacedPart() {
    this.replacedPartsList.update(list => [
      ...list,
      { name: '', serialNumber: '', quantity: 1, unitPrice: 0 }
    ]);
  }

  removeReplacedPart(index: number) {
    this.replacedPartsList.update(list => list.filter((_, i) => i !== index));
    this.recalculateTotalRepairCost();
  }

  recalculateTotalRepairCost() {
    const total = this.replacedPartsList().reduce((sum, p) => {
      const q = Number(p.quantity) || 0;
      const u = Number(p.unitPrice) || 0;
      return sum + (q * u);
    }, 0);
    this.progressForm.repairCost = total;
  }

  parseReplacedParts(partsStr?: string): ReplacedPartItem[] {
    if (!partsStr) return [];
    try {
      const parsed = JSON.parse(partsStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          name: item.name || '',
          serialNumber: item.serialNumber || '',
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0
        }));
      }
    } catch {
      if (partsStr.trim()) {
        return [{ name: partsStr.trim(), quantity: 1, unitPrice: 0 }];
      }
    }
    return [];
  }

  // --- Handlers Modal Update Progress ---
  openProgressModal(item: EquipmentRepairItem) {
    this.selectedRepairForProgress = item;
    const parts = this.parseReplacedParts(item.replacedParts);
    if (parts.length === 0) {
      parts.push({ name: '', serialNumber: '', quantity: 1, unitPrice: 0 });
    }
    this.replacedPartsList.set(parts);

    this.progressForm = {
      status: item.status === 'PENDING' ? 'IN_PROGRESS' : item.status,
      actualError: item.actualError || '',
      solutionDetail: item.solutionDetail || '',
      replacedParts: item.replacedParts || '',
      repairCost: item.repairCost || 0,
      note: item.note || ''
    };
    this.recalculateTotalRepairCost();
    this.isProgressModalOpen = true;
  }

  closeProgressModal() {
    this.isProgressModalOpen = false;
    this.selectedRepairForProgress = null;
  }

  submitProgress() {
    if (!this.selectedRepairForProgress) return;

    const validParts = this.replacedPartsList().filter(p => p.name && p.name.trim().length > 0);
    const replacedPartsJson = validParts.length > 0 ? JSON.stringify(validParts) : undefined;
    const calculatedCost = validParts.reduce((sum, p) => sum + ((Number(p.quantity) || 0) * (Number(p.unitPrice) || 0)), 0);
    const finalCost = calculatedCost > 0 ? calculatedCost : (Number(this.progressForm.repairCost) || 0);

    this.isSubmittingProgress = true;
    this.repairService.updateProgress(this.selectedRepairForProgress.id, {
      status: this.progressForm.status,
      actualError: this.progressForm.actualError.trim() || undefined,
      solutionDetail: this.progressForm.solutionDetail.trim() || undefined,
      replacedParts: replacedPartsJson,
      repairCost: finalCost,
      note: this.progressForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã cập nhật tiến độ & danh sách linh kiện sửa chữa.');
        this.isSubmittingProgress = false;
        this.closeProgressModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingProgress = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi cập nhật tiến độ.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal View Detail ---
  openViewModal(item: EquipmentRepairItem) {
    this.selectedRepairDetail = item;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedRepairDetail = null;
  }

  // Helpers UI Labels & Badges
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'URGENT': return '🔴 Khẩn cấp (Sửa ngay)';
      case 'HIGH': return '🟠 Cao';
      case 'MEDIUM': return '🟡 Trung bình';
      case 'LOW': return '🟢 Thấp';
      default: return priority;
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'URGENT': return 'badge-danger fw-bold border border-danger shadow-xs';
      case 'HIGH': return 'badge-light-warning text-warning fw-bold';
      case 'MEDIUM': return 'badge-light-info text-info fw-bold';
      case 'LOW': return 'badge-light-success text-success';
      default: return 'badge-light-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return '⏳ Chờ phân công IT';
      case 'IN_PROGRESS': return '🔧 Đang kiểm tra / Sửa';
      case 'COMPLETED': return '✅ Đã hoàn thành sửa';
      case 'UNREPAIRABLE': return '❌ Không thể sửa (Thanh lý)';
      case 'CANCELLED': return '⚪ Đã hủy';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-light-warning text-warning fw-bold';
      case 'IN_PROGRESS': return 'badge-light-primary text-primary fw-bold';
      case 'COMPLETED': return 'badge-light-success text-success fw-bold';
      case 'UNREPAIRABLE': return 'badge-light-danger text-danger fw-bold border border-danger border-dashed';
      case 'CANCELLED': return 'badge-light-dark text-dark';
      default: return 'badge-light-secondary';
    }
  }
}
