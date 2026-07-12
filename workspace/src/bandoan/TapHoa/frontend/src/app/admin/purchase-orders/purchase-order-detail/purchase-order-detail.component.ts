import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService, PurchaseOrder } from '../../../services/purchase-order.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslatePipe],
  templateUrl: './purchase-order-detail.component.html',
  styleUrl: './purchase-order-detail.component.scss'
})
export class PurchaseOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private poService = inject(PurchaseOrderService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  order: PurchaseOrder | null = null;
  isLoading = true;
  isSubmitting = false;

  amountPaidInput: number = 0;

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
        this.cdr.detectChanges();
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

    const confirmMsg = this.translate.instant('PURCHASE_ORDERS.STATUS.' + status);
    if (!confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang: ${confirmMsg}?`)) {
      return;
    }

    this.isSubmitting = true;
    this.poService.updateStatus(this.order.id, { status, amountPaid }).subscribe({
      next: () => {
        this.alertService.success('Cập nhật trạng thái thành công');
        this.loadOrder(this.order!.id);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.alertService.error('Lỗi khi cập nhật trạng thái');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  getEnumString(status: any): string {
    if (typeof status === 'string') return status;
    const map: Record<number, string> = {
      0: 'Draft',
      1: 'Processing',
      2: 'Completed',
      3: 'Cancelled'
    };
    return map[status] || 'Draft';
  }

  getStatusBadgeClass(status: any): string {
    const s = this.getEnumString(status);
    switch (s) {
      case 'Draft': return 'bg-secondary text-white';
      case 'Processing': return 'bg-primary text-white';
      case 'Completed': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  }
}
