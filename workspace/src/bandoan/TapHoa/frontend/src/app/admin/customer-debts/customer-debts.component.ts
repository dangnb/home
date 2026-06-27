import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerLedgerService, CustomerDebt } from '../../services/customer-ledger.service';
import { CustomerService, Customer } from '../../services/customer.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-customer-debts',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './customer-debts.component.html',
  styleUrls: ['./customer-debts.component.scss']
})
export class CustomerDebtsComponent implements OnInit {
  private ledgerService = inject(CustomerLedgerService);
  private customerService = inject(CustomerService);
  private alertService = inject(AlertService);

  debts: CustomerDebt[] = [];
  customers: Customer[] = [];
  isLoading = true;

  showModal = false;
  isSubmitting = false;
  modalMode: 'record' | 'pay' = 'record';
  
  formData = {
    customerId: '',
    amount: 0,
    note: ''
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
        this.debts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  openRecordModal(customerId?: string) {
    this.modalMode = 'record';
    this.formData = {
      customerId: customerId || '',
      amount: 0,
      note: ''
    };
    this.showModal = true;
  }

  openPayModal(customerId: string) {
    this.modalMode = 'pay';
    this.formData = {
      customerId: customerId,
      amount: 0,
      note: ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitting = false;
  }

  submitForm() {
    if (this.formData.amount <= 0) {
      this.alertService.warning('Cảnh báo', 'Số tiền phải lớn hơn 0');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const request = this.modalMode === 'record' 
      ? this.ledgerService.recordDebt(this.formData.customerId, this.formData.amount, this.formData.note)
      : this.ledgerService.recordPayment(this.formData.customerId, this.formData.amount, this.formData.note);

    request.subscribe({
      next: () => {
        this.alertService.success('Thành công', 'Đã lưu giao dịch sổ nợ!');
        this.loadDebts();
        this.closeModal();
      },
      error: (err) => {
        this.alertService.error('Lỗi', err.error?.title || 'Không thể lưu giao dịch');
        this.isSubmitting = false;
      }
    });
  }
}
