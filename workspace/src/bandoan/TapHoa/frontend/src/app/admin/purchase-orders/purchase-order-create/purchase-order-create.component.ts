import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PurchaseOrderService, CreatePurchaseOrderDto } from '../../../services/purchase-order.service';
import { SupplierService } from '../../../services/supplier.service';
import { ProductService } from '../../../services/product.service';
import { AlertService } from '../../../services/alert.service';
import { NumberFormatDirective } from '../../../shared/directives/number-format.directive';

@Component({
  selector: 'app-purchase-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NumberFormatDirective],
  templateUrl: './purchase-order-create.component.html',
  styleUrl: './purchase-order-create.component.scss'
})
export class PurchaseOrderCreateComponent implements OnInit {
  suppliers: any[] = [];
  products: any[] = [];
  
  dto: CreatePurchaseOrderDto = {
    supplierId: '',
    expectedDeliveryDate: undefined,
    notes: '',
    details: []
  };

  selectedProductId = '';
  selectedQuantity = 1;
  selectedCostPrice = 0;

  isSubmitting = false;

  constructor(
    private poService: PurchaseOrderService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supplierService.getSuppliers().subscribe(data => this.suppliers = data);
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  addProduct(): void {
    if (!this.selectedProductId) {
      this.alertService.error('Vui lòng chọn sản phẩm');
      return;
    }
    if (this.selectedQuantity <= 0) {
      this.alertService.error('Số lượng phải lớn hơn 0');
      return;
    }
    
    const product = this.products.find(p => p.id === this.selectedProductId);
    if (product) {
      // Check if already added
      const existing = this.dto.details.find(d => d.productId === product.id);
      if (existing) {
        existing.quantity += this.selectedQuantity;
        existing.costPrice = this.selectedCostPrice > 0 ? this.selectedCostPrice : existing.costPrice;
      } else {
        this.dto.details.push({
          productId: product.id,
          quantity: this.selectedQuantity,
          costPrice: this.selectedCostPrice > 0 ? this.selectedCostPrice : product.costPrice
        });
      }
      
      // Reset form
      this.selectedProductId = '';
      this.selectedQuantity = 1;
      this.selectedCostPrice = 0;
    }
  }

  removeProduct(index: number): void {
    this.dto.details.splice(index, 1);
  }

  getProductName(id: string): string {
    return this.products.find(p => p.id === id)?.name || id;
  }

  getTotalAmount(): number {
    return this.dto.details.reduce((sum, d) => sum + (d.quantity * d.costPrice), 0);
  }

  onProductSelectChange(): void {
    if (this.selectedProductId) {
      const product = this.products.find(p => p.id === this.selectedProductId);
      if (product) {
        this.selectedCostPrice = product.costPrice;
      }
    }
  }

  save(): void {
    if (!this.dto.supplierId) {
      this.alertService.error('Vui lòng chọn nhà cung cấp');
      return;
    }
    if (this.dto.details.length === 0) {
      this.alertService.error('Vui lòng thêm ít nhất 1 sản phẩm');
      return;
    }

    this.isSubmitting = true;
    this.poService.createPurchaseOrder(this.dto).subscribe({
      next: () => {
        this.alertService.success('Tạo đơn mua hàng thành công');
        this.router.navigate(['/admin/purchase-orders']);
      },
      error: (err) => {
        console.error('Error creating PO:', err);
        this.alertService.error('Có lỗi xảy ra khi tạo đơn mua hàng');
        this.isSubmitting = false;
      }
    });
  }
}
