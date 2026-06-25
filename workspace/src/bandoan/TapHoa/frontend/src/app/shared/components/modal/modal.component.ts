import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() title: string = '';
    @Input() size: string = 'lg'; // 'sm', 'md', 'lg', 'xl'
    @Output() closeDialog = new EventEmitter<void>();
}
