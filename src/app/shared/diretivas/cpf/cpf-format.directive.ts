import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCpfFormat]'
})
export class CpfFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const inputValue = event.target.value.replace(/\D/g, '');
    this.el.nativeElement.value = this.formatCpf(inputValue);

    // Adiciona o cursor no final do valor formatado
    this.setCursorPosition(this.el.nativeElement.selectionStart);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {

    if (event.key === 'Backspace') {
      this.el.nativeElement.value = '';
      event.preventDefault();
    }
  }

  private formatCpf(value: string): string {
    if (!value) {
      return '';
    }

    const formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    return formatted;
  }

  private setCursorPosition(position: number): void {

    this.el.nativeElement.setSelectionRange(position, position);
  }
}
