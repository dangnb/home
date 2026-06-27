import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier, SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm: string = '';
  
  isModalOpen = false;
  isEditMode = false;
  currentSupplier: Partial<Supplier> = {};

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe((data) => {
      this.suppliers = data;
      this.filterSuppliers();
    });
  }

  filterSuppliers() {
    if (!this.searchTerm) {
      this.filteredSuppliers = this.suppliers;
    } else {
      const lowerTerm = this.searchTerm.toLowerCase();
      this.filteredSuppliers = this.suppliers.filter(
        (s) =>
          s.fullName.toLowerCase().includes(lowerTerm) ||
          s.phoneNumber?.toLowerCase().includes(lowerTerm)
      );
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentSupplier = { fullName: '', phoneNumber: '', address: '', notes: '' };
    this.isModalOpen = true;
  }

  openEditModal(supplier: Supplier) {
    this.isEditMode = true;
    this.currentSupplier = { ...supplier };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentSupplier = {};
  }

  saveSupplier() {
    if (this.isEditMode && this.currentSupplier.id) {
      this.supplierService.updateSupplier(this.currentSupplier.id, this.currentSupplier).subscribe(() => {
        this.loadSuppliers();
        this.closeModal();
      });
    } else {
      this.supplierService.createSupplier(this.currentSupplier).subscribe(() => {
        this.loadSuppliers();
        this.closeModal();
      });
    }
  }

  deleteSupplier(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => {
        this.loadSuppliers();
      });
    }
  }
}
