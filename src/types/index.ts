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
  foto_url?: string;
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
  fotoUrl?: string;
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
  alunoId?: string | null;
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
  titulo?: string;
  viewOuLink: string;
  url?: string;
  visivel: boolean;
  ativo?: boolean;
  ordem: number;
}

export interface PaginaCustomizada {
  id: string;
  slug: string;
  titulo: string;
  conteudo: string;
  visivelMenu?: boolean;
  publicada?: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
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
  descricaoHero?: string;
  chavePixOficial: string;
  valorMensalidadePadrao: number;
  whatsappContato: string;
  instagramUrl: string;
  facebookUrl?: string;
  emailContato: string;
  dominioPersonalizado?: string;
  firebaseConfigCustom?: string;
  biografiaMestreDaniel: string;
  historiaAcademia: string;
  avisoGlobal?: string;
  avisoGlobalAtivo?: boolean;
  notificacoesAtivas?: boolean;
  notificacaoTexto?: string;
  rodapeTexto?: string;
  menuItens?: MenuItemSite[];
}

export interface HomeScreenConfig {
  badge: string;
  tituloHero: string;
  subtituloHero: string;
  ctaPrimario: string;
  ctaSecundario: string;
  statAnosNumero: string;
  statAnosTexto: string;
  statFaixasNumero: string;
  statFaixasTexto: string;
  statPolosNumero: string;
  statPolosTexto: string;
  statMetodologiaNumero: string;
  statMetodologiaTexto: string;
  polosTitulo: string;
  polosSubtitulo: string;
  horariosTitulo: string;
  horariosSubtitulo: string;
  ctaBannerTitulo: string;
  ctaBannerTexto: string;
  ctaBannerBotao: string;
  heroVisivel?: boolean;
  modalidadesVisivel?: boolean;
  horariosVisivel?: boolean;
  polosVisivel?: boolean;
  ctaBannerVisivel?: boolean;
  heroImagemUrl?: string;
  modalidade1FotoUrl?: string;
  modalidade2FotoUrl?: string;
  modalidade3FotoUrl?: string;
  ctaBannerFotoUrl?: string;
}

export interface SobreScreenConfig {
  tituloMestre: string;
  subtituloMestre: string;
  biografiaMestre: string;
  grauMestre: string;
  historiaTitulo: string;
  historiaTexto: string;
  pilar1Titulo: string;
  pilar1Texto: string;
  pilar2Titulo: string;
  pilar2Texto: string;
  pilar3Titulo: string;
  pilar3Texto: string;
}

export interface MatriculaScreenConfig {
  titulo: string;
  subtitulo: string;
  beneficio1: string;
  beneficio2: string;
  beneficio3: string;
  botaoTexto: string;
  avisoTermo: string;
}

export interface AlunoScreenConfig {
  tituloPortal: string;
  avisoMural: string;
  suporteWhatsAppTexto: string;
  linkSuporteWhatsApp: string;
  mostrarRanking: boolean;
  mostrarGradeHorarios: boolean;
  mostrarCalculadoraPeso: boolean;
}

export interface GlobalSiteConfig {
  nomeSite: string;
  slogan: string;
  logoUrl?: string;
  corPrimaria: string;
  corDestaque: string;
  chavePix: string;
  valorMensalidade: number;
  whatsapp: string;
  instagram: string;
  facebook?: string;
  emailContato: string;
  notificacaoTopoAtiva: boolean;
  notificacaoTopoTexto: string;
  notificacaoTopoCor?: 'amarelo' | 'vermelho' | 'verde' | 'azul';
  notificacaoDataExpiracao?: string;
  chatbotBoasVindas?: string;
  rodapeTexto: string;
}

export interface GlobalScreensConfig {
  home: HomeScreenConfig;
  sobre: SobreScreenConfig;
  matricula: MatriculaScreenConfig;
  aluno: AlunoScreenConfig;
  global: GlobalSiteConfig;
  updatedAt?: any;
  updatedBy?: string;
}

export type Professor = UsuarioSistema;

export interface CadastroPendente {
  id: string;
  tipo: 'aluno' | 'professor';
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  ct: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  faixa?: ProjardeBelt;
  graus?: number;
  dataSolicitacao: string;
  observacoes?: string;
  termoAceito: boolean;
}

export interface LeadAtendimento {
  id: string;
  nome?: string;
  contato?: string;
  poloInteresse?: string;
  duvidaPrincipal?: string;
  historicoMensagens: { autor: 'user' | 'ia'; texto: string; timestamp: string }[];
  data: string;
  status: 'novo' | 'em_atendimento' | 'convertido';
}

export interface ChatbotConfig {
  ativo: boolean;
  nomeAtendente: string;
  mensagemBoasVindas: string;
  resumoPrompt?: string;
  whatsappDestino?: string;
}

export interface CMSHistoryItem {
  id: string;
  data: string;
  autor: string;
  descricao: string;
  dados: GlobalScreensConfig;
}

export interface GaleriaItem {
  id: string;
  titulo: string;
  categoria: 'campeonatos' | 'cinturoes' | 'treinos' | 'instagram';
  url: string;
  legenda?: string;
  instagramPostUrl?: string;
  ordem?: number;
  estilo?: {
    larguraPercentual?: number;
    alturaPx?: number;
    encaixe?: 'cover' | 'contain';
    focoX?: number;
    focoY?: number;
    zoom?: number;
    rotacao?: number;
    overlayEscuro?: number;
  };
}

export interface AvisoGlobalConfig {
  ativo: boolean;
  texto: string;
  cor: 'vermelho' | 'amarelo' | 'verde' | 'azul';
  dataLimiteExibicao?: string;
}
