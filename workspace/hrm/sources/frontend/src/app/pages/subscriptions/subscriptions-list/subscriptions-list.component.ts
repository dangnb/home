import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubscriptionsService } from '../../../core/services/subscriptions.service';
import { Subscription } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-subscriptions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './subscriptions-list.component.html',
  styleUrls: ['./subscriptions-list.component.scss']
})
export class SubscriptionsListComponent implements OnInit {
  private subsService = inject(SubscriptionsService);

  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];

  // Search & Filter
  searchTerm = '';
  selectedStatus = '';
  selectedBilling = '';
  isFilterOpen = false;

  // Selection
  selectAll = false;
  selectedCount = 0;

  // Add Modal
  isAddModalOpen = false;
  newCustomerName = '';
  newCustomerEmail = '';
  newProduct: 'Basic' | 'Basic Bundle' | 'Teams' | 'Enterprise' = 'Teams';
  newBilling: 'Auto-debit' | 'Manual - Credit Card' | 'Manual - Paypal' = 'Auto-debit';
  newStatus: 'Active' | 'Expiring' | 'Suspended' = 'Active';

  // Export Modal
  isExportModalOpen = false;
  exportFormat = 'excel';
  isExporting = false;
  exportCompleted = false;

  ngOnInit(): void {
    this.subsService.getSubscriptions().subscribe(list => {
      this.subscriptions = list;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    let result = [...this.subscriptions];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(s =>
        s.customerName.toLowerCase().includes(term) ||
        s.customerEmail.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus) {
      result = result.filter(s => s.status === this.selectedStatus);
    }

    if (this.selectedBilling) {
      result = result.filter(s => s.billing === this.selectedBilling);
    }

    this.filteredSubscriptions = result;
    this.updateSelectionStats();
  }

  resetFilter(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedBilling = '';
    this.applyFilter();
    this.isFilterOpen = false;
  }

  toggleSelectAll(): void {
    this.filteredSubscriptions.forEach(s => (s.selected = this.selectAll));
    this.updateSelectionStats();
  }

  onItemSelect(): void {
    this.selectAll = this.filteredSubscriptions.length > 0 && this.filteredSubscriptions.every(s => s.selected);
    this.updateSelectionStats();
  }

  updateSelectionStats(): void {
    this.selectedCount = this.filteredSubscriptions.filter(s => s.selected).length;
  }

  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedCount} selected subscription(s)?`)) {
      const ids = this.filteredSubscriptions.filter(s => s.selected).map(s => s.id);
      this.subsService.deleteSelected(ids);
      this.selectAll = false;
      this.selectedCount = 0;
    }
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      this.subsService.deleteSubscription(id);
    }
  }

  saveSubscription(): void {
    if (!this.newCustomerName || !this.newCustomerEmail) {
      alert('Please provide Customer Name and Email');
      return;
    }

    let price = '$999 / Year';
    if (this.newProduct === 'Basic') price = '$29 / Month';
    if (this.newProduct === 'Basic Bundle') price = '$69 / Month';
    if (this.newProduct === 'Teams') price = '$199 / Month';

    this.subsService.addSubscription({
      customerName: this.newCustomerName,
      customerEmail: this.newCustomerEmail,
      initials: this.newCustomerName.charAt(0).toUpperCase(),
      initialsColor: 'primary',
      product: this.newProduct,
      billing: this.newBilling,
      status: this.newStatus,
      price
    });

    this.isAddModalOpen = false;
    this.newCustomerName = '';
    this.newCustomerEmail = '';
  }

  startExport(): void {
    this.isExporting = true;
    setTimeout(() => {
      this.isExporting = false;
      this.exportCompleted = true;
      setTimeout(() => {
        this.exportCompleted = false;
        this.isExportModalOpen = false;
      }, 1500);
    }, 1500);
  }
}
