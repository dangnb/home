import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountHeaderComponent } from '../account-header/account-header.component';

interface SecurityMetric {
  userSignIn: number;
  adminSignIn: number;
  failedAttempts: number;
  successRate: number;
}

interface LoginSession {
  location: string;
  status: 'OK' | 'WRN' | 'ERR';
  device: string;
  ip: string;
  time: string;
}

interface LicenseUsage {
  status: string;
  operator: string;
  duration: string;
  ip: string;
  date: string;
}

@Component({
  selector: 'app-account-security',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AccountHeaderComponent],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class AccountSecurityComponent {
  selectedPeriod: 'hours' | 'day' | 'week' = 'hours';
  selectedTarget: 'agents' | 'clients' = 'agents';
  selectedHourFilter = '12';

  periodMetrics: Record<'hours' | 'day' | 'week', SecurityMetric> = {
    hours: { userSignIn: 36899, adminSignIn: 72, failedAttempts: 291, successRate: 98.4 },
    day: { userSignIn: 30467, adminSignIn: 120, failedAttempts: 23, successRate: 99.2 },
    week: { userSignIn: 124500, adminSignIn: 340, failedAttempts: 87, successRate: 99.8 }
  };

  loginSessions: LoginSession[] = [
    { location: 'USA (California)', status: 'OK', device: 'Chrome - Windows 11', ip: '236.125.56.78', time: '2 mins ago' },
    { location: 'United Kingdom (London)', status: 'OK', device: 'Safari - macOS Sonoma', ip: '185.220.101.5', time: '12 mins ago' },
    { location: 'Norway (Oslo)', status: 'ERR', device: 'Firefox - Ubuntu 24.04', ip: '236.125.56.10', time: '25 mins ago' },
    { location: 'Japan (Tokyo)', status: 'OK', device: 'Mobile Safari - iOS 18', ip: '236.125.56.54', time: '35 mins ago' },
    { location: 'Italy (Rome)', status: 'WRN', device: 'Samsung Browser - Android 14', ip: '236.100.56.50', time: '1 hour ago' },
    { location: 'Vietnam (Hanoi)', status: 'OK', device: 'Edge - Windows 11', ip: '113.190.234.12', time: '2 hours ago' }
  ];

  licenseUsages: LicenseUsage[] = [
    { status: 'Active', operator: 'Max Smith (max@kt.com)', duration: '4h 15m', ip: '236.125.56.78', date: 'Sep 08, 2026' },
    { status: 'Active', operator: 'Emma Smith (emma@smith.com)', duration: '2h 40m', ip: '185.220.101.5', date: 'Sep 08, 2026' },
    { status: 'Revoked', operator: 'Unknown Client', duration: '12m', ip: '236.125.56.10', date: 'Sep 07, 2026' },
    { status: 'Active', operator: 'Melody Macy (melody@altbox.com)', duration: '6h 10m', ip: '236.125.56.54', date: 'Sep 06, 2026' }
  ];

  get currentMetrics(): SecurityMetric {
    return this.periodMetrics[this.selectedPeriod];
  }

  downloadSecurityReport(): void {
    alert('Security Audit Report has been exported to CSV.');
  }
}
