import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CustomerService, Customer } from '../../services/customer.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, TranslatePipe],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);
  private alertService = inject(AlertService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm: string = '';
  isLoading = false;
  isSubmitting = false;

  showModal = false;
  activeDropdownRowId: string | null = null;
  editingCustomer: Customer | null = null;
  
  formData: Partial<Customer> = {
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: '',
    email: '',
    bankAccountNumber: '',
    bankName: ''
  };

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data || [];
        this.filteredCustomers = [...this.customers];
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
      this.filteredCustomers = [...this.customers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(c => 
        c.fullName?.toLowerCase().includes(term) || 
        c.phoneNumber?.toLowerCase().includes(term)
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
    this.editingCustomer = null;
    this.formData = { fullName: '', phoneNumber: '', address: '', notes: '', email: '', bankAccountNumber: '', bankName: '' };
    this.showModal = true;
  }

  openEditModal(customer: Customer) {
    this.editingCustomer = customer;
    this.formData = { ...customer };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCustomer() {
    if (!this.formData.fullName?.trim()) {
      this.alertService.error('Lỗi', 'Vui lòng nhập tên khách hàng');
      return;
    }
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.editingCustomer) {
      this.customerService.updateCustomer(this.editingCustomer.id, this.formData).subscribe({
        next: () => {
          this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.SAVE_SUCCESS'));
          this.loadCustomers();
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
      this.customerService.createCustomer(this.formData).subscribe({
        next: () => {
          this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.SAVE_SUCCESS'));
          this.loadCustomers();
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

  deleteCustomer(id: string) {
    this.alertService.confirm(this.translate.instant('COMMON.CONFIRM'), this.translate.instant('COMMON.DELETE_CONFIRM')).then((result: any) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe({
          next: () => {
            this.alertService.success(this.translate.instant('COMMON.SUCCESS'), this.translate.instant('COMMON.DELETE_SUCCESS'));
            this.loadCustomers();
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
