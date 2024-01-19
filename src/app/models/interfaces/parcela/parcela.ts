export interface Parcela {
  id?: number;
  emprestimoId: number;
  numeroParcela: number;
  dataVencimento?: string;
  valorComJuros: number;
  dataPagamento?: string;
  status?: string;
}
export interface ParcelaPage {
  parcelas: Parcela[];
  totalItems: number;
}
