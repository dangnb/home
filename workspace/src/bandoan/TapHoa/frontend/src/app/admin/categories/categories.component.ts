import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AlertService } from '../../services/alert.service';

export interface CategoryNode extends Category {
    children: CategoryNode[];
    level: number;
    expanded: boolean;
}

@Component({
    selector: 'app-categories',
    imports: [CommonModule, FormsModule, ModalComponent],
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

    constructor(private categoryService: CategoryService, private alertService: AlertService) { }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe(data => {
            this.categories = data;
            this.categoryNodes = this.buildTree(data);
            this.applyFilter();
        });
    }

    onSearch() {
        this.applyFilter();
    }

    private applyFilter() {
        if (!this.searchTerm.trim()) {
            this.filteredCategoryNodes = this.categoryNodes;
            return;
        }
        const term = this.searchTerm.toLowerCase().trim();
        this.filteredCategoryNodes = this.filterTreeNodes(this.categoryNodes, term);
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
    }

    openAddModal(parentId?: string) {
        this.isEditMode = false;
        this.editingCategory = this.getEmptyCategory();
        if (parentId) {
            this.editingCategory.parentId = parentId;
        }
        this.showModal = true;
    }

    openEditModal(category: Category) {
        this.isEditMode = true;
        this.editingCategory = { ...category };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.isSubmitting = false;
    }

    saveCategory() {
        if (this.isSubmitting) return;
        
        const payload = { ...this.editingCategory };
        if (!payload.parentId || payload.parentId === "") {
            payload.parentId = undefined;
        }

        this.isSubmitting = true;

        if (this.isEditMode) {
            this.categoryService.updateCategory(payload.id, payload).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeModal();
                },
                error: () => {
                    this.isSubmitting = false;
                }
            });
        } else {
            this.categoryService.createCategory(payload).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeModal();
                },
                error: () => {
                    this.isSubmitting = false;
                }
            });
        }
    }

    deleteCategory(id: string) {
        this.alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa danh mục này không? Các danh mục con có thể cũng bị ảnh hưởng.').then((result: any) => {
            if (result.isConfirmed) {
                this.categoryService.deleteCategory(id).subscribe(() => {
                    this.loadCategories();
                    this.alertService.success('Thành công', 'Đã xóa danh mục.');
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
