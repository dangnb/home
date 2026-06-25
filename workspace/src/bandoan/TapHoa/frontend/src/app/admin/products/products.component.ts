import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  fileUrl = environment.fileUrl;

  // Search & Filter
  searchTerm = '';
  selectedCategory = '';

  // Pagination State
  currentPage = 1;
  pageSize = 5;

  // Modal State
  showModal = false;
  isEditMode = false;
  editingProduct: Product = this.getEmptyProduct();

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  get paginatedProducts(): Product[] {
    const safeFiltered = this.filteredProducts;
    const maxPage = Math.ceil(safeFiltered.length / this.pageSize);
    if (this.currentPage > maxPage && maxPage > 0) {
      this.currentPage = maxPage;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return safeFiltered.slice(start, end);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to page 1 on search
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingProduct = this.getEmptyProduct();
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.isEditMode = true;
    this.editingProduct = { ...product };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    if (this.isEditMode) {
      this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    } else {
      this.productService.createProduct(this.editingProduct).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onMainImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe(res => {
        this.editingProduct.mainImageUrl = res.url;
      });
    }
  }

  onAdditionalImageSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.productService.uploadImage(file).subscribe(res => {
        this.editingProduct.additionalImages = this.editingProduct.additionalImages || [];
        this.editingProduct.additionalImages.push(res.url);
      });
    }
  }

  removeAdditionalImage(index: number) {
    if (this.editingProduct.additionalImages) {
      this.editingProduct.additionalImages.splice(index, 1);
    }
  }

  private getEmptyProduct(): Product {
    return {
      id: "",
      name: '',
      category: 'Trái cây',
      price: 0,
      stockQuantity: 0,
      unit: 'kg',
      status: 'Đang bán',
      mainImageUrl: '',
      additionalImages: []
    };
  }
}
