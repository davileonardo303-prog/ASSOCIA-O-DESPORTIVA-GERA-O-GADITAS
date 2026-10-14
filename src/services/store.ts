import { Aluno, Unidade, Professor, FrequenciaRecord, FinanceiroItem, EstoqueItem, ProjardeBelt } from '../types';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';

const INITIAL_UNIDADES: Unidade[] = [
  { id: 'uni-1', nome: 'Campo Grande', tipo: 'pagante', responsavel: 'Mestre Daniel Braga', endereco: 'Rua Principal, Campo Grande - RJ' },
  { id: 'uni-2', nome: 'Bangu', tipo: 'pagante', responsavel: 'Professor Lucas', endereco: 'Av. Cônego de Vasconcelos, Bangu - RJ' },
  { id: 'uni-3', nome: 'Seropédica', tipo: 'pagante', responsavel: 'Professor Marcos', endereco: 'Km 40, Seropédica - RJ' },
  { id: 'uni-4', nome: 'Nova Iguaçu (Social)', tipo: 'bolsista', responsavel: 'Equipe Gaditas Social', endereco: 'Polo Nova Iguaçu - RJ' }
];

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const INITIAL_ALUNOS: Aluno[] = [
  {
    id: 'alu-1',
    matricula: 1,
    nome: 'Gabriel Santos',
    email: 'gabriel.santos@gmail.com',
    telefone: '(21) 98765-4321',
    ct: 'Campo Grande',
    status: 'ativo',
    faixa: 'Azul e Branca',
    graus: 3,
    tipo_sanguineo: 'O+',
    alergias: 'Nenhuma',
    problemas_saude: '',
    contato_emergencia: 'Carla (Mãe) - (21) 98888-1111',
    ultimo_mes_pago: currentMonth,
    ultimo_ano_pago: currentYear,
    data_cadastro: '2024-03-10'
  },
  {
    id: 'alu-2',
    matricula: 2,
    nome: 'Matheus Oliveira',
    email: 'matheus.muay@gmail.com',
    telefone: '(21) 97123-9988',
    ct: 'Campo Grande',
    status: 'ativo',
    faixa: 'Verde e Branca',
    graus: 2,
    tipo_sanguineo: 'A+',
    alergias: 'Dipirona',
    problemas_saude: 'Cirurgia no ombro esquerdo em 2022',
    contato_emergencia: 'Roberto (Irmão) - (21) 97654-2222',
    ultimo_mes_pago: currentMonth,
    ultimo_ano_pago: currentYear,
    data_cadastro: '2024-05-18'
  },
  {
    id: 'alu-3',
    matricula: 3,
    nome: 'Larissa Ferreira',
    email: 'larissa.luta@gmail.com',
    telefone: '(21) 99345-6712',
    ct: 'Bangu',
    status: 'ativo',
    faixa: 'Amarela e Branca',
    graus: 1,
    tipo_sanguineo: 'B+',
    alergias: 'Nenhuma',
    problemas_saude: '',
    contato_emergencia: 'Sonia (Mãe) - (21) 99112-3344',
    ultimo_mes_pago: -1, // Pendente
    ultimo_ano_pago: -1,
    data_cadastro: '2025-01-12'
  },
  {
    id: 'alu-4',
    matricula: 4,
    nome: 'Felipe Alcantara',
    email: 'felipe.alc@gmail.com',
    telefone: '(21) 98221-7788',
    ct: 'Seropédica',
    status: 'ativo',
    faixa: 'Marrom',
    graus: 4,
    tipo_sanguineo: 'AB+',
    alergias: 'Penicilina',
    problemas_saude: 'Asma leve',
    contato_emergencia: 'Juliana (Esposa) - (21) 98334-4455',
    ultimo_mes_pago: currentMonth,
    ultimo_ano_pago: currentYear,
    data_cadastro: '2023-09-01'
  },
  {
    id: 'alu-5',
    matricula: 5,
    nome: 'Lucas Silva Prado',
    email: 'lucas.prado@gmail.com',
    telefone: '(21) 96554-1122',
    ct: 'Nova Iguaçu (Social)',
    status: 'ativo',
    faixa: 'Amarela',
    graus: 2,
    tipo_sanguineo: 'O-',
    alergias: 'Nenhuma',
    problemas_saude: '',
    contato_emergencia: 'Marcos (Pai) - (21) 96554-1100',
    ultimo_mes_pago: currentMonth,
    ultimo_ano_pago: currentYear,
    data_cadastro: '2025-02-05'
  },
  {
    id: 'alu-6',
    matricula: 6,
    nome: 'Thiago Rangel',
    email: 'thiago.rangel@gmail.com',
    telefone: '(21) 98111-9900',
    ct: 'Campo Grande',
    status: 'pendente',
    faixa: 'Amarela',
    graus: 0,
    tipo_sanguineo: 'A-',
    alergias: 'Nenhuma',
    problemas_saude: '',
    contato_emergencia: 'Ana (Mãe) - (21) 98111-9901',
    ultimo_mes_pago: -1,
    ultimo_ano_pago: -1,
    data_cadastro: '2026-10-12'
  },
  {
    id: 'alu-7',
    matricula: 7,
    nome: 'Rodrigo Medeiros',
    email: 'rodrigo.med@gmail.com',
    telefone: '(21) 97777-6655',
    ct: 'Bangu',
    status: 'inativo',
    faixa: 'Verde',
    graus: 1,
    tipo_sanguineo: 'O+',
    alergias: 'Nenhuma',
    problemas_saude: 'Mudança de estado',
    contato_emergencia: 'Paula - (21) 97777-6650',
    ultimo_mes_pago: -1,
    ultimo_ano_pago: -1,
    data_cadastro: '2023-11-20'
  }
];

