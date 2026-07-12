import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReturnOrderService } from '../../../services/return-order.service';
import { OrderService } from '../../../services/order.service';
import { AlertService } from '../../../services/alert.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-return-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './return-order-form.component.html'
})
export class ReturnOrderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private returnOrderService = inject(ReturnOrderService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  searchOrderCode = '';
  orderData: any = null;
  
  returnForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.returnForm = this.fb.group({
      originalOrderId: ['', Validators.required],
      reason: [''],
      items: this.fb.array([])
    });
  }

  get items() {
    return this.returnForm.get('items') as FormArray;
  }

  searchOrder() {
    if (!this.searchOrderCode.trim()) return;

    this.orderService.getPagedOrders(1, 10, this.searchOrderCode.trim()).subscribe({
      next: (res: any) => {
        const order = res.items.find((o: any) => o.orderCode === this.searchOrderCode.trim());
        if (order) {
          this.loadOrderDetails(order.id);
        } else {
          this.alertService.error('Lỗi', 'Không tìm thấy đơn hàng với mã này');
          this.orderData = null;
        }
      },
      error: () => this.alertService.error('Lỗi', 'Lỗi khi tìm kiếm đơn hàng')
    });
  }

  loadOrderDetails(orderId: string) {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order: any) => {
        this.orderData = order;
        this.returnForm.patchValue({ originalOrderId: order.id });
        this.items.clear();
        
        // Add all order details to form array with selected=false
        order.details.forEach((detail: any) => {
          this.items.push(this.fb.group({
            selected: [false],
            productId: [detail.productId],
            productName: [detail.productName],
            unitPrice: [detail.unitPrice],
            maxQuantity: [detail.quantity], // The max they can return
            returnQuantity: [detail.quantity, [Validators.required, Validators.min(1), Validators.max(detail.quantity)]]
          }));
        });
      },
      error: () => this.alertService.error('Lỗi', 'Lỗi khi tải chi tiết đơn hàng')
    });
  }

  get totalRefundAmount() {
    let total = 0;
    this.items.controls.forEach(control => {
      if (control.get('selected')?.value) {
        total += control.get('returnQuantity')?.value * control.get('unitPrice')?.value;
      }
    });
    return total;
  }

  onSubmit() {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    const formValue = this.returnForm.value;
    const selectedItems = formValue.items.filter((item: any) => item.selected);

    if (selectedItems.length === 0) {
      this.alertService.error('Lỗi', 'Vui lòng chọn ít nhất một sản phẩm để trả lại');
      return;
    }

    const command = {
      originalOrderId: formValue.originalOrderId,
      reason: formValue.reason,
      items: selectedItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.returnQuantity
      }))
    };

    this.isSubmitting = true;
    this.returnOrderService.createReturnOrder(command).subscribe({
      next: (id: string) => {
        this.alertService.success('Thành công', 'Đã tạo phiếu trả hàng thành công');
        this.router.navigate(['/admin/return-orders', id]);
      },
      error: (err: any) => {
        this.alertService.error('Lỗi', err.error?.detail || 'Lỗi khi tạo phiếu trả hàng');
        this.isSubmitting = false;
      }
    });
  }
}
