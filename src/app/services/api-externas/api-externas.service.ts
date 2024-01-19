import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, first, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiExternasService {
  private readonly API = `${environment.API_URL}/api/ApisExternas`;

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

    if (error.status === 404) {

      return throwError('Registro não encontrado.');
    } else {

      return throwError('Erro ao realizar a operação!');
    }
  }

  private handleComplete() {
    this.loadingSubject.next(false);
  }

  private handleSuccess(response: any) {
    this.handleResponse(response);
    this.handleComplete();
  }
  getCEP(cep: number): Observable<any> {
    this.loadingSubject.next(true);

    const url = `${this.API}/consultarCEP/${cep}`;

    return this.httpClient.get<any>(url)
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getMoeda(): Observable<any> {
    this.loadingSubject.next(true);

    const url = `${this.API}/cotacao`;

    return this.httpClient.get<any>(url)
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getCambio(moeda: string):Observable<any> {
    this.loadingSubject.next(true);
    const url = `${this.API}/consultarcotacao?moeda=${moeda}`;
    return this.httpClient.get<any>(url)
    .pipe(
      first(),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

}