const INITIAL_PROFESSORES: Professor[] = [
  { id: 'prof-1', nome: 'Mestre Daniel Braga', email: 'davileonardo303@gmail.com', ct: 'GERAL', role: 'admin', telefone: '(21) 99999-0001' },
  { id: 'prof-2', nome: 'Professor Lucas Rocha', email: 'lucas.gaditas@gmail.com', ct: 'Bangu', role: 'professor', telefone: '(21) 99999-0002' },
  { id: 'prof-3', nome: 'Professor Marcos Santos', email: 'marcos.gaditas@gmail.com', ct: 'Seropédica', role: 'professor', telefone: '(21) 99999-0003' }
];

const INITIAL_FINANCEIRO: FinanceiroItem[] = [
  { id: 'fin-1', descricao: 'Mensalidade: Gabriel Santos', tipo: 'entrada', valor: 120, categoria: 'Mensalidade', forma: 'Pix', data: '2026-10-05', ct: 'Campo Grande' },
  { id: 'fin-2', descricao: 'Mensalidade: Matheus Oliveira', tipo: 'entrada', valor: 120, categoria: 'Mensalidade', forma: 'Pix', data: '2026-10-06', ct: 'Campo Grande' },
  { id: 'fin-3', descricao: 'Mensalidade: Felipe Alcantara', tipo: 'entrada', valor: 120, categoria: 'Mensalidade', forma: 'Dinheiro', data: '2026-10-08', ct: 'Seropédica' },
  { id: 'fin-4', descricao: 'Venda: 2x Camisas Oficiais Gaditas', tipo: 'entrada', valor: 180, categoria: 'Venda', forma: 'Pix', data: '2026-10-09', ct: 'Campo Grande' },
  { id: 'fin-5', descricao: 'Manutenção Tatame & Higienização', tipo: 'saida', valor: 250, categoria: 'Geral', forma: 'Pix', data: '2026-10-04', ct: 'Campo Grande' }
];

const INITIAL_ESTOQUE: EstoqueItem[] = [
  { id: 'est-1', nome: 'Luvas de Boxe/Muay Thai 14oz (Preta/Dourada)', quantidade: 8, categoria: 'Proteção', valorUnitario: 180 },
  { id: 'est-2', nome: 'Caneleira de Treino Gaditas', quantidade: 6, categoria: 'Proteção', valorUnitario: 140 },
  { id: 'est-3', nome: 'Camiseta Oficial Equipe Gaditas Fight Team', quantidade: 24, categoria: 'Vestuário', valorUnitario: 90 },
  { id: 'est-4', nome: 'Shorts de Muay Thai Gaditas', quantidade: 15, categoria: 'Vestuário', valorUnitario: 110 },
  { id: 'est-5', nome: 'Bandagens de Mão 4m (Par)', quantidade: 30, categoria: 'Proteção', valorUnitario: 35 },
  { id: 'est-6', nome: 'Protetor Bucal Termomoldável', quantidade: 20, categoria: 'Proteção', valorUnitario: 25 }
];

const LOCAL_STORAGE_KEYS = {
  ALUNOS: 'gaditas_alunos_v2',
  UNIDADES: 'gaditas_unidades_v2',
  PROFESSORES: 'gaditas_professores_v2',
  FINANCEIRO: 'gaditas_financeiro_v2',
  ESTOQUE: 'gaditas_estoque_v2',
  FREQUENCIA: 'gaditas_frequencia_v2',
  AUTH_ADMIN: 'ct_professor',
  NOME_ADMIN: 'nome_professor',
  ALUNO_LOGADO: 'gaditas_aluno_logado'
};

