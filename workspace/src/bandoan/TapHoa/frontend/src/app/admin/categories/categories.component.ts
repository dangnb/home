import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

export interface CategoryNode extends Category {
    children: CategoryNode[];
    level: number;
    expanded: boolean;
}

@Component({
    selector: 'app-categories',
    imports: [CommonModule, FormsModule, ModalComponent, TranslatePipe],
    templateUrl: './categories.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    categoryNodes: CategoryNode[] = [];
    filteredCategoryNodes: CategoryNode[] = [];

    searchTerm: string = '';

    showModal = false;
    isEditMode = false;
    isSubmitting = false;
    editingCategory: Category = this.getEmptyCategory();

    presetIcons: string[] = ['📁', '📦', '🏷️', '🍎', '🥦', '🥛', '🥩', '🥤', '🧼', '💊', '⚡', '🎒', '🏠', '🛒', '🎮', '📱'];

    private categoryService = inject(CategoryService);
    private alertService = inject(AlertService);
    private translate = inject(TranslateService);
    private cdr = inject(ChangeDetectorRef);

    constructor() { }

    selectPresetIcon(icon: string) {
        this.editingCategory.icon = icon;
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
                this.categoryNodes = this.buildTree(data);
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.LOAD_ERROR'));
                this.cdr.detectChanges();
            }
        });
    }

    onSearch() {
        this.applyFilter();
    }

    private applyFilter() {
        if (!this.searchTerm.trim()) {
            this.filteredCategoryNodes = this.categoryNodes;
            this.cdr.detectChanges();
            return;
        }
        const term = this.searchTerm.toLowerCase().trim();
        this.filteredCategoryNodes = this.filterTreeNodes(this.categoryNodes, term);
        this.cdr.detectChanges();
    }

    private filterTreeNodes(nodes: CategoryNode[], term: string): CategoryNode[] {
        return nodes.map(node => {
            const matches = node.name.toLowerCase().includes(term) || (node.description?.toLowerCase().includes(term) ?? false) || node.id.includes(term);
            const filteredChildren = this.filterTreeNodes(node.children, term);

            if (matches || filteredChildren.length > 0) {
                return { ...node, children: filteredChildren, expanded: true }; // Tự động mở rộng nếu tìm thấy con
            }
            return null;
        }).filter(n => n !== null) as CategoryNode[];
    }

    private buildTree(categories: Category[], parentId?: string, level: number = 0): CategoryNode[] {
        return categories
            .filter(c => (c.parentId || null) === (parentId || null))
            .map(c => ({
                ...c,
                level: level,
                expanded: true,
                children: this.buildTree(categories, c.id, level + 1)
            }));
    }

    toggleExpand(node: CategoryNode) {
        node.expanded = !node.expanded;
        this.cdr.detectChanges();
    }

    openAddModal(parentId?: string) {
        this.isEditMode = false;
        this.editingCategory = this.getEmptyCategory();
        if (parentId) {
            this.editingCategory.parentId = parentId;
        }
        this.showModal = true;
        this.cdr.detectChanges();
    }

    openEditModal(category: Category) {
        this.isEditMode = true;
        this.editingCategory = { ...category };
        this.showModal = true;
        this.cdr.detectChanges();
    }

    closeModal() {
        this.showModal = false;
        this.isSubmitting = false;
        this.cdr.detectChanges();
    }

    saveCategory() {
        if (this.isSubmitting) return;
        
        const payload = { ...this.editingCategory };
        if (!payload.parentId || payload.parentId === "") {
            payload.parentId = undefined;
        }

        this.isSubmitting = true;
        this.cdr.detectChanges();

        if (this.isEditMode) {
            this.categoryService.updateCategory(payload.id, payload).subscribe({
                next: () => {
                    this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.SAVE_SUCCESS'));
                    this.closeModal();
                    this.loadCategories();
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.SAVE_ERROR') + ': ' + (err.error?.title || err.message));
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.categoryService.createCategory(payload).subscribe({
                next: () => {
                    this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.SAVE_SUCCESS'));
                    this.closeModal();
                    this.loadCategories();
                },
                error: (err) => {
                    this.isSubmitting = false;
                    this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.SAVE_ERROR') + ': ' + (err.error?.title || err.message));
                    this.cdr.detectChanges();
                }
            });
        }
    }

    deleteCategory(id: string) {
        this.alertService.confirm(this.translate.instant('COMMON.CONFIRM'), this.translate.instant('COMMON.DELETE_CONFIRM')).then((result: any) => {
            if (result.isConfirmed) {
                this.categoryService.deleteCategory(id).subscribe({
                  next: () => {
                      this.loadCategories();
                      this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.DELETE_SUCCESS'));
                  },
                  error: (err) => {
                      this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.DELETE_ERROR') + ': ' + (err.error?.title || err.message));
                      this.cdr.detectChanges();
                  }
                });
            }
        });
    }

    private getEmptyCategory(): Category {
        return {
            id: "",
            name: '',
            description: '',
            icon: '📁',
            parentId: ''
        };
    }

    get flattenedCategoriesForSelect() {
        const flatList: { id: string, name: string }[] = [];
        const flatten = (nodes: CategoryNode[], prefix = '') => {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (this.isEditMode && node.id === this.editingCategory.id) continue;

                const isLast = i === nodes.length - 1;
                const connector = prefix === '' ? '' : (isLast ? '└─ ' : '├─ ');

                // Use non-breaking spaces for HTML option preserve formatting
                const displayName = prefix.replace(/ /g, '\u00A0') + connector + node.name;

                flatList.push({ id: node.id, name: displayName });

                if (node.children && node.children.length > 0) {
                    const newPrefix = prefix === '' ? '   ' : (isLast ? prefix + '   ' : prefix + '│  ');
                    flatten(node.children, newPrefix);
                }
            }
        };
        flatten(this.categoryNodes);
        return flatList;
    }
}
