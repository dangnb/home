import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerService } from '../../../core/services/drawer.service';

@Component({
  selector: 'app-activities-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './activities-drawer.component.html',
  styleUrls: ['./activities-drawer.component.scss']
})
export class ActivitiesDrawerComponent {
  readonly drawerService = inject(DrawerService);

  close(): void {
    this.drawerService.closeActivities();
  }
}
