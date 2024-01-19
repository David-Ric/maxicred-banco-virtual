import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCepFormat]'
})
export class CepFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const inputValue = event.target.value.replace(/\D/g, '');
    this.el.nativeElement.value = this.formatCep(inputValue);

    // Adiciona o cursor no final do valor formatado
    this.setCursorPosition(this.el.nativeElement.selectionStart);
  }

  private formatCep(value: string): string {
    if (!value) {
      return '';
    }

    // Garante no máximo 8 dígitos
    const numericValue = value.slice(0, 8);

    // Aplica a formatação desejada
    const formatted = `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}-${numericValue.slice(5)}`;
    return formatted;
  }

  private setCursorPosition(position: number): void {
    this.el.nativeElement.setSelectionRange(position, position);
  }
}
