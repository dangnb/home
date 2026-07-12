import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './services/loading.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoadingComponent],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
  }
}
