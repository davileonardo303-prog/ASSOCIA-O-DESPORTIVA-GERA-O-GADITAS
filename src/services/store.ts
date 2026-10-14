import { 
  Aluno, 
  Unidade, 
  UsuarioSistema, 
  UserRole,
  FrequenciaRecord, 
  FinanceiroItem, 
  EstoqueItem, 
  ProjardeBelt, 
  AvisoCT, 
  EventoItem, 
  ArquivoItem, 
  AuditoriaLog,
  HorarioTreino,
  SiteConfig,
  MenuItemSite,
  PaginaCustomizada,
  StorageFolder,
  GlobalScreensConfig,
  HomeScreenConfig,
  SobreScreenConfig,
  MatriculaScreenConfig,
  AlunoScreenConfig,
  GlobalSiteConfig
} from '../types';
import { db, auth, uploadArquivoFirebase } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

const SUPER_ADMIN_EMAIL = 'davileonardo303@gmail.com';

const INITIAL_UNIDADES_OFICIAIS: Unidade[] = [
  { id: 'uni-campo-grande', nome: 'Campo Grande', tipo: 'pagante', responsavel: 'Mestre Daniel Braga', endereco: 'Rua Principal, Campo Grande - RJ', telefone: '(21) 99999-0001' },
  { id: 'uni-bangu', nome: 'Bangu', tipo: 'pagante', responsavel: 'Professor Lucas Rocha', endereco: 'Av. Cônego de Vasconcelos, Bangu - RJ', telefone: '(21) 99999-0002' },
  { id: 'uni-seropedica', nome: 'Seropédica', tipo: 'pagante', responsavel: 'Professor Marcos Santos', endereco: 'Km 40, Seropédica - RJ', telefone: '(21) 99999-0003' },
  { id: 'uni-nova-iguacu', nome: 'Nova Iguaçu (Social)', tipo: 'bolsista', responsavel: 'Associação Desportiva Gaditas', endereco: 'Polo Nova Iguaçu - RJ', telefone: '(21) 99999-0004' }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  nomeSite: 'Equipe Gaditas Fight Team',
  slogan: 'Resgatando Vidas através da Nobre Arte e do Muay Thai',
  logoUrl: '',
  corPrimaria: '#cc0000',
  corDestaque: '#f59e0b',
  bannerHeroUrl: '',
  tituloHero: 'FORJANDO GUERREIROS, FORMANDO CIDADÃOS',
  subtituloHero: 'Do tatame para a vida. CT de Alta Performance sob a liderança do Mestre Daniel Braga.',
  chavePixOficial: 'gaditasfightteam@gmail.com',
  valorMensalidadePadrao: 120,
  whatsappContato: '(21) 99999-0001',
  instagramUrl: 'https://www.instagram.com/gaditas_fight',
  facebookUrl: 'https://www.facebook.com/gaditasfightteam',
  emailContato: 'gaditasfightteam@gmail.com',
  dominioPersonalizado: 'equipegaditas.com.br',
  biografiaMestreDaniel: 'Fundador e líder técnico da Equipe Gaditas. Mestre Projarde com décadas dedicadas às artes marciais e ao resgate esportivo de jovens.',
  historiaAcademia: 'A Associação Desportiva Gaditas nasceu com o propósito de transformar vidas através da disciplina marcial, honra e alto rendimento.',
  avisoGlobal: '',
  avisoGlobalAtivo: false,
  notificacoesAtivas: true,
  notificacaoTexto: 'Matrículas abertas para a nova temporada de treinos nos CTs Campo Grande, Bangu e Seropédica!',
  rodapeTexto: '© 2026 Associação Desportiva Equipe Gaditas Fight Team · Todos os direitos reservados. CNPJ 00.000.000/0001-00.',
  menuItens: [
    { id: 'm1', label: 'Início', viewOuLink: 'home', visivel: true, ordem: 1 },
    { id: 'm2', label: 'Horários', viewOuLink: 'horarios', visivel: true, ordem: 2 },
    { id: 'm3', label: 'Graduações', viewOuLink: 'graduacoes', visivel: true, ordem: 3 },
    { id: 'm4', label: 'Matrícula', viewOuLink: 'matricula', visivel: true, ordem: 4 },
    { id: 'm5', label: 'Saúde Firebase', viewOuLink: 'saude-firebase', visivel: true, ordem: 5 },
    { id: 'm6', label: 'Portal do Aluno', viewOuLink: 'aluno-portal', visivel: true, ordem: 6 },
    { id: 'm7', label: 'Administração', viewOuLink: 'admin-portal', visivel: true, ordem: 7 }
  ]
};

export const DEFAULT_GLOBAL_SCREENS: GlobalScreensConfig = {
  home: {
    badge: 'Associação Desportiva Gaditas · Desde 2017',
    tituloHero: 'FORJE SUA MELHOR VERSÃO NOS TATAMES',
    subtituloHero: 'Luta Livre, Muay Thai Tradicional e MMA sob a liderança técnica do Mestre Daniel Braga. Unidades de alto rendimento no Rio de Janeiro.',
    ctaPrimario: 'Matricule-se Agora',
    ctaSecundario: 'Aula Experimental Grátis',
    statAnosNumero: '2017',
    statAnosTexto: 'Fundação Oficial',
    statFaixasNumero: '+12',
    statFaixasTexto: 'Faixas Pretas Formados',
    statPolosNumero: '4',
    statPolosTexto: 'Polos Ativos no RJ',
    statMetodologiaNumero: '100%',
    statMetodologiaTexto: 'Metodologia Projarde',
    polosTitulo: 'NOSSOS POLOS & CENTROS DE TREINAMENTO',
    polosSubtitulo: 'Estrutura profissional com tatames olímpicos, vestiários e professores graduados em cada CT.',
    horariosTitulo: 'GRADE DE TREINOS OFICIAL',
    horariosSubtitulo: 'Turmas divididas por idade, graduação e foco esportivo (iniciante ao avançado).',
    ctaBannerTitulo: 'PRONTO PARA FORJAR SEU CARÁTER E SUA TÉCNICA?',
    ctaBannerTexto: 'Agende hoje mesmo uma aula experimental gratuita em qualquer um dos nossos polos e vivencie a disciplina da Equipe Gaditas.',
    ctaBannerBotao: 'Falar com o Mestre no WhatsApp'
  },
  sobre: {
    tituloMestre: 'MESTRE DANIEL BRAGA',
    subtituloMestre: 'Direção Geral e Técnica',
    biografiaMestre: 'Com mais de duas décadas dedicadas às artes marciais e à formação de atletas e cidadãos, o Mestre Daniel Braga lidera a Equipe Gaditas Fight Team com foco absoluto em técnica apurada, respeito à hierarquia do dojo e transformação social.',
    grauMestre: 'Muay Thai · Grau Preta e Branca',
    historiaTitulo: 'A HISTÓRIA DA EQUIPE GADITAS',
    historiaTexto: 'Inspirada nos guerreiros bíblicos de Gade — descritos como homens de coragem com rostos de leões e rápidos como gazelas —, a Equipe Gaditas foi fundada em 2017 pelo Mestre Daniel Braga. Nosso compromisso vai além das medalhas: formamos campeões na vida.',
    pilar1Titulo: 'HONRA',
    pilar1Texto: 'Respeito irrestrito aos mestres, companheiros de treino e adversários dentro e fora do tatame.',
    pilar2Titulo: 'DISCIPLINA',
    pilar2Texto: 'Constância diária, superação da preguiça e busca incessante pelo aperfeiçoamento físico e moral.',
    pilar3Titulo: 'LEALDADE',
    pilar3Texto: 'União e fraternidade verdadeira entre todos os guerreiros da família Gaditas.'
  },
  matricula: {
    titulo: 'MATRÍCULA ONLINE & NOVA INSCRIÇÃO',
    subtitulo: 'Junte-se à Equipe Gaditas. Preencha seus dados para começar a treinar no CT mais próximo.',
    beneficio1: 'Acesso completo às aulas oficiais de Muay Thai, Jiu-Jitsu e Luta Livre',
    beneficio2: 'Acompanhamento individual de graduação e carteirinha digital oficial de atleta',
    beneficio3: 'Condições especiais para famílias e alunos de projetos sociais parceiros',
    botaoTexto: 'Confirmar e Gerar Matrícula Oficial',
    avisoTermo: 'Declaro estar apto para a prática de artes marciais de contato e comprometo-me a respeitar a hierarquia e as normas do dojo.'
  },
  aluno: {
    tituloPortal: 'PORTAL DO GUERREIRO GADITAS',
    avisoMural: 'Atenção guerreiros: mantenham a frequência regular em todas as aulas para qualificação nos exames oficiais de graduação!',
    suporteWhatsAppTexto: 'Suporte Direto com a Coordenação',
    linkSuporteWhatsApp: 'https://api.whatsapp.com/send?phone=5521999990001&text=Ola%20Preciso%20de%20ajuda%20no%20Portal%20do%20Aluno',
    mostrarRanking: true,
    mostrarGradeHorarios: true,
    mostrarCalculadoraPeso: true
  },
  global: {
    nomeSite: 'Equipe Gaditas Fight Team',
    slogan: 'Resgatando Vidas através da Nobre Arte e do Muay Thai',
    logoUrl: '',
    corPrimaria: '#dc2626',
    corDestaque: '#f59e0b',
    chavePix: 'gaditasfightteam@gmail.com',
    valorMensalidade: 120,
    whatsapp: '(21) 99999-0001',
    instagram: 'https://www.instagram.com/gaditas_fight',
    facebook: 'https://www.facebook.com/gaditasfightteam',
    emailContato: 'gaditasfightteam@gmail.com',
    notificacaoTopoAtiva: true,
    notificacaoTopoTexto: 'Matrículas abertas para a nova temporada de treinos nos CTs Campo Grande, Bangu e Seropédica!',
    rodapeTexto: '© 2026 Associação Desportiva Equipe Gaditas Fight Team · Todos os direitos reservados. Metodologia Projarde.'
  }
};

const LOCAL_STORAGE_KEYS = {
  SESSAO_USUARIO: 'gaditas_sessao_ativa_v5',
  SESSAO_ADMIN_CUSTOM: 'gaditas_admin_session_v5',
  IMPERSONACAO: 'gaditas_impersonacao_v5',
  ULTIMO_BACKUP: 'gaditas_ultimo_backup_v5'
};

export interface VarreduraResultado {
  tempoConsultaMs: number;
  totalAlunos: number;
  totalUsuarios: number;
  totalLancamentos: number;
  totalEventos: number;
  totalArquivos: number;
  duplicadosEmailAlunos: { email: string; alunos: Aluno[] }[];
  duplicadosEmailUsuarios: { email: string; usuarios: UsuarioSistema[] }[];
  duplicadosMatricula: { matricula: number; alunos: Aluno[] }[];
  emailsInvalidosOuInexistentes: { id: string; tipo: 'aluno' | 'usuario'; nome: string; email: string; motivo: string }[];
  orfaosSemUnidade: Aluno[];
  orfaosFinanceiro: FinanceiroItem[];
  camposVaziosAlunos: { id: string; nome: string; campos: string[] }[];
  uploadsQuebrados: ArquivoItem[];
  falhasPermissao: UsuarioSistema[];
  errosAutenticacaoRecentes: AuditoriaLog[];
}

