import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 99999;">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show mb-3 shadow-lg border-0" [ngClass]="'bg-' + toast.type" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex align-items-center text-white p-3">
            <div class="toast-body flex-grow-1">
              <strong class="d-block mb-1 fs-6">{{ toast.title }}</strong>
              <span class="fs-7 opacity-90">{{ toast.message }}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toastService.remove(toast.id)"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
