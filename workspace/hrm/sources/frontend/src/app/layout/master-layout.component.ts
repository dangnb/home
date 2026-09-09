import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatDrawerComponent } from '../shared/components/chat-drawer/chat-drawer.component';
import { ActivitiesDrawerComponent } from '../shared/components/activities-drawer/activities-drawer.component';
import { ScrollTopComponent } from '../shared/components/scroll-top/scroll-top.component';
import { NewTargetModalComponent } from '../shared/components/new-target-modal/new-target-modal.component';
import { CreateAppModalComponent } from '../shared/components/create-app-modal/create-app-modal.component';
import { ToastContainerComponent } from '../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-master-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    ToolbarComponent,
    FooterComponent,
    ChatDrawerComponent,
    ActivitiesDrawerComponent,
    ScrollTopComponent,
    NewTargetModalComponent,
    CreateAppModalComponent,
    ToastContainerComponent
  ],
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent {
  isMobileSidebarOpen = false;
  isSidebarCollapsed = false;

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

  toggleSidebarCollapse(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    const body = document.getElementById('kt_app_body');
    const sidebar = document.getElementById('kt_app_sidebar');
    
    if (sidebar) {
      sidebar.classList.add('animating');
      setTimeout(() => {
        sidebar.classList.remove('animating');
      }, 300);
    }

    if (body) {
      if (this.isSidebarCollapsed) {
        body.setAttribute('data-kt-app-sidebar-minimize', 'on');
        body.setAttribute('data-kt-app-sidebar-hoverable', 'true');
      } else {
        body.removeAttribute('data-kt-app-sidebar-minimize');
        body.setAttribute('data-kt-app-sidebar-hoverable', 'true');
      }
    }
  }
}
