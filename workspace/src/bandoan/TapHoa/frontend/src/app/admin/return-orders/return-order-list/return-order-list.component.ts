import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReturnOrderService, ReturnOrderDto } from '../../../services/return-order.service';
import { AlertService } from '../../../services/alert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-return-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './return-order-list.component.html'
})
export class ReturnOrderListComponent implements OnInit {
  private returnOrderService = inject(ReturnOrderService);
  private alertService = inject(AlertService);
  private translateService = inject(TranslateService);

  returnOrders: ReturnOrderDto[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  searchTerm = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.returnOrderService.getReturnOrders(this.pageNumber, this.pageSize, this.searchTerm)
      .subscribe({
        next: (res: any) => {
          this.returnOrders = res.items;
          this.totalCount = res.totalCount;
          this.totalPages = res.totalPages;
        },
        error: (err: any) => {
          const errorTitle = this.translateService.instant('COMMON.ERROR') || 'Lỗi';
          const errorMsg = this.translateService.instant('COMMON.LOAD_ERROR') || 'Lỗi khi tải dữ liệu';
          this.alertService.error(errorTitle, errorMsg);
        }
      });
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.loadData();
    }
  }

  approve(id: string) {
    const title = this.translateService.instant('COMMON.CONFIRM') || 'Xác nhận duyệt';
    const msg = 'Bạn có chắc chắn muốn duyệt phiếu trả hàng này? Kho sẽ tự động nhập lại sản phẩm.';
    this.alertService.confirm(title, msg).then(result => {
      if (result.isConfirmed) {
        this.returnOrderService.approveReturnOrder(id).subscribe({
          next: () => {
            const successTitle = this.translateService.instant('COMMON.SUCCESS') || 'Thành công';
            const successMsg = this.translateService.instant('COMMON.SUCCESS') || 'Thành công';
            this.alertService.success(successTitle, successMsg);
            this.loadData();
          },
          error: () => {
            const errorTitle = this.translateService.instant('COMMON.ERROR') || 'Lỗi';
            const errorMsg = this.translateService.instant('COMMON.ERROR') || 'Lỗi';
            this.alertService.error(errorTitle, errorMsg);
          }
        });
      }
    });
  }
}
