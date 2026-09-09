import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountHeaderComponent } from '../account-header/account-header.component';

interface PaymentCard {
  id: string;
  name: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expires: string;
  isPrimary: boolean;
  logo: string;
}

interface BillingInvoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-account-billing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AccountHeaderComponent],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class AccountBillingComponent {
  activePaymentTab: 'card' | 'paypal' = 'card';
  showAddCardModal = false;

  newCard = {
    name: '',
    number: '',
    expMonth: '12',
    expYear: '2028',
    cvv: '',
    isPrimary: false
  };

  cards: PaymentCard[] = [
    {
      id: 'c1',
      name: 'Max Smith',
      type: 'visa',
      last4: '1679',
      expires: '09/27',
      isPrimary: true,
      logo: 'assets/media/svg/card-logos/visa.svg'
    },
    {
      id: 'c2',
      name: 'Max Smith',
      type: 'mastercard',
      last4: '2040',
      expires: '10/26',
      isPrimary: false,
      logo: 'assets/media/svg/card-logos/mastercard.svg'
    },
    {
      id: 'c3',
      name: 'Keenthemes Inc',
      type: 'amex',
      last4: '1290',
      expires: '03/28',
      isPrimary: false,
      logo: 'assets/media/svg/card-logos/american-express.svg'
    }
  ];

  invoices: BillingInvoice[] = [
    { id: 'INV-2026-009', date: 'Sep 01, 2026', description: 'Pro Package Monthly Subscription', amount: '$24.99', status: 'Paid' },
    { id: 'INV-2026-008', date: 'Aug 01, 2026', description: 'Pro Package Monthly Subscription', amount: '$24.99', status: 'Paid' },
    { id: 'INV-2026-007', date: 'Jul 01, 2026', description: 'Pro Package Monthly Subscription', amount: '$24.99', status: 'Paid' },
    { id: 'INV-2026-006', date: 'Jun 01, 2026', description: 'Pro Package Monthly Subscription + Extra Bandwidth', amount: '$49.99', status: 'Paid' },
    { id: 'INV-2026-005', date: 'May 01, 2026', description: 'Pro Package Monthly Subscription', amount: '$24.99', status: 'Paid' }
  ];

  makePrimary(card: PaymentCard): void {
    this.cards.forEach(c => c.isPrimary = (c.id === card.id));
  }

  deleteCard(card: PaymentCard): void {
    if (confirm(`Remove card ending in ${card.last4}?`)) {
      this.cards = this.cards.filter(c => c.id !== card.id);
    }
  }

  saveNewCard(): void {
    if (this.newCard.name && this.newCard.number) {
      const last4 = this.newCard.number.slice(-4) || '8888';
      const created: PaymentCard = {
        id: 'c' + (this.cards.length + 1),
        name: this.newCard.name,
        type: 'visa',
        last4: last4,
        expires: `${this.newCard.expMonth}/${this.newCard.expYear.slice(-2)}`,
        isPrimary: this.newCard.isPrimary,
        logo: 'assets/media/svg/card-logos/visa.svg'
      };

      if (created.isPrimary) {
        this.cards.forEach(c => c.isPrimary = false);
      }
      this.cards.push(created);
      this.showAddCardModal = false;
      this.newCard = { name: '', number: '', expMonth: '12', expYear: '2028', cvv: '', isPrimary: false };
    }
  }

  downloadInvoice(inv: BillingInvoice): void {
    alert(`Downloading ${inv.id} (${inv.amount}) PDF...`);
  }
}
