import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    imports: [TranslatePipe],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
