import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { AlertService } from '../../services/alert.service';
import { PromotionService } from '../../services/promotion.service';
import { CreateOrderCommand, OrderItemDto, PaymentMethod } from '../../models/order.model';
import { ApplicablePromotionResult, PromotionType } from '../../models/promotion';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';
import { ShiftOpenModalComponent } from '../shift/shift-open-modal/shift-open-modal.component';
import { ShiftCloseModalComponent } from '../shift/shift-close-modal/shift-close-modal.component';
import { ShiftService, ShiftDto } from '../../services/shift.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatDirective, TranslatePipe, ShiftOpenModalComponent, ShiftCloseModalComponent],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  private shiftService = inject(ShiftService);
  private promotionService = inject(PromotionService);

  products: any[] = [];
  customers: any[] = [];
  cart: { product: any, quantity: number }[] = [];

  // Shift state
  currentShift: ShiftDto | null = null;
  needsShiftOpen = false;

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
  PromotionType = PromotionType;

  usePoints: boolean = false;
  pointsToUse: number = 0;

  get selectedCustomerObj() {
    return this.customers.find(c => c.id === this.selectedCustomerId) || null;
  }

  // Promotions Engine
  suggestedPromotions: ApplicablePromotionResult[] = [];
  appliedPromotion: ApplicablePromotionResult | null = null;
  couponCode: string = '';
  couponApplied = false;
  couponMessage: string = '';
  isLoadingPromotions = false;

  ngOnInit(): void {
    this.checkShiftStatus();

    this.loadProducts();
    this.loadCustomers();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.loadProducts(term);
    });
  }

  checkShiftStatus() {
    this.shiftService.getCurrentShift().subscribe({
      next: (res) => {
        if (res) {
          this.currentShift = res;
          this.needsShiftOpen = false;
        } else {
          this.currentShift = null;
          this.needsShiftOpen = true; // Show Open Modal
        }
        this.cdr.detectChanges();
      },
      error: () => {
        // Fallback or handle error
      }
    });
  }

  onShiftOpened() {
    this.checkShiftStatus();
  }

  onShiftClosed() {
    this.checkShiftStatus();
  }

  loadProducts(term?: string) {
    this.isLoadingProducts = true;
    this.productService.getPaged(1, 50, { SearchTerm: term || '' }).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.products = res;
        } else {
          this.products = res.items || res.Items || res.data?.items || res.data?.Items || [];
        }
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingProducts = false;
        this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.LOAD_ERROR') + ': ' + (err.error?.title || err.message));
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.customers = res;
        } else {
          this.customers = res.items || res.Items || res.data?.items || res.data?.Items || [];
        }
        this.cdr.detectChanges();
      },
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
    this.onCartChanged();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.onCartChanged();
  }

  increaseQuantity(index: number) {
    this.cart[index].quantity++;
    this.onCartChanged();
  }

  decreaseQuantity(index: number) {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.removeFromCart(index);
    }
    this.onCartChanged();
  }

  onCartChanged() {
    this.calculateDefaultAmountPaid();
    this.clearAppliedPromotion();
    this.fetchSuggestedPromotions();
  }

  fetchSuggestedPromotions() {
    if (this.cart.length === 0) {
      this.suggestedPromotions = [];
      return;
    }

    this.isLoadingPromotions = true;
    const items = this.cart.map(c => ({
      productId: c.product.id,
      categoryId: c.product.categoryId || undefined,
      quantity: c.quantity,
      unitPrice: c.product.price
    }));

    this.promotionService.calculateApplicablePromotions(items, this.getSubTotal()).subscribe({
      next: (res) => {
        this.suggestedPromotions = res;
        this.isLoadingPromotions = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.suggestedPromotions = [];
        this.isLoadingPromotions = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyPromotion(promo: ApplicablePromotionResult) {
    this.appliedPromotion = promo;
    this.discountAmount = promo.calculatedDiscount;
    this.couponApplied = false;
    this.couponMessage = '';
    this.calculateDefaultAmountPaid();
    this.cdr.detectChanges();
  }

  clearAppliedPromotion() {
    this.appliedPromotion = null;
    this.discountAmount = 0;
    this.couponApplied = false;
    this.couponCode = '';
    this.couponMessage = '';
  }

  applyCoupon() {
    if (!this.couponCode.trim()) return;

    this.promotionService.applyCouponCode(this.couponCode, this.getSubTotal()).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.appliedPromotion = {
            id: res.promotionId!,
            name: res.promotionName!,
            type: PromotionType.CouponCode,
            discountValue: 0,
            calculatedDiscount: res.calculatedDiscount
          };
          this.discountAmount = res.calculatedDiscount;
          this.couponApplied = true;
          this.couponMessage = `Đã áp dụng mã "${this.couponCode.toUpperCase()}" — Giảm ${res.calculatedDiscount.toLocaleString('vi-VN')}₫`;
          this.calculateDefaultAmountPaid();
        } else {
          this.couponApplied = false;
          this.couponMessage = res.errorMessage || 'Mã không hợp lệ';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.couponMessage = 'Có lỗi xảy ra khi kiểm tra mã';
        this.cdr.detectChanges();
      }
    });
  }

  getSubTotal(): number {
    return this.cart.reduce((total, item) => total + (item.quantity * item.product.price), 0);
  }

  getTotal(): number {
    let total = Math.max(0, this.getSubTotal() - this.discountAmount);
    if (this.usePoints && this.pointsToUse > 0) {
      total = Math.max(0, total - (this.pointsToUse * 100)); // 1 point = 100 VND
    }
    return total;
  }

  togglePoints() {
    if (this.usePoints && this.selectedCustomerObj) {
       const maxPoints = this.selectedCustomerObj.loyaltyPoints || 0;
       const billAmount = Math.max(0, this.getSubTotal() - this.discountAmount);
       const maxPointsForBill = Math.ceil(billAmount / 100);
       this.pointsToUse = Math.min(maxPoints, maxPointsForBill);
    } else {
       this.pointsToUse = 0;
    }
    this.calculateDefaultAmountPaid();
  }

  onCustomerChange() {
    this.usePoints = false;
    this.pointsToUse = 0;
    this.calculateDefaultAmountPaid();
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
      this.alertService.warning('Cảnh báo', this.translate.instant('POS.CART_EMPTY'));
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
      promotionId: this.appliedPromotion?.id || null,
      amountPaid: this.amountPaid,
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      pointsToUse: this.usePoints ? this.pointsToUse : 0
    };

    this.orderService.createOrder(command).subscribe({
      next: (res) => {
        this.alertService.success(this.translate.instant('COMMON.SUCCESS'), 'Thanh toán đơn hàng thành công');
        this.resetForm();
      },
      error: (err) => {
        this.alertService.error(this.translate.instant('COMMON.ERROR'), 'Lỗi thanh toán: ' + (err.error?.title || err.message));
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
    this.suggestedPromotions = [];
    this.appliedPromotion = null;
    this.couponCode = '';
    this.couponApplied = false;
    this.couponMessage = '';
  }
}
