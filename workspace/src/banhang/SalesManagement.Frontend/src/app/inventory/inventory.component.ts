import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, Warehouse, TransactionSummary, CreateTransactionDto, TransactionDetailDto } from './inventory.service';
import { Product, ProductService } from '../products/product.service';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
    transactions: TransactionSummary[] = [];
    warehouses: Warehouse[] = [];
    products: Product[] = [];

    isCreateMode = false;

    currentTxn: CreateTransactionDto = {
        code: '', type: 'IN', warehouseId: '', note: '', details: []
    };
    currentDetails: TransactionDetailDto[] = [];

    constructor(
        private inventoryService: InventoryService,
        private productService: ProductService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.inventoryService.getTransactions().subscribe(res => this.transactions = res);
        this.inventoryService.getWarehouses().subscribe(res => {
            this.warehouses = res;
            if (res.length > 0) this.currentTxn.warehouseId = res[0].id;
        });
        this.productService.getProducts().subscribe(res => this.products = res);
    }

    toggleCreateMode() {
        this.isCreateMode = !this.isCreateMode;
        if (this.isCreateMode) {
            this.currentTxn.code = `TXN-${Math.floor(Math.random() * 10000)}`;
            this.currentDetails = [];
            this.addRow(); // add initial row
        } else {
            this.loadData();
        }
    }

    addRow() {
        this.currentDetails.push({ productId: '', quantity: 1, unitPrice: 0 });
    }

    removeRow(index: number) {
        this.currentDetails.splice(index, 1);
    }

    saveDraft() {
        this.currentTxn.details = this.currentDetails.filter(d => d.productId && d.quantity > 0);
        if (this.currentTxn.details.length === 0) {
            alert("Please enter valid items.");
            return;
        }

        this.inventoryService.createTransaction(this.currentTxn).subscribe({
            next: (res) => {
                this.toggleCreateMode(); // back to list
            },
            error: (e) => alert("Error saving transaction")
        });
    }

    approveTxn(id: string) {
        if (confirm("Are you sure you want to approve this transaction? Stock will be updated irrevocably.")) {
            this.inventoryService.approveTransaction(id).subscribe({
                next: (res) => this.loadData(),
                error: (e) => alert("Failed to approve: " + (e.error?.error || 'Unknown error'))
            });
        }
    }
}
