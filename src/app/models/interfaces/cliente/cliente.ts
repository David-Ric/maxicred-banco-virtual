import { Emprestimo } from "../emprestimo/emprestimo";

export interface Cliente {
  id: number;
  email: string;
  username?: string;
  nomeCompleto?: string;
  cpf_cnpj?:string;
  status?: string;
  telefone?: string;
  profissao?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  rendaMensal: number;
  emprestimos?: Emprestimo[];
  tipUser?: string;

  [key: string]: string | number | undefined | Emprestimo[] | null;
}





