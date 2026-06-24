import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  // Modal State
  showModal = false;
  isEditMode = false;
  editingProduct: Product = this.getEmptyProduct();

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

  deleteProduct(id: number) {
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
      id: 0,
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
