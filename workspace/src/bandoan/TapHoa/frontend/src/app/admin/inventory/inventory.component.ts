import { Component, ChangeDetectionStrategy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, NgClass, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import Swal from 'sweetalert2';

interface InventoryReportItem {
    productId: string;
    productName: string;
    barcode: string;
    unit: string;
    openingStock: number;
    totalInbound: number;
    totalOutbound: number;
    totalWastage: number;
    totalAdjustment: number;
    closingStock: number;
    averageCost: number;
    inventoryValue: number;
    reorderPoint: number;
}

interface InventoryReportSummary {
    totalSku: number;
    totalInventoryValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    items: InventoryReportItem[];
}

@Component({
    selector: 'app-inventory',
    imports: [CommonModule, NgClass, DatePipe, FormsModule, DecimalPipe, RouterLink],
    templateUrl: './inventory.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
    private http = inject(HttpClient);
    private alertService = inject(AlertService);
    private cdr = inject(ChangeDetectorRef);

    // Report data
    reportSummary: InventoryReportSummary | null = null;
    filteredItems: InventoryReportItem[] = [];
    searchTerm: string = '';
    activeDropdownRowId: string | null = null;
    isLoading = true;

    // Alerts
    lowStockProducts: any[] = [];
    expiringBatches: any[] = [];

    // Period filter
    filterType: string = 'thisMonth';
    customFromDate: string = '';
    customToDate: string = '';

    ngOnInit() {
        this.applyFilter();
        this.fetchAlerts();
    }

    applyFilter() {
        let fromDate = new Date();
        let toDate = new Date();

        switch (this.filterType) {
            case 'today':
                break;
            case 'thisWeek':
                fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1); // Monday
                break;
            case 'thisMonth':
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
                break;
            case 'lastMonth':
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, 1);
                toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
                break;
            case 'thisYear':
                fromDate = new Date(fromDate.getFullYear(), 0, 1);
                break;
            case 'custom':
                if (!this.customFromDate || !this.customToDate) return;
                fromDate = new Date(this.customFromDate);
                toDate = new Date(this.customToDate);
                break;
        }

        const fromStr = this.formatDate(fromDate);
        const toStr = this.formatDate(toDate);
        this.fetchReport(fromStr, toStr);
    }

    private formatDate(d: Date): string {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    fetchReport(fromDate: string, toDate: string) {
        this.isLoading = true;
        this.http.get<InventoryReportSummary>(
            `${environment.apiUrl}/transactions/inventory-report?fromDate=${fromDate}&toDate=${toDate}`
        ).subscribe({
            next: (data) => {
                this.reportSummary = data;
                this.filteredItems = [...(data.items || [])];
                this.onSearchChange();
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Error fetching inventory report:', err);
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
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

    onSearchChange() {
        if (!this.reportSummary) return;
        if (!this.searchTerm) {
            this.filteredItems = [...(this.reportSummary.items || [])];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredItems = (this.reportSummary.items || []).filter(i =>
                i.productName?.toLowerCase().includes(term) ||
                i.barcode?.toLowerCase().includes(term)
            );
        }
    }

    onFilterChange() {
        this.applyFilter();
    }

    toggleDropdown(id: string, event: Event) {
        event.stopPropagation();
        if (this.activeDropdownRowId === id) {
            this.activeDropdownRowId = null;
        } else {
            this.activeDropdownRowId = id;
        }
    }

    async reportWastage(item: InventoryReportItem) {
        const result = await Swal.fire({
            title: `Báo hỏng / Hủy: ${item.productName}`,
            text: `Nhập số lượng hàng hỏng/hết hạn cần hủy:`,
            input: 'number',
            inputValue: 1,
            inputAttributes: {
                min: '1',
                max: item.closingStock.toString(),
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
                if (quantity > item.closingStock) {
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
            this.applyFilter();
        }
    }

    async adjustStock(item: InventoryReportItem) {
        const result = await Swal.fire({
            title: `Kiểm kê: ${item.productName}`,
            text: `Nhập số lượng tồn kho THỰC TẾ mới nhất:`,
            input: 'number',
            inputValue: item.closingStock,
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
                if (parseInt(newQty) === item.closingStock) {
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
            this.applyFilter();
        }
    }

    getStockStatus(item: InventoryReportItem): string {
        if (item.closingStock <= 0) return 'Hết Hàng';
        if (item.closingStock <= item.reorderPoint) return 'Sắp Hết';
        return 'An Toàn';
    }

    getStockBadgeClass(item: InventoryReportItem): string {
        if (item.closingStock <= 0) return 'bg-danger';
        if (item.closingStock <= item.reorderPoint) return 'bg-warning text-dark';
        return 'bg-success';
    }
}
