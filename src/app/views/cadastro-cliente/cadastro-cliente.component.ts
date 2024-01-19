import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Cliente } from 'src/app/models/interfaces/cliente/cliente';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { UserService } from 'src/app/services/user/user.service';
import { CurrencyPipe, formatCurrency } from '@angular/common';
import { ApiExternasService } from 'src/app/services/api-externas/api-externas.service';
import { Router } from '@angular/router';
import { cambio } from 'src/app/models/interfaces/cotacao-moeda/contacao-moeda';
import { validarCpf } from 'src/app/shared/validacoes/valida-cpf';
import { ContaCorrenteService } from 'src/app/services/conta-corrente/conta-corrente.service';
import { ContaCorrente } from 'src/app/models/interfaces/conta-corrente/conta-corrente';


@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.scss']
})
export class CadastroClienteComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  user: AuthResponse | null = null;
  userForm: FormGroup;
  clienteForm: FormGroup;
  loading: boolean = false;
  selectControl = new FormControl();
  messageError = false;
  message = '';
  inputControl = new FormControl();
 ;
 cliente: Cliente = {
  id: 0,
  email: '',
  username: '',
  nomeCompleto: '',
  cpf_cnpj: '',
  status: '',
  telefone: '',
  profissao: '',
  logradouro: '',
  bairro:'',
  cidade: '',
  uf: '',
  cep: '',
  rendaMensal: 0,
  tipUser: '',

};

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private apiexterna: ApiExternasService,
              private contaCorrenteService: ContaCorrenteService,
              private router: Router) {

                this.clienteForm = this.fb.group({});

    this.userForm = this.fb.group({
      id: [0, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      nomeCompleto: ['', Validators.required],
      cpf_cnpj: [
        '',
        [Validators.required],
        [validarCpf()],
      ],
      status: ['S', Validators.required],
      telefone: ['', Validators.required],
      profissao: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      cep: ['', Validators.required],
      rendaMensal: [0, Validators.required],
      tipUser: ['C', Validators.required]
    });


  }
  formControlRendaMensal = new FormControl();

  valorInicial = 0;

   formatarMoeda(valor: number): string {
     let moeda = 'BRL';
     return valor.toLocaleString('pt-BR', { style: 'currency', currency: moeda });
   }


  // formatarInput(event: any): void {
  //   const valorSemMascara = event.target.value.replace(/\D/g, '');
  //   const valorNumerico = parseFloat(valorSemMascara) / 100;

  //   // Adicionando um console log para exibir o valor digitado
  //   console.log('Valor Digitado:', valorNumerico);

  //   const valorFormatado = this.formatarMoeda(valorNumerico);

  //   event.target.value = valorFormatado;
  //   this.valorInicial = valorNumerico;
  // }
  formatarInput(event: any): void {
    const valorSemMascara = event.target.value.replace(/\D/g, '');
    const valorNumerico = parseFloat(valorSemMascara) / 100;

    if (!isNaN(valorNumerico)) {

      console.log('Valor Digitado:', valorNumerico);

      const valorFormatado = this.formatarMoeda(valorNumerico);

      event.target.value = valorFormatado;
      this.valorInicial = valorNumerico;
    } else {

      event.target.value = '';
      this.valorInicial = 0;
    }
  }



  onFocus(): void {
    const cpfCnpjControl = this.userForm.get('cpf_cnpj');
    if (cpfCnpjControl) {
      cpfCnpjControl.markAsUntouched();
    }
  }
  public showModal = false;
  public showModalCard = false;
  public modalMessage = '';
  public modalUrl='';

  validarCpfAoSair(): void {
    const cpfControl: AbstractControl | null = this.userForm.get('cpf_cnpj');

    if (cpfControl) {
      cpfControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }
  onUpdate() {
    this.modalUrl='/home';
    this.loading = true;
    console.log('Entrou aqui',this.user?.id)
    if (this.user?.id) {
      const updatedCliente: Cliente = this.getValuesWithoutMasksEdit();

      this.userService.putCliente(this.user.id, updatedCliente).subscribe(
        () => {
          this.loading = false;
          this.showModal = true;
          this.messageError = true;
          this.modalMessage = 'Cadastro finalizado com sucesso!';
          console.log('Atualizado com sucesso');
          this.criarContaCorrente()
          this.closeModal.emit();
        },
        (error) => {
          this.loading = false;
          console.error('Update Error:', error);
          this.showModal = true;
          this.messageError = true;
          this.modalMessage = 'Erro ao atualizar o cliente.';
        }
      );
    } else {
      console.log('Entrou aqui3')
      this.loading = false;
      this.messageError = true;
      this.message = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }

  onCancel() {
    this.userForm.reset();
    this.closeModal.emit();
    this.router.navigate(['/home']);
  }

  getValuesWithoutMasksEdit(): Cliente {
    const formValues = this.userForm.value;

    return {
      id: this.user?.id || 0,
      email: formValues.email,
      username: formValues.username,
      nomeCompleto: formValues.nomeCompleto,
      cpf_cnpj:this.removeCpfMask(formValues.cpf_cnpj),
      status: "1",
      telefone: this.removePhoneMask(formValues.telefone),
      profissao: formValues.profissao,
      logradouro: formValues.logradouro,
      bairro: formValues.bairro,
      cidade: formValues.cidade,
      uf: formValues.uf,
      cep: this.removeCepMask(formValues.cep),
      rendaMensal: this.valorInicial,
      tipUser: 'C',
    };
  }

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');
    if (storedUser !== null) {
      this.user = JSON.parse(storedUser) as AuthResponse;
    }
    if(this.user !== null){
      this.onGetDetails(this.user?.id ?? 0);
    }

  }
  populateForm(cliente: Cliente) {
    this.userForm.patchValue({
      email: cliente.email,
      username: cliente.username || '',
      nomeCompleto: cliente.nomeCompleto || '',
      cpf_cnpj:this.cpfFormat(cliente.cpf_cnpj || ''),
      status: cliente.status || '',
      telefone:this.phoneFormat( cliente.telefone || ''),
      profissao: cliente.profissao || '',
      logradouro: cliente.logradouro || '',
      bairro: cliente.bairro || '',
      cidade: cliente.cidade || '',
      uf: cliente.uf || '',
      cep: this.cepFormat(cliente.cep || ''),
      rendaMensal: this.formatarMoeda(cliente.rendaMensal || 0),
      tipUser: cliente.tipUser || '',
    });
  }


  onGetDetails(id: number) {
    this.userService.getId(id)
      .pipe(
        switchMap(dados => {
          const propriedadesValidas = Object.keys(dados).filter(prop => prop in this.cliente);
          const dadosFiltrados = propriedadesValidas.reduce((obj, prop) => {
            obj[prop] = dados[prop];
            return obj;
          }, {} as Cliente);

          this.cliente = { ...this.cliente, ...dadosFiltrados };
          this.populateForm(this.cliente);
          return of(dados);
        }),
        catchError(error => {
          console.error(`Erro ao obter detalhes da cliente com ID ${id} no Formulário:`, error);
          return of(error);
        }),
        finalize(() => {
          console.log('Detalhes da cliente:', this.cliente);

        })
      )
      .subscribe();
  }

  cpfFormat(value: string): string {
    if (!value) {
      return '';
    }

    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
  }

  phoneFormat(value: string): string {
    if (!value) {
      return '';
    }

    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  }

  cepFormat(value: string): string {
    if (!value) {
      return '';
    }

    const numericValue = value.replace(/\D/g, '');

    const formattedValue = numericValue.slice(0, 8);

    return `${formattedValue.slice(0, 2)}.${formattedValue.slice(2, 5)}-${formattedValue.slice(5)}`;
  }


  currencyFormat(value: number, locale: string = 'pt-BR'): string {
    if (isNaN(value)) {
      return '';
    }

    return formatCurrency(value, locale, 'BRL', '', `1.2-2`);
  }


  onCloseModal() {
    this.showModal = false;
    console.log('Modal fechado. Navegar para a nova rota aqui.');
  }
  removeCpfMask(value: string): string {
    return value.replace(/\D/g, '');
  }

  removePhoneMask(value: string): string {
    return value.replace(/\D/g, '');
  }
  removeCepMask(value: string): string {
    return value.replace(/\D/g, '');
  }
  removeCurrencyMask(value: string): string {
    return value.replace(/\D/g, '');
  }

  pesquisarCEP() {
    this.loading = true;
    let cep = this.userForm.get('cep')?.value;

    if (cep) {
      cep = this.removeCepMask(cep);
      this.apiexterna.getCEP(cep)
        .subscribe(
          response => {
            console.log('Resposta do CEP:', response);

            if (response.erro) {

              this.loading = false;
              this.showModal = true;
              this.messageError = true;
              this.modalMessage = 'CEP não encontrado!';
            } else {

              this.userForm.patchValue({
                bairro: response.bairro || '',
                logradouro: response.logradouro || '',
                cidade: response.localidade || '',
                uf: response.uf || '',
              });
              this.loading = false;
            }
          },
          error => {
            console.error('Erro ao obter o CEP:', error);
            this.loading = false;
            this.showModal = true;
            this.messageError = true;
            this.modalMessage = 'Erro ao obter o CEP. Verifique se o CEP é válido.';
          }
        );
    }
  }

  criarContaCorrenteExecutada = false;

criarContaCorrente(): void {
    if (!this.criarContaCorrenteExecutada && this.user) {
        this.criarContaCorrenteExecutada = true;

        const clienteId = this.user.id;

        this.contaCorrenteService.criarContaCorrente({ clienteId } as ContaCorrente).subscribe(
            (contaCorrente) => {
                console.log('ContaCorrente criada com sucesso:', contaCorrente);
                this.closeModal.emit();
            },
            (error) => {
                console.error('Erro ao criar ContaCorrente:', error);
            }
        );
    }
}





}