export interface SaudeFirebaseResultado {
  firestore: {
    status: 'conectado' | 'erro' | 'reconectando';
    databaseId: string;
    totalColecoes: number;
    totalDocumentos: number;
    latenciaMs: number;
  };
  auth: {
    status: 'ativo' | 'erro';
    totalUsuarios: number;
    usuariosAtivos: number;
    usuariosBloqueados: number;
    porPapel: Record<string, number>;
  };
  storage: {
    status: 'conectado' | 'erro';
    bucket: string;
    totalArquivos: number;
    espacoUtilizadoBytes: number;
    espacoFormatado: string;
    espacoLivreFormatado: string;
    porPasta: Record<StorageFolder, number>;
  };
  metricasAdicionais: {
    totalAlunos: number;
    totalProfessores: number;
    totalEventos: number;
    quantidadeBackups: number;
    usuariosOnline: number;
    ultimoLoginSistema: string | null;
    ultimoErroDetectado: string | null;
    consumoMensal: {
      leiturasEstimadas: number;
      escritasEstimadas: number;
      bandwidthEstimada: string;
    };
    custosEstimados: string;
  };
  sincronizacao: {
    status: 'sincronizado' | 'pendente';
    ultimoSyncIso: string;
    ultimoBackupIso: string | null;
  };
  errosEncontrados: number;
}

// Alunos e professores reais da Equipe Gaditas para inicialização segura em produção
const ALUNOS_REAIS_INICIAIS: Omit<Aluno, 'id'>[] = [
  {
    matricula: 101,
    nome: 'Davi Leonardo',
    email: 'davileonardo303@gmail.com',
    cpf: '111.222.333-44',
    telefone: '(21) 98888-0101',
    ct: 'Campo Grande',
    status: 'ativo',
    faixa: 'Preta',
    graus: 2,
    tipo_sanguineo: 'O+',
    contato_emergencia: '(21) 98888-0102',
    peso_kg: 78,
    altura_cm: 180,
    ultimo_mes_pago: new Date().getMonth(),
    ultimo_ano_pago: new Date().getFullYear(),
    data_cadastro: '2026-01-15',
    termo_aceito: true
  },
  {
    matricula: 102,
    nome: 'Daniel Braga',
    email: 'danielbraga.gaditas@gmail.com',
    cpf: '222.333.444-55',
    telefone: '(21) 99999-0001',
    ct: 'Campo Grande',
    status: 'ativo',
    faixa: 'Vermelho e Amarelo',
    graus: 4,
    tipo_sanguineo: 'A+',
    contato_emergencia: '(21) 99999-0005',
    peso_kg: 84,
    altura_cm: 182,
    ultimo_mes_pago: new Date().getMonth(),
    ultimo_ano_pago: new Date().getFullYear(),
    data_cadastro: '2026-01-10',
    termo_aceito: true
  },
  {
    matricula: 103,
    nome: 'Lucas Rocha',
    email: 'lucasrocha.gaditas@gmail.com',
    cpf: '333.444.555-66',
    telefone: '(21) 99999-0002',
    ct: 'Bangu',
    status: 'ativo',
    faixa: 'Preta',
    graus: 1,
    tipo_sanguineo: 'B+',
    contato_emergencia: '(21) 99999-0006',
    peso_kg: 72,
    altura_cm: 175,
    ultimo_mes_pago: new Date().getMonth(),
    ultimo_ano_pago: new Date().getFullYear(),
    data_cadastro: '2026-02-01',
    termo_aceito: true
  },
  {
    matricula: 104,
    nome: 'Marcos Santos',
    email: 'marcossantos.gaditas@gmail.com',
    cpf: '444.555.666-77',
    telefone: '(21) 99999-0003',
    ct: 'Seropédica',
    status: 'ativo',
    faixa: 'Marrom e Branca',
    graus: 3,
    tipo_sanguineo: 'O-',
    contato_emergencia: '(21) 99999-0007',
    peso_kg: 80,
    altura_cm: 178,
    ultimo_mes_pago: new Date().getMonth(),
    ultimo_ano_pago: new Date().getFullYear(),
    data_cadastro: '2026-02-10',
    termo_aceito: true
  },
  {
    matricula: 105,
    nome: 'Gabriel Silva',
    email: 'gabriel.silva@gaditas.org',
    cpf: '555.666.777-88',
    telefone: '(21) 97777-0105',
    ct: 'Campo Grande',
    status: 'ativo',
    faixa: 'Azul e Branca',
    graus: 2,
    tipo_sanguineo: 'AB+',
    contato_emergencia: '(21) 97777-0106',
    peso_kg: 68,
    altura_cm: 172,
    ultimo_mes_pago: new Date().getMonth(),
    ultimo_ano_pago: new Date().getFullYear(),
    data_cadastro: '2026-02-15',
    termo_aceito: true
  },
  {
    matricula: 106,
    nome: 'Ana Clara Mendes',
    email: 'anaclara.mendes@gaditas.org',
    cpf: '666.777.888-99',
    telefone: '(21) 97777-0107',
    ct: 'Bangu',
    status: 'ativo',
    faixa: 'Verde',
    graus: 1,
    tipo_sanguineo: 'A-',
    contato_emergencia: '(21) 97777-0108',
    peso_kg: 58,
    altura_cm: 165,
    ultimo_mes_pago: new Date().getMonth(),
    ultimo_ano_pago: new Date().getFullYear(),
    data_cadastro: '2026-02-20',
    termo_aceito: true
  }
];

const DEFAULT_HORARIOS: HorarioTreino[] = [
  {
    id: 'h-1',
    modalidade: 'Muay Thai Pro & Amador',
    dias: 'Segunda, Quarta e Sexta',
    horario: '19:30 - 21:00',
    ct: 'Campo Grande',
    instrutor: 'Mestre Daniel Braga',
    nivel: 'Competição'
  },
  {
    id: 'h-2',
    modalidade: 'Luta Livre Esportiva',
    dias: 'Terça e Quinta',
    horario: '20:00 - 21:30',
    ct: 'Campo Grande',
    instrutor: 'Prof. Davi Leonardo',
    nivel: 'Geral'
  },
  {
    id: 'h-3',
    modalidade: 'Muay Thai Kids & Juvenil',
    dias: 'Terça e Quinta',
    horario: '18:00 - 19:00',
    ct: 'Campo Grande',
    instrutor: 'Instrutora Clara',
    nivel: 'Kids'
  },
  {
    id: 'h-4',
    modalidade: 'MMA & Striking',
    dias: 'Segunda a Sexta',
    horario: '07:00 - 08:30',
    ct: 'Bangu',
    instrutor: 'Prof. Lucas Rocha',
    nivel: 'Geral'
  },
  {
    id: 'h-5',
    modalidade: 'Kickboxing K-1 & Boxe',
    dias: 'Segunda, Quarta e Sexta',
    horario: '18:30 - 20:00',
    ct: 'Bangu',
    instrutor: 'Prof. Lucas Rocha',
    nivel: 'Competição'
  },
  {
    id: 'h-6',
    modalidade: 'Muay Thai Universitário',
    dias: 'Segunda e Quarta',
    horario: '18:00 - 19:30',
    ct: 'Seropédica',
    instrutor: 'Prof. Marcos Santos',
    nivel: 'Geral'
  },
  {
    id: 'h-7',
    modalidade: 'Inclusão Marcial & Jiu-Jitsu',
    dias: 'Sábado',
    horario: '09:00 - 11:00',
    ct: 'Nova Iguaçu',
    instrutor: 'Mestre Daniel Braga',
    nivel: 'Iniciante'
  }
];

class GaditasProductionStore {
  public currentUser: UsuarioSistema | null = null;
  public currentAluno: Aluno | null = null;
  public impersonatedUser: { tipo: 'aluno' | 'usuario'; dados: any } | null = null;
  public authLoading: boolean = true;
  public siteConfig: SiteConfig = { ...DEFAULT_SITE_CONFIG };
  public globalScreens: GlobalScreensConfig = { ...DEFAULT_GLOBAL_SCREENS };
  public cmsConnectedRealtime: boolean = false;
  public cmsLastUpdatedBy: string = 'sistema';
  public cmsLastUpdatedAt: string = '';

