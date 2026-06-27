import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-inventory',
    imports: [CommonModule, NgClass, DatePipe, FormsModule],
    templateUrl: './inventory.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
    private http = inject(HttpClient);
    private alertService = inject(AlertService);
    private cdr = inject(ChangeDetectorRef);

    inventories: any[] = [];
    lowStockProducts: any[] = [];
    expiringBatches: any[] = [];
    isLoading = true;

    ngOnInit() {
        this.fetchStock();
        this.fetchAlerts();
    }

    fetchAlerts() {
        this.http.get<any[]>(`${environment.apiUrl}/transactions/low-stock`).subscribe({
            next: (data) => {
                this.lowStockProducts = data;
                this.cdr.markForCheck();
            }
        });

        this.http.get<any[]>(`${environment.apiUrl}/transactions/expiring-batches?days=30`).subscribe({
            next: (data) => {
                this.expiringBatches = data;
                this.cdr.markForCheck();
            }
        });
    }

    fetchStock() {
        this.isLoading = true;
        this.http.get<any[]>(`${environment.apiUrl}/transactions/stock`).subscribe({
            next: (data) => {
                this.inventories = data;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Error fetching stock:', err);
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }

    async adjustStock(item: any) {
        const result = await Swal.fire({
            title: `Kiểm kê: ${item.productName}`,
            text: `Nhập số lượng tồn kho THỰC TẾ mới nhất:`,
            input: 'number',
            inputValue: item.quantityOnHand,
            inputAttributes: {
                min: '0',
                step: '1'
            },
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy',
            showLoaderOnConfirm: true,
            preConfirm: async (newQty) => {
                if (newQty === '' || newQty < 0) {
                    Swal.showValidationMessage('Số lượng không hợp lệ');
                    return false;
                }
                if (parseInt(newQty) === item.quantityOnHand) {
                    Swal.showValidationMessage('Số lượng không thay đổi');
                    return false;
                }

                try {
                    const payload = {
                        productId: item.productId,
                        newQuantityOnHand: parseInt(newQty),
                        notes: 'Kiểm kê tự động qua chức năng Tồn kho tức thời',
                        createdBy: 'Admin'
                    };
                    const res = await this.http.post(`${environment.apiUrl}/transactions/adjust`, payload).toPromise();
                    return res;
                } catch (error: any) {
                    Swal.showValidationMessage(`Lỗi: ${error.error?.message || error.message}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
            this.alertService.success('Thành công', 'Đã cập nhật tồn kho theo kiểm kê thực tế!');
            this.fetchStock();
        }
    }
}
