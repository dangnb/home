import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AlertService } from '../../services/alert.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { TransactionService } from '../../services/transaction.service';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, PaginationComponent, ModalComponent, NumberFormatDirective, TranslatePipe],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  fileUrl = environment.fileUrl;

  // Search & Filter
  searchTerm = '';
  selectedCategory = '';
  selectedSupplier = '';
  selectedStatus: number | '' = '';
  selectedStockFilter = '';
  sortBy = 'newest';
  showAdvancedFilters = false;

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedSupplier) count++;
    if (this.selectedStatus !== '') count++;
    if (this.selectedStockFilter) count++;
    if (this.sortBy && this.sortBy !== 'newest') count++;
    return count;
  }

  // Pagination State
  currentPage = 1;
  pageSize = 5;
  totalCount = 0;

  activeDropdownRowId: string | null = null;

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    this.activeDropdownRowId = this.activeDropdownRowId === id ? null : id;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.activeDropdownRowId = null;
  }


  // Modal State
  showModal = false;
  isEditMode = false;
  isSubmitting = false;
  editingProduct: Product = this.getEmptyProduct();

  // Categories Tree state
  categories: any[] = [];
  flatCategories: { id: string, name: string, pureName: string }[] = [];

  // Suppliers state
  suppliers: any[] = [];

  // History State
  showHistoryModal = false;
  productHistory: any[] = [];
  historyProduct: Product | null = null;
  isHistoryLoading = false;

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to page 1 on search
    this.loadProducts();
  }

  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private translate = inject(TranslateService);
  private categoryService = inject(CategoryService);
  private supplierService = inject(SupplierService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategoriesTree();
    this.loadSuppliers();

    this.route.queryParams.subscribe(params => {
      const editId = params['editProductId'];
      if (editId) {
        console.log('Found editProductId in query params:', editId);
        this.productService.getProduct(editId).subscribe({
          next: (product) => {
            console.log('Fetched product for edit:', product);
            if (product) {
              this.openEditModal(product);
              this.cdr.detectChanges(); // Ensure UI updates
              // Clean up the query param
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { editProductId: null },
                queryParamsHandling: 'merge'
              });
            }
          },
          error: (err) => console.error('Failed to fetch product for edit:', err)
        });
      }
    });
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
      this.cdr.detectChanges();
    });
  }

  loadCategoriesTree() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      const tree = this.buildTree(data);
      this.flatCategories = this.flattenTree(tree);
      this.cdr.detectChanges();
    });
  }

  private buildTree(categories: any[], parentId?: string, level: number = 0): any[] {
    return categories
      .filter(c => (c.parentId || null) === (parentId || null))
      .map(c => ({
        ...c,
        level: level,
        children: this.buildTree(categories, c.id, level + 1)
      }));
  }

  private flattenTree(nodes: any[], prefix = ''): { id: string, name: string, pureName: string }[] {
    const flatList: { id: string, name: string, pureName: string }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const isLast = i === nodes.length - 1;
      const connector = prefix === '' ? '' : (isLast ? '└─ ' : '├─ ');

      const displayName = prefix.replace(/ /g, '\u00A0') + connector + node.name;

      flatList.push({ id: node.id, name: displayName, pureName: node.name });

      if (node.children && node.children.length > 0) {
        const newPrefix = prefix === '' ? '   ' : (isLast ? prefix + '   ' : prefix + '│  ');
        flatList.push(...this.flattenTree(node.children, newPrefix));
      }
    }
    return flatList;
  }

  loadProducts() {
    this.productService.getPaged(this.currentPage, this.pageSize, {
      searchTerm: this.searchTerm || undefined,
      categoryId: this.selectedCategory || undefined,
      supplierId: this.selectedSupplier || undefined,
      status: this.selectedStatus !== '' ? this.selectedStatus : undefined,
      stockFilter: this.selectedStockFilter || undefined,
      sortBy: this.sortBy || undefined
    }).subscribe(res => {
      this.products = res.items;
      this.totalCount = res.totalCount;

      // Handle edge case where the current page becomes out of bounds (e.g. after deletion)
      const maxPage = Math.ceil(this.totalCount / this.pageSize);
      if (this.currentPage > maxPage && maxPage > 0) {
        this.currentPage = maxPage;
        this.loadProducts();
      } else {
        this.cdr.detectChanges();
      }
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedSupplier = '';
    this.selectedStatus = '';
    this.selectedStockFilter = '';
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.loadProducts();
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingProduct = this.getEmptyProduct();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(product: Product) {
    this.isEditMode = true;
    this.editingProduct = { ...product };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }

  openHistoryModal(product: Product) {
    this.historyProduct = product;
    this.showHistoryModal = true;
    this.isHistoryLoading = true;
    this.transactionService.getProductTransactionHistory(product.id).subscribe({
      next: (res) => {
        this.productHistory = res;
        this.isHistoryLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.isHistoryLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.productHistory = [];
    this.historyProduct = null;
    this.cdr.detectChanges();
  }

  saveProduct() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.isEditMode) {
      this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: () => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.createProduct(this.editingProduct).subscribe({
        next: () => {
          this.currentPage = 1; // Reset to page 1 to see the newly added product
          this.loadProducts();
          this.closeModal();
        },
        error: () => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteProduct(id: string) {
    this.alertService.confirm('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này không?').then((result: any) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            this.alertService.success('Thành công', 'Đã xóa sản phẩm.');
          },
          error: (err) => {
            this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.LOAD_ERROR') + ': ' + (err.error?.title || err.message));
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onMainImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe(res => {
        this.editingProduct.mainImageUrl = res.url;
        this.cdr.detectChanges();
      });
    }
  }

  removeMainImage() {
    this.editingProduct.mainImageUrl = '';
    this.cdr.detectChanges();
  }

  onAdditionalImageSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.productService.uploadImage(file).subscribe(res => {
        this.editingProduct.additionalImages = this.editingProduct.additionalImages || [];
        this.editingProduct.additionalImages.push(res.url);
        this.cdr.detectChanges();
      });
    }
  }

  removeAdditionalImage(index: number) {
    if (this.editingProduct.additionalImages) {
      this.editingProduct.additionalImages.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  addUnit() {
    if (!this.editingProduct.units) {
      this.editingProduct.units = [];
    }
    this.editingProduct.units.push({
      unitName: '',
      conversionFactor: 1,
      price: 0
    });
    this.cdr.detectChanges();
  }

  removeUnit(index: number) {
    if (this.editingProduct.units) {
      this.editingProduct.units.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  private getEmptyProduct(): Product {
    return {
      id: "",
      name: '',
      categoryId: '',
      costPrice: 0,
      wholesalePrice: 0,
      price: 0,
      stockQuantity: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      unit: 'kg',
      status: 'Active',
      supplierId: undefined,
      mainImageUrl: '',
      additionalImages: [],
      units: []
    };
  }
}
