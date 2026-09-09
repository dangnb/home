import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserManagementService } from '../../../core/services/user-management.service';
import { ManagedUser } from '../../../core/models/user-management.model';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userMgmtService = inject(UserManagementService);

  user: ManagedUser | null = null;
  activeTab: 'overview' | 'security' | 'billing' | 'statements' = 'overview';

  // Security tab state
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordUpdateSuccess = false;

  // Login sessions mock data
  loginSessions = [
    { location: 'USA(50.200.3.5)', device: 'Chrome - Windows', ip: '236.125.56.78', time: '2 mins ago', status: 'OK', statusColor: 'success' },
    { location: 'United Kingdom(180.156.23.1)', device: 'Safari - iOS', ip: '223.45.67.89', time: '10 mins ago', status: 'OK', statusColor: 'success' },
    { location: 'Norway(67.89.12.34)', device: 'Firefox - MacOS', ip: '198.54.32.11', time: '3 hours ago', status: 'ERR', statusColor: 'danger' },
    { location: 'Japan(112.55.90.12)', device: 'Edge - Windows', ip: '110.23.45.67', time: 'Yesterday', status: 'OK', statusColor: 'success' }
  ];

  // Invoices mock data
  invoices = [
    { id: 'INV-00142', date: 'Nov 01, 2025', description: 'Metronic SaaS Annual Plan', amount: '$420.00', status: 'Approved', statusColor: 'success' },
    { id: 'INV-00129', date: 'Oct 01, 2025', description: 'Metronic SaaS Monthly Add-ons', amount: '$35.00', status: 'Approved', statusColor: 'success' },
    { id: 'INV-00118', date: 'Sep 01, 2025', description: 'Custom API Integrations Tier', amount: '$150.00', status: 'Pending', statusColor: 'warning' },
    { id: 'INV-00095', date: 'Aug 01, 2025', description: 'Metronic Cloud Backup Pro', amount: '$20.00', status: 'Approved', statusColor: 'success' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'] || '1';
      this.userMgmtService.getUserById(id).subscribe({
        next: (res) => {
          if (res.data) {
            this.user = res.data;
          }
        },
        error: () => {
          // Fallback default
          this.user = {
            id: '1',
            username: 'superadmin',
            name: 'System Super Administrator',
            email: 'superadmin@hrmplatform.local',
            avatar: 'assets/media/avatars/300-6.jpg',
            role: 'Super Administrator',
            twoStep: true,
            lastLogin: 'Yesterday',
            joinedDate: '25 Jul 2022, 5:20 pm',
            status: 'ACTIVE',
            statusColor: 'success'
          };
        }
      });
    });
  }

  setActiveTab(tab: 'overview' | 'security' | 'billing' | 'statements'): void {
    this.activeTab = tab;
  }

  toggleTwoStep(): void {
    if (this.user) {
      this.user.twoStep = !this.user.twoStep;
      this.userMgmtService.updateUser(this.user.id, { twoStep: this.user.twoStep }).subscribe();
    }
  }

  updatePassword(): void {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match or are empty!');
      return;
    }
    this.passwordUpdateSuccess = true;
    setTimeout(() => {
      this.passwordUpdateSuccess = false;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }, 2500);
  }
}
