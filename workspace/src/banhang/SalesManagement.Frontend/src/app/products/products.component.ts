import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from './product.service';
import { Category, CategoryService } from '../categories/category.service';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    isLoading = true;

    isModalOpen = false;
    isEditMode = false;
    currentProduct: Product = { name: '', sku: '', price: 0, description: '' };

    isBulkModalOpen = false;
    bulkJson = '';

    constructor(private productService: ProductService, private categoryService: CategoryService) { }

    ngOnInit() {
        this.loadCategories();
        this.loadProducts();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (data) => this.categories = data,
            error: () => console.error('Failed to load categories')
        });
    }

    loadProducts() {
        this.isLoading = true;
        this.productService.getProducts().subscribe({
            next: (data) => {
                this.products = data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                alert('Failed to load products');
            }
        });
    }

    openAddModal() {
        this.isEditMode = false;
        this.currentProduct = { name: '', sku: '', price: 0, description: '' };
        this.isModalOpen = true;
    }

    openEditModal(product: Product) {
        this.isEditMode = true;
        this.currentProduct = { ...product }; // clone
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveProduct() {
        if (this.isEditMode) {
            this.productService.updateProduct(this.currentProduct.id!, this.currentProduct).subscribe({
                next: () => {
                    this.loadProducts();
                    this.closeModal();
                },
                error: () => alert('Failed to update product')
            });
        } else {
            this.productService.createProduct(this.currentProduct).subscribe({
                next: () => {
                    this.loadProducts();
                    this.closeModal();
                },
                error: () => alert('Failed to create product')
            });
        }
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe({
                next: () => this.loadProducts(),
                error: () => alert('Failed to delete product')
            });
        }
    }

    openBulkUpload() {
        this.bulkJson = '';
        this.isBulkModalOpen = true;
    }

    closeBulkUpload() {
        this.isBulkModalOpen = false;
    }

    submitBulkUpload() {
        try {
            const parsed = JSON.parse(this.bulkJson);
            if (!Array.isArray(parsed)) throw new Error('Must be an array');

            this.productService.bulkUpload(parsed).subscribe({
                next: () => {
                    alert('Bulk upload successful!');
                    this.loadProducts();
                    this.closeBulkUpload();
                },
                error: (err) => {
                    console.error(err);
                    alert('Upload failed');
                }
            });
        } catch (e) {
            alert('Invalid JSON format');
        }
    }

    getCategoryName(id?: string): string {
        if (!id) return 'Uncategorized';
        const cat = this.categories.find(c => c.id === id);
        return cat ? cat.name : 'Uncategorized';
    }
}
