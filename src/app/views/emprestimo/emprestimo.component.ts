import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmprestimoService } from 'src/app/services/emprestimo/emprestimo.service';
import { CurrencyPipe, formatCurrency } from '@angular/common';
import { ApiExternasService } from 'src/app/services/api-externas/api-externas.service';
import { cambioBc } from 'src/app/models/interfaces/cotacao-bcb/cotacao-bcb';
import { catchError, finalize, throwError } from 'rxjs';
import { Emprestimo } from 'src/app/models/interfaces/emprestimo/emprestimo';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { Parcela } from 'src/app/models/interfaces/parcela/parcela';
import { ContaCorrenteService } from 'src/app/services/conta-corrente/conta-corrente.service';

@Component({
  selector: 'app-emprestimo',
  templateUrl: './emprestimo.component.html',
  styleUrls: ['./emprestimo.component.scss']
})
export class EmprestimoComponent implements OnInit {

  @Output() closeModalCambio = new EventEmitter<void>();

  user: AuthResponse | null = null;
  public showModal = false;
  public showModalCard = false;
  public modalMessage = '';
  public modalUrl='';
  public emprestimo = true;
  public emprestimoInic = false;
  errorLoadingEmprestimos: boolean = false;
  loading: boolean = false;
  selectControl = new FormControl();
  messageError = false;
  message = '';
  moedaInternacional = false;
  modalCambio = false;
  moedaEscolhida: string = 'BRL';
  valorInicial = 100;
  taxaJurosMensal = 0.0445;
  numeroParcelas = 12;
  parcelas:number =0;
  valorParcela:number = 0;
  valorEmReais:number =0;
  listaParcelas: string[] = [];
  listParcelas: Parcela[] = [];
  valorCotacao:number = 0;
  valorEmprestimoReal: number=0;
  public cotacao: cambioBc = {
    cotacaoCompra: 0,
    cotacaoVenda: 0,
    dataHoraCotacao: ""
  };

  constructor(public emprestimoService: EmprestimoService,private apiexterna: ApiExternasService,private contaCorrenteService: ContaCorrenteService) {}

  ngOnInit() {
    this.atualizarParcelas();
    const storedUser = localStorage.getItem('user');
    if (storedUser !== null) {
      this.user = JSON.parse(storedUser) as AuthResponse;
    }
  }

  formatarMoeda(valor: number): string {
    let moeda = 'BRL';

    if (this.moedaEscolhida === 'USD') {
      moeda = 'USD';
    } else if (this.moedaEscolhida === 'EUR') {
      moeda = 'EUR';
    }

    return valor.toLocaleString('pt-BR', { style: 'currency', currency: moeda });
  }


  formatarInput(event: any) {

     const valorSemMascara = event.target.value.replace(/\D/g, '');

     const valorFormatado = this.formatarMoeda(parseFloat(valorSemMascara) / 100);

     event.target.value = valorFormatado;

     this.valorInicial = parseFloat(valorSemMascara) / 100;


     this.atualizarParcelas();
   }

   formatarMoedaMoedaEstrangeira(event: any){
    const valorSemMascara = event.target.value.replace(/\D/g, '');

    const valorFormatado = this.formatarMoedaEstrangeira(parseFloat(valorSemMascara) / 100);

    event.target.value = parseFloat(valorSemMascara) / 100 === 0 ? '' : valorFormatado;

    this.valorInicial = parseFloat(valorSemMascara) / 100;

    this.atualizarParcelasEstrageira();
  }

   formatarMoedaEstrangeira(valor: number): string {
     let moeda = 'BRL';

     if (this.moedaEscolhida === 'USD') {
       moeda = 'USD';
     } else if (this.moedaEscolhida === 'EUR') {
       moeda = 'EUR';
     }

     const formatoMoeda = this.moedaEscolhida === 'USD' ? 'USD' : 'EUR';
     return valor.toLocaleString('en-US', { style: 'currency', currency: formatoMoeda });
   }

   atualizarParcelas() {
    this.listaParcelas = this.emprestimoService.calcularParcelas(this.valorInicial, this.taxaJurosMensal, this.numeroParcelas);
    this.numeroParcelas = this.listaParcelas.length;


    this.parcelas = this.numeroParcelas;
    this.valorParcela = this.obterValorUltimaParcela(this.listaParcelas);
    console.log('Parcela:', this.parcelas);
    console.log('Valor da parcela2:', this.valorParcela);
    this.valorEmReais =this.parcelas*this.valorParcela;
  }

