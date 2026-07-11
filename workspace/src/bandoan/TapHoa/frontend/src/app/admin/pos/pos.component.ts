import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { AlertService } from '../../services/alert.service';
import { CreateOrderCommand, OrderItemDto, PaymentMethod } from '../../models/order.model';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatDirective],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private alertService = inject(AlertService);

  products: any[] = [];
  customers: any[] = [];
  cart: { product: any, quantity: number }[] = [];

  // Search and Loading state
  searchTerm: string = '';
  isLoadingProducts: boolean = false;
  searchSubject = new Subject<string>();

  // Selected values
  selectedCustomerId: string | null = null;
  paymentMethod: PaymentMethod = PaymentMethod.Cash;
  amountPaid: number = 0;
  discountAmount: number = 0;
  notes: string = '';

  PaymentMethod = PaymentMethod;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.loadProducts(term);
    });
  }

  loadProducts(term?: string) {
    this.isLoadingProducts = true;
    this.productService.getPaged(1, 50, { SearchTerm: term || '' }).subscribe({
      next: (res: any) => {
        this.products = res.items || res; // fallback if api returns direct array somehow
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingProducts = false;
      }
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (res: any) => this.customers = Array.isArray(res) ? res : res.items,
      error: (err) => console.error(err)
    });
  }

  addToCart(product: any) {
    const existingItem = this.cart.find(x => x.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.calculateDefaultAmountPaid();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateDefaultAmountPaid();
  }

  increaseQuantity(index: number) {
    this.cart[index].quantity++;
    this.calculateDefaultAmountPaid();
  }

  decreaseQuantity(index: number) {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.removeFromCart(index);
    }
    this.calculateDefaultAmountPaid();
  }

  getSubTotal(): number {
    return this.cart.reduce((total, item) => total + (item.quantity * item.product.price), 0);
  }

  getTotal(): number {
    return Math.max(0, this.getSubTotal() - this.discountAmount);
  }

  calculateDefaultAmountPaid() {
    // Tự động điền số tiền khách đưa bằng tổng tiền (nếu là tiền mặt/chuyển khoản)
    if (this.paymentMethod !== PaymentMethod.Debt) {
      this.amountPaid = this.getTotal();
    } else {
      this.amountPaid = 0;
    }
  }

  onPaymentMethodChange() {
    this.calculateDefaultAmountPaid();
  }

  checkout() {
    if (this.cart.length === 0) {
      this.alertService.warning('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng.');
      return;
    }

    if (this.paymentMethod === PaymentMethod.Debt && !this.selectedCustomerId) {
      this.alertService.warning('Khách hàng', 'Vui lòng chọn khách hàng để ghi nợ.');
      return;
    }

    const command: CreateOrderCommand = {
      customerId: this.selectedCustomerId,
      items: this.cart.map(x => ({
        productId: x.product.id,
        quantity: x.quantity,
        unitPrice: x.product.price
      })),
      discountAmount: this.discountAmount,
      amountPaid: this.amountPaid,
      paymentMethod: this.paymentMethod,
      notes: this.notes
    };

    this.orderService.createOrder(command).subscribe({
      next: () => {
        this.alertService.success('Thành công', 'Đã thanh toán đơn hàng thành công.');
        this.resetForm();
      },
      error: (err) => {
        this.alertService.error('Lỗi', err.error?.title || 'Không thể tạo đơn hàng.');
      }
    });
  }

  resetForm() {
    this.cart = [];
    this.selectedCustomerId = null;
    this.paymentMethod = PaymentMethod.Cash;
    this.amountPaid = 0;
    this.discountAmount = 0;
    this.notes = '';
  }
}
