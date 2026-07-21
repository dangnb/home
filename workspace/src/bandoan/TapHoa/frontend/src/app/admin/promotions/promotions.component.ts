import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PromotionService } from '../../services/promotion.service';
import { Promotion, PromotionType } from '../../models/promotion';
import { AlertService } from '../../services/alert.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, ModalComponent, NumberFormatDirective, DatePipe, TranslatePipe],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  private promotionService = inject(PromotionService);
  private alertService = inject(AlertService);
  private translate = inject(TranslateService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  promotions: Promotion[] = [];
  categories: Category[] = [];
  searchTerm = '';
  activeDropdownRowId: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  // Modal
  showModal = false;
  isEditMode = false;
  isSubmitting = false;

  PromotionType = PromotionType;

  editingPromotion: Partial<Promotion> = this.getEmptyPromotion();

  ngOnInit(): void {
    this.loadPromotions();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res: Category[]) => {
        this.categories = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load categories', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadPromotions() {
    this.promotionService.getPagedPromotions(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (res: any) => {
        this.promotions = res.items;
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPromotions();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadPromotions();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadPromotions();
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingPromotion = this.getEmptyPromotion();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(promotion: Promotion) {
    this.isEditMode = true;
    this.editingPromotion = { ...promotion };
    
    // Format dates for input type="datetime-local" if needed, 
    // or type="date". Assuming Date string for now.
    if (this.editingPromotion.startDate) {
      this.editingPromotion.startDate = new Date(this.editingPromotion.startDate).toISOString().slice(0, 16);
    }
    if (this.editingPromotion.endDate) {
      this.editingPromotion.endDate = new Date(this.editingPromotion.endDate).toISOString().slice(0, 16);
    }
    
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }

  savePromotion() {
    if (!this.editingPromotion.name) {
      this.alertService.warning(this.translate.instant('COMMON.WARNING'), 'Vui lòng nhập tên khuyến mãi');
      return;
    }

    this.isSubmitting = true;

    // Convert back from local datetime string to UTC ISO if needed, or backend will handle it
    const payload = { ...this.editingPromotion };

    if (this.isEditMode && payload.id) {
      this.promotionService.updatePromotion(payload.id, payload).subscribe({
        next: () => {
          this.alertService.success(this.translate.instant('COMMON.SUCCESS'), 'Đã cập nhật khuyến mãi');
          this.loadPromotions();
          this.closeModal();
        },
        error: (err: any) => {
          this.alertService.error(this.translate.instant('COMMON.ERROR'), err.error?.title || 'Lỗi cập nhật');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.promotionService.createPromotion(payload).subscribe({
        next: () => {
          this.alertService.success(this.translate.instant('COMMON.SUCCESS'), 'Đã tạo khuyến mãi mới');
          this.currentPage = 1;
          this.loadPromotions();
          this.closeModal();
        },
        error: (err: any) => {
          this.alertService.error(this.translate.instant('COMMON.ERROR'), err.error?.title || 'Lỗi tạo mới');
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  toggleStatus(promotion: Promotion) {
    const newStatus = !promotion.isActive;
    this.promotionService.togglePromotionStatus(promotion.id, newStatus).subscribe({
      next: () => {
        promotion.isActive = newStatus;
        this.alertService.success(this.translate.instant('COMMON.SUCCESS'), 'Đã thay đổi trạng thái');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.alertService.error(this.translate.instant('COMMON.ERROR'), 'Không thể thay đổi trạng thái');
        this.cdr.detectChanges();
      }
    });
  }

  deletePromotion(id: string) {
    this.alertService.confirm(this.translate.instant('COMMON.CONFIRM'), 'Bạn có chắc chắn muốn xóa khuyến mãi này?').then((result: any) => {
      if (result.isConfirmed) {
        this.promotionService.deletePromotion(id).subscribe({
          next: () => {
            this.alertService.success(this.translate.instant('COMMON.SUCCESS'), 'Đã xóa khuyến mãi');
            this.loadPromotions();
          },
          error: (err: any) => {
            this.alertService.error(this.translate.instant('COMMON.ERROR'), 'Không thể xóa khuyến mãi');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  private getEmptyPromotion(): Partial<Promotion> {
    return {
      name: '',
      description: '',
      type: PromotionType.PercentageOff,
      minOrderAmount: 0,
      discountValue: 0,
      isActive: true,
      buyQuantity: null,
      getQuantity: null,
      startDate: null,
      endDate: null,
      couponCode: null,
      maxUsageCount: null,
      applicableCategoryId: null,
      maxDiscountAmount: null
    };
  }
}
