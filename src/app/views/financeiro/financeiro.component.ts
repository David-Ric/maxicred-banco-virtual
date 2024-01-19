import { Component, EventEmitter, ViewChild, Output } from '@angular/core';
import { Emprestimo } from 'src/app/models/interfaces/emprestimo/emprestimo';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { EmprestimoService } from 'src/app/services/emprestimo/emprestimo.service';
import { DatePipe } from '@angular/common';
import { Parcela, ParcelaPage } from 'src/app/models/interfaces/parcela/parcela';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ContaCorrenteService } from 'src/app/services/conta-corrente/conta-corrente.service';
import { ContaCorrente } from 'src/app/models/interfaces/conta-corrente/conta-corrente';


@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
  providers: [DatePipe],
})
export class FinanceiroComponent {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  emprestimos: Emprestimo[] = [];
  parcelas: Parcela[] = [];
  loading:boolean=false;
  visualizar = false;
  panelOpenState = false;
  user: AuthResponse | null = null;
  emprestimoId = '0';
  public showModal = false;
  public showModalCard = false;
  public modalMessage = '';
  public modalUrl='';
  contaCorrente: ContaCorrente | undefined;
  messageError = false;
  message = '';

  parcelas$: Observable<ParcelaPage | undefined> = throwError({ totalItems: 0, parcelas: [] });
  pageIndex = 0;
  pageSize = 10;
  cdr: any;
  constructor(private emprestimoService: EmprestimoService,private datePipe: DatePipe,private contaCorrenteService: ContaCorrenteService) {}

  onCloseModal() {
    this.showModal = false;
    const clienteId = this.user?.id ||0;
    this.getEmprestimoCliete(clienteId)
    console.log('Modal fechado. Navegar para a nova rota aqui.');
  }


  formatarData(data: Date | string | undefined): string {
    if (!data) {
      return 'Data não disponível';
    }

    let dataObj: Date;

    if (data instanceof Date) {
      dataObj = data;
    } else if (typeof data === 'string') {
      dataObj = new Date(data);
    } else {
      return 'Formato de data não suportado';
    }

    if (isNaN(dataObj.getTime())) {
      return 'Data inválida';
    }

    const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return dataFormatada;
  }


  atualizarStatusEmprestimo(emprestimoId: number): void {
    this.emprestimoService.putEmprestimoStatus(emprestimoId).subscribe(
      response => {
        console.log('Status atualizado com sucesso!', response);

      },
      error => {
        console.error('Erro ao atualizar status do empréstimo', error);

      }
    );
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser !== null) {
      this.user = JSON.parse(storedUser) as AuthResponse;

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

    console.log("dados dos emprestimos recebidos",this.emprestimos)

    this.getEmprestimoCliete(clienteId)
    // this.emprestimoService.getEmprestimosByClienteId(clienteId, 1, 10)
    // .subscribe((response: any) => {
    //   const emprestimos: Emprestimo[] = response.emprestimos;

    //   this.emprestimos = emprestimos.map(emprestimo => {

    //     return emprestimo;
    //   });

    //   const primeiroEmprestimo = emprestimos[0];
    //   if (primeiroEmprestimo) {

    //     this.emprestimos=emprestimos;
    //   }

    //   this.loading = false;

    //   console.log("emprestimo existente", this.emprestimos);
    // });

   this.emprestimoId = localStorage.getItem('emprestimoId')||'';

    this.getParcelas();



  }

  getEmprestimoCliete(clienteId:any):void {
  this.emprestimoService.getEmprestimosByClienteId(clienteId, 1, 10)
    .subscribe((response: any) => {
      const emprestimos: Emprestimo[] = response.emprestimos;

      this.emprestimos = emprestimos.map(emprestimo => {

        return emprestimo;
      });

      const primeiroEmprestimo = emprestimos[0];
      if (primeiroEmprestimo) {

        this.emprestimos=emprestimos;
      }

      this.loading = false;

      console.log("emprestimo existente", this.emprestimos);
    });
}

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.getParcelas(1, 4, '1');
    } else if (event.index === 1) {
      this.getParcelas(1, 4, '0');
    }
  }

  atualizarStatus(id: any): void {
    this.emprestimoService.putStatus(id).subscribe(
      () => {
        console.log('Status e DataPagamento atualizados com sucesso!');


      },
      (error) => {
        console.error('Erro ao atualizar status e data de pagamento:', error);

      }
    );
    this.getParcelas(1, 4, '1');
    this.loading = false;
    this.showModal = true;
    this.messageError = true;
    this.modalMessage = 'Pagamento efetuado com sucesso!';
    console.log('Atualizado com sucesso');
  }

  getParcelas(page = 1, pageSize = 4, status = '1') {
    this.loading = true;

    this.parcelas$ = this.emprestimoService.getParcelasEmprestimoId(page, pageSize, status)
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar parcelas:', error);
          this.loading = false;
          return throwError(error);
        }),
        map((response: any) => {
          console.log('Parcelas carregadas com sucesso:', response);
          console.log("total de itens parcela",response.totalItems)
          if (this.paginator) {
            this.paginator.length = response.totalItems;
            this.cdr?.detectChanges();
          }
          this.pageIndex = page - 1;
          this.pageSize = pageSize;
          this.parcelas = response.parcelas;
          return response;
        }),
        finalize(() => {
          this.loading = false;
          if(this.parcelas.length==0){
            this.atualizarStatusEmprestimo(Number(this.emprestimoId));
          }

        })
      )

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
   inverterVisualizacao(): void {
    this.visualizar = !this.visualizar;
  }
}