class GaditasStore {
  private alunos: Aluno[] = [];
  private unidades: Unidade[] = [];
  private professores: Professor[] = [];
  private financeiro: FinanceiroItem[] = [];
  private estoque: EstoqueItem[] = [];
  private frequencia: FrequenciaRecord[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Carrega do LocalStorage com fallback para os dados de base
    const storedAlunos = localStorage.getItem(LOCAL_STORAGE_KEYS.ALUNOS);
    this.alunos = storedAlunos ? JSON.parse(storedAlunos) : INITIAL_ALUNOS;

    const storedUnidades = localStorage.getItem(LOCAL_STORAGE_KEYS.UNIDADES);
    this.unidades = storedUnidades ? JSON.parse(storedUnidades) : INITIAL_UNIDADES;

    const storedProfessores = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFESSORES);
    this.professores = storedProfessores ? JSON.parse(storedProfessores) : INITIAL_PROFESSORES;

    const storedFinanceiro = localStorage.getItem(LOCAL_STORAGE_KEYS.FINANCEIRO);
    this.financeiro = storedFinanceiro ? JSON.parse(storedFinanceiro) : INITIAL_FINANCEIRO;

    const storedEstoque = localStorage.getItem(LOCAL_STORAGE_KEYS.ESTOQUE);
    this.estoque = storedEstoque ? JSON.parse(storedEstoque) : INITIAL_ESTOQUE;

    const storedFreq = localStorage.getItem(LOCAL_STORAGE_KEYS.FREQUENCIA);
    this.frequencia = storedFreq ? JSON.parse(storedFreq) : [];

    // Tenta sincronizar com o Firestore em segundo plano
    this.syncFromFirestore();
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

  private persist(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
    this.notify();
  }

  private async syncFromFirestore() {
    try {
      const snapAlunos = await getDocs(collection(db, 'alunos'));
      if (!snapAlunos.empty) {
        const firestoreAlunos: Aluno[] = [];
        snapAlunos.forEach(d => {
          const raw = d.data();
          firestoreAlunos.push({
            id: d.id,
            matricula: raw.matricula || 0,
            nome: raw.nome || '',
            email: raw.email || '',
            telefone: raw.telefone || '',
            ct: raw.ct || raw.unidade || 'Campo Grande',
            status: raw.status || 'ativo',
            faixa: raw.faixa || 'Amarela',
            graus: raw.graus ?? 0,
            tipo_sanguineo: raw.tipo_sanguineo || 'Não Sei',
            alergias: raw.alergias || '',
            problemas_saude: raw.problemas_saude || '',
            contato_emergencia: raw.contato_emergencia || '',
            ultimo_mes_pago: raw.ultimo_mes_pago ?? -1,
            ultimo_ano_pago: raw.ultimo_ano_pago ?? -1,
            data_cadastro: raw.data_cadastro ? (raw.data_cadastro.toDate ? raw.data_cadastro.toDate().toISOString().split('T')[0] : String(raw.data_cadastro)) : undefined
          });
        });
        if (firestoreAlunos.length > 0) {
          this.alunos = firestoreAlunos;
          this.persist(LOCAL_STORAGE_KEYS.ALUNOS, this.alunos);
        }
      }

      const snapUnidades = await getDocs(collection(db, 'unidades'));
      if (!snapUnidades.empty) {
        const firestoreUnidades: Unidade[] = [];
        snapUnidades.forEach(d => {
          const raw = d.data();
          firestoreUnidades.push({
            id: d.id,
            nome: raw.nome || '',
            tipo: raw.tipo === 'bolsista' ? 'bolsista' : 'pagante',
            endereco: raw.endereco,
            responsavel: raw.responsavel
          });
        });
        if (firestoreUnidades.length > 0) {
          this.unidades = firestoreUnidades;
          this.persist(LOCAL_STORAGE_KEYS.UNIDADES, this.unidades);
        }
      }
    } catch {
      // Ignora erro de permissão ou offline e continua operando perfeitamente
    }
  }

  // ===== ALUNOS =====
  public getAlunos(filterStatus?: 'ativo' | 'pendente' | 'inativo', ct?: string): Aluno[] {
    let list = this.alunos;
    if (filterStatus) {
      list = list.filter(a => a.status === filterStatus);
    }
    if (ct && ct !== 'GERAL') {
      list = list.filter(a => a.ct.toUpperCase() === ct.toUpperCase());
    }
    return list;
  }

