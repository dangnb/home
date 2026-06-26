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
  totalCount = 0;

  // Modal State
  showModal = false;
  isEditMode = false;
  editingProduct: Product = this.getEmptyProduct();

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to page 1 on search
    this.loadProducts();
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getPaged(this.currentPage, this.pageSize, {
      searchTerm: this.searchTerm,
      category: this.selectedCategory
    }).subscribe(res => {
      this.products = res.items;
      this.totalCount = res.totalCount;

      // Handle edge case where the current page becomes out of bounds (e.g. after deletion)
      const maxPage = Math.ceil(this.totalCount / this.pageSize);
      if (this.currentPage > maxPage && maxPage > 0) {
        this.currentPage = maxPage;
        this.loadProducts();
      }
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
        this.currentPage = 1; // Reset to page 1 to see the newly added product
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Lỗi xóa sản phẩm:', err);
          alert('Không thể xóa sản phẩm. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau!');
        }
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
