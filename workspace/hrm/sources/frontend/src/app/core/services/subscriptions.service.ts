import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  private initialSubscriptions: Subscription[] = [
    {
      id: 'SUB-10492',
      customerName: 'Emma Smith',
      customerEmail: 'smith@kpmg.com',
      avatar: 'assets/media/avatars/300-6.jpg',
      status: 'Active',
      billing: 'Auto-debit',
      product: 'Enterprise',
      price: '$999 / Year',
      createdDate: '21 Oct 2024, 5:54 pm'
    },
    {
      id: 'SUB-10493',
      customerName: 'Melody Macy',
      customerEmail: 'melody@altbox.com',
      avatar: 'assets/media/avatars/300-2.jpg',
      status: 'Active',
      billing: 'Auto-debit',
      product: 'Teams',
      price: '$199 / Month',
      createdDate: '10 Mar 2024, 6:43 am'
    },
    {
      id: 'SUB-10494',
      customerName: 'Max Smith',
      customerEmail: 'max@kt.com',
      avatar: 'assets/media/avatars/300-1.jpg',
      status: 'Active',
      billing: 'Manual - Credit Card',
      product: 'Basic Bundle',
      price: '$69 / Month',
      createdDate: '25 Jul 2024, 9:00 pm'
    },
    {
      id: 'SUB-10495',
      customerName: 'Sean Bean',
      customerEmail: 'sean@dellito.com',
      avatar: 'assets/media/avatars/300-5.jpg',
      status: 'Expiring',
      billing: 'Auto-debit',
      product: 'Enterprise',
      price: '$999 / Year',
      createdDate: '19 Aug 2024, 11:20 am'
    },
    {
      id: 'SUB-10496',
      customerName: 'Brian Cox',
      customerEmail: 'brian@exchange.com',
      avatar: 'assets/media/avatars/300-25.jpg',
      status: 'Suspended',
      billing: 'Manual - Paypal',
      product: 'Basic',
      price: '$29 / Month',
      createdDate: '05 May 2024, 10:10 pm'
    },
    {
      id: 'SUB-10497',
      customerName: 'Mikaela Collins',
      customerEmail: 'mikaela@pexcom.com',
      initials: 'M',
      initialsColor: 'warning',
      status: 'Active',
      billing: 'Auto-debit',
      product: 'Teams',
      price: '$199 / Month',
      createdDate: '15 Apr 2024, 10:30 am'
    },
    {
      id: 'SUB-10498',
      customerName: 'Francis Mitcham',
      customerEmail: 'f.mitcham@kpmg.com',
      avatar: 'assets/media/avatars/300-9.jpg',
      status: 'Active',
      billing: 'Auto-debit',
      product: 'Enterprise',
      price: '$999 / Year',
      createdDate: '22 Sep 2024, 8:43 pm'
    },
    {
      id: 'SUB-10499',
      customerName: 'Olivia Wild',
      customerEmail: 'olivia@corpmail.com',
      initials: 'O',
      initialsColor: 'danger',
      status: 'Expiring',
      billing: 'Manual - Credit Card',
      product: 'Basic Bundle',
      price: '$69 / Month',
      createdDate: '01 Feb 2024, 2:40 pm'
    }
  ];

  private subscriptions$ = new BehaviorSubject<Subscription[]>(this.initialSubscriptions);

  getSubscriptions(): Observable<Subscription[]> {
    return this.subscriptions$.asObservable();
  }

  addSubscription(sub: Omit<Subscription, 'id' | 'createdDate'>): void {
    const newSub: Subscription = {
      ...sub,
      id: `SUB-${Math.floor(10000 + Math.random() * 90000)}`,
      createdDate: 'Just now'
    };
    const current = this.subscriptions$.getValue();
    this.subscriptions$.next([newSub, ...current]);
  }

  deleteSubscription(id: string): void {
    const current = this.subscriptions$.getValue().filter(s => s.id !== id);
    this.subscriptions$.next(current);
  }

  deleteSelected(ids: string[]): void {
    const set = new Set(ids);
    const current = this.subscriptions$.getValue().filter(s => !set.has(s.id));
    this.subscriptions$.next(current);
  }
}
