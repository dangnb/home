import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../../../core/hrm/services/equipment.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { DepartmentService } from '../../../core/hrm/services/department.service';
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
  currentDepartmentId?: number;
  currentDepartmentName?: string;
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
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);

  items = signal<EquipmentItem[]>([]);
  summary = signal<EquipmentSummary>({
    totalEquipments: 0,
    availableEquipments: 0,
    assignedEquipments: 0,
    brokenEquipments: 0
  });
  employees = signal<any[]>([]);
  departments = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  openDropdownId = signal<number | null>(null);

  // Selection for Bulk Actions
  selectedIds = signal<number[]>([]);

  // Filter params
  filterKeyword: string = '';
  filterCategory: string = 'ALL';
  filterStatus: string = 'ALL';
  filterDepartmentId: number | null = null;
  filterUserId: number | null = null;
  filterAssignedFromDate: string = '';
  filterAssignedToDate: string = '';
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

  // Modal Edit Equipment
  isEditModalOpen = false;
  isSubmittingEdit = false;
  selectedEquipmentForEdit: EquipmentItem | null = null;
  editForm = {
    code: '',
    name: '',
    category: 'LAPTOP',
    serialNumber: '',
    specifications: '',
    purchaseDate: '',
    warrantyEndDate: '',
    note: ''
  };

  // Modal Handover (Bàn Giao đơn lẻ & hàng loạt)
  isHandoverModalOpen = false;
  isBulkHandover = false;
  isSubmittingHandover = false;
  selectedEquipmentForHandover: EquipmentItem | null = null;
  handoverTargetType: 'EMPLOYEE' | 'DEPARTMENT' = 'EMPLOYEE';
  handoverForm = {
    targetUserId: 0,
    targetDepartmentId: 0,
    conditionStatus: 'Mới 100% / Đang hoạt động tốt',
    note: ''
  };

  // Modal Revoke (Thu Hồi đơn lẻ & hàng loạt)
  isRevokeModalOpen = false;
  isBulkRevoke = false;
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

  // Searchable Employee Select State
  handoverEmployeeSearch = signal<string>('');
  filterEmployeeSearch = signal<string>('');
  isHandoverEmployeeDropdownOpen = signal<boolean>(false);
  isFilterEmployeeDropdownOpen = signal<boolean>(false);

  @HostListener('document:click')
  onDocumentClick() {
    this.openDropdownId.set(null);
    this.isHandoverEmployeeDropdownOpen.set(false);
    this.isFilterEmployeeDropdownOpen.set(false);
  }

  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.isHandoverEmployeeDropdownOpen.set(false);
    this.isFilterEmployeeDropdownOpen.set(false);
    if (this.openDropdownId() === id) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(id);
    }
  }

  closeDropdown() {
    this.openDropdownId.set(null);
  }

  toggleHandoverEmployeeDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.openDropdownId.set(null);
    this.isFilterEmployeeDropdownOpen.set(false);
    this.isHandoverEmployeeDropdownOpen.update(v => !v);
  }

  toggleFilterEmployeeDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.openDropdownId.set(null);
    this.isHandoverEmployeeDropdownOpen.set(false);
    this.isFilterEmployeeDropdownOpen.update(v => !v);
  }

  getFilteredEmployeesForHandover(): any[] {
    const query = this.handoverEmployeeSearch().trim().toLowerCase();
    const list = this.employees();
    if (!query) return list;
    return list.filter(emp => 
      (emp.fullName && emp.fullName.toLowerCase().includes(query)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(query)) ||
      (emp.departmentName && emp.departmentName.toLowerCase().includes(query)) ||
      (emp.jobTitle && emp.jobTitle.toLowerCase().includes(query))
    );
  }

  getFilteredEmployeesForFilter(): any[] {
    const query = this.filterEmployeeSearch().trim().toLowerCase();
    const list = this.employees();
    if (!query) return list;
    return list.filter(emp => 
      (emp.fullName && emp.fullName.toLowerCase().includes(query)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(query)) ||
      (emp.departmentName && emp.departmentName.toLowerCase().includes(query)) ||
      (emp.jobTitle && emp.jobTitle.toLowerCase().includes(query))
    );
  }

  selectHandoverEmployee(emp: any) {
    this.handoverForm.targetUserId = emp.userId || emp.id;
    this.isHandoverEmployeeDropdownOpen.set(false);
    this.handoverEmployeeSearch.set('');
  }

  getSelectedHandoverEmployee(): any {
    const targetId = Number(this.handoverForm.targetUserId);
    if (!targetId) return null;
    return this.employees().find(e => (e.userId === targetId || e.id === targetId));
  }

  selectFilterEmployee(empId: number | null) {
    this.filterUserId = empId;
    this.isFilterEmployeeDropdownOpen.set(false);
    this.filterEmployeeSearch.set('');
    this.onFilterChange();
  }

  getSelectedFilterEmployee(): any {
    if (!this.filterUserId) return null;
    const targetId = Number(this.filterUserId);
    return this.employees().find(e => (e.userId === targetId || e.id === targetId));
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadDepartments();
    this.loadItems();
  }

  // --- Selection Logic ---
  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  toggleSelectItem(id: number) {
    this.selectedIds.update(ids => {
      if (ids.includes(id)) {
        return ids.filter(i => i !== id);
      } else {
        return [...ids, id];
      }
    });
  }

  isAllSelected(): boolean {
    const list = this.items();
    if (list.length === 0) return false;
    return list.every(item => this.selectedIds().includes(item.id));
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedIds.set([]);
    } else {
      this.selectedIds.set(this.items().map(i => i.id));
    }
  }

  clearSelection() {
    this.selectedIds.set([]);
  }

  getSelectedEquipments(): EquipmentItem[] {
    return this.items().filter(i => this.selectedIds().includes(i.id));
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

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.departments.set(res.data);
        } else if (Array.isArray(res)) {
          this.departments.set(res);
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
      status: this.filterStatus !== 'ALL' ? this.filterStatus : undefined,
      departmentId: this.filterDepartmentId ? Number(this.filterDepartmentId) : undefined,
      currentUserId: this.filterUserId ? Number(this.filterUserId) : undefined,
      assignedFromDate: this.filterAssignedFromDate || undefined,
      assignedToDate: this.filterAssignedToDate || undefined
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
    if (this.filterDepartmentId) count++;
    if (this.filterUserId) count++;
    if (this.filterAssignedFromDate) count++;
    if (this.filterAssignedToDate) count++;
    return count;
  }

  clearSingleFilter(type: string) {
    if (type === 'category') this.filterCategory = 'ALL';
    if (type === 'status') this.filterStatus = 'ALL';
    if (type === 'keyword') this.filterKeyword = '';
    if (type === 'department') this.filterDepartmentId = null;
    if (type === 'user') this.filterUserId = null;
    if (type === 'assignedFromDate') this.filterAssignedFromDate = '';
    if (type === 'assignedToDate') this.filterAssignedToDate = '';
    this.onFilterChange();
  }

  resetFilters() {
    this.filterKeyword = '';
    this.filterCategory = 'ALL';
    this.filterStatus = 'ALL';
    this.filterDepartmentId = null;
    this.filterUserId = null;
    this.filterAssignedFromDate = '';
    this.filterAssignedToDate = '';
    this.onFilterChange();
  }

  getDepartmentName(id: number | null): string {
    if (!id) return '';
    const dept = this.departments().find(d => d.id === Number(id));
    return dept ? dept.name : `ID: ${id}`;
  }

  getUserName(id: number | null): string {
    if (!id) return '';
    const emp = this.employees().find(e => (e.userId === Number(id) || e.id === Number(id)));
    return emp ? emp.fullName : `ID: ${id}`;
  }

  onFilterChange() {
    this.currentPage = 1;
    this.clearSelection();
    this.loadItems();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.clearSelection();
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

  // --- Handlers Modal Edit ---
  openEditModal(item: EquipmentItem) {
    this.selectedEquipmentForEdit = item;
    this.editForm = {
      code: item.code || '',
      name: item.name || '',
      category: item.category || 'LAPTOP',
      serialNumber: item.serialNumber || '',
      specifications: item.specifications || '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      warrantyEndDate: item.warrantyEndDate ? item.warrantyEndDate.split('T')[0] : '',
      note: item.note || ''
    };
    this.isEditModalOpen = true;
    this.closeDropdown();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedEquipmentForEdit = null;
  }

  submitEdit() {
    if (!this.selectedEquipmentForEdit) return;
    if (!this.editForm.code.trim() || !this.editForm.name.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập Mã và Tên trang thiết bị.');
      return;
    }

    this.isSubmittingEdit = true;
    this.equipmentService.updateEquipment(this.selectedEquipmentForEdit.id, {
      code: this.editForm.code.trim(),
      name: this.editForm.name.trim(),
      category: this.editForm.category,
      serialNumber: this.editForm.serialNumber.trim() || undefined,
      specifications: this.editForm.specifications.trim() || undefined,
      purchaseDate: this.editForm.purchaseDate || undefined,
      warrantyEndDate: this.editForm.warrantyEndDate || undefined,
      note: this.editForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã cập nhật thông tin trang thiết bị thành công.');
        this.isSubmittingEdit = false;
        this.closeEditModal();
        this.loadItems();
      },
      error: (err) => {
        this.isSubmittingEdit = false;
        const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi cập nhật thiết bị.';
        this.toastService.error('Lỗi', msg);
      }
    });
  }

  // --- Handlers Modal Handover (Single & Bulk) ---
  openHandoverModal(item?: EquipmentItem) {
    this.handoverTargetType = 'EMPLOYEE';
    const defaultUserId = this.employees().length > 0 ? (this.employees()[0].userId || this.employees()[0].id) : 0;
    const defaultDeptId = this.departments().length > 0 ? this.departments()[0].id : 0;

    this.handoverForm = {
      targetUserId: defaultUserId,
      targetDepartmentId: defaultDeptId,
      conditionStatus: 'Mới 100% / Đang hoạt động tốt',
      note: ''
    };

    if (item) {
      this.isBulkHandover = false;
      this.selectedEquipmentForHandover = item;
    } else {
      this.isBulkHandover = true;
      this.selectedEquipmentForHandover = null;
    }

    this.isHandoverModalOpen = true;
  }

  closeHandoverModal() {
    this.isHandoverModalOpen = false;
    this.isBulkHandover = false;
    this.selectedEquipmentForHandover = null;
  }

  submitHandover() {
    if (this.handoverTargetType === 'EMPLOYEE' && !this.handoverForm.targetUserId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn nhân sự nhận bàn giao.');
      return;
    }

    if (this.handoverTargetType === 'DEPARTMENT' && !this.handoverForm.targetDepartmentId) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng chọn phòng ban nhận bàn giao.');
      return;
    }

    this.isSubmittingHandover = true;

    if (this.isBulkHandover) {
      // Bulk Handover
      this.equipmentService.bulkHandoverEquipments({
        equipmentIds: this.selectedIds(),
        targetType: this.handoverTargetType,
        targetUserId: this.handoverTargetType === 'EMPLOYEE' ? Number(this.handoverForm.targetUserId) : undefined,
        targetDepartmentId: this.handoverTargetType === 'DEPARTMENT' ? Number(this.handoverForm.targetDepartmentId) : undefined,
        conditionStatus: this.handoverForm.conditionStatus.trim(),
        note: this.handoverForm.note.trim() || undefined
      }).subscribe({
        next: (res: any) => {
          this.toastService.success('Thành công', res.message || 'Đã bàn giao hàng loạt thiết bị.');
          this.isSubmittingHandover = false;
          this.closeHandoverModal();
          this.clearSelection();
          this.loadItems();
        },
        error: (err) => {
          this.isSubmittingHandover = false;
          const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi bàn giao hàng loạt.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else {
      // Single Handover
      if (!this.selectedEquipmentForHandover) return;
      this.equipmentService.handoverEquipment(this.selectedEquipmentForHandover.id, {
        targetType: this.handoverTargetType,
        targetUserId: this.handoverTargetType === 'EMPLOYEE' ? Number(this.handoverForm.targetUserId) : undefined,
        targetDepartmentId: this.handoverTargetType === 'DEPARTMENT' ? Number(this.handoverForm.targetDepartmentId) : undefined,
        conditionStatus: this.handoverForm.conditionStatus.trim(),
        note: this.handoverForm.note.trim() || undefined
      }).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã bàn giao trang thiết bị thành công.');
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
  }

  // --- Handlers Modal Revoke (Single & Bulk) ---
  openRevokeModal(item?: EquipmentItem) {
    this.revokeForm = {
      conditionStatus: 'Hoạt động bình thường',
      note: ''
    };

    if (item) {
      this.isBulkRevoke = false;
      this.selectedEquipmentForRevoke = item;
    } else {
      this.isBulkRevoke = true;
      this.selectedEquipmentForRevoke = null;
    }

    this.isRevokeModalOpen = true;
  }

  closeRevokeModal() {
    this.isRevokeModalOpen = false;
    this.isBulkRevoke = false;
    this.selectedEquipmentForRevoke = null;
  }

  submitRevoke() {
    this.isSubmittingRevoke = true;

    if (this.isBulkRevoke) {
      // Bulk Revoke
      this.equipmentService.bulkRevokeEquipments({
        equipmentIds: this.selectedIds(),
        conditionStatus: this.revokeForm.conditionStatus.trim(),
        note: this.revokeForm.note.trim() || undefined
      }).subscribe({
        next: (res: any) => {
          this.toastService.success('Thành công', res.message || 'Đã thu hồi hàng loạt thiết bị về kho.');
          this.isSubmittingRevoke = false;
          this.closeRevokeModal();
          this.clearSelection();
          this.loadItems();
        },
        error: (err) => {
          this.isSubmittingRevoke = false;
          const msg = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi thu hồi hàng loạt.';
          this.toastService.error('Lỗi', msg);
        }
      });
    } else {
      // Single Revoke
      if (!this.selectedEquipmentForRevoke) return;
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
