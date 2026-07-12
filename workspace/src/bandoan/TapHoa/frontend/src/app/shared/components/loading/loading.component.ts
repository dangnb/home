import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
