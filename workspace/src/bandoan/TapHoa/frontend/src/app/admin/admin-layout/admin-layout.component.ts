import { Component, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';



@Component({
    selector: 'app-admin-layout',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;
  isDarkMode = false;
  currentFontSize = 14;

  showNotifications = false;
  lowStockCount = 0;
  lowStockProducts: any[] = [];

  constructor(private productService: ProductService, private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(this.showNotifications) {
      if(!this.eRef.nativeElement.contains(event.target)) {
        this.showNotifications = false;
      }
    }
  }

  ngOnInit() {
    // Load theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }

    // Load font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      this.currentFontSize = parseInt(savedFontSize, 10);
      document.documentElement.style.setProperty('--root-font-size', `${this.currentFontSize}px`);
    }

    this.loadNotifications();
  }

  loadNotifications() {
    this.productService.getLowStockProducts().subscribe({
      next: (products) => {
        this.lowStockProducts = products || [];
        this.lowStockCount = this.lowStockProducts.length;
      }
    });
  }

  toggleNotifications(event?: Event) {
    if(event) {
        event.stopPropagation();
    }
    this.showNotifications = !this.showNotifications;
  }

  changeFontSize(step: number) {
    this.currentFontSize += step;
    if (this.currentFontSize < 12) this.currentFontSize = 12;
    if (this.currentFontSize > 24) this.currentFontSize = 24;

    document.documentElement.style.setProperty('--root-font-size', `${this.currentFontSize}px`);
    localStorage.setItem('fontSize', this.currentFontSize.toString());
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
}
