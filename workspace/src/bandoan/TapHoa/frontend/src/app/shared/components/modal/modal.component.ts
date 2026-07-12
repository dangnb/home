import { Component, Input, Output, EventEmitter, HostListener, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ opacity: 0 }))
            ])
        ]),
        trigger('slideUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px) scale(0.97)' }),
                animate('250ms 50ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(10px) scale(0.98)' }))
            ])
        ])
    ]
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() size: string = 'lg'; // 'sm', 'md', 'lg', 'xl', 'full'
    @Input() noPadding: boolean = false;
    @Input() closeOnBackdrop: boolean = true;
    @Output() closeDialog = new EventEmitter<void>();

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.renderer.appendChild(document.body, this.el.nativeElement);
    }

    ngOnDestroy(): void {
        if (this.el.nativeElement && this.el.nativeElement.parentNode) {
            this.renderer.removeChild(document.body, this.el.nativeElement);
        }
    }

    onBackdropClick(): void {
        if (this.closeOnBackdrop) {
            this.closeDialog.emit();
        }
    }

    @HostListener('document:keydown.escape')
    onEscKey(): void {
        this.closeDialog.emit();
    }
}
