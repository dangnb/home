import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerService } from '../../../core/services/drawer.service';

@Component({
  selector: 'app-create-app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-app-modal.component.html'
})
export class CreateAppModalComponent {
  readonly drawerService = inject(DrawerService);

  readonly currentStep = signal<number>(1);
  readonly appName = signal<string>('My Metronic App');
  readonly appCategory = signal<string>('Quick Online Courses');
  readonly framework = signal<string>('Angular');
  readonly database = signal<string>('PostgreSQL');

  nextStep(): void {
    if (this.currentStep() < 5) {
      this.currentStep.update(s => s + 1);
    } else {
      this.close();
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  close(): void {
    this.currentStep.set(1);
    this.drawerService.closeCreateApp();
  }
}
