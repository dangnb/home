import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, interval, switchMap, startWith } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  readAt?: string;
  createdDate: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.startPolling();
  }

  // Poll unread count every 1 minute
  private startPolling() {
    interval(60000)
      .pipe(
        startWith(0),
        switchMap(() => this.getUnreadCount())
      )
      .subscribe({
        next: (res: any) => this.unreadCountSubject.next(res.count),
        error: (err) => console.error('Error fetching unread count', err)
      });
  }

  getNotifications(page: number = 1, pageSize: number = 10, unreadOnly: boolean = false): Observable<PaginatedResult<Notification>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('unreadOnly', unreadOnly.toString());
      
    return this.http.get<PaginatedResult<Notification>>(this.apiUrl, { params });
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      })
    );
  }
}
