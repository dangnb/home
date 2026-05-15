import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'SalesManagement.Frontend';
    isLoggedIn = false;

    constructor(private router: Router) { }

    isHome(): boolean {
        return this.router.url === '/' || this.router.url === '/dashboard';
    }

    isLoginPage(): boolean {
        return this.router.url === '/login';
    }

    activeUrl(): string { return ''; }

    ngOnInit() {
        console.log('Enterprise Sales Management Frontend Initialized');
    }

    startTrial() {
        alert("Exciting journey ahead! Trial initialization process starting...");
    }
}
