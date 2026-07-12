import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NumberFormatDirective } from '../../../shared/directives/number-format.directive';
import { ShiftService } from '../../../services/shift.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-shift-open-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, NumberFormatDirective, TranslatePipe],
  template: `
    <app-modal *ngIf="isOpen" [title]="'MỞ CA LÀM VIỆC'" (closeDialog)="onCloseAttempt()">
      <div class="space-y-4">
        <div class="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
          <p class="font-medium">⚠️ Yêu cầu bắt buộc</p>
          <p class="text-sm">Bạn phải mở ca làm việc và xác nhận số tiền lẻ ban đầu có trong két trước khi có thể thực hiện giao dịch tại máy POS.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Số tiền lẻ đầu ca (VND)</label>
          <input type="text" appNumberFormat [(ngModel)]="startingCash"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 placeholder="VD: 500,000">
        </div>
      </div>

      <div modal-footer class="flex justify-end gap-3 w-full">
        <!-- Not allowing cancel, so no cancel button -->
        <button (click)="submit()" [disabled]="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
          <i class="fas fa-play" *ngIf="!isSubmitting"></i>
          <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
          Mở ca
        </button>
      </div>
    </app-modal>
  `
})
export class ShiftOpenModalComponent {
  private shiftService = inject(ShiftService);
  private alertService = inject(AlertService);
  private translate = inject(TranslateService);

  @Output() shiftOpened = new EventEmitter<void>();

  isOpen = true; // Always open when rendered
  startingCash: number | string = 0;
  isSubmitting = false;

  onCloseAttempt() {
    this.alertService.warning('Bắt buộc', 'Vui lòng mở ca trước khi tiếp tục!');
  }

  submit() {
    const cash = Number(this.startingCash.toString().replace(/,/g, ''));
    if (isNaN(cash) || cash < 0) {
      this.alertService.error('Lỗi', 'Số tiền không hợp lệ');
      return;
    }

    this.isSubmitting = true;
    this.shiftService.openShift({ startingCash: cash }).subscribe({
      next: (res) => {
        this.alertService.success('Thành công', 'Đã mở ca làm việc!');
        this.isOpen = false;
        this.shiftOpened.emit();
      },
      error: (err) => {
        this.alertService.error('Lỗi', err.error?.title || 'Không thể mở ca');
        this.isSubmitting = false;
      }
    });
  }
}
