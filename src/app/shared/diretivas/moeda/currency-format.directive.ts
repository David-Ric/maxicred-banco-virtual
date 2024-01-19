import { Directive, ElementRef, HostListener, LOCALE_ID, Inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[appCurrencyFormat]'
})
export class CurrencyFormatDirective {

  constructor(
    private el: ElementRef,
    private currencyPipe: CurrencyPipe,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const inputValue = event.target.value.replace(/[^\d,]/g, '');
    const formattedValue = this.currencyPipe.transform(inputValue, 'BRL', '', `1.2-2`, this.locale);
    this.el.nativeElement.value = formattedValue || '';

    // Adiciona o cursor no final do valor formatado
    this.setCursorPosition(this.el.nativeElement.selectionStart);
  }

  private setCursorPosition(position: number): void {
    this.el.nativeElement.setSelectionRange(position, position);
  }
}
