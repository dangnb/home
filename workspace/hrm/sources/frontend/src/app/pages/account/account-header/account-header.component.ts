import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-header.component.html',
  styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent {
  @Input() currentTab: 'overview' | 'settings' | 'security' | 'billing' | 'statements' = 'overview';
}
