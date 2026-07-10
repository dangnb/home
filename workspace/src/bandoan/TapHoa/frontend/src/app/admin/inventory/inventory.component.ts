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
    filteredInventories: any[] = [];
    searchTerm: string = '';
    activeDropdownRowId: string | null = null;
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
                this.inventories = data || [];
                this.filteredInventories = [...this.inventories];
                this.onSearchChange();
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

    onSearchChange() {
        if (!this.searchTerm) {
            this.filteredInventories = [...this.inventories];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredInventories = this.inventories.filter(i => 
                i.productName?.toLowerCase().includes(term) || 
                i.barcode?.toLowerCase().includes(term)
            );
        }
    }

    toggleDropdown(id: string, event: Event) {
        event.stopPropagation();
        if (this.activeDropdownRowId === id) {
            this.activeDropdownRowId = null;
        } else {
            this.activeDropdownRowId = id;
        }
    }

    async reportWastage(item: any) {
        const result = await Swal.fire({
            title: `Báo hỏng / Hủy: ${item.productName}`,
            text: `Nhập số lượng hàng hỏng/hết hạn cần hủy:`,
            input: 'number',
            inputValue: 1,
            inputAttributes: {
                min: '1',
                max: item.quantityOnHand.toString(),
                step: '1'
            },
            showCancelButton: true,
            confirmButtonText: 'Ghi nhận',
            cancelButtonText: 'Hủy',
            showLoaderOnConfirm: true,
            preConfirm: async (qty) => {
                const quantity = parseInt(qty);
                if (isNaN(quantity) || quantity <= 0) {
                    Swal.showValidationMessage('Số lượng không hợp lệ');
                    return false;
                }
                if (quantity > item.quantityOnHand) {
                    Swal.showValidationMessage('Số lượng hủy không được vượt quá tồn kho hiện tại');
                    return false;
                }

                try {
                    const payload = {
                        referenceId: `WASTAGE-${Date.now()}`,
                        notes: 'Hủy hàng hỏng/hết hạn',
                        createdBy: 'Admin',
                        lines: [
                            {
                                productId: item.productId,
                                quantity: quantity,
                                unitPrice: 0
                            }
                        ]
                    };
                    const res: any = await this.http.post(`${environment.apiUrl}/transactions/wastage`, payload).toPromise();
                    
                    // Automatically approve it so stock decreases immediately
                    if (res && res.id) {
                        await this.http.post(`${environment.apiUrl}/transactions/${res.id}/approve`, {}).toPromise();
                    }
                    return res;
                } catch (error: any) {
                    Swal.showValidationMessage(`Lỗi: ${error.error?.message || error.message}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
            this.alertService.success('Thành công', 'Đã ghi nhận phiếu hủy/hỏng hàng và cập nhật tồn kho!');
            this.fetchStock();
        }
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
