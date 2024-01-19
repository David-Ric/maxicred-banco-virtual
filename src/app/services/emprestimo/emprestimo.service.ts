import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, first, tap, throwError } from 'rxjs';
import { Emprestimo } from 'src/app/models/interfaces/emprestimo/emprestimo';
import { Parcela, ParcelaPage } from 'src/app/models/interfaces/parcela/parcela';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService {

  private readonly API = environment.API_URL;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public showModal = false;
  public modalMessage = '';

  constructor(private httpClient: HttpClient) {}

  private handleResponse(response: any) {
    this.loadingSubject.next(false);
    this.showModal = true;
    this.modalMessage = response || 'Operação realizada com sucesso.';
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro:', error);
    this.loadingSubject.next(false);
    this.showModal = true;
    this.modalMessage = error.error?.message || 'Erro ao realizar a operação!';
    return throwError(error);
  }

  private handleComplete() {
    this.loadingSubject.next(false);
  }

  private handleSuccess(response: any) {
    this.handleResponse(response);
    this.handleComplete();
  }

  calcularParcelas(valorInicial: number, taxaJurosMensal: number, numeroParcelas = 12): string[] {
    let numeroMaxParcelas = 12;

    if (valorInicial >= 1000) {
      numeroMaxParcelas = 24;
    }

    if (valorInicial >= 10000) {
      numeroMaxParcelas = 48;
    }

    const parcelas = [];

    for (let i = 1; i <= numeroMaxParcelas; i++) {
      const parcela = (valorInicial * Math.pow(1 + taxaJurosMensal, i)) / i;
      parcelas.push(`${i} parcela de ${this.formatarMoeda(parcela)}`);
    }

    return parcelas;
  }

  private formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }




  postEmprestimo(emprestimo: Emprestimo): Observable<string> {
    this.loadingSubject.next(true);

    return this.httpClient.post(`${this.API}/api/Emprestimo`, emprestimo, { responseType: 'text' })
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete()),
        tap(response => {
          console.log('Post Response:', response);
          this.handleSuccess(response);
        })
      );
  }

  postParcelas(parcelas: Parcela[]): Observable<string> {
    this.loadingSubject.next(true);

    return this.httpClient.post(`${this.API}/api/Parcela`, parcelas, { responseType: 'text' })
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete()),
        tap(response => {
          console.log('Post Parcelas Response:', response);
          this.handleSuccess(response);
        })
      );
  }


  putEmprestimoStatus(id: number): Observable<any> {
    const url = `${this.API}/api/Emprestimo/status/${id}`;
    return this.httpClient.put(url, null)
      .pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete()),
        tap(response => {
          console.log('Put Status Response:', response);
          this.handleSuccess(response);
        })
      );
  }
  putStatus(id: number): Observable<any> {
    const url = `${this.API}/api/Parcela/status/${id}`;
    return this.httpClient.put(url, null);
  }

  putEmprestimo(id: number, emprestimo: Emprestimo): Observable<string> {
    this.loadingSubject.next(true);

    const url = `${this.API}/${id}`;

    return this.httpClient.put(url, emprestimo, { responseType: 'text' })
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete()),
        tap(response => {
          console.log('Put Response:', response);
          this.handleSuccess(response);
        })
      );
  }


  getEmprestimosByClienteId(clienteId: number, page: number, pageSize: number): Observable<Emprestimo[]> {
    const url = `${this.API}/api/Emprestimo/clienteId`;

    const params = new HttpParams()
      .set('clienteId', clienteId.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get<Emprestimo[]>(url, { params });
  }



  getParcelasEmprestimoId( page = 1, pageSize = 4, status:string): Observable<ParcelaPage> {
    this.loadingSubject.next(true);
    const emprestimoId = localStorage.getItem('emprestimoId')||'';

    let url = `${this.API}/api/Parcela/emprestimoId?emprestimoId=${emprestimoId}&page=${page}&pageSize=${pageSize}&status=${status}`;

    return this.httpClient.get<ParcelaPage>(url)
      .pipe(
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete())
      );
  }






}
