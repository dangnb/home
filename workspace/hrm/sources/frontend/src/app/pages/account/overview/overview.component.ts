import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountHeaderComponent } from '../account-header/account-header.component';

interface TopCategory {
  name: string;
  sales: string;
  percentage: number;
  color: string;
  icon: string;
}

interface DeliveryItem {
  id: string;
  title: string;
  status: string;
  statusClass: string;
  date: string;
  recipient: string;
  carrier: string;
}

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountHeaderComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class AccountOverviewComponent {
  topCategories: TopCategory[] = [
    { name: 'Electronics & Gadgets', sales: '$45,200', percentage: 72, color: 'bg-primary', icon: 'bi-laptop' },
    { name: 'Fashion & Apparel', sales: '$28,400', percentage: 54, color: 'bg-success', icon: 'bi-handbag' },
    { name: 'Health & Beauty', sales: '$19,650', percentage: 38, color: 'bg-warning', icon: 'bi-heart-pulse' },
    { name: 'Home & Kitchen', sales: '$14,200', percentage: 26, color: 'bg-info', icon: 'bi-house-door' }
  ];

  deliveries: DeliveryItem[] = [
    { id: '#PKG-9824', title: 'MacBook Pro 16 M3 Max', status: 'Delivered', statusClass: 'badge-light-success', date: 'Today, 10:45 AM', recipient: 'Emma Smith', carrier: 'FedEx Express' },
    { id: '#PKG-8742', title: 'Sony WH-1000XM5 Headphones', status: 'In Transit', statusClass: 'badge-light-primary', date: 'Yesterday, 3:20 PM', recipient: 'Melody Macy', carrier: 'DHL Global' },
    { id: '#PKG-6531', title: 'iPad Air 11" 256GB Wi-Fi', status: 'Processing', statusClass: 'badge-light-warning', date: 'Sep 05, 2026', recipient: 'Max Smith', carrier: 'UPS Next Day' },
    { id: '#PKG-5412', title: 'Keychron Q1 Pro Mechanical Keyboard', status: 'Delivered', statusClass: 'badge-light-success', date: 'Aug 29, 2026', recipient: 'Sean Bean', carrier: 'FedEx Ground' }
  ];
}