  atualizarParcelasEstrageira() {
    this.listaParcelas = this.emprestimoService.calcularParcelas(this.valorInicial * this.valorCotacao, this.taxaJurosMensal, this.numeroParcelas);
    this.numeroParcelas = this.listaParcelas.length;



    this.parcelas = this.numeroParcelas;
    this.valorParcela = this.obterValorUltimaParcela(this.listaParcelas);

    console.log('Parcela:', this.parcelas);
    console.log('Valor da parcela1:', this.valorParcela);
    this.valorEmReais =this.parcelas*this.valorParcela;
  }


    private obterValorUltimaParcela(listaParcelas: string[]): number {

      const ultimaParcela = listaParcelas[listaParcelas.length - 1];


      if (ultimaParcela) {

        const valorParcelaMatch = ultimaParcela.match(/R\$\s*([\d,.]+)/);

        if (valorParcelaMatch) {
          return parseFloat(valorParcelaMatch[1].replace(',', ''));
        }
      }

      return 0;
    }

  escolherMoeda() {
    if (this.moedaEscolhida === 'BRL') {
      this.atualizarParcelas();
      this.formatarInput({ target: { value: this.formatarMoeda(this.valorInicial) } });
    } else {
      this.atualizarParcelasEstrageira();
      this.formatarMoedaMoedaEstrangeira({ target: { value: this.formatarMoedaEstrangeira(this.valorInicial) } });
    }
  }


  onCloseModal() {
    this.showModal = false;
    console.log('Modal fechado. Navegar para a nova rota aqui.');
  }
  onCloseModalCambio() {
    this.modalCambio = false;

  }

  iniciarEmprestimoNacional(){
    this.emprestimo = false;
    this.emprestimoInic = true;
    this.moedaInternacional=false
  }
  iniciarEmprestimoInternacional(){
    this.emprestimo = false;
    this.emprestimoInic = true;
    this.moedaInternacional=true;
    this.modalCambio = true;
  }
  voltarTipo(){
    this.moedaEscolhida='BRL';
    this.emprestimo = true;
    this.emprestimoInic = false;
    this.moedaInternacional=false;
  }

  atualizarCotacao() {
    this.loading=true;
    this.apiexterna.getCambio(this.moedaEscolhida).subscribe(
      (response: any) => {
        console.log('Resposta da Cotação:', response);

        if (response && response.cotacaoCompra !== undefined) {
          const cotacaoCompraArredondada = parseFloat(response.cotacaoCompra.toFixed(2));
          console.log('Cotação valor arredondado:', cotacaoCompraArredondada);
          this.valorCotacao = cotacaoCompraArredondada;
          this.escolherMoeda();
          this.loading=false;
        } else {
          console.error('Erro de comunicação com a api.');
          this.loading=false;
        }
      },
      (error: any) => {
        console.error('Erro ao obter a cotação:', error);
        this.loading=false;
      }
    );
  }

finalizar(){
  this.gerarEExibirParcelas()

   this.onCreateEmprestimo(this.valorInicial, this.valorEmReais, this.parcelas, this.moedaEscolhida)

}


