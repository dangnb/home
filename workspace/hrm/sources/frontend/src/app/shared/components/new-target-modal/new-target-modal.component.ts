import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerService } from '../../../core/services/drawer.service';

@Component({
  selector: 'app-new-target-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-target-modal.component.html'
})
export class NewTargetModalComponent {
  readonly drawerService = inject(DrawerService);

  readonly targetTitle = signal<string>('');
  readonly targetAssignee = signal<string>('Max Smith');
  readonly targetDueDate = signal<string>('');
  readonly targetDetails = signal<string>('');
  readonly targetTags = signal<string>('Important, Q3 Sprint');

  close(): void {
    this.drawerService.closeNewTarget();
  }

  submitTarget(): void {
    this.close();
  }
}
