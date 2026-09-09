import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../core/hrm/services/department.service';
import { ToastService } from '../../../core/services/toast.service';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../../../core/hrm/models/hrm.models';

export interface DepartmentTreeNode extends Department {
  level: number;
  hasChildren: boolean;
  childCount: number;
  isExpanded: boolean;
  children?: DepartmentTreeNode[];
}

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments-list.component.html'
})
export class DepartmentsListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);

  departments = signal<Department[]>([]);
  filteredDepartments = signal<DepartmentTreeNode[]>([]);
  isLoading = signal<boolean>(false);
  searchTerm = '';
  statusFilter: string = '';
  viewMode = signal<'tree' | 'flat'>('tree');
  expandedNodeIds = new Set<string | number>();

  // Action Menu Dropdown State
  activeActionMenuId: string | number | null = null;

  @HostListener('document:click')
  onDocumentClick() {
    this.activeActionMenuId = null;
  }

  toggleActionMenu(id: string | number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.activeActionMenuId = this.activeActionMenuId === id ? null : id;
  }

  // Modal state
  isModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  currentDepartmentId: number | string | null = null;

  // Form Model
  formData = {
    code: '',
    name: '',
    description: '',
    parentId: '' as string | number,
    status: 'ACTIVE'
  };

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading.set(true);
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        if (res.data) {
          this.departments.set(res.data);
          
          // Mặc định mở rộng tất cả các node có phòng ban con
          const parentIdsWithChildren = new Set(res.data.map(d => d.parentId).filter(Boolean));
          res.data.forEach(d => {
            if (parentIdsWithChildren.has(d.id)) {
              this.expandedNodeIds.add(d.id);
            }
          });

          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Lỗi', 'Không thể tải danh sách phòng ban từ máy chủ.');
      }
    });
  }

  availableParentDepartments(): Department[] {
    return this.departments().filter(d => !this.currentDepartmentId || d.id !== this.currentDepartmentId);
  }

  setViewMode(mode: 'tree' | 'flat') {
    this.viewMode.set(mode);
    this.applyFilter();
  }

  toggleNode(dept: DepartmentTreeNode, event?: Event) {
    if (event) event.stopPropagation();
    if (this.expandedNodeIds.has(dept.id)) {
      this.expandedNodeIds.delete(dept.id);
    } else {
      this.expandedNodeIds.add(dept.id);
    }
    this.applyFilter();
  }

  expandAll() {
    this.departments().forEach(d => this.expandedNodeIds.add(d.id));
    this.applyFilter();
  }

  collapseAll() {
    this.expandedNodeIds.clear();
    this.applyFilter();
  }

  private matchesFilter(d: Department, term: string, status: string): boolean {
    if (status && d.status !== status) {
      return false;
    }
    if (term) {
      const t = term.toLowerCase();
      return !!(
        d.name?.toLowerCase().includes(t) ||
        d.code?.toLowerCase().includes(t) ||
        (d.parentName && d.parentName.toLowerCase().includes(t)) ||
        (d.managerName && d.managerName.toLowerCase().includes(t)) ||
        (d.description && d.description.toLowerCase().includes(t))
      );
    }
    return true;
  }

  private buildTree(items: Department[], parentId: string | number | null = null, level = 0): DepartmentTreeNode[] {
    const children = items.filter(d => {
      if (parentId === null) {
        return !d.parentId || !items.some(parent => parent.id === d.parentId);
      }
      return d.parentId === parentId;
    });

    return children.map(dept => {
      const deptChildren = this.buildTree(items, dept.id, level + 1);
      return {
        ...dept,
        level,
        hasChildren: deptChildren.length > 0,
        childCount: deptChildren.length,
        isExpanded: this.expandedNodeIds.has(dept.id),
        children: deptChildren
      };
    });
  }

  private filterTreeNodes(nodes: DepartmentTreeNode[], term: string, status: string): DepartmentTreeNode[] {
    const result: DepartmentTreeNode[] = [];
    for (const node of nodes) {
      const matchesSelf = this.matchesFilter(node, term, status);
      const filteredChildren = node.children ? this.filterTreeNodes(node.children, term, status) : [];

      if (matchesSelf || filteredChildren.length > 0) {
        const isSearchActive = !!term || !!status;
        const newNode: DepartmentTreeNode = {
          ...node,
          children: filteredChildren,
          hasChildren: filteredChildren.length > 0,
          childCount: filteredChildren.length,
          // Nếu đang tìm kiếm và có con match, tự động mở rộng node để nhìn thấy cây
          isExpanded: isSearchActive && filteredChildren.length > 0 ? true : this.expandedNodeIds.has(node.id)
        };
        result.push(newNode);
      }
    }
    return result;
  }

  private flattenTree(nodes: DepartmentTreeNode[], result: DepartmentTreeNode[] = []): DepartmentTreeNode[] {
    for (const node of nodes) {
      result.push(node);
      if (node.isExpanded && node.children && node.children.length > 0) {
        this.flattenTree(node.children, result);
      }
    }
    return result;
  }

  applyFilter() {
    const rawList = this.departments();
    const term = this.searchTerm.trim();
    const status = this.statusFilter;

    if (this.viewMode() === 'flat') {
      let list = rawList.filter(d => this.matchesFilter(d, term, status));
      this.filteredDepartments.set(list.map(d => ({
        ...d,
        level: 0,
        hasChildren: false,
        childCount: 0,
        isExpanded: false
      })));
    } else {
      // Tree Mode
      const tree = this.buildTree(rawList);
      const filteredTree = (term || status) ? this.filterTreeNodes(tree, term, status) : tree;
      const flatVisible = this.flattenTree(filteredTree);
      this.filteredDepartments.set(flatVisible);
    }
  }

  isDeptActive(status?: string): boolean {
    return status === 'ACTIVE' || status === '1';
  }

  openCreateChildModal(parentDept: Department, event?: Event) {
    if (event) event.stopPropagation();
    this.openCreateModal();
    this.formData.parentId = parentDept.id;
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentDepartmentId = null;
    this.formData = {
      code: '',
      name: '',
      description: '',
      parentId: '',
      status: 'ACTIVE'
    };
    this.isModalOpen = true;
  }

  openEditModal(dept: Department) {
    this.isEditMode = true;
    this.currentDepartmentId = dept.id;
    this.formData = {
      code: dept.code,
      name: dept.name,
      description: dept.description || '',
      parentId: dept.parentId ? String(dept.parentId) : '',
      status: dept.status || 'ACTIVE'
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveDepartment() {
    if (!this.formData.name.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập tên phòng ban.');
      return;
    }

    if (!this.formData.code.trim()) {
      this.toastService.warning('Thiếu thông tin', 'Vui lòng nhập mã phòng ban.');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.currentDepartmentId) {
      const dto: UpdateDepartmentDto = {
        id: this.currentDepartmentId,
        code: this.formData.code.trim().toUpperCase(),
        name: this.formData.name.trim(),
        description: this.formData.description?.trim() || undefined,
        parentId: this.formData.parentId ? Number(this.formData.parentId) : undefined,
        status: this.formData.status
      };

      this.departmentService.updateDepartment(this.currentDepartmentId, dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', 'Đã cập nhật thông tin phòng ban thành công.');
          this.isSubmitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể cập nhật phòng ban.';
          this.toastService.error('Thất bại', msg);
        }
      });
    } else {
      const dto: CreateDepartmentDto = {
        code: this.formData.code.toUpperCase().trim(),
        name: this.formData.name.trim(),
        description: this.formData.description?.trim() || undefined,
        parentId: this.formData.parentId ? Number(this.formData.parentId) : undefined
      };

      this.departmentService.createDepartment(dto).subscribe({
        next: () => {
          this.toastService.success('Thành công', `Đã thêm phòng ban "${dto.name}" (${dto.code}) thành công.`);
          this.isSubmitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg = err.error?.message || err.error?.detail || 'Không thể tạo mới phòng ban.';
          this.toastService.error('Thất bại', msg);
        }
      });
    }
  }

  // Delete Modal State
  isDeleteModalOpen = false;
  departmentToDelete: Department | null = null;
  isDeleting = false;

  openDeleteModal(dept: Department) {
    this.departmentToDelete = dept;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.departmentToDelete = null;
  }

  confirmDelete() {
    if (!this.departmentToDelete) return;
    this.isDeleting = true;
    const dept = this.departmentToDelete;

    this.departmentService.deleteDepartment(dept.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa', `Đã xóa phòng ban "${dept.name}" thành công.`);
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadDepartments();
      },
      error: (err) => {
        this.isDeleting = false;
        const msg = err.error?.message || err.error?.detail || 'Không thể xóa phòng ban.';
        this.toastService.error('Thất bại', msg);
        this.closeDeleteModal();
      }
    });
  }
}
