import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, first, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EntradaPage } from 'src/app/models/interfaces/entrada/entrada-page';
import { Entrada } from 'src/app/models/interfaces/entrada/entrada';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private readonly API = `${environment.API_URL}/api/Entrada`;
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

  getEntradas(page = 1, pageSize = 4, placa: string): Observable<EntradaPage> {
    this.loadingSubject.next(true);

    let url = `${this.API}?page=${page}&pageSize=${pageSize}`;
    if (placa) {
      url += `&placa=${placa}`;
    }
    return this.httpClient.get<EntradaPage>(url)
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete())
      );
  }

  getId(id: number): Observable<Entrada> {
    this.loadingSubject.next(true);

    const url = `${this.API}/${id}`;

    return this.httpClient.get<Entrada>(url)
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  postEntrada(entrada: Entrada): Observable<string> {
    this.loadingSubject.next(true);

    return this.httpClient.post(this.API, entrada, { responseType: 'text' })
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

  putEntrada(id: number, entrada: Entrada): Observable<string> {
    this.loadingSubject.next(true);

    const url = `${this.API}/${id}`;

    return this.httpClient.put(url, entrada, { responseType: 'text' })
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

  deleteEntrada(id: number): Observable<string> {
    this.loadingSubject.next(true);

    const url = `${this.API}/${id}`;

    return this.httpClient.delete(url, { responseType: 'text' })
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete()),
        tap(response => {
          console.log('Delete Response:', response);
          this.handleSuccess(response);
        })
      );
  }
}
