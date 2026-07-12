import { Component, OnInit, ChangeDetectionStrategy, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SupplierService, Supplier } from '../../services/supplier.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, TranslatePipe],
  templateUrl: './suppliers.component.html'
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private alertService = inject(AlertService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm: string = '';
  isLoading = false;
  isSubmitting = false;

  showModal = false;
  activeDropdownRowId: string | null = null;
  editingSupplier: Supplier | null = null;
  
  formData: Partial<Supplier> = {
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: '',
    email: '',
    bankAccountNumber: '',
    bankName: ''
  };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data || [];
        this.filteredSuppliers = [...this.suppliers];
        this.onSearchChange();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.LOAD_ERROR') + ': ' + (err.error?.title || err.message));
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange() {
    if (!this.searchTerm) {
      this.filteredSuppliers = [...this.suppliers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSuppliers = this.suppliers.filter(s => 
        s.fullName?.toLowerCase().includes(term) || 
        s.phoneNumber?.toLowerCase().includes(term)
      );
    }
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeDropdownRowId === id) {
      this.activeDropdownRowId = null;
    } else {
      this.activeDropdownRowId = id;
    }
  }

  openCreateModal() {
    this.editingSupplier = null;
    this.formData = { fullName: '', phoneNumber: '', address: '', notes: '', email: '', bankAccountNumber: '', bankName: '' };
    this.showModal = true;
  }

  openEditModal(supplier: Supplier) {
    this.editingSupplier = supplier;
    this.formData = { ...supplier };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveSupplier() {
    if (!this.formData.fullName?.trim()) {
      this.alertService.error('Lỗi', 'Vui lòng nhập tên nhà cung cấp');
      return;
    }
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.editingSupplier) {
      this.supplierService.updateSupplier(this.editingSupplier.id, this.formData).subscribe({
        next: () => {
          this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.SAVE_SUCCESS'));
          this.loadSuppliers();
          this.closeModal();
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.SAVE_ERROR') + ': ' + (err.error?.title || err.message));
          this.cdr.detectChanges();
        }
      });
    } else {
      this.supplierService.createSupplier(this.formData).subscribe({
        next: () => {
          this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.SAVE_SUCCESS'));
          this.loadSuppliers();
          this.closeModal();
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.SAVE_ERROR') + ': ' + (err.error?.title || err.message));
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteSupplier(id: string) {
    this.alertService.confirm(this.translate.instant('COMMON.CONFIRM'), this.translate.instant('COMMON.DELETE_CONFIRM')).then((result: any) => {
      if (result.isConfirmed) {
        this.supplierService.deleteSupplier(id).subscribe({
          next: () => {
            this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.DELETE_SUCCESS'));
            this.loadSuppliers();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.alertService.error(this.translate.instant('COMMON.ERROR'), this.translate.instant('COMMON.DELETE_ERROR') + ': ' + (err.error?.title || err.message));
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
