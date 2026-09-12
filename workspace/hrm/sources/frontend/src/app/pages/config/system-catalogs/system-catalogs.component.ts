import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService, SystemCatalogDto, SystemCatalogType, CATALOG_TYPE_META } from '../../../core/services/catalog.service';

interface CatalogTypeEntry {
  key: SystemCatalogType;
  meta: typeof CATALOG_TYPE_META[SystemCatalogType];
}

@Component({
  selector: 'app-system-catalogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-catalogs.component.html',
  styleUrls: []
})
export class SystemCatalogsComponent implements OnInit {
  private catalogService = inject(CatalogService);

  // ======================================================
  // State: Type navigation
  // ======================================================
  catalogTypeEntries: CatalogTypeEntry[] = Object.entries(CATALOG_TYPE_META).map(([key, meta]) => ({
    key: key as SystemCatalogType,
    meta
  }));

  selectedType: SystemCatalogType | null = null;

  get selectedMeta() {
    return this.selectedType ? CATALOG_TYPE_META[this.selectedType] : null;
  }

  // ======================================================
  // State: Data
  // ======================================================
  allGrouped: Record<string, SystemCatalogDto[]> = {};
  loading = false;

  get currentItems(): SystemCatalogDto[] {
    return this.selectedType ? (this.allGrouped[this.selectedType] ?? []) : [];
  }

  getCatalogCount(type: string): number {
    return this.allGrouped[type]?.length ?? 0;
  }

  // ======================================================
  // State: Modal
  // ======================================================
  showModal = false;
  isEditMode = false;
  submitting = false;
  errorMessage = '';
  editingItemId: number | null = null;

  form = {
    code: '',
    name: '',
    description: '',
    sortOrder: 0
  };

  // ======================================================
  // Lifecycle
  // ======================================================
  ngOnInit(): void {
    this.loadAllGrouped();
  }

  loadAllGrouped(): void {
    this.loading = true;
    this.catalogService.getAllGrouped().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allGrouped = res.data;
        }
        this.loading = false;
        // Auto-select first tab
        if (!this.selectedType && this.catalogTypeEntries.length > 0) {
          this.selectedType = this.catalogTypeEntries[0].key;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectType(type: SystemCatalogType): void {
    this.selectedType = type;
  }

  // ======================================================
  // Modal CRUD
  // ======================================================
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingItemId = null;
    this.form = { code: '', name: '', description: '', sortOrder: this.currentItems.length };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(item: SystemCatalogDto): void {
    this.isEditMode = true;
    this.editingItemId = item.id;
    this.form = {
      code: item.code,
      name: item.name,
      description: item.description ?? '',
      sortOrder: item.sortOrder
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingItemId = null;
    this.errorMessage = '';
  }

  submitForm(): void {
    if (!this.selectedType) return;
    this.submitting = true;
    this.errorMessage = '';

    const dto = {
      code: this.form.code.trim().toUpperCase(),
      name: this.form.name.trim(),
      description: this.form.description.trim() || undefined,
      sortOrder: this.form.sortOrder
    };

    const request$ = this.isEditMode && this.editingItemId
      ? this.catalogService.update(this.selectedType, this.editingItemId, dto)
      : this.catalogService.create(this.selectedType, dto);

    request$.subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success !== false) {
          this.closeModal();
          this.loadAllGrouped();
        } else {
          this.errorMessage = res.message || 'Có lỗi xảy ra.';
        }
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.detail || err?.error?.message || 'Có lỗi xảy ra khi lưu danh mục.';
      }
    });
  }

  toggleStatus(item: SystemCatalogDto): void {
    if (!this.selectedType) return;
    const activate = item.status !== 'ACTIVE';
    this.catalogService.toggleStatus(this.selectedType, item.id, activate).subscribe({
      next: () => this.loadAllGrouped(),
      error: (err) => alert(err?.error?.detail || 'Không thể thay đổi trạng thái.')
    });
  }

  confirmDelete(item: SystemCatalogDto): void {
    if (!this.selectedType) return;
    if (item.isSystemDefault) {
      alert('Không thể xóa danh mục hệ thống mặc định.');
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${item.name}"?\nThao tác này không thể hoàn tác.`)) return;

    this.catalogService.delete(this.selectedType, item.id).subscribe({
      next: () => this.loadAllGrouped(),
      error: (err) => alert(err?.error?.detail || 'Không thể xóa danh mục.')
    });
  }
}