  public getAlunoById(id: string): Aluno | undefined {
    return this.alunos.find(a => a.id === id);
  }

  public getAlunoByEmail(email: string): Aluno | undefined {
    return this.alunos.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
  }

  public async cadastrarAluno(dados: Omit<Aluno, 'id' | 'matricula' | 'status' | 'ultimo_mes_pago' | 'ultimo_ano_pago'>): Promise<Aluno> {
    const proximaMatricula = this.alunos.length > 0 ? Math.max(...this.alunos.map(a => a.matricula || 0)) + 1 : 1;
    const novoAluno: Aluno = {
      ...dados,
      id: 'alu-' + Date.now(),
      matricula: proximaMatricula,
      status: 'pendente',
      ultimo_mes_pago: -1,
      ultimo_ano_pago: -1,
      data_cadastro: new Date().toISOString().split('T')[0]
    };

    this.alunos.unshift(novoAluno);
    this.persist(LOCAL_STORAGE_KEYS.ALUNOS, this.alunos);

    // Tenta persistir no Firestore
    try {
      await setDoc(doc(db, 'alunos', novoAluno.id), novoAluno);
    } catch {
      // Offline fallback
    }

    return novoAluno;
  }

  public async atualizarStatusAluno(id: string, novoStatus: 'ativo' | 'inativo' | 'pendente') {
    this.alunos = this.alunos.map(a => {
      if (a.id === id) {
        return { ...a, status: novoStatus };
      }
      return a;
    });
    this.persist(LOCAL_STORAGE_KEYS.ALUNOS, this.alunos);

    try {
      await updateDoc(doc(db, 'alunos', id), { status: novoStatus });
    } catch {
      // Fallback
    }
  }

  public async atualizarGraduacao(id: string, faixa: ProjardeBelt, graus: number) {
    this.alunos = this.alunos.map(a => {
      if (a.id === id) {
        return { ...a, faixa, graus };
      }
      return a;
    });
    this.persist(LOCAL_STORAGE_KEYS.ALUNOS, this.alunos);

    try {
      await updateDoc(doc(db, 'alunos', id), { faixa, graus });
    } catch {
      // Fallback
    }
  }

  public async darBaixaMensalidade(id: string, valor: number = 120, categoria = 'Mensalidade') {
    const aluno = this.alunos.find(a => a.id === id);
    if (!aluno) return;

    const dataHoje = new Date();
    const mes = dataHoje.getMonth();
    const ano = dataHoje.getFullYear();

    this.alunos = this.alunos.map(a => {
      if (a.id === id) {
        return { ...a, ultimo_mes_pago: mes, ultimo_ano_pago: ano };
      }
      return a;
    });
    this.persist(LOCAL_STORAGE_KEYS.ALUNOS, this.alunos);

    // Registra entrada no financeiro
    this.adicionarLancamentoFinanceiro({
      descricao: `Mensalidade: ${aluno.nome}`,
      tipo: 'entrada',
      valor,
      categoria: categoria as any,
      forma: 'Pix',
      data: dataHoje.toISOString().split('T')[0],
      ct: aluno.ct
    });

    try {
      await updateDoc(doc(db, 'alunos', id), { ultimo_mes_pago: mes, ultimo_ano_pago: ano });
    } catch {
      // Fallback
    }
  }

  public async excluirAluno(id: string) {
    this.alunos = this.alunos.filter(a => a.id !== id);
    this.persist(LOCAL_STORAGE_KEYS.ALUNOS, this.alunos);

    try {
      await deleteDoc(doc(db, 'alunos', id));
    } catch {
      // Fallback
    }
  }

  // ===== UNIDADES =====
  public getUnidades(): Unidade[] {
    return this.unidades;
  }

  public async adicionarUnidade(nome: string, tipo: 'pagante' | 'bolsista', endereco?: string) {
    const nova: Unidade = {
      id: 'uni-' + Date.now(),
      nome,
      tipo,
      endereco
    };
    this.unidades.push(nova);
    this.persist(LOCAL_STORAGE_KEYS.UNIDADES, this.unidades);

    try {
      await setDoc(doc(db, 'unidades', nova.id), nova);
    } catch {
      // Fallback
    }
  }

  public async removerUnidade(id: string) {
    this.unidades = this.unidades.filter(u => u.id !== id);
    this.persist(LOCAL_STORAGE_KEYS.UNIDADES, this.unidades);

    try {
      await deleteDoc(doc(db, 'unidades', id));
    } catch {
      // Fallback
    }
  }

