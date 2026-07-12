import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierLedgerService, SupplierDebtDto, SupplierDebtTransactionDto } from '../../services/supplier-ledger.service';
import { SupplierService, Supplier } from '../../services/supplier.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { NumberFormatDirective } from '../../shared/directives/number-format.directive';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-debts',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, NumberFormatDirective, TranslatePipe],
  templateUrl: './supplier-debts.component.html',
  styleUrls: ['./supplier-debts.component.scss']
})
export class SupplierDebtsComponent implements OnInit {
  private ledgerService = inject(SupplierLedgerService);
  private supplierService = inject(SupplierService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);

  debts: SupplierDebtDto[] = [];
  filteredDebts: SupplierDebtDto[] = [];
  searchTerm: string = '';
  suppliers: Supplier[] = [];
  isLoading = true;

  showModal = false;
  showDetailModal = false;
  isSubmitting = false;
  isLoadingTransactions = false;
  modalMode: 'record' | 'pay' | 'paySpecific' = 'record';
  activeDropdownRowId: string | null = null;
  dropdownPositions: { [key: string]: { top: string, left: string } } = {};
  
  supplierTransactions: SupplierDebtTransactionDto[] = [];
  selectedSupplierForDetail: string | null = null;
  selectedTransactionToPay: any = null;

  formData = {
    supplierId: '',
    transactionId: '',
    amount: 0,
    note: '',
    dueDate: ''
  };

  ngOnInit(): void {
    this.loadDebts();
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.suppliers = data
    });
  }

  getSupplierName(supplierId: string): string {
    const supplier = this.suppliers.find(c => c.id === supplierId);
    return supplier ? supplier.fullName : supplierId;
  }

  loadDebts() {
    this.isLoading = true;
    this.ledgerService.getSupplierDebts().subscribe({
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
        const name = this.getSupplierName(d.supplierId).toLowerCase();
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

  openRecordModal(supplierId?: string) {
    this.modalMode = 'record';
    this.formData = {
      supplierId: supplierId || '',
      transactionId: '',
      amount: 0,
      note: '',
      dueDate: ''
    };
    this.showModal = true;
  }

  openPayModal(supplierId: string) {
    this.modalMode = 'pay';
    this.formData = {
      supplierId: supplierId,
      transactionId: '',
      amount: 0,
      note: '',
      dueDate: ''
    };
    this.showModal = true;
  }

  openDetailModal(supplierId: string) {
    this.selectedSupplierForDetail = supplierId;
    this.showDetailModal = true;
    this.loadTransactions(supplierId);
  }

  loadTransactions(supplierId: string) {
    this.isLoadingTransactions = true;
    this.ledgerService.getTransactions(supplierId).subscribe({
      next: (data) => {
        this.supplierTransactions = data || [];
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

  openPaySpecificModal(transaction: SupplierDebtTransactionDto) {
    this.modalMode = 'paySpecific';
    this.selectedTransactionToPay = transaction;
    this.formData = {
      supplierId: transaction.supplierId,
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
      const warnMsg = this.translateService.instant('SUPPLIER_DEBTS.MSG_PAY_ERROR') || 'Số tiền phải lớn hơn 0';
      this.alertService.warning(warnTitle, warnMsg);
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    let request;
    if (this.modalMode === 'record') {
      const due = this.formData.dueDate ? new Date(this.formData.dueDate).toISOString() : undefined;
      request = this.ledgerService.recordDebt({ supplierId: this.formData.supplierId, amount: this.formData.amount, note: this.formData.note, dueDate: due });
    } else if (this.modalMode === 'paySpecific') {
      request = this.ledgerService.paySpecificDebt({ supplierId: this.formData.supplierId, debtTransactionId: this.formData.transactionId, amount: this.formData.amount, note: this.formData.note });
    } else {
      request = this.ledgerService.payDebt({ supplierId: this.formData.supplierId, amount: this.formData.amount, note: this.formData.note });
    }

    request.subscribe({
      next: () => {
        const successTitle = this.translateService.instant('COMMON.SUCCESS') || 'Thành công';
        const successMsg = this.translateService.instant('SUPPLIER_DEBTS.MSG_PAY_SUCCESS') || 'Đã lưu giao dịch sổ nợ!';
        this.alertService.success(successTitle, successMsg);
        this.loadDebts();
        this.closeModal();
        if (this.showDetailModal && this.selectedSupplierForDetail) {
          this.loadTransactions(this.selectedSupplierForDetail);
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        const errorTitle = this.translateService.instant('COMMON.ERROR') || 'Lỗi';
        const errorMsg = err.error?.title || err.error?.message || this.translateService.instant('SUPPLIER_DEBTS.MSG_PAY_ERROR') || 'Không thể lưu giao dịch';
        this.alertService.error(errorTitle, errorMsg);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  isOverdue(dueDate: string | null | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }
}
