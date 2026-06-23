import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];

    showModal = false;
    isEditMode = false;
    editingCategory: Category = this.getEmptyCategory();

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe(data => {
            this.categories = data;
        });
    }

    openAddModal() {
        this.isEditMode = false;
        this.editingCategory = this.getEmptyCategory();
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
        if (this.isEditMode) {
            this.categoryService.updateCategory(this.editingCategory.id, this.editingCategory).subscribe(() => {
                this.loadCategories();
                this.closeModal();
            });
        } else {
            this.categoryService.createCategory(this.editingCategory).subscribe(() => {
                this.loadCategories();
                this.closeModal();
            });
        }
    }

    deleteCategory(id: number) {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            this.categoryService.deleteCategory(id).subscribe(() => {
                this.loadCategories();
            });
        }
    }

    private getEmptyCategory(): Category {
        return {
            id: 0,
            name: '',
            description: '',
            icon: '📁'
        };
    }
}
