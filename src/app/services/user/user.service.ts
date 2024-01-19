import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, catchError, finalize, first, tap, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/interfaces/cliente/cliente';
import { AuthRegister } from 'src/app/models/interfaces/user/auth/AuthRegister';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL
  private readonly API = `${environment.API_URL}/api/Usuario`;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public showModal = false;
  public modalMessage = '';


  constructor(private http: HttpClient, private cookie: CookieService) { }

  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/Auth/login`, requestDatas);
  }

  registerUser(requestDatas: AuthRegister): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/Auth/register`, requestDatas);
  }

  isLoggedIn(): boolean {

    const JWT_TOKEN = this.cookie.get('T_USER');
    return JWT_TOKEN? true : false;

  }
  getId(id: number): Observable<Cliente> {
    this.loadingSubject.next(true);

    const url = `${this.API}/${id}`;

    return this.http.get<Cliente>(url)
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
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

  private handleResponse(response: any) {
    this.loadingSubject.next(false);
    this.showModal = true;
    this.modalMessage = response || 'Operação realizada com sucesso.';
  }

  private handleSuccess(response: any) {
    this.handleResponse(response);
    this.handleComplete();
  }

  putCliente(id: number, cliente: Cliente): Observable<string> {
    this.loadingSubject.next(true);

    const url = `${this.API}/${id}`;

    return this.http.put(url, cliente, { responseType: 'text' })
      .pipe(
        first(),
        catchError(error => this.handleError(error)),
        finalize(() => this.handleComplete()),
        tap(response => {
          console.log('Put Response:', response);
          this.loadingSubject.next(false);
          this.showModal = true;
          this.modalMessage = response || 'Cadastro finalizado com sucesso.';
          this.handleSuccess(response);
        })
      );
  }
}