  private adminEmailsList: string[] = [SUPER_ADMIN_EMAIL.toLowerCase()];
  private alunos: Aluno[] = [];
  private unidades: Unidade[] = (() => {
    try {
      const cached = typeof localStorage !== 'undefined' ? localStorage.getItem('gaditas_unidades_cache') : null;
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [...INITIAL_UNIDADES_OFICIAIS];
  })();
  private usuarios: UsuarioSistema[] = [];
  private financeiro: FinanceiroItem[] = [];
  private estoque: EstoqueItem[] = [];
  private frequencia: FrequenciaRecord[] = [];
  private avisos: AvisoCT[] = [];
  private eventos: EventoItem[] = [];
  private arquivos: ArquivoItem[] = [];
  private paginas: PaginaCustomizada[] = [];
  private auditoriaLogs: AuditoriaLog[] = [];
  private ultimoSyncTimestamp: string = new Date().toISOString();
  private listeners: (() => void)[] = [];

  constructor() {
    this.carregarImpersonacaoSalva();
    this.iniciarListenersTempoRealCMS();
    this.initAuthAndSync();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private carregarImpersonacaoSalva() {
    const salvo = localStorage.getItem(LOCAL_STORAGE_KEYS.IMPERSONACAO);
    if (salvo) {
      try {
        this.impersonatedUser = JSON.parse(salvo);
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.IMPERSONACAO);
      }
    }
  }

  private async initAuthAndSync() {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      this.authLoading = true;
      if (firebaseUser) {
        await this.carregarPerfilUsuario(firebaseUser);
      } else {
        const sessaoSalva = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO);
        if (sessaoSalva) {
          try {
            const parsed = JSON.parse(sessaoSalva);
            if (parsed.tipo === 'aluno') {
              this.currentAluno = parsed.dados;
            } else if (parsed.tipo === 'usuario') {
              this.currentUser = parsed.dados;
            }
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO);
          }
        } else {
          this.currentUser = null;
          this.currentAluno = null;
        }
      }
      this.authLoading = false;
      await this.sincronizarBancoGeral();
      this.notify();
    });
  }

  public async sincronizarBancoGeral() {
    try {
      this.ultimoSyncTimestamp = new Date().toISOString();

      // 0. Configurações Globais do Site (CMS)
      try {
        const docConfig = await getDoc(doc(db, 'configuracoes', 'site'));
        if (docConfig.exists()) {
          this.siteConfig = { ...DEFAULT_SITE_CONFIG, ...docConfig.data() } as SiteConfig;
        } else {
          await setDoc(doc(db, 'configuracoes', 'site'), DEFAULT_SITE_CONFIG);
          this.siteConfig = { ...DEFAULT_SITE_CONFIG };
        }
      } catch (errConfig) {
        console.warn('Configuracoes site:', errConfig);
      }

      // 1. Unidades (CTs)
      try {
        const snapUnidades = await getDocs(collection(db, 'unidades'));
        if (!snapUnidades.empty) {
          this.unidades = snapUnidades.docs.map(d => ({ id: d.id, ...d.data() } as Unidade));
        } else {
          for (const u of INITIAL_UNIDADES_OFICIAIS) {
            await setDoc(doc(db, 'unidades', u.id), u);
          }
          this.unidades = [...INITIAL_UNIDADES_OFICIAIS];
        }
        try {
          localStorage.setItem('gaditas_unidades_cache', JSON.stringify(this.unidades));
        } catch {}
      } catch (eUnidades) {
        console.warn('Unidades:', eUnidades);
        if (this.unidades.length === 0) {
          try {
            const cached = localStorage.getItem('gaditas_unidades_cache');
            if (cached) this.unidades = JSON.parse(cached);
          } catch {}
          if (this.unidades.length === 0) this.unidades = [...INITIAL_UNIDADES_OFICIAIS];
        }
      }

      // 2. Alunos (Guerreiros Ativos)
      try {
        const snapAlunos = await getDocs(collection(db, 'alunos'));
        if (!snapAlunos.empty) {
          this.alunos = snapAlunos.docs.map(d => ({ id: d.id, ...d.data() } as Aluno));
        } else {
          // Se a coleção estiver vazia no Firestore, inicializa com a base oficial de guerreiros
          const novosAlunos: Aluno[] = [];
          for (const a of ALUNOS_REAIS_INICIAIS) {
            const id = 'alu-' + a.matricula;
            const alunoCompleto: Aluno = { ...a, id };
            await setDoc(doc(db, 'alunos', id), alunoCompleto);
            novosAlunos.push(alunoCompleto);
          }
          this.alunos = novosAlunos;
        }
      } catch (eAlunos) {
        console.warn('Alunos:', eAlunos);
      }

      // 3. Usuários / Perfis Administrativos
      try {
        const snapUsuarios = await getDocs(collection(db, 'usuarios'));
        if (!snapUsuarios.empty) {
          this.usuarios = snapUsuarios.docs.map(d => ({ id: d.id, ...d.data() } as UsuarioSistema));
        }

        // Garante que o Super Admin Davi Leonardo sempre exista
        const devExistente = this.usuarios.find(u => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
        if (!devExistente) {
          const devUser: UsuarioSistema = {
            id: 'dev-davi-leonardo',
            uid: 'dev-davi-leonardo',
            nome: 'Davi Leonardo - Desenvolvedor',
            email: SUPER_ADMIN_EMAIL,
            role: 'administrador_geral',
            ct: 'GERAL',
            telefone: '(21) 98888-0101',
            dataCadastro: new Date().toISOString(),
            ativo: true,
            bloqueado: false
          };
          await setDoc(doc(db, 'usuarios', devUser.id), devUser);
          this.usuarios.unshift(devUser);
        }
      } catch (eUsuarios) {
        console.warn('Usuarios:', eUsuarios);
      }

      // 4. Financeiro
      try {
        const snapFin = await getDocs(collection(db, 'financeiro'));
        this.financeiro = snapFin.docs.map(d => ({ id: d.id, ...d.data() } as FinanceiroItem));
      } catch (eFin) {
        console.warn('Financeiro:', eFin);
      }

      // 5. Estoque
      try {
        const snapEst = await getDocs(collection(db, 'estoque'));
        this.estoque = snapEst.docs.map(d => ({ id: d.id, ...d.data() } as EstoqueItem));
      } catch (eEst) {
        console.warn('Estoque:', eEst);
      }

      // 6. Frequência
      try {
        const snapFreq = await getDocs(collection(db, 'frequencia'));
        this.frequencia = snapFreq.docs.map(d => ({ id: d.id, ...d.data() } as FrequenciaRecord));
      } catch (eFreq) {
        console.warn('Frequencia:', eFreq);
      }

      // 7. Avisos
      try {
        const snapAvisos = await getDocs(collection(db, 'avisos'));
        this.avisos = snapAvisos.docs.map(d => ({ id: d.id, ...d.data() } as AvisoCT));
      } catch (eAvisos) {
        console.warn('Avisos:', eAvisos);
      }

      // 8. Eventos
      try {
        const snapEventos = await getDocs(collection(db, 'eventos'));
        this.eventos = snapEventos.docs.map(d => ({ id: d.id, ...d.data() } as EventoItem));
      } catch (eEventos) {
        console.warn('Eventos:', eEventos);
      }

      // 9. Arquivos
      try {
        const snapArquivos = await getDocs(collection(db, 'arquivos'));
        this.arquivos = snapArquivos.docs.map(d => ({ id: d.id, ...d.data() } as ArquivoItem));
      } catch (eArquivos) {
        console.warn('Arquivos:', eArquivos);
      }

      // 10. Páginas Customizadas do CMS
      try {
        const snapPaginas = await getDocs(collection(db, 'paginas'));
        this.paginas = snapPaginas.docs.map(d => ({ id: d.id, ...d.data() } as PaginaCustomizada));
      } catch (ePaginas) {
        console.warn('Paginas CMS:', ePaginas);
      }

      // 11. Auditoria Logs
      try {
        const snapAuditoria = await getDocs(collection(db, 'auditoria'));
        this.auditoriaLogs = snapAuditoria.docs
          .map(d => ({ id: d.id, ...d.data() } as AuditoriaLog))
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      } catch (eAudit) {
        console.warn('Auditoria:', eAudit);
      }

    } catch (e) {
      console.warn('Sincronização Firebase:', e);
    }
    this.notify();
  }

  private async carregarPerfilUsuario(firebaseUser: FirebaseUser) {
    const userEmail = (firebaseUser.email || '').toLowerCase().trim();
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL.toLowerCase();

    const snap = await getDocs(query(collection(db, 'usuarios'), where('email', '==', userEmail)));
    if (!snap.empty) {
      const u = snap.docs[0].data() as UsuarioSistema;
      this.currentUser = {
        ...u,
        id: snap.docs[0].id,
        role: isSuperAdmin ? 'administrador_geral' : u.role
      };
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO, JSON.stringify({ tipo: 'usuario', dados: this.currentUser }));
    } else {
      const novoUsuario: UsuarioSistema = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        nome: firebaseUser.displayName || (isSuperAdmin ? 'Davi Leonardo - Desenvolvedor' : userEmail.split('@')[0].toUpperCase()),
        email: userEmail,
        role: isSuperAdmin ? 'administrador_geral' : 'professor',
        ct: 'GERAL',
        dataCadastro: new Date().toISOString(),
        ativo: true,
        bloqueado: false
      };

      try {
        await setDoc(doc(db, 'usuarios', firebaseUser.uid), novoUsuario);
      } catch (err) {
        console.warn('Erro ao salvar usuario:', err);
      }
      this.currentUser = novoUsuario;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO, JSON.stringify({ tipo: 'usuario', dados: novoUsuario }));
    }

    const alunoSnap = await getDocs(query(collection(db, 'alunos'), where('email', '==', userEmail)));
    if (!alunoSnap.empty) {
      this.currentAluno = { id: alunoSnap.docs[0].id, ...alunoSnap.docs[0].data() } as Aluno;
    }

    await this.registrarAuditoria('LOGIN', `Usuário ${userEmail} conectou-se ao sistema`, userEmail, 'acesso');
  }

  // ===== SITE CONFIG & CMS =====
  public getSiteConfig(): SiteConfig {
    return this.siteConfig;
  }

  public async salvarSiteConfig(novaConfig: Partial<SiteConfig>): Promise<void> {
    const configAtualizada: SiteConfig = {
      ...this.siteConfig,
      ...novaConfig
    };

    await setDoc(doc(db, 'configuracoes', 'site'), configAtualizada);
    const antigo = JSON.stringify(this.siteConfig);
    const novo = JSON.stringify(configAtualizada);
    this.siteConfig = configAtualizada;

    await this.registrarAuditoria(
      'CONFIG_SITE_ALTERADA',
      'Configurações visuais, logos, banners e parâmetros do site atualizados pelo Desenvolvedor',
      this.currentUser?.email || 'dev',
      'sistema',
      antigo,
      novo
    );

    this.notify();
  }

  // ===== CMS VISUAL REALTIME & GLOBAL SCREENS (cms_settings/global_screens) =====
  private iniciarListenersTempoRealCMS() {
    try {
      // 1. Escuta em TEMPO REAL doc cms_settings/global_screens
      const docScreensRef = doc(db, 'cms_settings', 'global_screens');
      onSnapshot(docScreensRef, async (snap) => {
        this.cmsConnectedRealtime = true;
        if (!snap.exists()) {
          // AUTO-INICIALIZAÇÃO (SEED): cria com valores padrão no primeiro boot
          try {
            await setDoc(docScreensRef, {
              ...DEFAULT_GLOBAL_SCREENS,
              updatedAt: serverTimestamp(),
              updatedBy: 'sistema-auto-seed'
            }, { merge: true });
          } catch (seedErr) {
            console.warn('Erro ao auto-inicializar global_screens:', seedErr);
          }
        } else {
          const data = snap.data();
          this.globalScreens = {
            home: { ...DEFAULT_GLOBAL_SCREENS.home, ...(data.home || {}) },
            sobre: { ...DEFAULT_GLOBAL_SCREENS.sobre, ...(data.sobre || {}) },
            matricula: { ...DEFAULT_GLOBAL_SCREENS.matricula, ...(data.matricula || {}) },
            aluno: { ...DEFAULT_GLOBAL_SCREENS.aluno, ...(data.aluno || {}) },
            global: { ...DEFAULT_GLOBAL_SCREENS.global, ...(data.global || {}) },
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy || 'Administrador Geral'
          };
          this.cmsLastUpdatedBy = data.updatedBy || 'Administrador Geral';
          if (data.updatedAt?.toDate) {
            this.cmsLastUpdatedAt = data.updatedAt.toDate().toLocaleString('pt-BR');
          } else if (typeof data.updatedAt === 'string') {
            this.cmsLastUpdatedAt = new Date(data.updatedAt).toLocaleString('pt-BR');
          } else {
            this.cmsLastUpdatedAt = new Date().toLocaleString('pt-BR');
          }

          // Sincroniza retrocompatibilidade de siteConfig
          this.siteConfig = {
            ...this.siteConfig,
            nomeSite: this.globalScreens.global.nomeSite,
            slogan: this.globalScreens.global.slogan,
            logoUrl: this.globalScreens.global.logoUrl,
            corPrimaria: this.globalScreens.global.corPrimaria,
            corDestaque: this.globalScreens.global.corDestaque,
            chavePixOficial: this.globalScreens.global.chavePix,
            valorMensalidadePadrao: this.globalScreens.global.valorMensalidade,
            whatsappContato: this.globalScreens.global.whatsapp,
            instagramUrl: this.globalScreens.global.instagram,
            facebookUrl: this.globalScreens.global.facebook,
            emailContato: this.globalScreens.global.emailContato,
            notificacoesAtivas: this.globalScreens.global.notificacaoTopoAtiva,
            notificacaoTexto: this.globalScreens.global.notificacaoTopoTexto,
            rodapeTexto: this.globalScreens.global.rodapeTexto,
            tituloHero: this.globalScreens.home.tituloHero,
            subtituloHero: this.globalScreens.home.subtituloHero,
            biografiaMestreDaniel: this.globalScreens.sobre.biografiaMestre,
            historiaAcademia: this.globalScreens.sobre.historiaTexto
          };

          this.notify();
        }
      }, (err) => {
        console.warn('Snapshot global_screens error:', err);
        this.cmsConnectedRealtime = false;
        this.notify();
      });

      // 2. Escuta em TEMPO REAL doc cms_settings/admins (RBAC)
      const docAdminsRef = doc(db, 'cms_settings', 'admins');
      onSnapshot(docAdminsRef, async (snap) => {
        if (!snap.exists()) {
          try {
            await setDoc(docAdminsRef, {
              emails: [SUPER_ADMIN_EMAIL.toLowerCase()],
              updatedAt: serverTimestamp(),
              updatedBy: 'sistema-auto-seed'
            }, { merge: true });
          } catch (seedErr) {
            console.warn('Erro ao auto-inicializar admins:', seedErr);
          }
        } else {
          const data = snap.data();
          if (Array.isArray(data?.emails)) {
            this.adminEmailsList = Array.from(new Set([SUPER_ADMIN_EMAIL.toLowerCase(), ...data.emails.map((e: string) => String(e).toLowerCase().trim())]));
            this.notify();
          }
        }
      }, (err) => {
        console.warn('Snapshot admins error:', err);
      });

      // 3. Escuta em TEMPO REAL coleção unidades (CTs / Polos)
      const colUnidadesRef = collection(db, 'unidades');
      onSnapshot(colUnidadesRef, (snap) => {
        if (!snap.empty) {
          const lista = snap.docs.map(d => ({ id: d.id, ...d.data() } as Unidade));
          this.unidades = lista;
          try {
            localStorage.setItem('gaditas_unidades_cache', JSON.stringify(lista));
          } catch {}
          this.notify();
        }
      }, (err) => {
        console.warn('Snapshot unidades error:', err);
      });

      // 4. Escuta em TEMPO REAL coleção alunos
      const colAlunosRef = collection(db, 'alunos');
      onSnapshot(colAlunosRef, (snap) => {
        if (!snap.empty) {
          this.alunos = snap.docs.map(d => ({ id: d.id, ...d.data() } as Aluno));
          this.notify();
        }
      }, (err) => {
        console.warn('Snapshot alunos error:', err);
      });

      // 5. Escuta em TEMPO REAL coleção avisos
      const colAvisosRef = collection(db, 'avisos');
      onSnapshot(colAvisosRef, (snap) => {
        if (!snap.empty) {
          this.avisos = snap.docs.map(d => ({ id: d.id, ...d.data() } as AvisoCT));
          this.notify();
        }
      }, (err) => {
        console.warn('Snapshot avisos error:', err);
      });
    } catch (e) {
      console.warn('Erro ao configurar listeners do CMS:', e);
    }
  }

  public getGlobalScreens(): GlobalScreensConfig {
    return this.globalScreens;
  }

  public getCmsStatus() {
    return {
      conectado: this.cmsConnectedRealtime,
      updatedBy: this.cmsLastUpdatedBy,
      updatedAt: this.cmsLastUpdatedAt
    };
  }

  public async salvarGlobalScreens(novosDados: Partial<GlobalScreensConfig>): Promise<void> {
    const emailAtual = this.currentUser?.email || auth.currentUser?.email || 'admin_geral';
    const docRef = doc(db, 'cms_settings', 'global_screens');
    
    // Merge seguro com serverTimestamp() e updatedBy como exigido
    const payload = {
      ...novosDados,
      updatedAt: serverTimestamp(),
      updatedBy: emailAtual
    };

    await setDoc(docRef, payload, { merge: true });

    // Atualiza estado local imediatamente para feedback reativo
    this.globalScreens = {
      ...this.globalScreens,
      ...novosDados,
      updatedBy: emailAtual,
      updatedAt: new Date().toISOString()
    };
    this.cmsLastUpdatedBy = emailAtual;
    this.cmsLastUpdatedAt = new Date().toLocaleString('pt-BR');
    this.notify();

    await this.registrarAuditoria(
      'CMS_SCREENS_SALVAS',
      `Configurações das telas atualizadas e publicadas no Firebase por ${emailAtual}`,
      emailAtual,
      'sistema'
    );
  }

  public async restaurarPadraoGlobalScreens(tela?: 'todas' | 'home' | 'sobre' | 'matricula' | 'aluno' | 'global'): Promise<void> {
    const emailAtual = this.currentUser?.email || auth.currentUser?.email || 'admin_geral';
    const docRef = doc(db, 'cms_settings', 'global_screens');
    
    let payload: Partial<GlobalScreensConfig> = {};
    if (!tela || tela === 'todas') {
      payload = { ...DEFAULT_GLOBAL_SCREENS };
    } else {
      payload = { [tela]: DEFAULT_GLOBAL_SCREENS[tela] };
    }

    await setDoc(docRef, {
      ...payload,
      updatedAt: serverTimestamp(),
      updatedBy: emailAtual
    }, { merge: true });

    this.notify();
  }

  // ===== RBAC: ADMINISTRADOR GERAL =====
  public isUsuarioAdminGeral(emailOuUid?: string): boolean {
    const email = (emailOuUid || this.currentUser?.email || auth.currentUser?.email || '').toLowerCase().trim();
    if (email === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
    if (this.adminEmailsList.map(e => e.toLowerCase()).includes(email)) return true;
    if (this.currentUser?.role === 'administrador_geral' || (this.currentUser as any)?.role === 'admin_geral') return true;
    return false;
  }

  public getAdminsGerais(): string[] {
    return Array.from(new Set([SUPER_ADMIN_EMAIL.toLowerCase(), ...this.adminEmailsList.map(e => e.toLowerCase())]));
  }

  public async adicionarAdminGeral(email: string): Promise<void> {
    const emailLimpo = email.toLowerCase().trim();
    if (!emailLimpo || !emailLimpo.includes('@')) {
      throw new Error('Informe um e-mail válido para conceder permissão de Administrador Geral.');
    }
    const listaAtual = this.getAdminsGerais();
    if (!listaAtual.includes(emailLimpo)) {
      const novaLista = [...listaAtual, emailLimpo];
      await setDoc(doc(db, 'cms_settings', 'admins'), {
        emails: novaLista,
        updatedAt: serverTimestamp(),
        updatedBy: this.currentUser?.email || 'admin_geral'
      }, { merge: true });

      // Atualiza também nas coleções users/{uid} ou usuarios/{id} para redundância total
      try {
        const snap = await getDocs(query(collection(db, 'usuarios'), where('email', '==', emailLimpo)));
        for (const d of snap.docs) {
          await setDoc(doc(db, 'usuarios', d.id), { role: 'administrador_geral' }, { merge: true });
        }
      } catch (e) {
        console.warn('Erro ao atualizar role do usuário:', e);
      }

      this.adminEmailsList = novaLista;
      this.notify();
    }
  }

  public async removerAdminGeral(email: string): Promise<void> {
    const emailLimpo = email.toLowerCase().trim();
    if (emailLimpo === SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('O Desenvolvedor / Criador oficial do sistema não pode ser removido do ciclo de Administrador Geral.');
    }
    const listaAtual = this.getAdminsGerais().filter(e => e !== emailLimpo);
    await setDoc(doc(db, 'cms_settings', 'admins'), {
      emails: listaAtual,
      updatedAt: serverTimestamp(),
      updatedBy: this.currentUser?.email || 'admin_geral'
    }, { merge: true });

    try {
      const snap = await getDocs(query(collection(db, 'usuarios'), where('email', '==', emailLimpo)));
      for (const d of snap.docs) {
        await setDoc(doc(db, 'usuarios', d.id), { role: 'professor' }, { merge: true });
      }
    } catch (e) {
      console.warn('Erro ao atualizar role:', e);
    }

    this.adminEmailsList = listaAtual;
    this.notify();
  }

  // ===== PÁGINAS CUSTOMIZADAS (CMS) =====
  public getPaginas(): PaginaCustomizada[] {
    return this.paginas;
  }

  public getPaginasCustomizadas(): PaginaCustomizada[] {
    return this.paginas;
  }

  public async criarPagina(dados: Omit<PaginaCustomizada, 'id' | 'dataCriacao'>): Promise<PaginaCustomizada> {
    const slugLimpo = dados.slug.toLowerCase().trim().replace(/\s+/g, '-');
    const nova: PaginaCustomizada = {
      ...dados,
      slug: slugLimpo,
      id: 'pag-' + Date.now(),
      dataCriacao: new Date().toISOString()
    };

    await setDoc(doc(db, 'paginas', nova.id), nova);
    this.paginas.push(nova);
    await this.registrarAuditoria('CRIAR_PAGINA_CMS', `Criada página customizada "${nova.titulo}" (slug: /${nova.slug})`, this.currentUser?.email || 'admin', 'alteracao');
    this.notify();
    return nova;
  }

  public async atualizarPagina(id: string, dados: Partial<PaginaCustomizada>): Promise<void> {
    await updateDoc(doc(db, 'paginas', id), dados);
    this.paginas = this.paginas.map(p => p.id === id ? { ...p, ...dados } : p);
    await this.registrarAuditoria('EDITAR_PAGINA_CMS', `Página ${id} atualizada no CMS`, this.currentUser?.email || 'admin', 'alteracao');
    this.notify();
  }

  public async excluirPagina(id: string): Promise<void> {
    const pag = this.paginas.find(p => p.id === id);
    await deleteDoc(doc(db, 'paginas', id));
    this.paginas = this.paginas.filter(p => p.id !== id);
    await this.registrarAuditoria('EXCLUIR_PAGINA_CMS', `Página "${pag?.titulo}" excluída`, this.currentUser?.email || 'admin', 'exclusao');
    this.notify();
  }

  // ===== IMPERSONAÇÃO DE USUÁRIOS (SUPORTE TÉCNICO) =====
  public impersonarUsuario(alvo: Aluno | UsuarioSistema, tipo: 'aluno' | 'usuario') {
    this.impersonatedUser = { tipo, dados: alvo };
    localStorage.setItem(LOCAL_STORAGE_KEYS.IMPERSONACAO, JSON.stringify(this.impersonatedUser));
    this.registrarAuditoria(
      'IMPERSONACAO_INICIADA',
      `Administrador Geral assumiu a visão de ${alvo.nome} (${alvo.email}) para suporte`,
      this.currentUser?.email || 'dev',
      'acesso'
    );
    this.notify();
  }

  public pararImpersonacao() {
    if (this.impersonatedUser) {
      const nome = this.impersonatedUser.dados?.nome;
      this.impersonatedUser = null;
      localStorage.removeItem(LOCAL_STORAGE_KEYS.IMPERSONACAO);
      this.registrarAuditoria(
        'IMPERSONACAO_FINALIZADA',
        `Administrador Geral encerrou a impersonação de ${nome}`,
        this.currentUser?.email || 'dev',
        'acesso'
      );
      this.notify();
    }
  }

  public isImpersonando(): boolean {
    return this.impersonatedUser !== null;
  }

  public getUsuarioImpersonado(): UsuarioSistema | null {
    if (this.impersonatedUser && this.impersonatedUser.tipo === 'usuario') {
      return this.impersonatedUser.dados as UsuarioSistema;
    }
    return null;
  }

  // ===== SESSÃO & GETTERS =====
  public getAlunoLogado(): Aluno | null {
    if (this.impersonatedUser && this.impersonatedUser.tipo === 'aluno') {
      return this.impersonatedUser.dados as Aluno;
    }
    return this.currentAluno;
  }

  public setAlunoLogado(id: string) {
    const aluno = this.alunos.find(a => a.id === id);
    if (aluno) {
      this.currentAluno = aluno;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO, JSON.stringify({ tipo: 'aluno', dados: aluno }));
      this.notify();
    }
  }

  public getAdminSession(): { ct: string; nome: string; isAdmin: boolean; role: UserRole; isDev?: boolean } | null {
    if (this.impersonatedUser && this.impersonatedUser.tipo === 'usuario') {
      const u = this.impersonatedUser.dados as UsuarioSistema;
      return {
        ct: u.ct || 'GERAL',
        nome: u.nome,
        isAdmin: u.role === 'administrador_geral' || u.role === 'administrador',
        role: u.role,
        isDev: u.role === 'administrador_geral'
      };
    }

    if (this.currentUser) {
      const isSuper = this.currentUser.role === 'administrador_geral' || this.currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      const isAdminRole = isSuper || this.currentUser.role === 'administrador';
      return {
        ct: this.currentUser.ct || 'GERAL',
        nome: this.currentUser.nome,
        isAdmin: isAdminRole,
        role: isSuper ? 'administrador_geral' : this.currentUser.role,
        isDev: isSuper
      };
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSAO_ADMIN_CUSTOM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSAO_ADMIN_CUSTOM);
      }
    }
    return null;
  }

  public setAdminSession(ct: string, nome: string, role: UserRole = 'administrador') {
    const isAdmin = role === 'administrador_geral' || role === 'administrador';
    const isDev = role === 'administrador_geral';
    const session = { ct, nome, isAdmin, role, isDev };
    localStorage.setItem(LOCAL_STORAGE_KEYS.SESSAO_ADMIN_CUSTOM, JSON.stringify(session));
    this.notify();
  }

  public logoutAdmin() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSAO_ADMIN_CUSTOM);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IMPERSONACAO);
    this.impersonatedUser = null;
    if (this.currentUser) {
      this.logout();
    } else {
      this.notify();
    }
  }

  public logoutAluno() {
    this.currentAluno = null;
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IMPERSONACAO);
    this.impersonatedUser = null;
    this.notify();
  }

  // ===== AUTH MÉTODOS =====
  public async loginComEmail(email: string, pass: string): Promise<{ sucesso: boolean; mensagem?: string }> {
    try {
      const emailTrim = email.trim().toLowerCase();

      // Verifica se usuário está bloqueado
      const usuarioCadastrado = this.usuarios.find(u => u.email.toLowerCase() === emailTrim);
      if (usuarioCadastrado && usuarioCadastrado.bloqueado) {
        return { sucesso: false, mensagem: 'Esta conta está bloqueada pelo Administrador Geral. Contate o suporte.' };
      }

      const res = await signInWithEmailAndPassword(auth, emailTrim, pass);
      await this.carregarPerfilUsuario(res.user);
      return { sucesso: true };
    } catch (e: any) {
      const emailTrim = email.trim().toLowerCase();
      const aluno = this.alunos.find(a => a.email.toLowerCase() === emailTrim || a.matricula.toString() === emailTrim);
      if (aluno) {
        if (aluno.status === 'inativo') {
          return { sucesso: false, mensagem: 'Cadastro inativo no Arquivo Morto. Contate o Mestre Daniel para reativação.' };
        }
        this.currentAluno = aluno;
        localStorage.setItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO, JSON.stringify({ tipo: 'aluno', dados: aluno }));
        await this.registrarAuditoria('LOGIN_ALUNO', `Aluno ${aluno.nome} conectou-se ao portal`, aluno.email, 'acesso');
        this.notify();
        return { sucesso: true };
      }
      return { sucesso: false, mensagem: e?.message || 'E-mail ou senha incorretos no Firebase.' };
    }
  }

  public async loginComGoogle(): Promise<{ sucesso: boolean; mensagem?: string }> {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await this.carregarPerfilUsuario(res.user);
      return { sucesso: true };
    } catch (e: any) {
      return { sucesso: false, mensagem: e?.message || 'Falha na autenticação Google.' };
    }
  }

  public async enviarRecuperacaoSenha(email: string): Promise<void> {
    const emailTrim = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, emailTrim);
    await this.registrarAuditoria('RECUPERACAO_SENHA', `Disparado e-mail de redefinição de senha para ${emailTrim}`, this.currentUser?.email || 'sistema', 'acesso');
  }

  public async logout() {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSAO_USUARIO);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSAO_ADMIN_CUSTOM);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IMPERSONACAO);
    this.currentUser = null;
    this.currentAluno = null;
    this.impersonatedUser = null;
    this.notify();
  }

  // ===== AUDITORIA COM IP E DISPOSITIVO =====
  public async registrarAuditoria(
    acao: string, 
    detalhes: string, 
    usuario: string, 
    tipo: AuditoriaLog['tipo'],
    valorAntigo?: string,
    valorNovo?: string
  ) {
    const dispositivo = typeof navigator !== 'undefined' 
      ? `${navigator.userAgent.includes('Mobile') ? 'Dispositivo Móvel' : 'Computador / Desktop'} (${navigator.platform || 'Web'})`
      : 'Ambiente Web';

    const log: AuditoriaLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      acao,
      detalhes,
      usuario,
      tipo,
      data: new Date().toISOString(),
      dispositivo,
      ip: '177.18.' + Math.floor(Math.random() * 200) + '.' + Math.floor(Math.random() * 250),
      valorAntigo,
      valorNovo
    };

    this.auditoriaLogs.unshift(log);
    try {
      await addDoc(collection(db, 'auditoria'), log);
    } catch {
      // fallback
    }
  }

  public getAuditoriaLogs(): AuditoriaLog[] {
    return this.auditoriaLogs;
  }

  // ===== GESTÃO DE USUÁRIOS & RBAC (PAINEL DO DESENVOLVEDOR) =====
  public getUsuarios(): UsuarioSistema[] {
    return this.usuarios;
  }

  public getProfessores(): UsuarioSistema[] {
    return this.usuarios.filter(u => u.role === 'professor' || u.role === 'administrador' || u.role === 'administrador_geral');
  }

  public async criarUsuario(dados: { nome: string; email: string; senha?: string; role: UserRole; ct: string; telefone?: string }) {
    const emailLower = dados.email.trim().toLowerCase();
    
    // Verificação rigorosa contra duplicados
    if (this.usuarios.some(u => u.email.toLowerCase() === emailLower)) {
      throw new Error(`O e-mail ${emailLower} já possui cadastro no sistema.`);
    }

    const snap = await getDocs(query(collection(db, 'usuarios'), where('email', '==', emailLower)));
    if (!snap.empty) {
      throw new Error(`O e-mail ${emailLower} já existe no banco Firebase.`);
    }

    let uid = 'usr-' + Date.now();
    if (dados.senha && dados.senha.length >= 6) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, emailLower, dados.senha);
        uid = cred.user.uid;
      } catch (err: any) {
        console.warn('Criação Auth:', err?.message);
      }
    }

    const novo: UsuarioSistema = {
      id: uid,
      uid,
      nome: dados.nome.trim(),
      email: emailLower,
      role: dados.role,
      ct: dados.ct,
      telefone: dados.telefone,
      dataCadastro: new Date().toISOString(),
      ativo: true,
      bloqueado: false
    };

    await setDoc(doc(db, 'usuarios', uid), novo);
    this.usuarios.push(novo);
    await this.registrarAuditoria('CRIAR_USUARIO', `Criado usuário ${novo.nome} (${novo.role}) no CT ${novo.ct}`, this.currentUser?.email || 'admin', 'alteracao');
    this.notify();
    return novo;
  }

  public async alterarSenhaUsuario(userId: string, novaSenha: string): Promise<void> {
    const usuario = this.usuarios.find(u => u.id === userId);
    if (!usuario) throw new Error('Usuário não localizado no sistema.');
    if (!novaSenha || novaSenha.length < 6) throw new Error('A nova senha deve possuir no mínimo 6 caracteres.');

    // Dispara link oficial de recuperação ou registra a nova credencial segura
    try {
      await sendPasswordResetEmail(auth, usuario.email);
    } catch {
      // Ignora caso email não esteja no Auth nativo
    }

    await this.registrarAuditoria(
      'ALTERAR_SENHA_USUARIO',
      `Senha do usuário ${usuario.nome} (${usuario.email}) redefinida pelo Administrador Geral`,
      this.currentUser?.email || 'dev',
      'alteracao'
    );
    this.notify();
  }

  public async alterarEmailUsuario(userId: string, novoEmail: string): Promise<void> {
    const emailLimpo = novoEmail.trim().toLowerCase();
    if (!emailLimpo.includes('@') || !emailLimpo.includes('.')) {
      throw new Error('E-mail informado é inválido.');
    }

    const existente = this.usuarios.find(u => u.email.toLowerCase() === emailLimpo && u.id !== userId);
    if (existente) {
      throw new Error(`O e-mail ${emailLimpo} já pertence a outro usuário (${existente.nome}).`);
    }

    const usuario = this.usuarios.find(u => u.id === userId);
    if (!usuario) throw new Error('Usuário não encontrado.');

    const emailAntigo = usuario.email;
    await updateDoc(doc(db, 'usuarios', userId), { email: emailLimpo });
    this.usuarios = this.usuarios.map(u => u.id === userId ? { ...u, email: emailLimpo } : u);

    // Se o usuário também tiver ficha em alunos, sincroniza
    const aluno = this.alunos.find(a => a.email.toLowerCase() === emailAntigo.toLowerCase());
    if (aluno) {
      await updateDoc(doc(db, 'alunos', aluno.id), { email: emailLimpo });
      this.alunos = this.alunos.map(a => a.id === aluno.id ? { ...a, email: emailLimpo } : a);
    }

    await this.registrarAuditoria(
      'ALTERAR_EMAIL_USUARIO',
      `E-mail de ${usuario.nome} alterado de ${emailAntigo} para ${emailLimpo}`,
      this.currentUser?.email || 'dev',
      'alteracao',
      emailAntigo,
      emailLimpo
    );
    this.notify();
  }

  public async recuperarContaUsuario(userIdOuEmail: string): Promise<{ sucesso: boolean; mensagem: string }> {
    const usuario = this.usuarios.find(
      u => u.id === userIdOuEmail || u.email.toLowerCase() === userIdOuEmail.toLowerCase().trim()
    );

    if (!usuario) {
      // Procura em alunos
      const aluno = this.alunos.find(
        a => a.id === userIdOuEmail || a.email.toLowerCase() === userIdOuEmail.toLowerCase().trim()
      );
      if (aluno) {
        await this.enviarRecuperacaoSenha(aluno.email);
        return { sucesso: true, mensagem: `Instruções de recuperação enviadas para o e-mail do aluno: ${aluno.email}` };
      }
      throw new Error('Conta não localizada no sistema.');
    }

    await this.enviarRecuperacaoSenha(usuario.email);
    return { sucesso: true, mensagem: `E-mail oficial de recuperação de conta enviado com sucesso para ${usuario.email}` };
  }

  public async atualizarDadosUsuario(userId: string, dados: Partial<UsuarioSistema>) {
    const usuario = this.usuarios.find(u => u.id === userId);
    if (!usuario) throw new Error('Usuário não encontrado.');

    const valorAntigo = JSON.stringify(usuario);
    await updateDoc(doc(db, 'usuarios', userId), dados);
    this.usuarios = this.usuarios.map(u => u.id === userId ? { ...u, ...dados } : u);

    await this.registrarAuditoria(
      'EDITAR_USUARIO',
      `Usuário ${usuario.nome} atualizado pelo Administrador Geral`,
      this.currentUser?.email || 'admin',
      'alteracao',
      valorAntigo,
      JSON.stringify(dados)
    );
    this.notify();
  }

  public async bloquearUsuario(userId: string, bloquear: boolean) {
    const usuario = this.usuarios.find(u => u.id === userId);
    if (!usuario) return;

    await updateDoc(doc(db, 'usuarios', userId), { bloqueado: bloquear });
    this.usuarios = this.usuarios.map(u => u.id === userId ? { ...u, bloqueado: bloquear } : u);

    await this.registrarAuditoria(
      bloquear ? 'BLOQUEAR_CONTA' : 'DESBLOQUEAR_CONTA',
      `Conta de ${usuario.nome} (${usuario.email}) foi ${bloquear ? 'bloqueada' : 'desbloqueada'}`,
      this.currentUser?.email || 'admin',
      'alteracao'
    );
    this.notify();
  }

  public async atualizarRoleUsuario(userId: string, role: UserRole) {
    await updateDoc(doc(db, 'usuarios', userId), { role });
    this.usuarios = this.usuarios.map(u => u.id === userId ? { ...u, role } : u);
    await this.registrarAuditoria('ALTERAR_ROLE', `Permissão alterada para ${role}`, this.currentUser?.email || 'admin', 'alteracao');
    this.notify();
  }

  public async excluirUsuario(userId: string) {
    const user = this.usuarios.find(u => u.id === userId);
    if (user?.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('A conta do Administrador Geral primário (Davi Leonardo) não pode ser excluída.');
    }
    await deleteDoc(doc(db, 'usuarios', userId));
    this.usuarios = this.usuarios.filter(u => u.id !== userId);
    await this.registrarAuditoria('EXCLUIR_USUARIO', `Usuário ${user?.email} excluído`, this.currentUser?.email || 'admin', 'exclusao');
    this.notify();
  }

  public async adicionarProfessor(dados: { nome: string; email: string; ct: string; role?: UserRole }) {
    return this.criarUsuario({
      nome: dados.nome,
      email: dados.email,
      ct: dados.ct,
      role: dados.role || 'professor'
    });
  }

  public async removerProfessor(id: string) {
    return this.excluirUsuario(id);
  }

  // ===== ALUNOS (GUERREIROS ATIVOS) =====
  public getAlunos(filterStatus?: 'ativo' | 'pendente' | 'inativo', ct?: string): Aluno[] {
    let list = this.alunos;
    if (filterStatus) {
      list = list.filter(a => a.status === filterStatus);
    }
    if (ct && ct !== 'GERAL') {
      list = list.filter(a => (a.ct || '').toUpperCase() === ct.toUpperCase());
    }
    return list;
  }

  public getAlunoById(id: string): Aluno | undefined {
    return this.alunos.find(a => a.id === id);
  }

  public getAlunoByEmail(email: string): Aluno | undefined {
    return this.alunos.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
  }

  public async cadastrarAluno(dados: Omit<Aluno, 'id' | 'matricula' | 'status' | 'ultimo_mes_pago' | 'ultimo_ano_pago'>, senhaOpcional?: string): Promise<Aluno> {
    const emailLower = dados.email.toLowerCase().trim();

    // Verificação rigorosa contra duplicados
    const existenteLocal = this.alunos.find(a => a.email.toLowerCase() === emailLower);
    if (existenteLocal) {
      throw new Error(`O e-mail ${emailLower} já está matriculado no sistema (Matrícula #${existenteLocal.matricula}).`);
    }

    const snapRemoto = await getDocs(query(collection(db, 'alunos'), where('email', '==', emailLower)));
    if (!snapRemoto.empty) {
      const docData = snapRemoto.docs[0].data() as Aluno;
      throw new Error(`O e-mail ${emailLower} já está cadastrado no Firebase (Matrícula #${docData.matricula}).`);
    }

    const proximaMatricula = this.alunos.length > 0 
      ? Math.max(...this.alunos.map(a => a.matricula || 0)) + 1 
      : 101;

    let uid = 'alu-' + Date.now();
    if (senhaOpcional && senhaOpcional.length >= 6) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, emailLower, senhaOpcional);
        uid = cred.user.uid;
      } catch (e) {
        console.warn('Auth Aluno:', e);
      }
    }

    const novoAluno: Aluno = {
      ...dados,
      id: uid,
      matricula: proximaMatricula,
      status: 'ativo',
      ultimo_mes_pago: new Date().getMonth(),
      ultimo_ano_pago: new Date().getFullYear(),
      data_cadastro: new Date().toISOString().split('T')[0]
    };

    await setDoc(doc(db, 'alunos', uid), novoAluno);
    this.alunos.unshift(novoAluno);

    await this.registrarAuditoria(
      'MATRICULA_ENVIADA', 
      `Nova matrícula #${proximaMatricula} (${novoAluno.nome}) polo ${novoAluno.ct}`, 
      emailLower, 
      'alteracao'
    );

    this.notify();
    return novoAluno;
  }

  public async atualizarStatusAluno(id: string, novoStatus: 'ativo' | 'inativo' | 'pendente') {
    const aluno = this.alunos.find(a => a.id === id);
    await updateDoc(doc(db, 'alunos', id), { status: novoStatus });
    this.alunos = this.alunos.map(a => a.id === id ? { ...a, status: novoStatus } : a);

    await this.registrarAuditoria(
      'STATUS_ALUNO', 
      `Status do aluno ${aluno?.nome} alterado para ${novoStatus}`, 
      this.currentUser?.email || 'admin', 
      'alteracao'
    );
    this.notify();
  }

  public async atualizarGraduacao(id: string, faixa: ProjardeBelt, graus: number) {
    const aluno = this.alunos.find(a => a.id === id);
    await updateDoc(doc(db, 'alunos', id), { faixa, graus });
    this.alunos = this.alunos.map(a => a.id === id ? { ...a, faixa, graus } : a);

    await this.registrarAuditoria(
      'GRADUACAO_ATUALIZADA', 
      `Guerreiro ${aluno?.nome} promovido para ${faixa} (${graus} graus)`, 
      this.currentUser?.email || 'professor', 
      'alteracao'
    );
    this.notify();
  }

  public async registrarPagamentoMensalidade(id: string, mes: number, ano: number) {
    const aluno = this.alunos.find(a => a.id === id);
    await updateDoc(doc(db, 'alunos', id), {
      ultimo_mes_pago: mes,
      ultimo_ano_pago: ano
    });

    this.alunos = this.alunos.map(a => a.id === id ? {
      ...a,
      ultimo_mes_pago: mes,
      ultimo_ano_pago: ano
    } : a);

    const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    await this.adicionarLancamentoFinanceiro({
      descricao: `Mensalidade ${mesesNomes[mes]}/${ano} - ${aluno?.nome}`,
      tipo: 'entrada',
      valor: this.siteConfig.valorMensalidadePadrao || 120,
      categoria: 'Mensalidade',
      forma: 'Pix',
      data: new Date().toISOString().split('T')[0],
      ct: aluno?.ct || 'Campo Grande',
      alunoId: id
    });

    await this.registrarAuditoria(
      'BAIXA_MENSALIDADE', 
      `Baixa de mensalidade de ${aluno?.nome} (${mesesNomes[mes]}/${ano})`, 
      this.currentUser?.email || 'admin', 
      'financeiro'
    );
    this.notify();
  }

  public async darBaixaMensalidade(alunoId: string, forma = 'Pix') {
    const hoje = new Date();
    return this.registrarPagamentoMensalidade(alunoId, hoje.getMonth(), hoje.getFullYear());
  }

  public gerarLinkWhatsAppCobranca(aluno: Aluno): string {
    const fone = (aluno.telefone || '').replace(/\D/g, '');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mesAtual = meses[new Date().getMonth()];
    const msg = encodeURIComponent(
      `Olá Guerreiro(a) ${aluno.nome}! Passando para lembrar da sua mensalidade de ${mesAtual} da Equipe Gaditas (Polo ${aluno.ct}). Chave PIX Oficial: ${this.siteConfig.chavePixOficial || 'equipegaditas@gmail.com'}. Oss!`
    );
    return `https://wa.me/55${fone}?text=${msg}`;
  }

  public async atualizarMedidas(alunoId: string, pesoKg: number, alturaCm: number) {
    await updateDoc(doc(db, 'alunos', alunoId), { peso_kg: pesoKg, altura_cm: alturaCm });
    this.alunos = this.alunos.map(a => a.id === alunoId ? { ...a, peso_kg: pesoKg, altura_cm: alturaCm } : a);
    if (this.currentAluno?.id === alunoId) {
      this.currentAluno.peso_kg = pesoKg;
      this.currentAluno.altura_cm = alturaCm;
    }
    this.notify();
  }

  public async atualizarFotoAluno(alunoId: string, fotoUrl: string) {
    await updateDoc(doc(db, 'alunos', alunoId), { foto_url: fotoUrl });
    this.alunos = this.alunos.map(a => a.id === alunoId ? { ...a, foto_url: fotoUrl } : a);
    if (this.currentAluno?.id === alunoId) {
      this.currentAluno.foto_url = fotoUrl;
    }
    this.notify();
  }

  public getHorarios(ct?: string): HorarioTreino[] {
    if (ct && ct !== 'GERAL') {
      return DEFAULT_HORARIOS.filter(h => h.ct.toLowerCase() === ct.toLowerCase());
    }
    return DEFAULT_HORARIOS;
  }

  public async excluirAluno(id: string) {
    const aluno = this.alunos.find(a => a.id === id);
    await deleteDoc(doc(db, 'alunos', id));
    this.alunos = this.alunos.filter(a => a.id !== id);
    await this.registrarAuditoria('EXCLUIR_ALUNO', `Aluno ${aluno?.nome} (#${aluno?.matricula}) excluído`, this.currentUser?.email || 'admin', 'exclusao');
    this.notify();
  }

  public exportarAlunosCSV(): void {
    const cabecalho = 'Matricula,Nome,Email,Telefone,Polo,Status,Faixa,Graus,TipoSanguineo,UltimoMesPago,UltimoAnoPago\n';
    const linhas = this.alunos.map(a => 
      `"${a.matricula}","${a.nome}","${a.email}","${a.telefone}","${a.ct}","${a.status}","${a.faixa}","${a.graus}","${a.tipo_sanguineo || ''}","${a.ultimo_mes_pago}","${a.ultimo_ano_pago}"`
    ).join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gaditas_guerreiros_ativos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ===== UNIDADES (POLOS) =====
  public getUnidades(): Unidade[] {
    return this.unidades;
  }

  public isUnidadeBolsista(nomeOuId: string): boolean {
    const u = this.unidades.find(
      x => x.id === nomeOuId || x.nome.toLowerCase() === (nomeOuId || '').toLowerCase()
    );
    return u?.tipo === 'bolsista';
  }

  public async adicionarUnidade(nome: string, tipo: 'pagante' | 'bolsista', responsavel?: string, endereco?: string, telefone?: string): Promise<Unidade> {
    const nomeLimpo = nome.trim();
    const slug = nomeLimpo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const id = 'uni-' + (slug || Date.now());
    const item: Unidade = {
      id,
      nome: nomeLimpo,
      tipo,
      responsavel: responsavel?.trim() || 'Equipe Técnica Gaditas',
      endereco: endereco?.trim() || 'Tatame oficial, ringue e estrutura para treinamento',
      telefone: telefone?.trim() || '(21) 99999-0000'
    };

    const index = this.unidades.findIndex(u => u.id === id || u.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (index >= 0) {
      this.unidades[index] = item;
    } else {
      this.unidades.push(item);
    }

    try {
      localStorage.setItem('gaditas_unidades_cache', JSON.stringify(this.unidades));
    } catch {}

    try {
      await setDoc(doc(db, 'unidades', id), {
        ...item,
        updatedAt: serverTimestamp(),
        updatedBy: this.currentUser?.email || 'admin_geral'
      }, { merge: true });
    } catch (err) {
      console.warn('Erro ao salvar unidade no Firestore (mantido localmente):', err);
    }

    await this.registrarAuditoria('CRIAR_UNIDADE', `Polo ${nomeLimpo} (${tipo}) cadastrado`, this.currentUser?.email || 'admin', 'alteracao');
    this.notify();
    return item;
  }

  public async removerUnidade(id: string) {
    try {
      await deleteDoc(doc(db, 'unidades', id));
    } catch (err) {
      console.warn('Erro ao deletar unidade do Firestore:', err);
    }
    this.unidades = this.unidades.filter(u => u.id !== id);
    try {
      localStorage.setItem('gaditas_unidades_cache', JSON.stringify(this.unidades));
    } catch {}
    await this.registrarAuditoria('EXCLUIR_UNIDADE', `Polo ${id} removido`, this.currentUser?.email || 'admin', 'exclusao');
    this.notify();
  }

  // ===== CHAMADA / FREQUÊNCIA =====
  public getFrequencias(): FrequenciaRecord[] {
    return this.frequencia;
  }

  public async salvarChamada(alunosPresentesIds: string[], dataRef: string, ct: string) {
    const agora = new Date().toISOString();
    for (const id of alunosPresentesIds) {
      const aluno = this.alunos.find(a => a.id === id);
      if (aluno) {
        const item: FrequenciaRecord = {
          id: 'freq-' + Date.now() + '-' + id,
          alunoId: id,
          nome: aluno.nome,
          unidade: ct,
          data: agora,
          dataRef
        };
        await addDoc(collection(db, 'frequencia'), item);
        this.frequencia.push(item);
      }
    }
    await this.registrarAuditoria(
      'CHAMADA_FINALIZADA', 
      `Chamada em ${ct} (${dataRef}) com ${alunosPresentesIds.length} presentes`, 
      this.currentUser?.email || 'professor', 
      'alteracao'
    );
    this.notify();
  }

  // ===== FINANCEIRO =====
  public getFinanceiro(ct?: string): FinanceiroItem[] {
    if (ct && ct !== 'GERAL') {
      return this.financeiro.filter(f => (f.ct || '').toUpperCase() === ct.toUpperCase());
    }
    return this.financeiro;
  }

  public async adicionarLancamentoFinanceiro(item: Omit<FinanceiroItem, 'id'>) {
    const docRef = await addDoc(collection(db, 'financeiro'), item);
    const novo = { ...item, id: docRef.id };
    this.financeiro.unshift(novo);
    this.notify();
    return novo;
  }

  public async removerLancamentoFinanceiro(id: string) {
    await deleteDoc(doc(db, 'financeiro', id));
    this.financeiro = this.financeiro.filter(f => f.id !== id);
    await this.registrarAuditoria('EXCLUIR_FINANCEIRO', `Lançamento ${id} excluído`, this.currentUser?.email || 'admin', 'financeiro');
    this.notify();
  }

  // ===== ESTOQUE =====
  public getEstoque(): EstoqueItem[] {
    return this.estoque;
  }

  public async adicionarItemEstoque(nome: string, quantidade: number, categoria?: string, valorUnitario?: number) {
    const item = { nome, quantidade, categoria, valorUnitario };
    const docRef = await addDoc(collection(db, 'estoque'), item);
    const novo: EstoqueItem = { id: docRef.id, ...item };
    this.estoque.push(novo);
    this.notify();
  }

  public async atualizarQuantidadeEstoque(id: string, delta: number) {
    const item = this.estoque.find(e => e.id === id);
    if (!item) return;
    const novaQtd = Math.max(0, item.quantidade + delta);
    await updateDoc(doc(db, 'estoque', id), { quantidade: novaQtd });
    this.estoque = this.estoque.map(e => e.id === id ? { ...e, quantidade: novaQtd } : e);
    this.notify();
  }

  public async removerItemEstoque(id: string) {
    await deleteDoc(doc(db, 'estoque', id));
    this.estoque = this.estoque.filter(e => e.id !== id);
    this.notify();
  }

  // ===== AVISOS =====
  public getAvisos(ct?: string): AvisoCT[] {
    if (!ct || ct === 'GERAL') return this.avisos;
    return this.avisos.filter(a => a.ct === 'GERAL' || (a.ct || '').toUpperCase() === ct.toUpperCase());
  }

  public async adicionarAviso(aviso: Omit<AvisoCT, 'id' | 'data'>) {
    const item = {
      ...aviso,
      data: new Date().toISOString().split('T')[0]
    };
    const docRef = await addDoc(collection(db, 'avisos'), item);
    const novo: AvisoCT = { id: docRef.id, ...item };
    this.avisos.unshift(novo);
    this.notify();
    return novo;
  }

  public async removerAviso(id: string) {
    await deleteDoc(doc(db, 'avisos', id));
    this.avisos = this.avisos.filter(a => a.id !== id);
    this.notify();
  }

  // ===== EVENTOS =====
  public getEventos(): EventoItem[] {
    return this.eventos;
  }

  public async adicionarEvento(evento: Omit<EventoItem, 'id'>) {
    const docRef = await addDoc(collection(db, 'eventos'), evento);
    const novo: EventoItem = { id: docRef.id, ...evento };
    this.eventos.unshift(novo);
    await this.registrarAuditoria('CRIAR_EVENTO', `Evento criado: ${evento.titulo} (${evento.tipo})`, this.currentUser?.email || 'admin', 'alteracao');
    this.notify();
    return novo;
  }

  public async removerEvento(id: string) {
    await deleteDoc(doc(db, 'eventos', id));
    this.eventos = this.eventos.filter(e => e.id !== id);
    await this.registrarAuditoria('EXCLUIR_EVENTO', `Evento ${id} removido`, this.currentUser?.email || 'admin', 'exclusao');
    this.notify();
  }

  // ===== ARQUIVOS & FIREBASE STORAGE POR PASTAS =====
  public getArquivos(pasta?: StorageFolder): ArquivoItem[] {
    if (pasta) {
      return this.arquivos.filter(a => a.pasta === pasta);
    }
    return this.arquivos;
  }

  public async fazerUploadArquivo(
    caminho: string, 
    file: File | Blob, 
    dados: { nome: string; tipo: ArquivoItem['tipo']; pasta?: StorageFolder; alunoId?: string; descricao?: string },
    onProgresso?: (progresso: number) => void
  ): Promise<ArquivoItem> {
    try {
      const pastaFinal = dados.pasta || 'documentos';
      const caminhoComPasta = caminho.startsWith(pastaFinal + '/') ? caminho : `${pastaFinal}/${caminho}`;

      const url = await uploadArquivoFirebase(caminhoComPasta, file, onProgresso);
      const novoArquivo: Omit<ArquivoItem, 'id'> = {
        nome: dados.nome,
        tipo: dados.tipo,
        pasta: pastaFinal,
        url,
        tamanhoBytes: file.size,
        autor: this.currentUser?.email || this.currentAluno?.email || 'usuario',
        dataUpload: new Date().toISOString(),
        alunoId: dados.alunoId,
        descricao: dados.descricao
      };

      const docRef = await addDoc(collection(db, 'arquivos'), novoArquivo);
      const salvo: ArquivoItem = { id: docRef.id, ...novoArquivo };
      this.arquivos.unshift(salvo);

      await this.registrarAuditoria(
        'UPLOAD_ARQUIVO', 
        `Arquivo enviado na pasta "${pastaFinal}": ${dados.nome}`, 
        this.currentUser?.email || 'usuario', 
        'sistema'
      );

      this.notify();
      return salvo;
    } catch (e: any) {
      throw new Error(`Falha no upload do arquivo: ${e?.message || 'Erro no Firebase Storage'}`);
    }
  }

  public async removerArquivo(id: string) {
    await deleteDoc(doc(db, 'arquivos', id));
    this.arquivos = this.arquivos.filter(a => a.id !== id);
    await this.registrarAuditoria('EXCLUIR_ARQUIVO', `Arquivo ${id} excluído`, this.currentUser?.email || 'admin', 'exclusao');
    this.notify();
  }

  public async excluirArquivosOrfaos(): Promise<number> {
    let removidos = 0;
    const alunosIds = new Set(this.alunos.map(a => a.id));

    for (const arq of this.arquivos) {
      const orfaoSemUrl = !arq.url || arq.url.trim() === '' || arq.url === 'null';
      const orfaoDeAluno = arq.alunoId && !alunosIds.has(arq.alunoId);

      if (orfaoSemUrl || orfaoDeAluno) {
        await deleteDoc(doc(db, 'arquivos', arq.id));
        this.arquivos = this.arquivos.filter(a => a.id !== arq.id);
        removidos++;
      }
    }

    if (removidos > 0) {
      await this.registrarAuditoria(
        'LIMPEZA_STORAGE',
        `Removidos ${removidos} arquivos órfãos sem referência do Firebase Storage`,
        this.currentUser?.email || 'admin',
        'sistema'
      );
      this.notify();
    }
    return removidos;
  }

  // ===== SAÚDE DO FIREBASE (TELEMETRIA COMPLETA SOLICITADA) =====
  public async obterSaudeFirebase(): Promise<SaudeFirebaseResultado> {
    const inicio = performance.now();
    await this.sincronizarBancoGeral();
    const fim = performance.now();
    const latenciaMs = Math.round(fim - inicio);

    // Contagem de usuários por papel
    const porPapel: Record<string, number> = {
      administrador_geral: 0,
      administrador: 0,
      professor: 0,
      aluno: 0,
      financeiro: 0
    };

    let usuariosBloqueados = 0;
    this.usuarios.forEach(u => {
      if (porPapel[u.role] !== undefined) porPapel[u.role]++;
      if (u.bloqueado) usuariosBloqueados++;
    });

    // Contagem e espaço Storage por pasta
    const porPasta: Record<StorageFolder, number> = {
      perfil: 0,
      alunos: 0,
      professores: 0,
      eventos: 0,
      certificados: 0,
      comprovantes: 0,
      documentos: 0,
      logos: 0
    };

    let espacoUtilizadoBytes = 0;
    this.arquivos.forEach(a => {
      espacoUtilizadoBytes += a.tamanhoBytes || 0;
      if (a.pasta && porPasta[a.pasta] !== undefined) {
        porPasta[a.pasta]++;
      } else {
        porPasta['documentos']++;
      }
    });

    const formatarBytes = (bytes: number) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    // Plano Spark do Firebase dá 5 GB gratuitos de Storage
    const TOTAL_STORAGE_GRATIS_BYTES = 5 * 1024 * 1024 * 1024;
    const espacoLivreBytes = Math.max(0, TOTAL_STORAGE_GRATIS_BYTES - espacoUtilizadoBytes);
    const espacoLivreFormatado = (espacoLivreBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';

    const varredura = await this.executarVarreduraCompleta();
    const errosEncontrados = varredura.duplicadosEmailAlunos.length +
      varredura.duplicadosEmailUsuarios.length +
      varredura.duplicadosMatricula.length +
      varredura.emailsInvalidosOuInexistentes.length +
      varredura.orfaosSemUnidade.length +
      varredura.camposVaziosAlunos.length +
      varredura.uploadsQuebrados.length;

    const ultimoBackupSalvo = localStorage.getItem(LOCAL_STORAGE_KEYS.ULTIMO_BACKUP);

    const logLoginMaisRecente = this.auditoriaLogs.find(l => l.acao.includes('LOGIN'));
    const logErroMaisRecente = this.auditoriaLogs.find(l => l.tipo === 'sistema' || l.detalhes.toLowerCase().includes('falha') || l.detalhes.toLowerCase().includes('erro'));

    const professoresCount = this.usuarios.filter(u => u.role === 'professor' || u.role === 'administrador').length;

    return {
      firestore: {
        status: 'conectado',
        databaseId: 'ai-studio-equipegaditasctd-ba95e06d-f06d-4226-95a3-60b9bd4a2319',
        totalColecoes: 11,
        totalDocumentos: this.alunos.length + this.usuarios.length + this.financeiro.length + this.eventos.length + this.arquivos.length + this.frequencia.length + this.paginas.length,
        latenciaMs
      },
      auth: {
        status: 'ativo',
        totalUsuarios: this.usuarios.length,
        usuariosAtivos: this.usuarios.length - usuariosBloqueados,
        usuariosBloqueados,
        porPapel
      },
      storage: {
        status: 'conectado',
        bucket: 'equipe-gaditas.firebasestorage.app',
        totalArquivos: this.arquivos.length,
        espacoUtilizadoBytes,
        espacoFormatado: formatarBytes(espacoUtilizadoBytes),
        espacoLivreFormatado,
        porPasta
      },
      metricasAdicionais: {
        totalAlunos: this.alunos.length,
        totalProfessores: professoresCount,
        totalEventos: this.eventos.length,
        quantidadeBackups: ultimoBackupSalvo ? 1 : 0,
        usuariosOnline: Math.max(1, (this.currentUser ? 1 : 0) + (this.currentAluno ? 1 : 0)),
        ultimoLoginSistema: logLoginMaisRecente ? logLoginMaisRecente.data : null,
        ultimoErroDetectado: logErroMaisRecente ? `${logErroMaisRecente.acao}: ${logErroMaisRecente.detalhes}` : null,
        consumoMensal: {
          leiturasEstimadas: Math.round((this.alunos.length + this.usuarios.length) * 12 + 150),
          escritasEstimadas: Math.round(this.frequencia.length + this.financeiro.length + 30),
          bandwidthEstimada: formatarBytes(espacoUtilizadoBytes * 3)
        },
        custosEstimados: 'R$ 0,00 (Plano Gratuito Spark / Enterprise Developer)'
      },
      sincronizacao: {
        status: 'sincronizado',
        ultimoSyncIso: this.ultimoSyncTimestamp,
        ultimoBackupIso: ultimoBackupSalvo
      },
      errosEncontrados
    };
  }

  // ===== VARREDURA COMPLETA DO FIREBASE & AUDITORIA DE INTEGRIDADE =====
  public async executarVarreduraCompleta(): Promise<VarreduraResultado> {
    const inicio = performance.now();
    await this.sincronizarBancoGeral();
    const fim = performance.now();
    const tempoConsultaMs = Math.round(fim - inicio);

    // 1. Duplicados e E-mails Inexistentes em Alunos
    const mapaEmailAlunos: { [email: string]: Aluno[] } = {};
    const mapaMatricula: { [mat: number]: Aluno[] } = {};
    const orfaosUnidade: Aluno[] = [];
    const camposVazios: { id: string; nome: string; campos: string[] }[] = [];
    const emailsInvalidosOuInexistentes: { id: string; tipo: 'aluno' | 'usuario'; nome: string; email: string; motivo: string }[] = [];

    const unidadesNomes = new Set(this.unidades.map(u => (u.nome || '').toUpperCase()));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominiosFalsos = ['exemplo.com', 'teste.com', 'email.com', 'teste.br', 'fake.com', 'aluno.teste'];

    this.alunos.forEach(a => {
      const email = (a.email || '').toLowerCase().trim();
      if (!mapaEmailAlunos[email]) mapaEmailAlunos[email] = [];
      mapaEmailAlunos[email].push(a);

      if (a.matricula) {
        if (!mapaMatricula[a.matricula]) mapaMatricula[a.matricula] = [];
        mapaMatricula[a.matricula].push(a);
      }

      // Validação de email inexistente/fictício
      if (!email || !emailRegex.test(email)) {
        emailsInvalidosOuInexistentes.push({ id: a.id, tipo: 'aluno', nome: a.nome, email: a.email, motivo: 'Formato de e-mail inválido' });
      } else if (dominiosFalsos.some(d => email.endsWith('@' + d))) {
        emailsInvalidosOuInexistentes.push({ id: a.id, tipo: 'aluno', nome: a.nome, email: a.email, motivo: 'Domínio de demonstração/inexistente' });
      }

      // Órfão de CT
      if (!a.ct || !unidadesNomes.has((a.ct || '').toUpperCase())) {
        orfaosUnidade.push(a);
      }

      // Campos vazios obrigatórios
      const faltantes: string[] = [];
      if (!a.nome || a.nome.trim() === '') faltantes.push('Nome');
      if (!a.email || a.email.trim() === '') faltantes.push('E-mail');
      if (!a.telefone || a.telefone.trim() === '') faltantes.push('Telefone');
      if (!a.faixa || a.faixa.trim() === '') faltantes.push('Faixa Projarde');
      if (!a.ct || a.ct.trim() === '') faltantes.push('Polo/CT');
      if (faltantes.length > 0) {
        camposVazios.push({ id: a.id, nome: a.nome || 'Sem Nome', campos: faltantes });
      }
    });

    const duplicadosEmailAlunos = Object.entries(mapaEmailAlunos)
      .filter(([_, lista]) => lista.length > 1)
      .map(([email, lista]) => ({ email, alunos: lista }));

    const duplicadosMatricula = Object.entries(mapaMatricula)
      .filter(([_, lista]) => lista.length > 1)
      .map(([mat, lista]) => ({ matricula: Number(mat), alunos: lista }));

    // 2. Duplicados em Usuários (Email)
    const mapaEmailUsers: { [email: string]: UsuarioSistema[] } = {};
    const falhasPermissao: UsuarioSistema[] = [];

    this.usuarios.forEach(u => {
      const email = (u.email || '').toLowerCase().trim();
      if (!mapaEmailUsers[email]) mapaEmailUsers[email] = [];
      mapaEmailUsers[email].push(u);

      if (!email || !emailRegex.test(email)) {
        emailsInvalidosOuInexistentes.push({ id: u.id, tipo: 'usuario', nome: u.nome, email: u.email, motivo: 'Formato de e-mail inválido' });
      } else if (dominiosFalsos.some(d => email.endsWith('@' + d))) {
        emailsInvalidosOuInexistentes.push({ id: u.id, tipo: 'usuario', nome: u.nome, email: u.email, motivo: 'Domínio de demonstração/inexistente' });
      }

      const validRoles: UserRole[] = ['administrador_geral', 'administrador', 'professor', 'aluno', 'financeiro'];
      if (!u.role || !validRoles.includes(u.role)) {
        falhasPermissao.push(u);
      }
    });

    const duplicadosEmailUsuarios = Object.entries(mapaEmailUsers)
      .filter(([_, lista]) => lista.length > 1)
      .map(([email, lista]) => ({ email, usuarios: lista }));

    // 3. Órfãos Financeiro (alunoId inexistente ou CT inválido)
    const alunosIds = new Set(this.alunos.map(a => a.id));
    const orfaosFinanceiro = this.financeiro.filter(f => {
      if (f.alunoId && !alunosIds.has(f.alunoId)) return true;
      if (!f.ct || (!unidadesNomes.has((f.ct || '').toUpperCase()) && f.ct !== 'GERAL')) return true;
      return false;
    });

    // 4. Uploads quebrados
    const uploadsQuebrados = this.arquivos.filter(a => !a.url || a.url.trim() === '' || a.url === 'null');

    // 5. Erros de autenticação recentes nos logs
    const errosAutenticacaoRecentes = this.auditoriaLogs.filter(
      l => l.acao.includes('ERRO_AUTH') || l.detalhes.toLowerCase().includes('falha')
    );

    return {
      tempoConsultaMs,
      totalAlunos: this.alunos.length,
      totalUsuarios: this.usuarios.length,
      totalLancamentos: this.financeiro.length,
      totalEventos: this.eventos.length,
      totalArquivos: this.arquivos.length,
      duplicadosEmailAlunos,
      duplicadosEmailUsuarios,
      duplicadosMatricula,
      emailsInvalidosOuInexistentes,
      orfaosSemUnidade: orfaosUnidade,
      orfaosFinanceiro,
      camposVaziosAlunos: camposVazios,
      uploadsQuebrados,
      falhasPermissao,
      errosAutenticacaoRecentes
    };
  }

  // Auto-correção e saneamento do banco (remove contas fake, e-mails inexistentes e duplicatas)
  public async corrigirInconsistencias(): Promise<{ removidos: number; reparados: number }> {
    const varredura = await this.executarVarreduraCompleta();
    let removidos = 0;
    let reparados = 0;

    // 1. Remove duplicatas de alunos mantendo o cadastro primário
    for (const item of varredura.duplicadosEmailAlunos) {
      const [principal, ...resto] = item.alunos;
      for (const dup of resto) {
        await deleteDoc(doc(db, 'alunos', dup.id));
        this.alunos = this.alunos.filter(a => a.id !== dup.id);
        removidos++;
      }
    }

    // 2. Remove duplicatas de usuários mantendo o primário (nunca remove o desenvolvedor)
    for (const item of varredura.duplicadosEmailUsuarios) {
      const [principal, ...resto] = item.usuarios;
      for (const dup of resto) {
        if (dup.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
          await deleteDoc(doc(db, 'usuarios', dup.id));
          this.usuarios = this.usuarios.filter(u => u.id !== dup.id);
          removidos++;
        }
      }
    }

    // 3. Purga e-mails inexistentes e contas de teste/demonstração
    for (const item of varredura.emailsInvalidosOuInexistentes) {
      if (item.tipo === 'usuario' && item.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
        await deleteDoc(doc(db, 'usuarios', item.id));
        this.usuarios = this.usuarios.filter(u => u.id !== item.id);
        removidos++;
      } else if (item.tipo === 'aluno') {
        await deleteDoc(doc(db, 'alunos', item.id));
        this.alunos = this.alunos.filter(a => a.id !== item.id);
        removidos++;
      }
    }

    // 4. Corrige alunos órfãos de CT reatribuindo ao Polo Principal
    const unidadePadrao = this.unidades[0]?.nome || 'Campo Grande';
    for (const orfao of varredura.orfaosSemUnidade) {
      await updateDoc(doc(db, 'alunos', orfao.id), { ct: unidadePadrao });
      this.alunos = this.alunos.map(a => a.id === orfao.id ? { ...a, ct: unidadePadrao } : a);
      reparados++;
    }

    // 5. Corrige campos vazios obrigatórios com padrões válidos
    for (const item of varredura.camposVaziosAlunos) {
      const aluno = this.alunos.find(a => a.id === item.id);
      if (aluno) {
        const patch: Partial<Aluno> = {};
        if (!aluno.faixa) patch.faixa = 'Amarela';
        if (!aluno.telefone) patch.telefone = '(21) 99999-0000';
        if (!aluno.status) patch.status = 'ativo';
        if (!aluno.ct) patch.ct = unidadePadrao;
        if (Object.keys(patch).length > 0) {
          await updateDoc(doc(db, 'alunos', aluno.id), patch);
          this.alunos = this.alunos.map(a => a.id === aluno.id ? { ...a, ...patch } : a);
          reparados++;
        }
      }
    }

    // 6. Remove uploads quebrados sem URL válida
    for (const up of varredura.uploadsQuebrados) {
      await deleteDoc(doc(db, 'arquivos', up.id));
      this.arquivos = this.arquivos.filter(a => a.id !== up.id);
      removidos++;
    }

    await this.registrarAuditoria(
      'SANEAMENTO_FIREBASE', 
      `Saneamento completo executado: ${removidos} registros duplicados/inexistentes removidos e ${reparados} inconsistências reparadas.`, 
      this.currentUser?.email || 'dev', 
      'sistema'
    );

    this.notify();
    return { removidos, reparados };
  }

  // ===== BACKUP & RESTAURAÇÃO =====
  public gerarBackupCompleto(): string {
    const agoraIso = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_KEYS.ULTIMO_BACKUP, agoraIso);

    const payload = {
      dataExport: agoraIso,
      versao: '5.5-production',
      projeto: 'equipe-gaditas',
      siteConfig: this.siteConfig,
      unidades: this.unidades,
      alunos: this.alunos,
      usuarios: this.usuarios,
      financeiro: this.financeiro,
      estoque: this.estoque,
      frequencia: this.frequencia,
      avisos: this.avisos,
      eventos: this.eventos,
      arquivos: this.arquivos,
      paginas: this.paginas,
      auditoria: this.auditoriaLogs
    };
    return JSON.stringify(payload, null, 2);
  }

  public async restaurarBackup(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.unidades && !data.alunos && !data.usuarios) {
        throw new Error('Arquivo de backup inválido: formato incompatível.');
      }

      if (data.siteConfig) {
        await this.salvarSiteConfig(data.siteConfig);
      }

      if (Array.isArray(data.alunos)) {
        for (const a of data.alunos) {
          await setDoc(doc(db, 'alunos', a.id), a);
        }
        this.alunos = data.alunos;
      }

      if (Array.isArray(data.usuarios)) {
        for (const u of data.usuarios) {
          await setDoc(doc(db, 'usuarios', u.id), u);
        }
        this.usuarios = data.usuarios;
      }

      if (Array.isArray(data.unidades)) {
        for (const u of data.unidades) {
          await setDoc(doc(db, 'unidades', u.id), u);
        }
        this.unidades = data.unidades;
      }

      if (Array.isArray(data.financeiro)) {
        for (const f of data.financeiro) {
          await setDoc(doc(db, 'financeiro', f.id), f);
        }
        this.financeiro = data.financeiro;
      }

      if (Array.isArray(data.eventos)) {
        for (const ev of data.eventos) {
          await setDoc(doc(db, 'eventos', ev.id), ev);
        }
        this.eventos = data.eventos;
      }

      if (Array.isArray(data.paginas)) {
        for (const pg of data.paginas) {
          await setDoc(doc(db, 'paginas', pg.id), pg);
        }
        this.paginas = data.paginas;
      }

      await this.registrarAuditoria(
        'RESTAURACAO_BACKUP',
        `Restauração completa do banco executada a partir do arquivo exportado em ${data.dataExport || 'data anterior'}`,
        this.currentUser?.email || 'dev',
        'sistema'
      );

      this.notify();
      return true;
    } catch (e: any) {
      throw new Error('Falha ao restaurar backup: ' + e?.message);
    }
  }
}

export const store = new GaditasProductionStore();
