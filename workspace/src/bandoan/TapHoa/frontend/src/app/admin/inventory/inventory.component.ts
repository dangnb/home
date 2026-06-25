import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-inventory',
    imports: [CommonModule],
    templateUrl: './inventory.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
    inventories = [
        { productId: 1, productName: 'Cocacola 330ml', barcode: '893456789', qtyOnHand: 150, availableQty: 145, lastRestocked: '2026-06-20' },
        { productId: 2, productName: 'Mì Hảo Hảo', barcode: '893456790', qtyOnHand: 45, availableQty: 45, lastRestocked: '2026-06-21' },
        { productId: 3, productName: 'Sữa tươi Vinamilk', barcode: '893456791', qtyOnHand: 5, availableQty: 0, lastRestocked: '2026-05-10' }, // Low stock warning
    ];
}
