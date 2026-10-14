export type UserRole = 
  | 'administrador_geral'
  | 'administrador'
  | 'professor'
  | 'aluno'
  | 'financeiro';

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

export interface UsuarioSistema {
  id: string;
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  ct: string;
  telefone?: string;
  fotoUrl?: string;
  dataCadastro: string;
  ultimoAcesso?: string;
  ultimoIp?: string;
  ultimoDispositivo?: string;
  ativo: boolean;
  bloqueado?: boolean;
}

export interface Aluno {
  id: string;
  matricula: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone: string;
  ct: string;
  status: 'ativo' | 'pendente' | 'inativo';
  faixa: ProjardeBelt;
  graus: number; // 0 a 4
  tipo_sanguineo?: string;
  alergias?: string;
  problemas_saude?: string;
  contato_emergencia?: string;
  peso_kg?: number;
  altura_cm?: number;
  fotoUrl?: string;
  documentoUrl?: string;
  certificadoUrl?: string;
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
  telefone?: string;
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
  alunoId?: string;
  comprovanteUrl?: string;
}

export interface EventoItem {
  id: string;
  titulo: string;
  tipo: 'campeonato' | 'graduacao' | 'seminario' | 'outro';
  data: string;
  local: string;
  descricao: string;
  ct: string;
  fotoUrl?: string;
}

export type StorageFolder = 
  | 'perfil'
  | 'alunos'
  | 'professores'
  | 'eventos'
  | 'certificados'
  | 'comprovantes'
  | 'documentos'
  | 'logos';

export interface ArquivoItem {
  id: string;
  nome: string;
  tipo: 'foto' | 'documento' | 'certificado' | 'outro';
  pasta?: StorageFolder;
  url: string;
  tamanhoBytes?: number;
  autor: string;
  dataUpload: string;
  alunoId?: string;
  descricao?: string;
}

export interface AuditoriaLog {
  id: string;
  acao: string;
  detalhes: string;
  usuario: string;
  tipo: 'acesso' | 'alteracao' | 'exclusao' | 'financeiro' | 'sistema';
  data: string;
  ip?: string;
  dispositivo?: string;
  valorAntigo?: string;
  valorNovo?: string;
}

export interface EstoqueItem {
  id: string;
  nome: string;
  quantidade: number;
  categoria?: string;
  valorUnitario?: number;
}

export interface AvisoCT {
  id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  data: string;
  ct: string;
  urgente?: boolean;
}

export interface HorarioTreino {
  id: string;
  modalidade: string;
  dias: string;
  horario: string;
  ct: string;
  instrutor: string;
  nivel: 'Iniciante' | 'Geral' | 'Competição' | 'Kids' | 'Feminino';
}

export interface MenuItemSite {
  id: string;
  label: string;
  viewOuLink: string;
  visivel: boolean;
  ordem: number;
}

export interface PaginaCustomizada {
  id: string;
  slug: string;
  titulo: string;
  conteudo: string;
  visivelMenu: boolean;
  dataCriacao: string;
  autor: string;
}

export interface SiteConfig {
  nomeSite: string;
  slogan: string;
  logoUrl?: string;
  corPrimaria: string;
  corDestaque: string;
  bannerHeroUrl?: string;
  tituloHero: string;
  subtituloHero: string;
  chavePixOficial: string;
  valorMensalidadePadrao: number;
  whatsappContato: string;
  instagramUrl: string;
  facebookUrl?: string;
  emailContato: string;
  dominioPersonalizado?: string;
  biografiaMestreDaniel: string;
  historiaAcademia: string;
  avisoGlobal?: string;
  avisoGlobalAtivo?: boolean;
  notificacoesAtivas?: boolean;
  notificacaoTexto?: string;
  rodapeTexto?: string;
  menuItens?: MenuItemSite[];
}

export type Professor = UsuarioSistema;
