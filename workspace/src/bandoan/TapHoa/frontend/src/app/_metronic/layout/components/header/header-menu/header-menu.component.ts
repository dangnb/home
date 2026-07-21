import { Component, OnInit } from '@angular/core';

@Component({ standalone: false,
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  companyName = '';

  ngOnInit(): void {
    this.loadCompanyName();
  }

  private loadCompanyName(): void {
    try {
      const tokenKey = localStorage.getItem('authf649fc9a5f57');
      if (tokenKey) {
        const payload = JSON.parse(atob(tokenKey.split('.')[1]));
        this.companyName = payload.CompanyName || payload.companyName || payload.company || 'Thu Phí';
      } else {
        this.companyName = 'Thu Phí';
      }
    } catch {
      this.companyName = 'Thu Phí';
    }
  }
}
