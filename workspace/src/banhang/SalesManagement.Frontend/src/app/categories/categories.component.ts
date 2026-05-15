import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from './category.service';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    isLoading = true;

    isModalOpen = false;
    isEditMode = false;
    currentCategory: Category = { name: '', description: '' };

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.isLoading = true;
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                alert('Failed to load categories');
            }
        });
    }

    openAddModal() {
        this.isEditMode = false;
        this.currentCategory = { name: '', description: '' };
        this.isModalOpen = true;
    }

    openEditModal(category: Category) {
        this.isEditMode = true;
        this.currentCategory = { ...category }; // clone
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveCategory() {
        if (this.isEditMode) {
            this.categoryService.updateCategory(this.currentCategory.id!, this.currentCategory).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeModal();
                },
                error: () => alert('Failed to update category')
            });
        } else {
            this.categoryService.createCategory(this.currentCategory).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeModal();
                },
                error: () => alert('Failed to create category')
            });
        }
    }

    deleteCategory(id: string) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.categoryService.deleteCategory(id).subscribe({
                next: () => this.loadCategories(),
                error: () => alert('Failed to delete category')
            });
        }
    }
}
