import { Emprestimo } from 'src/app/models/interfaces/emprestimo/emprestimo';
import { Component, OnInit } from '@angular/core';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service'
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Cliente } from 'src/app/models/interfaces/cliente/cliente';
import { ApiExternasService } from 'src/app/services/api-externas/api-externas.service';
import { cambio } from 'src/app/models/interfaces/cotacao-moeda/contacao-moeda';
import { EmprestimoService } from 'src/app/services/emprestimo/emprestimo.service';
import { ContaCorrente } from 'src/app/models/interfaces/conta-corrente/conta-corrente';
import { ContaCorrenteService } from 'src/app/services/conta-corrente/conta-corrente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
  user: AuthResponse | null = null;
  public showModal = false;
  public showModalCard = false;
  public modalMessage = '';
  public modalUrl='';
  loading: boolean = false;
  public cotacao: cambio[] = [];
  id:number |undefined =0;
  emprestimos: Emprestimo[] = [];
  contaCorrente: ContaCorrente | undefined;
  valorEmConta:number=0;

  constructor(private router: Router,
  public userService: UserService,
  private apiexterna: ApiExternasService,
  public emprestimoService: EmprestimoService,
  private contaCorrenteService: ContaCorrenteService
  ) {}


  visualizar = false;

  inverterVisualizacao(): void {
    this.visualizar = !this.visualizar;
  }

   handleLogin() {
    if(!this.user){
      this.showModal = true;
      this.modalMessage = 'Você precisa estar logado para utilizar este serviço!';
      this.modalUrl='/login'
    }else{
      if (this.verificarPropriedadesPreenchidas()) {
        console.log('Todas as propriedades estão preenchidas:', this.cliente);
        if(this.valorEmConta===0){
          this.router.navigate(['/emprestimos']);
        }else{
          this.showModal = true;
          this.modalMessage = 'Você tem um emprestimo ativo, após você finaliza-lo, poderá pedir um novo emprestimo!';
        }

      } else {
        console.log('Alguma propriedade não está preenchida:', this.cliente);
        this.showModal = true;
        this.modalMessage = 'Você precisa completar seu cadastro para utilizar nosso serviços!';
        this.modalUrl='/cadastro-cliente'
      }
    }



  }
  handleInvest():void{
    void this.router.navigate(['/investimentos']);
  }

  transformarNome(nome: string): string {
    return nome.replace(' Americano', '');
  }
  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');
    if (storedUser !== null) {
      this.user = JSON.parse(storedUser) as AuthResponse;
    }
    if(this.user !== null){
      this.onGetDetails(this.user?.id ?? 0);

      this.contaCorrenteService.obterContasCorrentesPorClienteId(this.user.id ?? 0).subscribe(
        (contasCorrentes: ContaCorrente[]) => {
          console.error('Entrou no metodo');
          if (contasCorrentes.length > 0) {

            const contaCorrente: ContaCorrente = contasCorrentes[0];
            console.log('Detalhes da Conta Corrente:', contaCorrente);
            this.contaCorrente = contaCorrente;
          } else {
            console.error('Cliente não possui contas correntes.');
          }
        },
        (error) => {
          console.error('Erro ao obter detalhes da Conta Corrente:', error);
        }
      );

    }
    const clienteId = this.user?.id ||0;
    this.loading = true;
    this.emprestimoService.getEmprestimosByClienteId(clienteId, 1, 10)
  .subscribe((response: any) => {
    const emprestimos: Emprestimo[] = response.emprestimos;

    this.emprestimos = emprestimos.map(emprestimo => {

      return emprestimo;
    });

    const primeiroEmprestimo = emprestimos[0];
    if (primeiroEmprestimo) {
      this.valorEmConta = primeiroEmprestimo.valorPedido;

      this.emprestimos=emprestimos;
      localStorage.setItem("emprestimoId", String(this.emprestimos[0]?.id));
    }

    this.loading=false;
    console.log("emprestimo existente", this.emprestimos);
  });


    this.getCambio();


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
          return of(dados);
        }),
        catchError(error => {
          console.error(`Erro ao obter detalhes da cliente com ID ${id} no Formulário:`, error);
          return of(error);
        }),
        finalize(() => {
          console.log('Detalhes da cliente:', this.cliente);
          if (this.verificarPropriedadesPreenchidas()) {
            console.log('Todas as propriedades estão preenchidas:', this.cliente);

          } else {
            console.log('Alguma propriedade não está preenchida:', this.cliente);
            this.showModalCard = true;
            this.modalMessage = `Bem-vindo ${this.cliente.username}! Percebi que você não finalizou seu cadastro; assim que puder, complete-o!"`;
            this.modalUrl='/cadastro-cliente'
          }

        })
      )
      .subscribe();
  }

  private verificarPropriedadesPreenchidas(): boolean {
    return Object.values(this.cliente).every(value => value !== null && value !== undefined && value !== '');
  }

  onCloseModal() {
    this.showModal = false;
    console.log('Modal fechado. Navegar para a nova rota aqui.');
  }

  onCloseModalCard() {
    this.showModalCard = false;
    console.log('Modal fechado. Navegar para a nova rota aqui.');

  }
  getCambio() {

    this.apiexterna.getMoeda()
      .subscribe(
        response => {
          console.log('Resposta da Cotação:', response);

          if (response && Array.isArray(response)) {
            this.cotacao = response;
            console.log('Cotação:', this.cotacao);

          } else {
            console.log('erro');

          }
        },
        error => {
          console.error('Erro ao obter a cotação:', error);

        }
      );
  }

  formatarValorConta(valor: number | undefined, moeda: string): string {

   console.log('retorno moelda',valor)
    if (valor == null) {
      return '0,00';
    }

    let formatoMoeda = 'pt-BR';

    if (moeda === 'USD') {
      formatoMoeda = 'en-US';
    } else if (moeda === 'EUR') {
      formatoMoeda = 'es-ES';
    }

    const valorFormatado = valor.toLocaleString(formatoMoeda, {
      style: 'currency',
      currency: moeda,
    });

    return valorFormatado;
  }



}


