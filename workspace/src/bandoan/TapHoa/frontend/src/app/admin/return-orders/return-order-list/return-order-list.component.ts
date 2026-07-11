import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReturnOrderService, ReturnOrderDto } from '../../../services/return-order.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-return-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './return-order-list.component.html'
})
export class ReturnOrderListComponent implements OnInit {
  private returnOrderService = inject(ReturnOrderService);
  private alertService = inject(AlertService);

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
          this.alertService.error('Lỗi', 'Lỗi khi tải danh sách phiếu trả hàng');
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
    this.alertService.confirm('Xác nhận duyệt', 'Bạn có chắc chắn muốn duyệt phiếu trả hàng này? Kho sẽ tự động nhập lại sản phẩm.').then(result => {
      if (result.isConfirmed) {
        this.returnOrderService.approveReturnOrder(id).subscribe({
          next: () => {
            this.alertService.success('Thành công', 'Đã duyệt phiếu trả hàng thành công');
            this.loadData();
          },
          error: () => this.alertService.error('Lỗi', 'Lỗi khi duyệt phiếu trả hàng')
        });
      }
    });
  }
}
