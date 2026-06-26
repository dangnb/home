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
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    categoryNodes: CategoryNode[] = [];
    filteredCategoryNodes: CategoryNode[] = [];

    searchTerm: string = '';

    showModal = false;
    isEditMode = false;
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
    }

    saveCategory() {
        const payload = { ...this.editingCategory };
        if (!payload.parentId || payload.parentId === "") {
            payload.parentId = undefined;
        }

        if (this.isEditMode) {
            this.categoryService.updateCategory(payload.id, payload).subscribe(() => {
                this.loadCategories();
                this.closeModal();
            });
        } else {
            this.categoryService.createCategory(payload).subscribe(() => {
                this.loadCategories();
                this.closeModal();
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
}
