import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.scss']
})
export class LowStockComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadLowStockProducts();
  }

  loadLowStockProducts(): void {
    this.isLoading = true;
    this.productService.getLowStockProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching low stock products', err);
        this.isLoading = false;
      }
    });
  }
}
