import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '../../../../core/services/ecommerce.service';
import { CustomerItem } from '../../../../core/models/ecommerce.model';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  private ecommerceService = inject(EcommerceService);

  customers: CustomerItem[] = [];
  searchTerm = '';
  statusFilter = 'All';

  // Add Customer modal
  isAddModalOpen = false;
  newCustomerName = '';
  newCustomerEmail = '';
  newCustomerCountry = 'United States';
  newCustomerStatus: CustomerItem['status'] = 'Active';

  // Active action menu
  activeActionMenuId: string | null = null;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.ecommerceService.getCustomers().subscribe(list => {
      this.customers = list.map(c => ({ ...c, selected: false }));
    });
  }

  get filteredCustomers(): CustomerItem[] {
    return this.customers.filter(c => {
      const matchSearch = !this.searchTerm ||
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchStatus = this.statusFilter === 'All' || c.status === this.statusFilter;

      return matchSearch && matchStatus;
    });
  }

  // Selection
  get selectedCount(): number {
    return this.customers.filter(c => c.selected).length;
  }

  get isAllSelected(): boolean {
    return this.filteredCustomers.length > 0 && this.filteredCustomers.every(c => c.selected);
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredCustomers.forEach(c => c.selected = checked);
  }

  deleteSelected(): void {
    const ids = this.customers.filter(c => c.selected).map(c => c.id);
    if (ids.length === 0) return;

    if (confirm(`Delete ${ids.length} selected customer(s)?`)) {
      this.ecommerceService.deleteCustomers(ids);
      this.loadCustomers();
    }
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
    this.newCustomerName = '';
    this.newCustomerEmail = '';
    this.newCustomerCountry = 'United States';
    this.newCustomerStatus = 'Active';
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  saveCustomer(): void {
    if (!this.newCustomerName || !this.newCustomerEmail) return;

    this.ecommerceService.addCustomer({
      name: this.newCustomerName,
      email: this.newCustomerEmail,
      country: this.newCustomerCountry,
      countryFlag: 'assets/media/flags/united-states.svg',
      avatar: 'assets/media/avatars/300-1.jpg',
      status: this.newCustomerStatus,
      ordersCount: 0,
      totalSpent: 0.00
    });

    this.loadCustomers();
    this.closeAddModal();
  }

  toggleActionMenu(id: string): void {
    this.activeActionMenuId = this.activeActionMenuId === id ? null : id;
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.ecommerceService.deleteCustomer(id);
      this.loadCustomers();
    }
  }
}
