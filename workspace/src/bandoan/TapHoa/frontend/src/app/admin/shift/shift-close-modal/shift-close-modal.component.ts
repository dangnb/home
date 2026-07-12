import { Component, EventEmitter, Output, inject, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NumberFormatDirective } from '../../../shared/directives/number-format.directive';
import { ShiftService, ShiftDto } from '../../../services/shift.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-shift-close-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, NumberFormatDirective],
  template: `
    <app-modal *ngIf="isOpen" [title]="'CHỐT CA LÀM VIỆC'" (closeDialog)="close()">
      <div class="space-y-4" *ngIf="currentShift">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500 mb-1">Thời gian bắt đầu</p>
            <p class="font-bold text-gray-800">{{ currentShift.startTime | date:'medium' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="text-sm text-gray-500 mb-1">Tiền lẻ đầu ca</p>
            <p class="font-bold text-blue-600">{{ currentShift.startingCash | number }} đ</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tiền mặt thực tế đếm được (VND)</label>
          <input type="text" appNumberFormat [(ngModel)]="actualCash"
                 class="w-full px-4 py-3 text-lg font-bold text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                 placeholder="Nhập số tiền...">
          <p class="text-xs text-gray-500 mt-1">Đếm toàn bộ số tiền mặt có trong két để hệ thống tính toán chênh lệch Thừa/Thiếu.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
          <textarea [(ngModel)]="notes" rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Ghi chú thêm nếu bị lệch tiền..."></textarea>
        </div>
      </div>

      <div modal-footer class="flex justify-end gap-3 w-full">
        <button (click)="close()" [disabled]="isSubmitting"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Hủy
        </button>
        <button (click)="submit()" [disabled]="isSubmitting"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
          <i class="fas fa-lock" *ngIf="!isSubmitting"></i>
          <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
          Xác nhận Chốt ca
        </button>
      </div>
    </app-modal>
  `
})
export class ShiftCloseModalComponent {
  private shiftService = inject(ShiftService);
  private alertService = inject(AlertService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() currentShift: ShiftDto | null = null;
  @Output() shiftClosed = new EventEmitter<void>();

  isOpen = false;
  actualCash: number | string = '';
  notes = '';
  isSubmitting = false;

  openModal() {
    this.isOpen = true;
    this.actualCash = '';
    this.notes = '';
    this.changeDetectorRef.detectChanges();
  }

  close() {
    if (!this.isSubmitting) {
      this.isOpen = false;
    }
  }

  submit() {
    const cash = Number(this.actualCash.toString().replace(/,/g, ''));
    if (isNaN(cash) || this.actualCash === '') {
      this.alertService.error('Lỗi', 'Vui lòng nhập số tiền thực tế trong két');
      return;
    }

    this.alertService.confirm('Xác nhận chốt ca', 'Bạn có chắc chắn muốn chốt ca làm việc này? Sau khi chốt sẽ không thể hoàn tác.').then(res => {
      if (res.isConfirmed) {
        this.isSubmitting = true;
        this.shiftService.closeShift({ actualCash: cash, notes: this.notes }).subscribe({
          next: () => {
            this.alertService.success('Thành công', 'Đã chốt ca làm việc!');
            this.isOpen = false;
            this.isSubmitting = false;
            this.shiftClosed.emit();
          },
          error: (err) => {
            this.alertService.error('Lỗi', err.error?.title || 'Không thể chốt ca');
            this.isSubmitting = false;
          }
        });
      }
    });
  }
}
