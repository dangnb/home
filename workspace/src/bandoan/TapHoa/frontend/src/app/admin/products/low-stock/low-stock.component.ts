import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.scss']
})
export class LowStockComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;

  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.loadLowStockProducts();
  }

  loadLowStockProducts(): void {
    this.isLoading = true;
    this.productService.getLowStockProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching low stock products', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
