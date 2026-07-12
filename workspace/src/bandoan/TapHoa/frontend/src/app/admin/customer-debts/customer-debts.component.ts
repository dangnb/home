import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerLedgerService, CustomerDebt } from '../../services/customer-ledger.service';
import { CustomerService, Customer } from '../../services/customer.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-debts',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, NumberFormatDirective, TranslatePipe],
  templateUrl: './customer-debts.component.html',
  styleUrls: ['./customer-debts.component.scss']
})
export class CustomerDebtsComponent implements OnInit {
  private ledgerService = inject(CustomerLedgerService);
  private customerService = inject(CustomerService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);

  debts: CustomerDebt[] = [];
  filteredDebts: CustomerDebt[] = [];
  searchTerm: string = '';
  customers: Customer[] = [];
  isLoading = true;

  showModal = false;
  showDetailModal = false;
  isSubmitting = false;
  isLoadingTransactions = false;
  modalMode: 'record' | 'pay' | 'paySpecific' = 'record';
  activeDropdownRowId: string | null = null;
  dropdownPositions: { [key: string]: { top: string, left: string } } = {};
  
  customerTransactions: any[] = [];
  selectedCustomerForDetail: string | null = null;
  selectedTransactionToPay: any = null;

  formData = {
    customerId: '',
    transactionId: '',
    amount: 0,
    note: '',
    dueDate: ''
  };

  ngOnInit(): void {
    this.loadDebts();
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data
    });
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? customer.fullName : customerId;
  }

  loadDebts() {
    this.isLoading = true;
    this.ledgerService.getDebts().subscribe({
      next: (data) => {
        this.debts = data || [];
        this.filteredDebts = [...this.debts];
        this.onSearchChange();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange() {
    if (!this.searchTerm) {
      this.filteredDebts = [...this.debts];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredDebts = this.debts.filter(d => {
        const name = this.getCustomerName(d.customerId).toLowerCase();
        return name.includes(term);
      });
    }
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeDropdownRowId === id) {
      this.activeDropdownRowId = null;
    } else {
      this.activeDropdownRowId = id;
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.dropdownPositions[id] = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.right - 160}px`
      };
    }
  }

  @HostListener('document:click')
  @HostListener('window:scroll')
  closeDropdowns() {
    this.activeDropdownRowId = null;
  }

  openRecordModal(customerId?: string) {
    this.modalMode = 'record';
    this.formData = {
      customerId: customerId || '',
      transactionId: '',
      amount: 0,
      note: '',
      dueDate: ''
    };
    this.showModal = true;
  }

  openPayModal(customerId: string) {
    this.modalMode = 'pay';
    this.formData = {
      customerId: customerId,
      transactionId: '',
      amount: 0,
      note: '',
      dueDate: ''
    };
    this.showModal = true;
  }

  openDetailModal(customerId: string) {
    this.selectedCustomerForDetail = customerId;
    this.showDetailModal = true;
    this.loadTransactions(customerId);
  }

  loadTransactions(customerId: string) {
    this.isLoadingTransactions = true;
    this.ledgerService.getTransactions(customerId).subscribe({
      next: (data) => {
        this.customerTransactions = data || [];
        this.isLoadingTransactions = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoadingTransactions = false;
        this.cdr.detectChanges();
      }
    });
  }

  openPaySpecificModal(transaction: any) {
    this.modalMode = 'paySpecific';
    this.selectedTransactionToPay = transaction;
    this.formData = {
      customerId: transaction.customerId,
      transactionId: transaction.id,
      amount: transaction.amount - transaction.paidAmount,
      note: '',
      dueDate: ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  submitForm() {
    if (this.formData.amount <= 0) {
      const warnTitle = this.translateService.instant('COMMON.WARNING') || 'Cảnh báo';
      const warnMsg = this.translateService.instant('CUSTOMER_DEBTS.MSG_PAY_ERROR') || 'Số tiền phải lớn hơn 0';
      this.alertService.warning(warnTitle, warnMsg);
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    let request;
    if (this.modalMode === 'record') {
      const due = this.formData.dueDate ? new Date(this.formData.dueDate).toISOString() : undefined;
      request = this.ledgerService.recordDebt(this.formData.customerId, this.formData.amount, this.formData.note, due);
    } else if (this.modalMode === 'paySpecific') {
      request = this.ledgerService.paySpecificDebt(this.formData.transactionId, this.formData.amount, this.formData.note);
    } else {
      request = this.ledgerService.recordPayment(this.formData.customerId, this.formData.amount, this.formData.note);
    }

    request.subscribe({
      next: () => {
        const successTitle = this.translateService.instant('COMMON.SUCCESS') || 'Thành công';
        const successMsg = this.translateService.instant('CUSTOMER_DEBTS.MSG_PAY_SUCCESS') || 'Đã lưu giao dịch sổ nợ!';
        this.alertService.success(successTitle, successMsg);
        this.loadDebts();
        this.closeModal();
        if (this.showDetailModal && this.selectedCustomerForDetail) {
          this.loadTransactions(this.selectedCustomerForDetail);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorTitle = this.translateService.instant('COMMON.ERROR') || 'Lỗi';
        const errorMsg = err.error?.title || err.error?.message || this.translateService.instant('CUSTOMER_DEBTS.MSG_PAY_ERROR') || 'Không thể lưu giao dịch';
        this.alertService.error(errorTitle, errorMsg);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }
}
