import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContaCorrente } from 'src/app/models/interfaces/conta-corrente/conta-corrente';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ContaCorrenteService {
  private readonly apiUrl = environment.API_URL;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public showModal = false;
  public modalMessage = '';

  constructor(private http: HttpClient) {}


  criarContaCorrente(contaCorrente: ContaCorrente): Observable<ContaCorrente> {
    return this.http.post<ContaCorrente>(`${this.apiUrl}/api/Contacorrente`, contaCorrente);
  }


  atualizarContaCorrente(clienteId: number, deposito: number, moeda:string): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Contacorrente/${clienteId}?deposito=${deposito}&moeda=${moeda}`,'' );
  }


  obterContaCorrentePorId(id: number): Observable<ContaCorrente> {
    return this.http.get<ContaCorrente>(`${this.apiUrl}/api/Contacorrente/${id}`);
  }


  obterContasCorrentesPorClienteId(clienteId: number): Observable<ContaCorrente[]> {
    return this.http.get<ContaCorrente[]>(`${this.apiUrl}/api/ContaCorrente/cliente/${clienteId}`);

  }
}
