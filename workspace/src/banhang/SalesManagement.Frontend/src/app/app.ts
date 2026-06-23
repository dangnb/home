import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);
  protected readonly title = signal('SalesManagement.Frontend');
  activeUrl = signal('/');

  ngOnInit() {
    this.activeUrl.set(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeUrl.set(event.urlAfterRedirects);
    });

    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      splashScreen.style.display = 'none';
      splashScreen.remove();
    }
  }

  isHome() {
    return this.activeUrl() === '/';
  }

  isLoginPage() {
    return this.activeUrl() === '/login';
  }

  startTrial() {
    alert("Exciting journey ahead! Trial initialization process starting...");
  }
}
