import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  referenceId?: number;
  targetUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.readApiUrl;

  readonly notifications = signal<NotificationItem[]>([]);
  readonly loading = signal<boolean>(false);

  readonly unreadCount = computed(() => 
    this.notifications().filter(n => !n.isRead).length
  );

  constructor() {
    this.loadNotifications();
    // Poll every 30 seconds for new notifications
    setInterval(() => {
      this.loadNotifications(true);
    }, 30000);
  }

  loadNotifications(silent: boolean = false): void {
    if (!silent) this.loading.set(true);

    this.http.get<NotificationItem[]>(`${this.apiUrl}/notifications?limit=20`)
      .subscribe({
        next: (res) => {
          this.notifications.set(res || []);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load notifications', err);
          this.loading.set(false);
        }
      });
  }

  markAsRead(id: number): void {
    this.http.post(`${this.apiUrl}/notifications/${id}/read`, {})
      .subscribe({
        next: () => {
          this.notifications.update(list => 
            list.map(n => n.id === id ? { ...n, isRead: true } : n)
          );
        }
      });
  }

  markAllAsRead(): void {
    this.http.post(`${this.apiUrl}/notifications/read-all`, {})
      .subscribe({
        next: () => {
          this.notifications.update(list => 
            list.map(n => ({ ...n, isRead: true }))
          );
        }
      });
  }
}
