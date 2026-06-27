import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService, Supplier } from '../../services/supplier.service';
import { AlertService } from '../../services/alert.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './suppliers.component.html'
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private alertService = inject(AlertService);

  suppliers: Supplier[] = [];
  isLoading = false;
  isSubmitting = false;

  showModal = false;
  editingSupplier: Supplier | null = null;
  
  formData: Partial<Supplier> = {
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: ''
  };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.alertService.error('Lỗi', 'Không thể tải danh sách nhà cung cấp');
        this.isLoading = false;
      }
    });
  }

  openCreateModal() {
    this.editingSupplier = null;
    this.formData = { fullName: '', phoneNumber: '', address: '', notes: '' };
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
          this.alertService.success('Thành công', 'Đã cập nhật thông tin nhà cung cấp');
          this.loadSuppliers();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.alertService.error('Lỗi', err.error?.title || 'Không thể cập nhật nhà cung cấp');
          this.isSubmitting = false;
        }
      });
    } else {
      this.supplierService.createSupplier(this.formData).subscribe({
        next: () => {
          this.alertService.success('Thành công', 'Đã thêm nhà cung cấp mới');
          this.loadSuppliers();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.alertService.error('Lỗi', err.error?.title || 'Không thể tạo nhà cung cấp');
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteSupplier(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này không?')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          this.alertService.success('Thành công', 'Đã xóa nhà cung cấp');
          this.loadSuppliers();
        },
        error: (err) => {
          this.alertService.error('Lỗi', 'Không thể xóa nhà cung cấp này');
        }
      });
    }
  }
}
