import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountHeaderComponent } from '../account-header/account-header.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AccountHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AccountSettingsComponent {
  // Profile model
  profile = {
    firstName: 'Max',
    lastName: 'Smith',
    company: 'Keenthemes',
    phone: '+1 (555) 234-5678',
    companySite: 'keenthemes.com',
    country: 'United States',
    language: 'English - United States',
    timezone: '(GMT-05:00) Eastern Time (US & Canada)',
    currency: 'USD - US Dollar',
    emailComm: true,
    phoneComm: false,
    allowMarketing: true
  };

  // Sign-in states
  emailEditMode = false;
  passwordEditMode = false;
  twoFactorEnabled = true;
  currentEmail = 'max@kt.com';
  newEmail = '';
  confirmPasswordForEmail = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Connected accounts
  connectedAccounts = {
    google: true,
    github: true,
    slack: false
  };

  // Email notifications
  notifications = {
    billing: true,
    newTeam: true,
    failedPayment: true,
    newsletter: false,
    securityAlerts: true
  };

  // Deactivate
  confirmDeactivate = false;

  // Alerts
  savedSuccess = false;

  saveProfile(): void {
    this.savedSuccess = true;
    setTimeout(() => {
      this.savedSuccess = false;
    }, 4000);
  }

  saveEmail(): void {
    if (this.newEmail) {
      this.currentEmail = this.newEmail;
      this.newEmail = '';
      this.confirmPasswordForEmail = '';
      this.emailEditMode = false;
      this.saveProfile();
    }
  }

  savePassword(): void {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordEditMode = false;
      this.saveProfile();
    }
  }

  toggle2FA(): void {
    this.twoFactorEnabled = !this.twoFactorEnabled;
  }

  toggleConnectedAccount(key: 'google' | 'github' | 'slack'): void {
    this.connectedAccounts[key] = !this.connectedAccounts[key];
  }

  deactivateAccount(): void {
    if (this.confirmDeactivate) {
      alert('Your account deactivation request has been submitted.');
    }
  }
}
