export type UserRole = 'admin' | 'professor' | 'aluno';

export type ProjardeBelt =
  | 'Amarela'
  | 'Amarela e Branca'
  | 'Verde'
  | 'Verde e Branca'
  | 'Azul'
  | 'Azul e Branca'
  | 'Marrom'
  | 'Marrom e Branca'
  | 'Vermelha'
  | 'Vermelha e Branca'
  | 'Vermelho e Amarelo'
  | 'Preta'
  | 'Preta e Branca';

export interface Aluno {
  id: string;
  matricula: number;
  nome: string;
  email: string;
  telefone: string;
  ct: string;
  status: 'ativo' | 'pendente' | 'inativo';
  faixa: ProjardeBelt;
  graus: number; // 0 a 4
  tipo_sanguineo?: string;
  alergias?: string;
  problemas_saude?: string;
  contato_emergencia?: string;
  ultimo_mes_pago: number; // 0-11, -1 se não pago
  ultimo_ano_pago: number;
  data_cadastro?: string;
  termo_aceito?: boolean;
}

export interface Unidade {
  id: string;
  nome: string;
  tipo: 'pagante' | 'bolsista';
  endereco?: string;
  responsavel?: string;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  ct: string;
  role: 'admin' | 'professor';
  telefone?: string;
  data_cadastro?: string;
}

export interface FrequenciaRecord {
  id: string;
  alunoId: string;
  nome: string;
  unidade: string;
  data: string; // ISO string
  dataRef: string; // YYYY-MM-DD
}

export interface FinanceiroItem {
  id: string;
  descricao: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  categoria: 'Mensalidade' | 'Venda' | 'Equipamento' | 'Aluguel' | 'Geral';
  forma: 'Pix' | 'Dinheiro' | 'Cartão' | 'Outro';
  data: string;
  ct: string;
}

export interface EstoqueItem {
  id: string;
  nome: string;
  quantidade: number;
  categoria?: string;
  valorUnitario?: number;
}
