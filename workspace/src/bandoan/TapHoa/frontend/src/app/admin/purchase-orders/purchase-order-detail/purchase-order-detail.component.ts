import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderService, PurchaseOrder } from '../../../services/purchase-order.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './purchase-order-detail.component.html',
  styleUrl: './purchase-order-detail.component.scss'
})
export class PurchaseOrderDetailComponent implements OnInit {
  order: PurchaseOrder | null = null;
  isLoading = true;
  isSubmitting = false;

  amountPaidInput: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private poService: PurchaseOrderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    }
  }

  loadOrder(id: string): void {
    this.isLoading = true;
    this.poService.getById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.amountPaidInput = data.totalAmount; // Default to full amount
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.alertService.error('Không thể tải thông tin đơn hàng');
        this.router.navigate(['/admin/purchase-orders']);
      }
    });
  }

  updateStatus(status: 'Processing' | 'Completed' | 'Cancelled'): void {
    if (!this.order) return;
    
    // For completion, check if they entered payment
    let amountPaid: number | undefined = undefined;
    if (status === 'Completed') {
      if (this.amountPaidInput < 0 || this.amountPaidInput > this.order.totalAmount) {
        this.alertService.error('Số tiền thanh toán không hợp lệ');
        return;
      }
      amountPaid = this.amountPaidInput;
    }

    if (!confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang: ${this.getStatusLabel(status)}?`)) {
      return;
    }

    this.isSubmitting = true;
    this.poService.updateStatus(this.order.id, { status, amountPaid }).subscribe({
      next: () => {
        this.alertService.success('Cập nhật trạng thái thành công');
        this.loadOrder(this.order!.id);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.alertService.error('Lỗi khi cập nhật trạng thái');
        this.isSubmitting = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Draft': return 'bg-secondary text-white';
      case 'Processing': return 'bg-primary text-white';
      case 'Completed': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Draft': return 'Nháp';
      case 'Processing': return 'Đang xử lý';
      case 'Completed': return 'Hoàn thành (Đã nhập kho)';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
