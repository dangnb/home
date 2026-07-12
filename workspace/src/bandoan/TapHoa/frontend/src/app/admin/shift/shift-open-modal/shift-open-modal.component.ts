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
      <div class="modal-body-content p-2">
        <div class="alert alert-warning border-warning border-opacity-25 bg-warning bg-opacity-10 d-flex gap-3 align-items-start rounded-4 mb-4 shadow-sm">
          <i class="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
          <div>
            <h6 class="fw-bold mb-1 text-dark">Yêu cầu bắt buộc</h6>
            <p class="mb-0 small text-muted">Bạn phải mở ca làm việc và xác nhận số tiền lẻ ban đầu có trong két trước khi có thể thực hiện giao dịch tại máy POS.</p>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-dark mb-2">Số tiền lẻ đầu ca (VNĐ) <span class="text-danger">*</span></label>
          <div class="input-group input-group-lg shadow-sm border rounded-3 overflow-hidden">
            <span class="input-group-text bg-white border-0 text-muted"><i class="bi bi-cash-stack fs-5"></i></span>
            <input type="text" appNumberFormat [(ngModel)]="startingCash"
                   class="form-control border-0 px-2 text-dark fw-bolder text-end fs-4 shadow-none"
                   placeholder="Nhập số tiền..." style="background-color: transparent;">
            <span class="input-group-text bg-white border-0 fw-bold text-muted">đ</span>
          </div>
          <div class="form-text mt-2 text-muted small">
            <i class="bi bi-info-circle text-primary me-1"></i>Nhập số tiền chuẩn xác để hệ thống tính toán chính xác số dư cuối ca.
          </div>
        </div>
      </div>

      <div modal-footer class="w-100 d-flex justify-content-end mt-3">
        <button (click)="submit()" [disabled]="isSubmitting"
                class="btn btn-primary text-white fw-bold rounded-pill px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2 transition-all hover-shadow"
                style="background: linear-gradient(135deg, #3b82f6, #2563eb);">
          <i class="bi bi-play-fill" *ngIf="!isSubmitting"></i>
          <span class="spinner-border spinner-border-sm" *ngIf="isSubmitting"></span>
          Bắt đầu ca làm việc
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
