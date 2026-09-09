import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '../../../../core/services/ecommerce.service';
import { ProductItem } from '../../../../core/models/ecommerce.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  private ecommerceService = inject(EcommerceService);

  products: ProductItem[] = [];
  searchTerm = '';
  statusFilter = 'All';

  // Add Product modal
  isAddModalOpen = false;
  newProductName = '';
  newProductSku = '';
  newProductCategory = 'Electronics';
  newProductPrice = 99.00;
  newProductQty = 50;
  newProductStatus: ProductItem['status'] = 'Published';
  newProductThumbnail = 'assets/media/stock/ecommerce/1.gif';

  // Active action dropdown
  activeActionMenuId: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.ecommerceService.getProducts().subscribe(list => {
      this.products = list.map(p => ({ ...p, selected: false }));
    });
  }

  get filteredProducts(): ProductItem[] {
    return this.products.filter(p => {
      const matchesSearch = !this.searchTerm ||
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'All' || p.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get paginatedProducts(): ProductItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Selection & Bulk delete
  get selectedCount(): number {
    return this.products.filter(p => p.selected).length;
  }

  get isAllSelected(): boolean {
    const pageProducts = this.paginatedProducts;
    return pageProducts.length > 0 && pageProducts.every(p => p.selected);
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const pageIds = new Set(this.paginatedProducts.map(p => p.id));
    this.products.forEach(p => {
      if (pageIds.has(p.id)) {
        p.selected = checked;
      }
    });
  }

  deleteSelected(): void {
    const ids = this.products.filter(p => p.selected).map(p => p.id);
    if (ids.length === 0) return;

    if (confirm(`Delete ${ids.length} selected product(s)?`)) {
      this.ecommerceService.deleteProducts(ids);
      this.loadProducts();
    }
  }

  // Add Product
  openAddModal(): void {
    this.isAddModalOpen = true;
    this.newProductName = '';
    this.newProductSku = Math.floor(10000000 + Math.random() * 90000000).toString();
    this.newProductCategory = 'Electronics';
    this.newProductPrice = 149.00;
    this.newProductQty = 25;
    this.newProductStatus = 'Published';
    this.newProductThumbnail = 'assets/media/stock/ecommerce/1.gif';
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  saveProduct(): void {
    if (!this.newProductName) return;

    this.ecommerceService.addProduct({
      name: this.newProductName,
      sku: this.newProductSku,
      category: this.newProductCategory,
      price: Number(this.newProductPrice),
      qty: Number(this.newProductQty),
      status: this.newProductStatus,
      rating: 5,
      thumbnail: this.newProductThumbnail
    });

    this.loadProducts();
    this.closeAddModal();
  }

  toggleActionMenu(productId: string): void {
    this.activeActionMenuId = this.activeActionMenuId === productId ? null : productId;
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.ecommerceService.deleteProduct(id);
      this.loadProducts();
    }
  }
}
