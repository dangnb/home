import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransactionService, CreateInboundTransactionRequest, TransactionLineDto } from '../../services/transaction.service';
import { AlertService } from '../../services/alert.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
    selector: 'app-transaction-create',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './transaction-create.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './transaction-create.component.scss'
})
export class TransactionCreateComponent implements OnInit {
    private transactionService = inject(TransactionService);
    private alertService = inject(AlertService);
    private productService = inject(ProductService);
    private router = inject(Router);

    referenceId: string = '';
    notes: string = '';

    availableProducts: Product[] = [];
    lines: (TransactionLineDto & { productName: string })[] = [];

    // For Autocomplete
    searchQuery: string = '';
    filteredProducts: Product[] = [];
    showDropdown: boolean = false;

    selectedProductId: string | null = null;
    selectedQuantity: number = 1;
    selectedCost: number = 0;

    // WMS
    selectedLocationCode: string = '';
    selectedBatchNumber: string = '';
    selectedExpiryDate: string = '';

    isSubmitting = false;

    // Simulate clicking outside
    hideDropdownTimeout: any;

    ngOnInit(): void {
        this.productService.getProducts().subscribe((res) => {
            this.availableProducts = res;
        });
    }

    onSearchChange() {
        if (!this.searchQuery) {
            this.filteredProducts = [];
            this.showDropdown = false;
            this.selectedProductId = null;
            this.selectedCost = 0;
            return;
        }

        const query = this.searchQuery.toLowerCase();
        this.filteredProducts = this.availableProducts.filter(p =>
            p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
        );
        this.showDropdown = true;
    }

    onProductSelect(prod: any) {
        this.selectedProductId = prod.id;
        this.searchQuery = prod.name;
        this.selectedCost = prod.price;
        this.showDropdown = false;

        // Focus quantity input for fast typing (optional)
    }

    onSearchBlur() {
        // Small delay to allow clicking on dropdown items
        this.hideDropdownTimeout = setTimeout(() => {
            this.showDropdown = false;
        }, 200);
    }

    onSearchFocus() {
        if (this.searchQuery) {
            this.onSearchChange();
        } else {
            this.filteredProducts = this.availableProducts;
            this.showDropdown = true;
        }
    }

    addLine() {
        if (!this.selectedProductId) {
            this.alertService.warning('Cảnh báo', 'Vui lòng chọn sản phẩm'); return;
        }
        if (this.selectedQuantity <= 0) {
            this.alertService.warning('Cảnh báo', 'Số lượng phải lớn hơn 0'); return;
        }

        const prod = this.availableProducts.find(p => p.id == this.selectedProductId);
        if (!prod) return;

        this.lines.push({
            productId: prod.id,
            productName: prod.name,
            quantity: this.selectedQuantity,
            unitCost: this.selectedCost,
            locationCode: this.selectedLocationCode || undefined,
            batchNumber: this.selectedBatchNumber || undefined,
            expiryDate: this.selectedExpiryDate || undefined
        });

        // reset
        this.selectedProductId = null;
        this.searchQuery = '';
        this.selectedQuantity = 1;
        this.selectedCost = 0;
        this.selectedLocationCode = '';
        this.selectedBatchNumber = '';
        this.selectedExpiryDate = '';
    }

    removeLine(index: number) {
        this.lines.splice(index, 1);
    }

    get totalAmount() {
        return this.lines.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0);
    }

    submitTransaction() {
        if (this.lines.length === 0) {
            this.alertService.warning('Cảnh báo', 'Phải có ít nhất 1 mặt hàng trong phiếu!'); return;
        }

        this.isSubmitting = true;
        const req: CreateInboundTransactionRequest = {
            referenceId: this.referenceId,
            notes: this.notes,
            lines: this.lines.map(l => ({
                productId: l.productId,
                quantity: l.quantity,
                unitCost: l.unitCost,
                locationCode: l.locationCode,
                batchNumber: l.batchNumber,
                expiryDate: l.expiryDate
            }))
        };

        this.transactionService.createInboundTransaction(req).subscribe({
            next: (res) => {
                this.alertService.success('Thành công', 'Tạo phiếu nhập nháp thành công!');
                this.router.navigate(['/admin/transactions']);
            },
            error: (err) => {
                console.error(err);
                this.alertService.error('Thất bại', 'Lỗi tạo phiếu: ' + (err.error?.title || err.message));
                this.isSubmitting = false;
            }
        });
    }
}
