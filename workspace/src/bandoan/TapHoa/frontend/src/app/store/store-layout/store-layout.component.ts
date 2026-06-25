import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-store-layout',
    imports: [RouterOutlet, RouterLink],
    templateUrl: './store-layout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent { }
