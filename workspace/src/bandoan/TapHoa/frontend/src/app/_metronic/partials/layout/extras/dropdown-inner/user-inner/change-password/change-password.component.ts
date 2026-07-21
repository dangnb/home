import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({ standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  error = '';
  success = '';
  showOld = false;
  showNew = false;
  showConfirm = false;

  constructor(public modal: NgbActiveModal, private http: HttpClient) {}

  toggleShow(field: 'old' | 'new' | 'confirm'): void {
    if (field === 'old') this.showOld = !this.showOld;
    if (field === 'new') this.showNew = !this.showNew;
    if (field === 'confirm') this.showConfirm = !this.showConfirm;
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (!this.oldPassword) {
      this.error = 'Vui lÃ²ng nháº­p máº­t kháº©u cÅ©';
      return;
    }
    if (!this.newPassword) {
      this.error = 'Vui lÃ²ng nháº­p máº­t kháº©u má»›i';
      return;
    }
    if (this.newPassword.length < 6) {
      this.error = 'Máº­t kháº©u má»›i pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Máº­t kháº©u xÃ¡c nháº­n khÃ´ng khá»›p';
      return;
    }

    this.isLoading = true;
    this.http.post(`${environment.apiUrl}/accounts/change-password`, {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.isSuccess) {
          this.success = 'Äá»•i máº­t kháº©u thÃ nh cÃ´ng!';
          setTimeout(() => this.modal.close(true), 1500);
        } else {
          this.error = res?.error?.message || 'Äá»•i máº­t kháº©u tháº¥t báº¡i';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.detail || 'Äá»•i máº­t kháº©u tháº¥t báº¡i';
      },
    });
  }
}