  onCreateEmprestimo(valorInicial: number, valorEmReais: number, parcelas: number, moedaEscolhida: string) {
    this.errorLoadingEmprestimos = false;
    this.loading = true;

    const dataEmprestimo = new Date();

    const clienteId = this.user?.id;
    const valorCotacao = this.valorCotacao;

    const emprestimo: Emprestimo = {
      id: 0,
      clienteId: clienteId || 0,
      dataEmprestimo: dataEmprestimo,
      moeda: moedaEscolhida,
      valorPedido: valorInicial,
      valorCotacao:valorCotacao,
      valorFinalComJuros: valorEmReais,
      totalParcelas: parcelas,
      valorFinalComJurosParcela: valorEmReais,
      status: '1',
    };

    this.emprestimoService.postEmprestimo(emprestimo)
      .pipe(
        catchError(error => {
          console.error('Erro ao criar empréstimo:', error);
          this.errorLoadingEmprestimos = true;
          return throwError(error);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(response  => {
        const emprestimoId: number = Number(response) || 0;

        this.listParcelas.forEach(parcela => {
            parcela.emprestimoId = emprestimoId;
          });


          this.salvarListaParcelas(this.listParcelas);
      });
  }

  private salvarListaParcelas(parcelas: Parcela[]): void {

    const parcelasSemIds:Parcela[] = parcelas.map(({ id, ...rest }) => rest);

    this.emprestimoService.postParcelas(parcelasSemIds)
      .pipe(
        catchError(error => {
          console.error('Erro ao salvar lista de parcelas:', error);

          return throwError(error);
        })
      )
      .subscribe(response => {
        const clienteId = this.user?.id ||0;
        this.atualizarContaCorrente(clienteId,this.valorInicial,this.moedaEscolhida)
        console.log('Lista de parcelas salva com sucesso!', response);
        this.showModal = true;
        this.modalMessage = `Parabéns seu empréstimo foi aprovado, em até 30 minutos seu dinheiro estará disponível!`;
        this.modalUrl='/home'
      });

  }

  atualizarContaCorrente(clienteId: number, deposito: number,moeda: string): void {
    this.contaCorrenteService.atualizarContaCorrente(clienteId, deposito,moeda).subscribe(
      () => {

        console.error('Conta corrente atualizada com sucesso!');
      },
      (error) => {

        console.error('Erro ao atualizar conta corrente', error);

      }
    );
  }



  onNumeroParcelasChange() {
    if (this.numeroParcelas >= 1 && this.numeroParcelas <= this.listaParcelas.length) {
      this.parcelas = this.numeroParcelas;

      const valorParcelaText = this.listaParcelas[this.numeroParcelas - 1];

      if (valorParcelaText) {
        const valorParcelaMatch = valorParcelaText.match(/R\$\s*([\d.,]+)/);

        if (valorParcelaMatch) {

          const valorParcelaLimpo = valorParcelaMatch[1].replace(/\./g, '').replace(',', '.');


          this.valorParcela = parseFloat(valorParcelaLimpo);

          console.log('Parcela:', this.parcelas);
          console.log('Valor da parcela200:', this.valorParcela);
          this.valorEmReais = this.parcelas * this.valorParcela;
          return;
        }
      }
    }

    console.error('Erro ao processar a escolha da parcela.');
  }






  // onNumeroParcelasChange() {

  //   if (this.numeroParcelas >= 1 && this.numeroParcelas <= this.listaParcelas.length) {
  //     this.parcelas = this.numeroParcelas;

  //     const valorParcelaText = this.listaParcelas[this.numeroParcelas - 1];


  //     if (valorParcelaText) {

  //       const valorParcelaMatch = valorParcelaText.match(/R\$\s*([\d,]+)/);

  //       if (valorParcelaMatch) {
  //         this.valorParcela = parseFloat(valorParcelaMatch[1].replace(',', '.'));

  //         console.log('Parcela:', this.parcelas);
  //         console.log('Valor da parcela200:', this.valorParcela);
  //         this.valorEmReais =this.parcelas*this.valorParcela;
  //         return;
  //       }
  //     }
  //   }

  //   console.error('Erro ao processar a escolha da parcela.');
  // }


  gerarEExibirParcelas() {

    const listaParcelas: Parcela[] = this.gerarParcelas();

    this.listParcelas=listaParcelas;
    console.log(listaParcelas);
  }


  gerarParcelas(): Parcela[] {
    const listaParcelas: Parcela[] = [];

    for (let i = 1; i <= this.parcelas; i++) {
        const valorComJurosNumerico: number = parseFloat(this.valorParcela.toFixed(2).replace('.', '').replace(',', ''));

        const parcela: Parcela = {
            id: i,
            emprestimoId: 0,
            numeroParcela: i,
            dataVencimento: this.calcularDataVencimento(i),
            valorComJuros: valorComJurosNumerico,
            status: '1'
        };

        listaParcelas.push(parcela);
    }

    return listaParcelas;
}


  calcularDataVencimento(numeroParcela: number): string {
    const dataAtual = new Date();
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setMonth(dataVencimento.getMonth() + (numeroParcela * 1));

    const formattedDate = dataVencimento.toISOString();

    return formattedDate;
  }




}





