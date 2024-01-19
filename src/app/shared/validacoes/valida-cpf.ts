import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export function validarCpf(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const cpf = control.value ? control.value.replace(/[^\d]/g, '') : '';

    if (cpf.length !== 11) {
      console.log('CPF inválido: comprimento incorreto');
      return of({ cpfInvalido: true });
    }

    if (/^(\d)\1+$/.test(cpf)) {
      console.log('CPF inválido: todos os dígitos são iguais');
      return of({ cpfInvalido: true });
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    }

    const resto = soma % 11;
    const digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

    if (parseInt(cpf.charAt(9), 10) !== digitoVerificador1) {
      console.log('CPF inválido: primeiro dígito verificador incorreto');
      return of({ cpfInvalido: true });
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (11 - i);
    }

    const resto2 = soma % 11;
    const digitoVerificador2 = resto2 < 2 ? 0 : 11 - resto2;

    if (parseInt(cpf.charAt(10), 10) !== digitoVerificador2) {
      console.log('CPF inválido: segundo dígito verificador incorreto');
      return of({ cpfInvalido: true });
    }

    console.log('CPF válido');
    return of(null);
  };
}