  public isUnidadeBolsista(ctNome: string): boolean {
    const uni = this.unidades.find(u => u.nome.toUpperCase() === (ctNome || '').toUpperCase());
    return uni?.tipo === 'bolsista';
  }

  // ===== PROFESSORES =====
  public getProfessores(): Professor[] {
    return this.professores;
  }

  public async adicionarProfessor(prof: Omit<Professor, 'id'>) {
    const novo: Professor = {
      ...prof,
      id: 'prof-' + Date.now(),
      data_cadastro: new Date().toISOString().split('T')[0]
    };
    this.professores.push(novo);
    this.persist(LOCAL_STORAGE_KEYS.PROFESSORES, this.professores);
    return novo;
  }

  public async removerProfessor(id: string) {
    this.professores = this.professores.filter(p => p.id !== id);
    this.persist(LOCAL_STORAGE_KEYS.PROFESSORES, this.professores);
  }

  // ===== FREQUENCIA / CHAMADA =====
  public getFrequencias(): FrequenciaRecord[] {
    return this.frequencia;
  }

  public async salvarChamada(alunosPresentesIds: string[], dataRef: string, ct: string) {
    const registros: FrequenciaRecord[] = [];
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
        registros.push(item);
        this.frequencia.push(item);
      }
    }

    this.persist(LOCAL_STORAGE_KEYS.FREQUENCIA, this.frequencia);

    try {
      for (const reg of registros) {
        await addDoc(collection(db, 'frequencia'), reg);
      }
    } catch {
      // Fallback
    }
  }

  // ===== FINANCEIRO =====
  public getFinanceiro(ct?: string): FinanceiroItem[] {
    if (ct && ct !== 'GERAL') {
      return this.financeiro.filter(f => f.ct.toUpperCase() === ct.toUpperCase());
    }
    return this.financeiro;
  }

  public async adicionarLancamentoFinanceiro(item: Omit<FinanceiroItem, 'id'>) {
    const novo: FinanceiroItem = {
      ...item,
      id: 'fin-' + Date.now()
    };
    this.financeiro.unshift(novo);
    this.persist(LOCAL_STORAGE_KEYS.FINANCEIRO, this.financeiro);

    try {
      await addDoc(collection(db, 'financeiro'), novo);
    } catch {
      // Fallback
    }
  }

  // ===== ESTOQUE =====
  public getEstoque(): EstoqueItem[] {
    return this.estoque;
  }

  public async adicionarItemEstoque(nome: string, quantidade: number, categoria?: string, valorUnitario?: number) {
    const novo: EstoqueItem = {
      id: 'est-' + Date.now(),
      nome,
      quantidade,
      categoria,
      valorUnitario
    };
    this.estoque.push(novo);
    this.persist(LOCAL_STORAGE_KEYS.ESTOQUE, this.estoque);

    try {
      await addDoc(collection(db, 'estoque'), novo);
    } catch {
      // Fallback
    }
  }

  public async atualizarQuantidadeEstoque(id: string, delta: number) {
    this.estoque = this.estoque.map(e => {
      if (e.id === id) {
        const novaQtd = Math.max(0, e.quantidade + delta);
        return { ...e, quantidade: novaQtd };
      }
      return e;
    });
    this.persist(LOCAL_STORAGE_KEYS.ESTOQUE, this.estoque);
  }

  public async removerItemEstoque(id: string) {
    this.estoque = this.estoque.filter(e => e.id !== id);
    this.persist(LOCAL_STORAGE_KEYS.ESTOQUE, this.estoque);
  }

  // ===== AUTH SESSIONS =====
  public getAdminSession(): { ct: string; nome: string; isAdmin: boolean } | null {
    const ct = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_ADMIN);
    const nome = localStorage.getItem(LOCAL_STORAGE_KEYS.NOME_ADMIN);
    if (!ct) return null;
    return {
      ct,
      nome: nome || 'Mestre Daniel Braga',
      isAdmin: ct === 'GERAL'
    };
  }

  public setAdminSession(ct: string, nome: string) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_ADMIN, ct);
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOME_ADMIN, nome);
    this.notify();
  }

  public logoutAdmin() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_ADMIN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.NOME_ADMIN);
    this.notify();
  }

  public getAlunoLogado(): Aluno | null {
    const id = localStorage.getItem(LOCAL_STORAGE_KEYS.ALUNO_LOGADO);
    if (!id) return null;
    return this.getAlunoById(id) || null;
  }

  public setAlunoLogado(alunoId: string) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ALUNO_LOGADO, alunoId);
    this.notify();
  }

  public logoutAluno() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ALUNO_LOGADO);
    this.notify();
  }
}

export const store = new GaditasStore();
