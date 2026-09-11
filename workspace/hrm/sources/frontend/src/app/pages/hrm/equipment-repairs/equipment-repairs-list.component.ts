import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentRepairService } from '../../../core/hrm/services/equipment-repair.service';
import { EquipmentService } from '../../../core/hrm/services/equipment.service';
import { EmployeeService } from '../../../core/hrm/services/employee.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

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

export interface EquipmentRepairSummary {
  totalRepairs: number;
  pendingRepairs: number;
  inProgressRepairs: number;
  completedRepairs: number;
  totalRepairCost: number;
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
  private toastService = inject(ToastService);

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
      technicianUserId: this.filterTechnicianUserId ? Number(this.filterTechnicianUserId) : undefined
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
    return count;
  }

  clearSingleFilter(type: string) {
    if (type === 'keyword') this.filterKeyword = '';
    if (type === 'status') this.filterStatus = 'ALL';
    if (type === 'priority') this.filterPriority = 'ALL';
    if (type === 'technician') this.filterTechnicianUserId = null;
    this.onFilterChange();
  }

  resetFilters() {
    this.filterKeyword = '';
    this.filterStatus = 'ALL';
    this.filterPriority = 'ALL';
    this.filterTechnicianUserId = null;
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

  // --- Handlers Modal Update Progress ---
  openProgressModal(item: EquipmentRepairItem) {
    this.selectedRepairForProgress = item;
    this.progressForm = {
      status: item.status === 'PENDING' ? 'IN_PROGRESS' : item.status,
      actualError: item.actualError || '',
      solutionDetail: item.solutionDetail || '',
      replacedParts: item.replacedParts || '',
      repairCost: item.repairCost || 0,
      note: item.note || ''
    };
    this.isProgressModalOpen = true;
  }

  closeProgressModal() {
    this.isProgressModalOpen = false;
    this.selectedRepairForProgress = null;
  }

  submitProgress() {
    if (!this.selectedRepairForProgress) return;

    this.isSubmittingProgress = true;
    this.repairService.updateProgress(this.selectedRepairForProgress.id, {
      status: this.progressForm.status,
      actualError: this.progressForm.actualError.trim() || undefined,
      solutionDetail: this.progressForm.solutionDetail.trim() || undefined,
      replacedParts: this.progressForm.replacedParts.trim() || undefined,
      repairCost: Number(this.progressForm.repairCost) || 0,
      note: this.progressForm.note.trim() || undefined
    }).subscribe({
      next: () => {
        this.toastService.success('Thành công', 'Đã cập nhật tiến độ & chi tiết khắc phục sự cố.');
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
