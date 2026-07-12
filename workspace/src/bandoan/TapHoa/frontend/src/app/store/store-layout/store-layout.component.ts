import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-store-layout',
    imports: [RouterOutlet, RouterLink, TranslatePipe],
    templateUrl: './store-layout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent { }
