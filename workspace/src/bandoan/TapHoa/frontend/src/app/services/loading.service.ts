import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private timeoutId: any;
  
  isLoading$ = this.isLoadingSubject.asObservable();

  show() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.timeoutId = setTimeout(() => {
        this.isLoadingSubject.next(true);
      }, 300);
    }
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      clearTimeout(this.timeoutId);
      this.isLoadingSubject.next(false);
    }
  }
}
