import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department, DepartmentService } from '../../services/department.service';
import { AlertService } from '../../services/alert.service';

export interface DepartmentNode extends Department {
    children: DepartmentNode[];
    level: number;
    expanded: boolean;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments = signal<Department[]>([]);
  departmentNodes = signal<DepartmentNode[]>([]);
  filteredDepartmentNodes = signal<DepartmentNode[]>([]);

  searchTerm = signal<string>('');

  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  
  showModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingDepartment: Partial<Department> = {};

  constructor(
    private departmentService: DepartmentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading.set(true);
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments.set(data);
        const nodes = this.buildTree(data);
        this.departmentNodes.set(nodes);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.error('Không thể tải danh sách phòng ban');
        this.isLoading.set(false);
      }
    });
  }

  onSearch() {
    this.applyFilter();
  }

  private applyFilter() {
    if (!this.searchTerm().trim()) {
      this.filteredDepartmentNodes.set(this.departmentNodes());
      return;
    }
    const term = this.searchTerm().toLowerCase().trim();
    const filtered = this.filterTreeNodes(this.departmentNodes(), term);
    this.filteredDepartmentNodes.set(filtered);
  }

  private filterTreeNodes(nodes: DepartmentNode[], term: string): DepartmentNode[] {
    return nodes.map(node => {
      const matches = node.name.toLowerCase().includes(term) || (node.description?.toLowerCase().includes(term) ?? false) || (node.id?.includes(term) ?? false);
      const filteredChildren = this.filterTreeNodes(node.children, term);

      if (matches || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren, expanded: true }; // Tự động mở rộng nếu tìm thấy con
      }
      return null;
    }).filter(n => n !== null) as DepartmentNode[];
  }

  private buildTree(departments: Department[], parentId?: string, level: number = 0): DepartmentNode[] {
    return departments
      .filter(d => (d.parentId || null) === (parentId || null))
      .map(d => ({
        ...d,
        level: level,
        expanded: true,
        children: this.buildTree(departments, d.id, level + 1)
      }));
  }

  toggleExpand(node: DepartmentNode) {
    node.expanded = !node.expanded;
  }

  openAddModal(parentId?: string) {
    this.isEditMode.set(false);
    this.editingDepartment = { name: '', description: '', parentId: parentId || null as any };
    this.showModal.set(true);
  }

  openEditModal(item: Department) {
    this.isEditMode.set(true);
    this.editingDepartment = { ...item };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveDepartment() {
    if (!this.editingDepartment.name) return;

    this.isSubmitting.set(true);
    if (this.isEditMode()) {
      this.departmentService.update(this.editingDepartment.id!, this.editingDepartment as Department).subscribe({
        next: () => {
          this.alertService.success('Cập nhật thành công');
          this.loadDepartments();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi cập nhật');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.departmentService.create(this.editingDepartment as Department).subscribe({
        next: () => {
          this.alertService.success('Thêm mới thành công');
          this.loadDepartments();
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.alertService.error('Có lỗi xảy ra khi thêm mới');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deleteDepartment(id: string) {
    this.alertService.confirm(
      'Bạn có chắc muốn xóa?',
      'Phòng ban này sẽ bị xóa khỏi hệ thống'
    ).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.delete(id).subscribe({
          next: () => {
            this.alertService.success('Xóa thành công');
            this.loadDepartments();
          },
          error: () => {
            this.alertService.error('Không thể xóa phòng ban này');
          }
        });
      }
    });
  }
}
