import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TransactionService, CreateInboundTransactionRequest, TransactionLineDto, TransactionDetailDto } from '../../services/transaction.service';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProductService, ProductBatch } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { SupplierService } from '../../services/supplier.service';
import { Product } from '../../models/product';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';

@Component({
    selector: 'app-transaction-create',
    imports: [CommonModule, FormsModule, RouterModule, NumberFormatDirective, TranslatePipe],
    templateUrl: './transaction-create.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './transaction-create.component.scss'
})
export class TransactionCreateComponent implements OnInit {
    private transactionService = inject(TransactionService);
    private alertService = inject(AlertService);
    private productService = inject(ProductService);
    private customerService = inject(CustomerService);
    private supplierService = inject(SupplierService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private t = inject(TranslateService);

    isEditMode = false;
    editTransactionId: string | null = null;

    referenceId: string = '';
    notes: string = '';
    amountPaid: number = 0;

    availableProducts: Product[] = [];
    lines: (TransactionLineDto & { productName: string, productBatchId?: string })[] = [];

    // Customers and Suppliers
    customers: any[] = [];
    suppliers: any[] = [];
    selectedCustomerId: string | null = null;
    selectedSupplierId: string | null = null;

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
    selectedMfgDate: string = '';
    selectedExpiryDate: string = '';
    
    // Batches
    availableBatches: ProductBatch[] = [];
    selectedBatchId: string | null = null;

    isSubmitting = false;

    hideDropdownTimeout: any;

    ngOnInit(): void {
        this.customerService.getCustomers().subscribe(res => this.customers = res);
        this.supplierService.getSuppliers().subscribe(res => this.suppliers = res);

        this.productService.getProducts().subscribe((res) => {
            this.availableProducts = res;

            this.route.paramMap.subscribe(params => {
                const id = params.get('id');
                if (id && id !== 'create') {
                    this.isEditMode = true;
                    this.editTransactionId = id;
                    this.loadTransactionForEditing(id);
                }
            });
        });
    }

    loadTransactionForEditing(id: string) {
        this.transactionService.getTransactionById(id).subscribe({
            next: (dto: TransactionDetailDto) => {
                this.referenceId = dto.referenceId;
                this.notes = dto.notes;

                // Set transaction type based on DTO
                if (dto.type === 1) this.transactionType = 'inbound';
                else if (dto.type === 2) this.transactionType = 'outbound';

                // Map lines
                this.lines = dto.lines.map(l => ({
                    productId: l.productId,
                    productName: l.productName,
                    quantity: l.quantity,
                    unitCost: l.unitCost
                }));
            },
            error: (err) => {
                this.alertService.error(this.t.instant('COMMON.ERROR'), this.t.instant('TRANSACTIONS.LOAD_ERROR'));
                this.router.navigate(['/admin/transactions']);
            }
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
        
        // If outbound, fetch available batches
        this.availableBatches = [];
        this.selectedBatchId = null;
        if (this.transactionType === 'outbound') {
            this.productService.getProductBatches(prod.id).subscribe(batches => {
                this.availableBatches = batches;
                if (batches.length > 0) {
                    this.selectedBatchId = batches[0].id;
                }
            });
        }
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
            this.alertService.warning(this.t.instant('TRANSACTIONS.WARNING'), this.t.instant('TRANSACTIONS.SELECT_PRODUCT')); return;
        }
        if (this.selectedQuantity <= 0) {
            this.alertService.warning(this.t.instant('TRANSACTIONS.WARNING'), this.t.instant('TRANSACTIONS.QTY_GREATER_THAN_ZERO')); return;
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
            productBatchId: this.selectedBatchId || undefined,
            mfgDate: this.selectedMfgDate || undefined,
            expiryDate: this.selectedExpiryDate || undefined
        });

        // reset
        this.selectedProductId = null;
        this.searchQuery = '';
        this.selectedQuantity = 1;
        this.selectedCost = 0;
        this.selectedLocationCode = '';
        this.selectedBatchNumber = '';
        this.selectedMfgDate = '';
        this.selectedExpiryDate = '';
        this.selectedBatchId = null;
        this.availableBatches = [];
    }

    removeLine(index: number) {
        this.lines.splice(index, 1);
    }

    get totalAmount() {
        return this.lines.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0);
    }

    transactionType: 'inbound' | 'outbound' = 'inbound';

    submitTransaction() {
        if (this.lines.length === 0) {
            this.alertService.warning(this.t.instant('TRANSACTIONS.WARNING'), this.t.instant('TRANSACTIONS.NEED_AT_LEAST_ONE')); return;
        }

        this.isSubmitting = true;
        const req: any = {
            transactionId: this.editTransactionId, // Used for update
            referenceId: this.referenceId,
            notes: this.notes,
            amountPaid: this.amountPaid,
            supplierId: this.transactionType === 'inbound' ? (this.selectedSupplierId || undefined) : undefined,
            customerId: this.transactionType === 'outbound' ? (this.selectedCustomerId || undefined) : undefined,
            lines: this.lines.map(l => ({
                productId: l.productId,
                quantity: l.quantity,
                unitCost: l.unitCost,
                locationCode: l.locationCode,
                batchNumber: l.batchNumber,
                productBatchId: l.productBatchId,
                mfgDate: l.mfgDate,
                expiryDate: l.expiryDate
            }))
        };

        const reqObservable = this.isEditMode
            ? this.transactionService.updateTransaction(this.editTransactionId!, req)
            : (this.transactionType === 'inbound'
                ? this.transactionService.createInboundTransaction(req)
                : this.transactionService.createOutboundTransaction(req));

        reqObservable.subscribe({
            next: (res) => {
                this.alertService.success(this.t.instant('COMMON.SUCCESS'), this.t.instant('TRANSACTIONS.SAVE_SUCCESS'));
                this.router.navigate(['/admin/transactions']);
            },
            error: (err) => {
                console.error(err);
                this.alertService.error(this.t.instant('COMMON.ERROR'), this.t.instant('TRANSACTIONS.SAVE_ERROR') + ' ' + (err.error?.title || err.message));
                this.isSubmitting = false;
            }
        });
    }
}
