import { Parcela } from "../parcela/parcela";


export interface EmprestimoResponse {
  totalItems: number;
  emprestimos: Emprestimo[];
}

export interface Emprestimo {
  id: number;
  clienteId: number;
  dataEmprestimo: Date;
  moeda?: string;
  valorPedido: number;
  valorCotacao?: number;
  valorFinalComJuros: number;
  totalParcelas: number;
  valorFinalComJurosParcela?: number;
  status?: string;
  parcelas?: Parcela[];
}
