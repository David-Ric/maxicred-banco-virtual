export interface ContaCorrente {
  id: number;
  clienteId: number;
  agencia: number;
  conta: number;
  dataAbertura: Date;
  saldo: number;
  chavePix?: string;
  moeda?: string;
}
