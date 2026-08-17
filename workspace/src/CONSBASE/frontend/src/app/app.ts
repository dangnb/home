import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  isFieldMode = false;

  setMode(fieldMode: boolean) {
    this.isFieldMode = fieldMode;
    if (fieldMode) {
      this.router.navigate(['/field']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
