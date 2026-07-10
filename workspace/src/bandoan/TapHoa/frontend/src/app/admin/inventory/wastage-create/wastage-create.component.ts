import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService, CreateWastageTransactionRequest } from '../../../services/transaction.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { AlertService } from '../../../services/alert.service';

interface WastageLineUI {
  product: Product;
  quantity: number;
  reason: string;
}

@Component({
  selector: 'app-wastage-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wastage-create.component.html',
  styleUrls: ['./wastage-create.component.scss']
})
export class WastageCreateComponent implements OnInit {
  referenceId: string = '';
  notes: string = '';
  lines: WastageLineUI[] = [];
  
  availableProducts: Product[] = [];
  selectedProductId: string = '';
  isSubmitting = false;

  constructor(
    private transactionService: TransactionService,
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      this.availableProducts = res;
    });
  }

  addProduct(): void {
    if (!this.selectedProductId) return;
    const p = this.availableProducts.find(x => x.id === this.selectedProductId);
    if (p && !this.lines.find(x => x.product.id === p.id)) {
      this.lines.push({ product: p, quantity: 1, reason: 'Hư hỏng' });
    }
    this.selectedProductId = '';
  }

  removeLine(index: number): void {
    this.lines.splice(index, 1);
  }

  submit(): void {
    if (this.lines.length === 0) {
      this.alertService.error('Vui lòng thêm ít nhất một sản phẩm để xuất hủy.');
      return;
    }
    if (this.lines.some(x => x.quantity <= 0)) {
      this.alertService.error('Số lượng xuất hủy phải lớn hơn 0.');
      return;
    }

    this.isSubmitting = true;
    const payload: CreateWastageTransactionRequest = {
      referenceId: this.referenceId,
      notes: this.notes,
      lines: this.lines.map(l => ({
        productId: l.product.id,
        quantity: l.quantity,
        unitPrice: l.product.costPrice,
        notes: l.reason // Assuming reason is part of line notes, or we just put it in the main note if backend doesn't support it per line yet
      }))
    };

    // Note: WastageTransactionLineDto in backend doesn't have a reason field currently, 
    // it only has ProductId, Quantity, UnitPrice, LocationCode, BatchNumber. 
    // We can append reason to the main notes if we want to preserve it.
    payload.notes = this.notes + '\nLý do: ' + this.lines.map(l => `${l.product.name} (${l.reason})`).join(', ');

    this.transactionService.createWastageTransaction(payload).subscribe({
      next: (res) => {
        this.alertService.success('Tạo phiếu xuất hủy thành công!');
        this.router.navigate(['/admin/inventory/wastage']);
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Có lỗi xảy ra khi tạo phiếu.');
        this.isSubmitting = false;
      }
    });
  }
}
