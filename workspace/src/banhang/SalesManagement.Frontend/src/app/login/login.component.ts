import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';
    isLoading = false;
    errorMessage = '';

    constructor(private http: HttpClient, private router: Router) { }

    onSubmit() {
        this.isLoading = true;
        this.errorMessage = '';

        // Send POST request to backend API
        this.http.post<any>('http://localhost:5062/api/auth/login', {
            username: this.username,
            password: this.password
        }).subscribe({
            next: (response) => {
                this.isLoading = false;
                // Simulating processing the JWT Token
                console.log('Login successful, Token:', response.token);
                alert('Login Successful! Welcome ' + this.username);
                // Optionally redirect back to dashboard
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;
                if (error.status === 401) {
                    this.errorMessage = 'Mật khẩu hoặc tài khoản không đúng.';
                } else {
                    this.errorMessage = 'Có lỗi xảy ra kết nối tới Server. Đảm bảo API backend đang chạy và DB đã được tạo.';
                }
                console.error('Login error', error);
            }
        });
    }
}
