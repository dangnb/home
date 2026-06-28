import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appNumberFormat]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFormatDirective),
      multi: true
    }
  ]
})
export class NumberFormatDirective implements ControlValueAccessor {
  private onChange: (val: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    if (value !== undefined && value !== null && value !== '') {
      this.el.nativeElement.value = this.formatNumber(value.toString());
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const rawValue = value.replace(/[^0-9]/g, '');
    if (rawValue === '') {
      this.el.nativeElement.value = '';
      this.onChange(null);
      return;
    }
    
    const parsed = parseInt(rawValue, 10);
    
    // Remember cursor position
    const start = this.el.nativeElement.selectionStart;
    const oldLength = this.el.nativeElement.value.length;
    
    this.el.nativeElement.value = this.formatNumber(parsed.toString());
    
    // Adjust cursor position
    const newLength = this.el.nativeElement.value.length;
    let newStart = (start ?? 0) + (newLength - oldLength);
    if (newStart < 0) newStart = 0;
    
    this.el.nativeElement.setSelectionRange(newStart, newStart);
    
    this.onChange(parsed);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  private formatNumber(value: string): string {
    const rawValue = value.replace(/[^0-9]/g, '');
    if (!rawValue) return '';
    // Format according to vi-VN (dot for thousand separator)
    return new Intl.NumberFormat('vi-VN').format(parseInt(rawValue, 10));
  }
}
