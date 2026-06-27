import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer } from '../../services/customer.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);
  private alertService = inject(AlertService);

  customers: Customer[] = [];
  isLoading = false;
  isSubmitting = false;

  showModal = false;
  editingCustomer: Customer | null = null;
  
  formData: Partial<Customer> = {
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: ''
  };

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.alertService.error('Lỗi', 'Không thể tải danh sách khách hàng');
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.editingCustomer = null;
    this.formData = { fullName: '', phoneNumber: '', address: '', notes: '' };
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
          this.alertService.success('Thành công', 'Đã cập nhật thông tin khách hàng');
          this.loadCustomers();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.alertService.error('Lỗi', err.error?.title || 'Không thể cập nhật khách hàng');
          this.isSubmitting = false;
        }
      });
    } else {
      this.customerService.createCustomer(this.formData).subscribe({
        next: () => {
          this.alertService.success('Thành công', 'Đã thêm khách hàng mới');
          this.loadCustomers();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.alertService.error('Lỗi', err.error?.title || 'Không thể tạo khách hàng');
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteCustomer(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.alertService.success('Thành công', 'Đã xóa khách hàng');
          this.loadCustomers();
        },
        error: (err) => {
          this.alertService.error('Lỗi', 'Không thể xóa khách hàng này');
        }
      });
    }
  }
}
