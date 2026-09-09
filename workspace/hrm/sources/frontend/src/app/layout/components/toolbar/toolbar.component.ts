import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerService } from '../../../core/services/drawer.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  readonly drawerService = inject(DrawerService);

  @Input() pageTitle = 'Tổng Quan Nhân Sự';
  @Input() breadcrumbs: Array<{ label: string; url?: string }> = [
    { label: 'Trang Chủ', url: '/' },
    { label: 'Quản Trị Nhân Sự', url: '/hrm/dashboard' },
    { label: 'Tổng Quan' }
  ];

  openCreateApp(): void {
    this.drawerService.openCreateApp();
  }

  openNewTarget(): void {
    this.drawerService.openNewTarget();
  }
}
