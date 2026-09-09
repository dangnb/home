import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  readonly isChatOpen = signal<boolean>(false);
  readonly isActivitiesOpen = signal<boolean>(false);
  readonly isCreateAppModalOpen = signal<boolean>(false);
  readonly isNewTargetModalOpen = signal<boolean>(false);
  readonly isUpgradePlanModalOpen = signal<boolean>(false);

  toggleChat(): void {
    this.isChatOpen.update(v => !v);
    if (this.isChatOpen()) {
      this.isActivitiesOpen.set(false);
    }
  }

  openChat(): void {
    this.isChatOpen.set(true);
    this.isActivitiesOpen.set(false);
  }

  closeChat(): void {
    this.isChatOpen.set(false);
  }

  toggleActivities(): void {
    this.isActivitiesOpen.update(v => !v);
    if (this.isActivitiesOpen()) {
      this.isChatOpen.set(false);
    }
  }

  openActivities(): void {
    this.isActivitiesOpen.set(true);
    this.isChatOpen.set(false);
  }

  closeActivities(): void {
    this.isActivitiesOpen.set(false);
  }

  openCreateApp(): void {
    this.isCreateAppModalOpen.set(true);
  }

  closeCreateApp(): void {
    this.isCreateAppModalOpen.set(false);
  }

  openNewTarget(): void {
    this.isNewTargetModalOpen.set(true);
  }

  closeNewTarget(): void {
    this.isNewTargetModalOpen.set(false);
  }

  openUpgradePlan(): void {
    this.isUpgradePlanModalOpen.set(true);
  }

  closeUpgradePlan(): void {
    this.isUpgradePlanModalOpen.set(false);
  }

  closeAll(): void {
    this.isChatOpen.set(false);
    this.isActivitiesOpen.set(false);
    this.isCreateAppModalOpen.set(false);
    this.isNewTargetModalOpen.set(false);
    this.isUpgradePlanModalOpen.set(false);
  }
}
