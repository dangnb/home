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
      <div class="modal-body-content p-2" *ngIf="currentShift">
        <!-- Overview Cards -->
        <div class="row g-3 mb-4">
          <div class="col-6">
            <div class="p-3 bg-light rounded-4 border border-secondary border-opacity-10 h-100 shadow-sm d-flex flex-column justify-content-center">
              <span class="text-muted small fw-medium mb-1"><i class="bi bi-clock-history me-1"></i>Thời gian bắt đầu</span>
              <span class="fs-6 fw-bold text-dark">{{ currentShift.startTime | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
          <div class="col-6">
            <div class="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-25 h-100 shadow-sm d-flex flex-column justify-content-center">
              <span class="text-primary small fw-bold mb-1"><i class="bi bi-cash-stack me-1"></i>Tiền lẻ đầu ca</span>
              <span class="fs-5 fw-bolder text-primary">{{ currentShift.startingCash | number }}đ</span>
            </div>
          </div>
        </div>

        <!-- Input Section -->
        <div class="mb-4">
          <label class="form-label small fw-bold text-dark mb-2">Tiền mặt thực tế đếm được (VNĐ) <span class="text-danger">*</span></label>
          <div class="input-group input-group-lg shadow-sm border rounded-3 overflow-hidden">
            <span class="input-group-text bg-white border-0 text-muted"><i class="bi bi-wallet2 fs-5"></i></span>
            <input type="text" appNumberFormat [(ngModel)]="actualCash"
                   class="form-control border-0 px-2 text-dark fw-bolder text-end fs-4 shadow-none"
                   placeholder="Nhập số tiền..." style="background-color: transparent;">
            <span class="input-group-text bg-white border-0 fw-bold text-muted">đ</span>
          </div>
          <div class="form-text mt-2 text-muted small">
            <i class="bi bi-info-circle text-primary me-1"></i>Đếm toàn bộ tiền mặt trong két để hệ thống tính toán mức chênh lệch (Thừa/Thiếu).
          </div>
        </div>

        <div class="mb-2">
          <label class="form-label small fw-bold text-dark mb-2">Ghi chú (Tùy chọn)</label>
          <textarea [(ngModel)]="notes" rows="3"
                    class="form-control form-control-solid rounded-3 py-2 shadow-sm border-0 bg-light"
                    placeholder="Ghi chú nguyên nhân nếu có lệch tiền..."></textarea>
        </div>
      </div>

      <div modal-footer class="w-100 d-flex justify-content-end gap-2 mt-3">
        <button (click)="close()" [disabled]="isSubmitting"
                class="btn bg-light text-dark fw-bold rounded-pill px-4 py-2 border-0 shadow-sm transition-all hover-shadow">
          Hủy
        </button>
        <button (click)="submit()" [disabled]="isSubmitting"
                class="btn btn-danger text-white fw-bold rounded-pill px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2 transition-all hover-shadow"
                style="background: linear-gradient(135deg, #ef4444, #dc2626);">
          <i class="bi bi-lock-fill" *ngIf="!isSubmitting"></i>
          <span class="spinner-border spinner-border-sm" *ngIf="isSubmitting"></span>
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
