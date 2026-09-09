import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountHeaderComponent } from '../account-header/account-header.component';

interface StatementItem {
  date: string;
  orderId: string;
  details: string;
  amount: string;
  isCredit: boolean;
}

@Component({
  selector: 'app-account-statements',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AccountHeaderComponent],
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class AccountStatementsComponent {
  selectedYear: 'current' | '2025' | '2024' | '2023' = 'current';
  selectedInvoiceType = 'individual';

  statementsByYear: Record<'current' | '2025' | '2024' | '2023', StatementItem[]> = {
    current: [
      { date: 'Sep 05, 2026', orderId: '102445788', details: 'Darknight Transparency 36 Icons Pack', amount: '$38.00', isCredit: true },
      { date: 'Aug 24, 2026', orderId: '423445721', details: 'Platform Marketplace Seller Fee', amount: '-$2.60', isCredit: false },
      { date: 'Aug 08, 2026', orderId: '312445984', details: 'Cartoon Mobile Emoji 3D Illustration Pack', amount: '$76.00', isCredit: true },
      { date: 'Jul 15, 2026', orderId: '891244598', details: 'iPhone 16 Pro Mockup Mega Bundle', amount: '$54.00', isCredit: true },
      { date: 'Jun 30, 2026', orderId: '523445943', details: 'Payment Processing Gateway Fee', amount: '-$1.30', isCredit: false },
      { date: 'May 22, 2026', orderId: '231445943', details: 'Parcel Logistics Delivery SaaS License', amount: '$204.00', isCredit: true },
      { date: 'Apr 09, 2026', orderId: '426445943', details: 'Visual Design System & Iconography', amount: '$31.00', isCredit: true }
    ],
    '2025': [
      { date: 'Nov 12, 2025', orderId: '984445943', details: 'Abstract 3D Visual Assets Collection', amount: '$152.00', isCredit: true },
      { date: 'Oct 04, 2025', orderId: '324442313', details: 'Transaction Maintenance Fee', amount: '-$3.80', isCredit: false },
      { date: 'Sep 18, 2025', orderId: '772341902', details: 'Angular Enterprise Admin Template License', amount: '$340.00', isCredit: true }
    ],
    '2024': [
      { date: 'Dec 15, 2024', orderId: '654321987', details: 'Full Stack Starter Kit Premium', amount: '$99.00', isCredit: true },
      { date: 'Jun 20, 2024', orderId: '123456789', details: 'Hosting Server Renewal Fee', amount: '-$12.50', isCredit: false }
    ],
    '2023': [
      { date: 'Aug 10, 2023', orderId: '876543210', details: 'Initial Platform Merchant Onboarding', amount: '$45.00', isCredit: true }
    ]
  };

  get activeStatements(): StatementItem[] {
    return this.statementsByYear[this.selectedYear] || [];
  }

  downloadInvoice(item: StatementItem): void {
    alert(`Downloading statement for order #${item.orderId}...`);
  }

  withdrawEarnings(): void {
    alert('Withdrawal request of $6,840 has been sent to your primary payout account.');
  }
}
