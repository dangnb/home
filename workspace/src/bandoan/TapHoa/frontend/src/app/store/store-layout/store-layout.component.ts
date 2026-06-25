import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-store-layout',
    imports: [RouterOutlet, RouterLink],
    templateUrl: './store-layout.component.html',
    styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent { }
