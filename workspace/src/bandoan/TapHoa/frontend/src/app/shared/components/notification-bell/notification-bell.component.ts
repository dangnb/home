import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule, TimeAgoPipe],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
  animations: [
    trigger('dropdownState', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8) translateY(-10px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scaleY(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scaleY(0.8) translateY(-10px)' }))
      ])
    ])
  ]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unreadCount: number = 0;
  notifications: Notification[] = [];
  isOpen: boolean = false;
  isLoading: boolean = false;
  
  private countSub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.countSub = this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.countSub) this.countSub.unsubscribe();
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications(1, 5, false).subscribe({
      next: (res) => {
        this.notifications = res.items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (notification.isRead) return;
    
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
    });
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  getIconForType(type: string): string {
    switch(type) {
      case 'LowStock': return 'bx-package';
      case 'ExpiringBatch': return 'bx-time-five';
      case 'ShiftReminder': return 'bx-calendar-event';
      case 'CustomerDebtOverdue': return 'bx-credit-card';
      case 'SystemAlert': return 'bx-error-circle';
      default: return 'bx-bell';
    }
  }
}
