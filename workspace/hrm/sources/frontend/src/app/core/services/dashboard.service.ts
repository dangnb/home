import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardOverview } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getOverview(): Observable<DashboardOverview> {
    const data: DashboardOverview = {
      stats: [
        {
          title: 'Total Sales',
          value: '$500,400',
          change: '+18.2%',
          isPositive: true,
          icon: 'bi-graph-up-arrow',
          badgeBg: 'success'
        },
        {
          title: 'Active Users',
          value: '45,200',
          change: '+4.5%',
          isPositive: true,
          icon: 'bi-people',
          badgeBg: 'primary'
        },
        {
          title: 'New Orders',
          value: '1,890',
          change: '-2.4%',
          isPositive: false,
          icon: 'bi-cart-check',
          badgeBg: 'danger'
        },
        {
          title: 'Pending Invoices',
          value: '$24,500',
          change: '+9.1%',
          isPositive: true,
          icon: 'bi-cash-coin',
          badgeBg: 'warning'
        }
      ],
      activities: [
        {
          id: '1',
          title: 'Project Kickoff Meeting',
          time: '08:42 AM',
          description: 'Discussed project scope and technical milestones with the design team.',
          badgeColor: 'success'
        },
        {
          id: '2',
          title: 'New Order Received #48920',
          time: '10:00 AM',
          description: 'Payment verified and order forwarded to warehouse.',
          badgeColor: 'primary'
        },
        {
          id: '3',
          title: 'System Server Maintenance',
          time: '02:30 PM',
          description: 'Completed scheduled security patch and database optimization.',
          badgeColor: 'warning'
        },
        {
          id: '4',
          title: 'Customer Feedback Received',
          time: '04:15 PM',
          description: 'Customer rated service 5 stars for fast turnaround.',
          badgeColor: 'info'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'Metronic Angular 18 Portal',
          client: 'Keenthemes Inc.',
          logo: 'assets/media/svg/brand-logos/angular-icon.svg',
          budget: '$14,500',
          progress: 85,
          status: 'In Progress',
          statusColor: 'primary'
        },
        {
          id: '2',
          name: 'E-commerce API Integration',
          client: 'Shopify Partner',
          logo: 'assets/media/svg/brand-logos/slack-icon.svg',
          budget: '$8,200',
          progress: 100,
          status: 'Completed',
          statusColor: 'success'
        },
        {
          id: '3',
          name: 'Mobile App Wireframing',
          client: 'Fintech Corp',
          logo: 'assets/media/svg/brand-logos/figma-icon.svg',
          budget: '$5,400',
          progress: 45,
          status: 'Pending',
          statusColor: 'warning'
        },
        {
          id: '4',
          name: 'Cloud Infrastructure Migration',
          client: 'AWS Cloud Partners',
          logo: 'assets/media/svg/brand-logos/google-icon.svg',
          budget: '$22,000',
          progress: 20,
          status: 'On Hold',
          statusColor: 'danger'
        }
      ]
    };

    return of(data);
  }
}
