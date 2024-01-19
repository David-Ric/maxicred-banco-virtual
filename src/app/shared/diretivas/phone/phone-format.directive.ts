import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const inputValue = event.target.value.replace(/\D/g, '');
    this.el.nativeElement.value = this.formatPhone(inputValue);

    this.setCursorPosition(this.el.nativeElement.selectionStart);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {

    if (event.key === 'Backspace') {

      this.el.nativeElement.value = '';
      event.preventDefault();
    }
  }

  private formatPhone(value: string): string {
    if (!value) {
      return '';
    }

    const formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    return formatted;
  }

  private setCursorPosition(position: number): void {

    this.el.nativeElement.setSelectionRange(position, position);
  }
}



