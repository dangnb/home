import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  isLoading = false;
  errorMsg = '';
  showPassword = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  onSubmit() {
    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        // Just storing directly on localStorage for simplicity
        localStorage.setItem('jwtToken', res.token);
        localStorage.setItem('authInfo', JSON.stringify(res));
        this.isLoading = false;

        // Navigate to admin
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Sai tên đăng nhập hoặc mật khẩu, vui lòng thử lại.';
      }
    });
  }
}
