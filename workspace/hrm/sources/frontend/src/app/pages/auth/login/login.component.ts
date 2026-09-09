import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  usernameOrEmail = 'superadmin';
  password = 'Admin@123456';
  rememberMe = true;
  errorMessage = '';

  fillSuperAdmin(): void {
    this.usernameOrEmail = 'superadmin';
    this.password = 'Admin@123456';
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập/email và mật khẩu.';
      return;
    }

    this.errorMessage = '';
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: () => {
        this.router.navigate(['/hrm/dashboard']);
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
      }
    });
  }
}
