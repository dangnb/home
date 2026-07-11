import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReturnOrderService, ReturnOrderDto } from '../../../services/return-order.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-return-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './return-order-detail.component.html'
})
export class ReturnOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private returnOrderService = inject(ReturnOrderService);
  private alertService = inject(AlertService);

  returnOrder: ReturnOrderDto | null = null;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReturnOrder(id);
    } else {
      this.alertService.error('Lỗi', 'Không tìm thấy ID phiếu trả hàng');
      this.router.navigate(['/admin/return-orders']);
    }
  }

  loadReturnOrder(id: string) {
    this.isLoading = true;
    this.returnOrderService.getReturnOrderById(id).subscribe({
      next: (data: any) => {
        this.returnOrder = data;
        this.isLoading = false;
      },
      error: () => {
        this.alertService.error('Lỗi', 'Lỗi khi tải chi tiết phiếu trả hàng');
        this.router.navigate(['/admin/return-orders']);
      }
    });
  }

  approve() {
    if(!this.returnOrder) return;
    
    this.alertService.confirm('Xác nhận duyệt', 'Bạn có chắc chắn muốn duyệt phiếu trả hàng này? Kho sẽ tự động nhập lại sản phẩm.').then(result => {
      if (result.isConfirmed) {
        this.returnOrderService.approveReturnOrder(this.returnOrder!.id).subscribe({
          next: () => {
            this.alertService.success('Thành công', 'Đã duyệt phiếu trả hàng thành công');
            this.loadReturnOrder(this.returnOrder!.id);
          },
          error: () => this.alertService.error('Lỗi', 'Lỗi khi duyệt phiếu trả hàng')
        });
      }
    });
  }
}
