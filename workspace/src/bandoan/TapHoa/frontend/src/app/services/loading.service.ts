import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  
  isLoading$ = this.isLoadingSubject.asObservable();

  show() {
    this.loadingCount++;
    if (this.loadingCount > 0 && !this.isLoadingSubject.value) {
      this.isLoadingSubject.next(true);
    }
  }

  hide() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    if (this.loadingCount === 0 && this.isLoadingSubject.value) {
      this.isLoadingSubject.next(false);
    }
  }
}
