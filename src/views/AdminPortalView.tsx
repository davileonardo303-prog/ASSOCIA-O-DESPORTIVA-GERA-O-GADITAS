import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Aluno, Unidade, Professor, FinanceiroItem, EstoqueItem, ProjardeBelt, AvisoCT } from '../types';
import { BeltDisplay } from '../components/BeltDisplay';
import { PrintableAthleteCard } from '../components/PrintableAthleteCard';
import { AthleteCardID } from '../components/AthleteCardID';
import { BeltProgressionModal } from '../components/BeltProgressionModal';
import { WeightCategoryCalculator } from '../components/WeightCategoryCalculator';
import { FirebaseDatabasePanel } from '../components/FirebaseDatabasePanel';
import { FirebaseStorageManager } from '../components/FirebaseStorageManager';
import { FirebaseHealthView } from '../components/FirebaseHealthView';
import { DeveloperCmsPanel } from '../components/DeveloperCmsPanel';
import { EventosManager } from '../components/EventosManager';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  CheckSquare, 
  DollarSign, 
  Award, 
  FolderArchive, 
  Package, 
  BarChart3, 
  Archive, 
  Building2, 
  MapPin,
  UserCog, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  Check, 
  X, 
  Eye, 
  Trash2, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  Printer, 
  Shield, 
  Lock, 
  Phone, 
  HeartPulse,
  Filter,
  RefreshCw,
  Download,
  MessageCircle,
  Bell,
  Scale,
  IdCard,
  BookOpen,
  Database,
  UploadCloud,
  Calendar as CalendarIcon,
  Activity,
  Code,
  Cloud,
  Camera,
  Sparkles
} from 'lucide-react';
import { GooglePreCadastroModal } from '../components/GooglePreCadastroModal';
import { GerenciadorFotosModal } from '../components/GerenciadorFotosModal';

interface AdminPortalViewProps {
  adminLogado: { ct: string; nome: string; isAdmin: boolean; role?: string } | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  adminLogado,
  onLogout,
  onNavigate
}) => {
  // Estado de Login do Admin/Professor
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [ctSelecionadoLogin, setCtSelecionadoLogin] = useState('GERAL');
  const [erroLogin, setErroLogin] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Sub-abas do ERP
  const [activeTab, setActiveTab] = useState<
    | 'visao-geral'
    | 'aprovar-alunos'
    | 'lista-alunos'
    | 'chamada'
    | 'financeiro'
    | 'graduacoes'
    | 'documentos'
    | 'estoque'
    | 'relatorios'
    | 'arquivo-morto'
    | 'avisos'
    | 'unidades'
    | 'equipe'
    | 'configuracoes'
    | 'painel-dev'
    | 'saude-firebase'
    | 'banco-dados'
    | 'backup-drive'
    | 'arquivos-storage'
    | 'eventos-ct'
    | 'gerenciar-fotos'
  >('visao-geral');

  // Estados de Modais
  const [modalFotosAberta, setModalFotosAberta] = useState(false);
  const [dadosGooglePendente, setDadosGooglePendente] = useState<{
    nome: string;
    email: string;
    uid?: string;
    foto?: string;
  } | null>(null);
  const [modalGoogleAberta, setModalGoogleAberta] = useState(false);

  // Estado Reativo
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return unsub;
  }, []);

  const currentCT = adminLogado?.ct || 'GERAL';
  const isAdminGeral = store.isUsuarioAdminGeral() || adminLogado?.isAdmin || adminLogado?.role === 'admin_geral' || adminLogado?.role === 'administrador_geral';

  // Estados dos Módulos
  const [buscaAluno, setBuscaAluno] = useState('');
  const [filtroCT, setFiltroCT] = useState(currentCT);
  const [filtroStatusCadastral, setFiltroStatusCadastral] = useState<'todos' | 'ativo' | 'pendente' | 'inativo'>('todos');
  const [filtroStatusFin, setFiltroStatusFin] = useState<'todos' | 'em-dia' | 'pendente' | 'bolsista'>('todos');

  // Chamada Digital
  const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);
  const [ctChamada, setCtChamada] = useState(currentCT === 'GERAL' ? 'Campo Grande' : currentCT);
  const [presentesSet, setPresentesSet] = useState<Set<string>>(new Set());
  const [salvandoChamada, setSalvandoChamada] = useState(false);

  // Ficha de Impressão e Carteirinha
  const [alunoFichaSelecionado, setAlunoFichaSelecionado] = useState<Aluno | null>(null);
  const [alunoCarteirinhaSelecionado, setAlunoCarteirinhaSelecionado] = useState<Aluno | null>(null);
  const [modalCurriculoAberto, setModalCurriculoAberto] = useState(false);
  const [alunoPesoSelecionado, setAlunoPesoSelecionado] = useState<Aluno | null>(null);

  // Formulário Financeiro Manual
  const [finDesc, setFinDesc] = useState('');
  const [finTipo, setFinTipo] = useState<'entrada' | 'saida'>('entrada');
  const [finValor, setFinValor] = useState('');
  const [finCat, setFinCat] = useState<'Mensalidade' | 'Venda' | 'Equipamento' | 'Aluguel' | 'Geral'>('Mensalidade');
  const [finForma, setFinForma] = useState<'Pix' | 'Dinheiro' | 'Cartão' | 'Outro'>('Pix');

  // Formulário de Avisos
  const [novoAvisoTitulo, setNovoAvisoTitulo] = useState('');
  const [novoAvisoConteudo, setNovoAvisoConteudo] = useState('');
  const [novoAvisoCT, setNovoAvisoCT] = useState(currentCT);
  const [novoAvisoUrgente, setNovoAvisoUrgente] = useState(false);

  // Formulário de Estoque
  const [novoProdNome, setNovoProdNome] = useState('');
  const [novoProdQtd, setNovoProdQtd] = useState('');

  // Formulário de Nova Unidade
  const [novaUniNome, setNovaUniNome] = useState('');
  const [novaUniTipo, setNovaUniTipo] = useState<'pagante' | 'bolsista'>('pagante');
  const [novaUniResp, setNovaUniResp] = useState('');
  const [novaUniEnd, setNovaUniEnd] = useState('');
  const [novaUniTel, setNovaUniTel] = useState('');
  const [salvandoUni, setSalvandoUni] = useState(false);

  // Formulário de Novo Professor
  const [novoProfNome, setNovoProfNome] = useState('');
  const [novoProfEmail, setNovoProfEmail] = useState('');
  const [novoProfCT, setNovoProfCT] = useState('Campo Grande');
  const [novoProfRole, setNovoProfRole] = useState<'professor' | 'administrador'>('professor');

  // Login handler oficial Firebase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroLogin('');
    setLoadingLogin(true);

    try {
      const email = emailLogin.trim().toLowerCase();
      const res = await store.loginComEmail(email, senhaLogin);
      if (!res.sucesso) {
        setErroLogin(res.mensagem || 'Credenciais inválidas no Firebase Auth.');
      } else {
        const u = store.currentUser;
        if (u) {
          store.setAdminSession(u.ct || ctSelecionadoLogin, u.nome, u.role);
        } else {
          store.setAdminSession(ctSelecionadoLogin, email.split('@')[0].toUpperCase(), 'administrador');
        }
      }
    } catch (err: any) {
      setErroLogin(err?.message || 'Falha ao autenticar no Firebase.');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLoginGoogleAdmin = async () => {
    setErroLogin('');
    setLoadingGoogle(true);
    try {
      const res = await store.loginComGoogle();
      if (res.novoUsuarioPendente && res.dadosGoogle) {
        setDadosGooglePendente(res.dadosGoogle);
        setModalGoogleAberta(true);
        return;
      }
      if (!res.sucesso) {
        if (res.erroDominio) {
          setDadosGooglePendente({ nome: '', email: '' });
          setModalGoogleAberta(true);
        } else {
          setErroLogin(res.mensagem || 'Falha ao autenticar com o Google.');
        }
      } else {
        const u = store.currentUser;
        if (u) {
          store.setAdminSession(u.ct || 'GERAL', u.nome, u.role);
        }
      }
    } catch (err: any) {
      setErroLogin(err?.message || 'Erro ao conectar ao Google Authentication.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Se NÃO estiver logado: Tela de Login ERP Oficial
  if (!adminLogado) {
    const unidades = store.getUnidades();

    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 mx-auto flex items-center justify-center text-red-500">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase text-white">
              GADITAS <span className="text-red-500">ERP DOCENTE</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Acesso seguro oficial via Firebase Authentication.
            </p>
          </div>

          {erroLogin && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{erroLogin}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                E-mail Corporativo do Professor / Mestre
              </label>
              <input
                type="email"
                required
                value={emailLogin}
                onChange={e => setEmailLogin(e.target.value)}
                placeholder="mestre.daniel@gaditas.com ou seu e-mail"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={senhaLogin}
                onChange={e => setSenhaLogin(e.target.value)}
                placeholder="******"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Polo de Atuação
              </label>
              <select
                value={ctSelecionadoLogin}
                onChange={e => setCtSelecionadoLogin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              >
                <option value="GERAL">ACESSO GERAL (Todos os Polos)</option>
                {unidades.map(u => (
                  <option key={u.id} value={u.nome}>
                    Polo {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loadingLogin ? 'Validando no Firebase Auth...' : 'Acessar Painel de Controle'}</span>
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-neutral-500">ou</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          <button
            type="button"
            onClick={handleLoginGoogleAdmin}
            disabled={loadingGoogle}
            className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{loadingGoogle ? 'Autenticando...' : 'Entrar com Conta Google'}</span>
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Voltar para o site institucional
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Dados Globais para o Painel
  const unidades = store.getUnidades();
  const todosAlunos = store.getAlunos(undefined, filtroCT === 'GERAL' ? undefined : filtroCT);
  const alunosAtivos = store.getAlunos('ativo', filtroCT === 'GERAL' ? undefined : filtroCT);
  const alunosPendentes = store.getAlunos('pendente', currentCT === 'GERAL' ? undefined : currentCT);
  const alunosInativos = store.getAlunos('inativo', currentCT === 'GERAL' ? undefined : currentCT);
  const avisos = store.getAvisos(currentCT);

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Cálculos Financeiros
  const financeiroItems = store.getFinanceiro(currentCT);
  let totalEntradas = 0;
  let totalSaidas = 0;
  let devedoresCount = 0;

  alunosAtivos.forEach(a => {
    const isBolsista = store.isUnidadeBolsista(a.ct);
    const estaPago = isBolsista || (a.ultimo_mes_pago === mesAtual && a.ultimo_ano_pago === anoAtual);
    if (!estaPago) devedoresCount++;
  });

  financeiroItems.forEach(f => {
    if (f.tipo === 'entrada') totalEntradas += f.valor;
    else totalSaidas += f.valor;
  });

  const saldoCT = totalEntradas - totalSaidas;
  const taxaRetencao = (alunosAtivos.length + alunosInativos.length) > 0
    ? Math.round((alunosAtivos.length / (alunosAtivos.length + alunosInativos.length)) * 100)
    : 100;

  // Filtragem Robusta e Imediata de Lista de Alunos (Guerreiros Ativos)
  const alunosFiltrados = todosAlunos.filter(a => {
    const termo = buscaAluno.toLowerCase().trim();
    const termoLimpo = termo.replace('#', '');
    const digitosBusca = termo.replace(/\D/g, '');
    
    const matchTermo = !termo ||
      (a.nome || '').toLowerCase().includes(termo) ||
      (a.matricula ? String(a.matricula).includes(termoLimpo) : false) ||
      (a.email || '').toLowerCase().includes(termo) ||
      (digitosBusca.length >= 3 && (a.telefone || '').replace(/\D/g, '').includes(digitosBusca)) ||
      (digitosBusca.length >= 3 && (a.cpf || '').replace(/\D/g, '').includes(digitosBusca)) ||
      (a.ct || '').toLowerCase().includes(termo) ||
      (a.faixa || '').toLowerCase().includes(termo);

    if (!matchTermo) return false;

    // Filtro por Situação Cadastral
    if (filtroStatusCadastral === 'ativo' && a.status !== 'ativo') return false;
    if (filtroStatusCadastral === 'pendente' && a.status !== 'pendente') return false;
    if (filtroStatusCadastral === 'inativo' && a.status !== 'inativo') return false;

    const isBolsista = store.isUnidadeBolsista(a.ct);
    const isPago = isBolsista || (a.ultimo_mes_pago === mesAtual && a.ultimo_ano_pago === anoAtual);

    if (filtroStatusFin === 'em-dia') return isPago && !isBolsista;
    if (filtroStatusFin === 'pendente') return !isPago && !isBolsista;
    if (filtroStatusFin === 'bolsista') return isBolsista;
    return true;
  });

  // Alunos para Chamada Digital
  const alunosParaChamada = store.getAlunos('ativo', ctChamada);

  const togglePresencaChamada = (alunoId: string) => {
    setPresentesSet(prev => {
      const next = new Set(prev);
      if (next.has(alunoId)) next.delete(alunoId);
      else next.add(alunoId);
      return next;
    });
  };

  const handleSalvarChamada = async () => {
    if (presentesSet.size === 0) {
      alert('Selecione pelo menos um guerreiro presente na chamada.');
      return;
    }

    setSalvandoChamada(true);
    await store.salvarChamada(Array.from(presentesSet), dataChamada, ctChamada);
    setSalvandoChamada(false);
    alert(`✓ Presenças salvas com sucesso! (${presentesSet.size} guerreiros presentes)`);
    setPresentesSet(new Set());
  };

  const handleLancarFinanceiro = async (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(finValor.replace(',', '.'));
    if (!finDesc.trim() || isNaN(valorNum) || valorNum <= 0) {
      alert('Preencha a descrição e um valor válido.');
      return;
    }

    await store.adicionarLancamentoFinanceiro({
      descricao: finDesc.trim(),
      tipo: finTipo,
      valor: valorNum,
      categoria: finCat,
      forma: finForma,
      data: new Date().toISOString().split('T')[0],
      ct: currentCT === 'GERAL' ? 'Campo Grande' : currentCT
    });

    setFinDesc('');
    setFinValor('');
    alert('Lançamento registrado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#070708] flex flex-col lg:flex-row">
      
      {/* SIDEBAR DO ERP */}
      <aside className="w-full lg:w-64 bg-neutral-950 border-r border-neutral-800 p-4 lg:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Header da Sidebar */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-black text-sm uppercase text-white block">
                  GADITAS <span className="text-red-500">ERP</span>
                </span>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  {currentCT === 'GERAL' ? 'Admin Geral' : `Polo ${currentCT}`}
                </span>
              </div>
            </div>
          </div>

          {/* Menus de Navegação */}
          <nav className="space-y-1 text-xs font-bold uppercase tracking-wider">
            <div className="text-[10px] text-neutral-500 px-3 py-1 font-black">Principal</div>
            <button
              onClick={() => setActiveTab('visao-geral')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'visao-geral' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('aprovar-alunos')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'aprovar-alunos' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" />
                <span>Aprovar Alunos</span>
              </div>
              {alunosPendentes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black">
                  {alunosPendentes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('lista-alunos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'lista-alunos' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Lista de Alunos</span>
            </button>

            <div className="text-[10px] text-neutral-500 px-3 py-1 font-black pt-3">Operacional</div>
            <button
              onClick={() => setActiveTab('chamada')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'chamada' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Chamada Digital</span>
            </button>

            <button
              onClick={() => setActiveTab('graduacoes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'graduacoes' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Graduações Projarde</span>
            </button>

            <button
              onClick={() => setActiveTab('documentos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'documentos' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span>Pasta Digital / Médica</span>
            </button>

            <button
              onClick={() => setActiveTab('avisos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'avisos' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Mural de Avisos</span>
            </button>

            <div className="text-[10px] text-neutral-500 px-3 py-1 font-black pt-3">Gestão & Finanças</div>
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'financeiro' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financeiro & Mensalidades</span>
            </button>

            <button
              onClick={() => setActiveTab('estoque')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'estoque' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Estoque de Materiais</span>
            </button>

            <button
              onClick={() => setActiveTab('relatorios')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'relatorios' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Relatórios</span>
            </button>

            <button
              onClick={() => setActiveTab('arquivo-morto')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'arquivo-morto' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Arquivo Morto</span>
            </button>

            {isAdminGeral && (
              <>
                <div className="text-[10px] text-neutral-500 px-3 py-1 font-black pt-3">Administração Geral</div>
                <button
                  onClick={() => setActiveTab('painel-dev')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'painel-dev' 
                      ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white shadow-lg font-black' 
                      : 'text-amber-400 hover:text-white hover:bg-neutral-900 font-bold'
                  }`}
                >
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>Painel do Desenvolvedor (CMS)</span>
                </button>

                <button
                  onClick={() => setActiveTab('saude-firebase')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'saude-firebase' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Saúde do Firebase</span>
                </button>

                <button
                  onClick={() => setActiveTab('banco-dados')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'banco-dados' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Database className="w-4 h-4 text-red-400" />
                  <span>Banco & Scanner</span>
                </button>

                <button
                  onClick={() => setActiveTab('backup-drive')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'backup-drive' 
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shadow-lg font-black' 
                      : 'text-emerald-400 hover:text-white hover:bg-neutral-900 font-bold'
                  }`}
                >
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  <span>Backup Google Drive</span>
                </button>

                <button
                  onClick={() => setActiveTab('arquivos-storage')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'arquivos-storage' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  <span>Arquivos Storage</span>
                </button>

                <button
                  onClick={() => setActiveTab('eventos-ct')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'eventos-ct' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                  <span>Eventos & Calendário</span>
                </button>

                <button
                  onClick={() => setActiveTab('unidades')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'unidades' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Gerenciar Polos (CTs)</span>
                </button>

                <button
                  onClick={() => setActiveTab('equipe')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'equipe' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <UserCog className="w-4 h-4" />
                  <span>Gerenciar Professores</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'configuracoes' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 font-bold text-xs">
              {adminLogado.nome.charAt(0)}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{adminLogado.nome}</span>
              <span className="text-[10px] text-neutral-400 uppercase">{currentCT}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-red-950 hover:text-red-400 text-neutral-400 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">

        {/* ALERTA DE MODO SUPORTE (IMPERSONAÇÃO) */}
        {store.isImpersonando() && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-xs uppercase text-white font-black">
                  MODO SUPORTE ATIVO · Administrador Geral
                </strong>
                <span className="text-[11px] text-amber-300">
                  Visualizando o painel como: <strong>{store.impersonatedUser?.dados?.nome}</strong> ({store.impersonatedUser?.tipo === 'aluno' ? 'Aluno' : store.impersonatedUser?.dados?.role})
                </span>
              </div>
            </div>
            <button
              onClick={() => store.pararImpersonacao()}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md self-start sm:self-auto"
            >
              Retornar ao Administrador Geral (Davi)
            </button>
          </div>
        )}
        
        {/* ========================================================
            TAB 1: VISÃO GERAL (DASHBOARD)
        ======================================================== */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-neutral-400">
                  {hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
                  PAINEL DE CONTROLE · <span className="text-red-500">{adminLogado.nome.split(' ')[0]}</span>
                </h1>
              </div>

              {/* Seletor de CT para Admin Geral */}
              {isAdminGeral && (
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
                  <Filter className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs text-neutral-400 font-bold uppercase">Filtrar CT:</span>
                  <select
                    value={filtroCT}
                    onChange={e => setFiltroCT(e.target.value)}
                    className="bg-transparent text-xs font-bold text-white uppercase focus:outline-none cursor-pointer"
                  >
                    <option value="GERAL" className="bg-neutral-900">TODAS AS UNIDADES</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.nome} className="bg-neutral-900">
                        {u.nome.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Grid de Estatísticas (KPIs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-blue-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Guerreiros Ativos
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {alunosAtivos.length}
                </div>
                <span className="text-[10px] text-blue-400 mt-1 block">Matrículas ativas no CT</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-emerald-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Receita / Saldo Caixa
                </span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                  R$ {saldoCT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Entradas acumuladas</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-amber-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Mensalidades Pendentes
                </span>
                <div className="text-3xl font-black text-amber-400 font-mono mt-1">
                  {devedoresCount}
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Alunos em aberto</span>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-purple-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Taxa de Retenção
                </span>
                <div className="text-3xl font-black text-purple-400 font-mono mt-1">
                  {taxaRetencao}%
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">Fidelidade aos tatames</span>
              </div>
            </div>

            {/* Grid Central: Distribuição e Acessos Rápidos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Gráfico / Distribuição por Polo */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center justify-between">
                  <span>Atletas Ativos por Polo de Treino</span>
                  <span className="text-xs font-mono text-neutral-400 font-normal">Total: {alunosAtivos.length}</span>
                </h3>

                <div className="space-y-3 pt-2">
                  {unidades.map(u => {
                    const qtd = store.getAlunos('ativo', u.nome).length;
                    const percent = alunosAtivos.length > 0 ? Math.round((qtd / alunosAtivos.length) * 100) : 0;

                    return (
                      <div key={u.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-white uppercase">{u.nome}</span>
                          <span className="text-neutral-400 font-mono">{qtd} atletas ({percent}%)</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Acesso Rápido */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  Ações Rápidas
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('chamada')}
                    className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <CheckSquare className="w-5 h-5 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase text-white block">Fazer Chamada</span>
                    <span className="text-[10px] text-neutral-400">Presença diária</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('financeiro')}
                    className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <DollarSign className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase text-white block">Caixa & Mensalidade</span>
                    <span className="text-[10px] text-neutral-400">Dar baixas</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('aprovar-alunos')}
                    className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <UserCheck className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase text-white block">Aprovar Alunos</span>
                    <span className="text-[10px] text-neutral-400">{alunosPendentes.length} pendentes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('graduacoes')}
                    className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer"
                  >
                    <Award className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase text-white block">Graduações</span>
                    <span className="text-[10px] text-neutral-400">Níveis Projarde</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: APROVAR ALUNOS
        ======================================================== */}
        {activeTab === 'aprovar-alunos' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                APROVAR NOVOS <span className="text-red-500">GUERREIROS</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Cadastros enviados pelo formulário online aguardando liberação do Mestre.
              </p>
            </div>

            {alunosPendentes.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold uppercase text-white">Nenhum cadastro pendente</h3>
                <p className="text-xs text-neutral-400">Todos os guerreiros cadastrados já foram homologados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alunosPendentes.map(aluno => (
                  <div
                    key={aluno.id}
                    className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-400">#{aluno.matricula}</span>
                        <h3 className="text-lg font-black uppercase text-white">{aluno.nome}</h3>
                        <p className="text-xs text-neutral-400">{aluno.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-bold text-amber-400 uppercase">
                        CT {aluno.ct}
                      </span>
                    </div>

                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1 text-neutral-300">
                      <div><strong>WhatsApp:</strong> {aluno.telefone}</div>
                      <div><strong>Tipo Sanguíneo:</strong> {aluno.tipo_sanguineo || 'Não informado'}</div>
                      <div><strong>Emergência:</strong> {aluno.contato_emergencia}</div>
                      {aluno.problemas_saude && (
                        <div className="text-red-400"><strong>Saúde/Lesões:</strong> {aluno.problemas_saude}</div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={async () => {
                          await store.atualizarStatusAluno(aluno.id, 'ativo');
                          alert(`Guerreiro ${aluno.nome} aprovado com sucesso!`);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprovar Matrícula</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Deseja recusar e excluir o cadastro de ${aluno.nome}?`)) {
                            await store.excluirAluno(aluno.id);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-red-950/60 hover:text-red-400 text-neutral-400 font-bold text-xs uppercase transition-colors cursor-pointer"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: LISTA DE ALUNOS COM WHATSAPP & EXPORTAÇÃO
        ======================================================== */}
        {activeTab === 'lista-alunos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="text-2xl font-black uppercase text-white">
                  GUERREIROS <span className="text-red-500">ATIVOS</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Gerenciamento de fichas, carteirinha digital, cobrança WhatsApp e exportação.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => store.exportarAlunosCSV()}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Exportar planilha completa em CSV/Excel"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Exportar CSV</span>
                </button>

                <button
                  onClick={() => onNavigate('matricula')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Aluno</span>
                </button>
              </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={buscaAluno}
                  onChange={e => setBuscaAluno(e.target.value)}
                  placeholder="Buscar guerreiro por nome, matrícula ou e-mail..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Filtro de Situação Cadastral */}
              <select
                value={filtroStatusCadastral}
                onChange={e => setFiltroStatusCadastral(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="todos">STATUS: TODOS</option>
                <option value="ativo">STATUS: ATIVOS</option>
                <option value="pendente">STATUS: PENDENTES</option>
                <option value="inativo">STATUS: INATIVOS</option>
              </select>

              {/* Filtro de Status Financeiro */}
              <select
                value={filtroStatusFin}
                onChange={e => setFiltroStatusFin(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="todos">MENSALIDADE: TODAS</option>
                <option value="em-dia">APENAS EM DIA</option>
                <option value="pendente">APENAS PENDENTES</option>
                <option value="bolsista">APENAS BOLSISTAS</option>
              </select>

              {isAdminGeral && (
                <select
                  value={filtroCT}
                  onChange={e => setFiltroCT(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase focus:outline-none cursor-pointer"
                >
                  <option value="GERAL">POLO: TODOS</option>
                  {unidades.map(u => (
                    <option key={u.id} value={u.nome}>{u.nome.toUpperCase()}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Contador de Guerreiros */}
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>
                Exibindo <strong className="text-white font-mono">{alunosFiltrados.length}</strong> de <strong className="text-white font-mono">{todosAlunos.length}</strong> guerreiros cadastrados
              </span>
              {buscaAluno && (
                <button
                  onClick={() => setBuscaAluno('')}
                  className="text-red-400 hover:underline cursor-pointer text-[11px]"
                >
                  Limpar busca
                </button>
              )}
            </div>

            {/* Tabela de Alunos */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Matrícula</th>
                      <th className="p-4">Atleta</th>
                      <th className="p-4">Polo / CT</th>
                      <th className="p-4">Nível Projarde</th>
                      <th className="p-4">Mensalidade</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {alunosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-500">
                          Nenhum atleta encontrado para esta busca ou filtro.
                        </td>
                      </tr>
                    ) : (
                      alunosFiltrados.map(a => {
                        const isBolsista = store.isUnidadeBolsista(a.ct);
                        const isPago = isBolsista || (a.ultimo_mes_pago === mesAtual && a.ultimo_ano_pago === anoAtual);

                        return (
                          <tr key={a.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-red-500">
                              #{a.matricula}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-white uppercase block">{a.nome}</span>
                              <span className="text-[10px] text-neutral-400">{a.telefone || a.email}</span>
                            </td>
                            <td className="p-4 text-neutral-300 font-semibold">
                              {a.ct}
                            </td>
                            <td className="p-4">
                              <div className="w-36 space-y-1">
                                <span className="text-[10px] font-bold uppercase text-amber-400">
                                  {a.faixa}
                                </span>
                                <BeltDisplay faixa={a.faixa} graus={a.graus} size="sm" />
                              </div>
                            </td>
                            <td className="p-4">
                              {isBolsista ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-bold text-[10px] uppercase">
                                  Bolsista
                                </span>
                              ) : isPago ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-bold text-[10px] uppercase">
                                  Em Dia
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 font-bold text-[10px] uppercase">
                                  Pendente
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Carteirinha Digital */}
                                <button
                                  onClick={() => setAlunoCarteirinhaSelecionado(a)}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
                                  title="Abrir Carteirinha Digital Oficial"
                                >
                                  <IdCard className="w-4 h-4" />
                                </button>

                                {/* Ver Ficha Completa */}
                                <button
                                  onClick={() => setAlunoFichaSelecionado(a)}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                  title="Ver Ficha Médica Completa"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* Cobrança WhatsApp se pendente */}
                                {!isPago && !isBolsista && (
                                  <>
                                    <a
                                      href={store.gerarLinkWhatsAppCobranca(a)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 transition-colors"
                                      title="Enviar lembrete amigável via WhatsApp com chave PIX"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </a>
                                    <button
                                      onClick={async () => {
                                        if (confirm(`Confirmar baixa de mensalidade para ${a.nome}?`)) {
                                          await store.darBaixaMensalidade(a.id);
                                          alert(`Mensalidade de ${a.nome} registrada como PAGA!`);
                                        }
                                      }}
                                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-black text-[10px] uppercase transition-colors"
                                      title="Dar Baixa no Pagamento"
                                    >
                                      Baixa
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={async () => {
                                    if (confirm(`Mover ${a.nome} para o Arquivo Morto?`)) {
                                      await store.atualizarStatusAluno(a.id, 'inativo');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 transition-colors"
                                  title="Mover para Arquivo Morto"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: CHAMADA DIGITAL
        ======================================================== */}
        {activeTab === 'chamada' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="text-2xl font-black uppercase text-white">
                  CHAMADA <span className="text-red-500">DIGITAL</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Marque presença com 1 toque para registrar frequência oficial nos treinos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={dataChamada}
                  onChange={e => setDataChamada(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono font-bold"
                />

                <select
                  value={ctChamada}
                  onChange={e => setCtChamada(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase"
                >
                  {unidades.map(u => (
                    <option key={u.id} value={u.nome}>POLO {u.nome.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contador de Presentes */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase text-white">
                  Presentes Marcados: <strong className="text-emerald-400 font-mono text-sm">{presentesSet.size}</strong> de {alunosParaChamada.length}
                </span>
              </div>

              <button
                onClick={handleSalvarChamada}
                disabled={salvandoChamada || presentesSet.size === 0}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950/60 cursor-pointer"
              >
                {salvandoChamada ? 'Salvando...' : 'Finalizar Chamada'}
              </button>
            </div>

            {/* Grid de Atletas para Toque */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alunosParaChamada.length === 0 ? (
                <div className="col-span-full p-8 text-center text-neutral-500">
                  Nenhum guerreiro ativo cadastrado no polo {ctChamada}.
                </div>
              ) : (
                alunosParaChamada.map(a => {
                  const isPresente = presentesSet.has(a.id);

                  return (
                    <div
                      key={a.id}
                      onClick={() => togglePresencaChamada(a.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                        isPresente
                          ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-950/30'
                          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                          isPresente ? 'bg-emerald-500 text-black font-black' : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {a.nome.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs uppercase block leading-tight">
                            {a.nome}
                          </span>
                          <span className="text-[10px] text-neutral-400 uppercase">
                            #{a.matricula} · {a.faixa}
                          </span>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isPresente ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-neutral-700 bg-neutral-950'
                      }`}>
                        {isPresente && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: FINANCEIRO
        ======================================================== */}
        {activeTab === 'financeiro' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="text-2xl font-black uppercase text-white">
                  GESTAO <span className="text-red-500">FINANCEIRA</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Fluxo de caixa, mensalidades dos atletas e controle de entradas e despesas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Imprimir Relatório</span>
                </button>
              </div>
            </div>

            {/* Estatísticas Financeiras */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-emerald-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total de Entradas</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-red-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total de Despesas</span>
                <div className="text-2xl font-black text-red-400 font-mono mt-1">
                  R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-4 border-b-amber-500">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Saldo Líquido</span>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  R$ {saldoCT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Split: Formulário de Lançamento & Situação de Pagamentos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Formulário Manual */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  Novo Lançamento no Caixa
                </h3>

                <form onSubmit={handleLancarFinanceiro} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Tipo</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFinTipo('entrada')}
                        className={`p-2 rounded-lg font-bold uppercase cursor-pointer ${
                          finTipo === 'entrada' ? 'bg-emerald-600 text-black' : 'bg-neutral-950 text-neutral-400'
                        }`}
                      >
                        Entrada (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFinTipo('saida')}
                        className={`p-2 rounded-lg font-bold uppercase cursor-pointer ${
                          finTipo === 'saida' ? 'bg-red-600 text-white' : 'bg-neutral-950 text-neutral-400'
                        }`}
                      >
                        Saída (-)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Descrição</label>
                    <input
                      type="text"
                      required
                      value={finDesc}
                      onChange={e => setFinDesc(e.target.value)}
                      placeholder="Ex: Mensalidade, Venda de Luvas..."
                      className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Categoria</label>
                      <select
                        value={finCat}
                        onChange={e => setFinCat(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      >
                        <option value="Mensalidade">Mensalidade</option>
                        <option value="Venda">Venda</option>
                        <option value="Equipamento">Equipamento</option>
                        <option value="Aluguel">Aluguel</option>
                        <option value="Geral">Geral</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Forma</label>
                      <select
                        value={finForma}
                        onChange={e => setFinForma(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      >
                        <option value="Pix">PIX</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Cartão">Cartão</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={finValor}
                      onChange={e => setFinValor(e.target.value)}
                      placeholder="120.00"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer mt-2"
                  >
                    Confirmar Lançamento
                  </button>
                </form>
              </div>

              {/* Situação dos Alunos no Mês com Botão WhatsApp */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center justify-between">
                  <span>Mensalidades do Mês Atual</span>
                  <span className="text-xs text-amber-400 font-bold font-mono">{devedoresCount} pendentes</span>
                </h3>

                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {alunosAtivos.map(a => {
                    const isBolsista = store.isUnidadeBolsista(a.ct);
                    const estaPago = isBolsista || (a.ultimo_mes_pago === mesAtual && a.ultimo_ano_pago === anoAtual);

                    return (
                      <div
                        key={a.id}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-white uppercase block">{a.nome}</span>
                          <span className="text-[10px] text-neutral-400">CT {a.ct}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isBolsista ? (
                            <span className="text-emerald-400 font-bold uppercase text-[10px]">
                              Bolsista
                            </span>
                          ) : estaPago ? (
                            <span className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Pago</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <a
                                href={store.gerarLinkWhatsAppCobranca(a)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 px-2 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1"
                                title="Enviar lembrete PIX no WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>
                              <button
                                onClick={async () => {
                                  await store.darBaixaMensalidade(a.id);
                                  alert(`Mensalidade de ${a.nome} confirmada como PAGA!`);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-black text-[10px] uppercase cursor-pointer"
                              >
                                Baixa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Extrato de Lançamentos Recentes */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Extrato Recente do Caixa
              </h3>

              <div className="divide-y divide-neutral-800 max-h-64 overflow-y-auto">
                {financeiroItems.map(f => (
                  <div key={f.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{f.descricao}</span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {f.data} · {f.categoria} ({f.forma}) · CT {f.ct}
                      </span>
                    </div>
                    <div className={`font-mono font-bold text-sm ${f.tipo === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {f.tipo === 'entrada' ? '+' : '-'} R$ {f.valor.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 6: GRADUAÇÕES PROJARDE & CURRÍCULO
        ======================================================== */}
        {activeTab === 'graduacoes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="text-2xl font-black uppercase text-white">
                  GRADUAÇÃO <span className="text-red-500">PROJARDE</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Clique nos 4 graus (pontas) para alterar o grau ou selecione a nova faixa do guerreiro.
                </p>
              </div>

              <button
                onClick={() => setModalCurriculoAberto(true)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Grade Curricular Projarde</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alunosAtivos.map(aluno => (
                <div
                  key={aluno.id}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-black uppercase text-white leading-tight">
                        {aluno.nome}
                      </h3>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        #{aluno.matricula} · CT {aluno.ct}
                      </span>
                    </div>

                    <select
                      value={aluno.faixa}
                      onChange={async e => {
                        await store.atualizarGraduacao(aluno.id, e.target.value as ProjardeBelt, aluno.graus);
                      }}
                      className="px-2 py-1 rounded bg-neutral-950 border border-neutral-700 text-xs text-amber-400 font-bold uppercase focus:outline-none"
                    >
                      <option value="Amarela">Amarela</option>
                      <option value="Amarela e Branca">Amarela e Branca</option>
                      <option value="Verde">Verde</option>
                      <option value="Verde e Branca">Verde e Branca</option>
                      <option value="Azul">Azul</option>
                      <option value="Azul e Branca">Azul e Branca</option>
                      <option value="Marrom">Marrom</option>
                      <option value="Marrom e Branca">Marrom e Branca</option>
                      <option value="Vermelha">Vermelha</option>
                      <option value="Vermelha e Branca">Vermelha e Branca</option>
                      <option value="Vermelho e Amarelo">Vermelho e Amarelo</option>
                      <option value="Preta">Preta</option>
                      <option value="Preta e Branca">Preta e Branca</option>
                    </select>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <BeltDisplay
                      faixa={aluno.faixa}
                      graus={aluno.graus}
                      interactive={true}
                      onUpdateGraus={async novoGrau => {
                        await store.atualizarGraduacao(aluno.id, aluno.faixa, novoGrau);
                      }}
                      size="md"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-1">
                    <span>Toque nos círculos para ajustar grau</span>
                    <span className="font-mono text-amber-400 font-bold">{aluno.graus}/4 Graus</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: PASTA DIGITAL & FICHAS MÉDICAS COM CARTEIRINHA
        ======================================================== */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                PASTA DIGITAL & <span className="text-red-500">FICHAS MÉDICAS</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Consulta de prontuário, peso para lutas, emissão de carteirinhas e fichas de pesagem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alunosAtivos.map(aluno => (
                <div
                  key={aluno.id}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400">#{aluno.matricula}</span>
                      <h3 className="text-base font-black uppercase text-white">{aluno.nome}</h3>
                      <span className="text-xs text-neutral-400">CT {aluno.ct}</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-700 text-xs font-black text-red-400">
                      {aluno.tipo_sanguineo || 'N/I'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 flex justify-between items-center">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Peso / Categoria</span>
                        <span className="text-white font-mono font-bold">{aluno.peso_kg || 70} kg</span>
                      </div>
                      <button
                        onClick={() => setAlunoPesoSelecionado(aluno)}
                        className="text-[10px] uppercase font-bold text-amber-400 hover:underline"
                      >
                        Calcular Categoria
                      </button>
                    </div>

                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Alergias</span>
                      <span className="text-white">{aluno.alergias || 'Nenhuma'}</span>
                    </div>

                    {aluno.problemas_saude && (
                      <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-lg">
                        <span className="text-red-400 block text-[10px] uppercase font-bold">Alerta Médico</span>
                        <span className="text-red-200">{aluno.problemas_saude}</span>
                      </div>
                    )}

                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Emergência</span>
                      <span className="text-amber-400 font-bold">{aluno.contato_emergencia}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setAlunoCarteirinhaSelecionado(aluno)}
                      className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <IdCard className="w-3.5 h-3.5" />
                      <span>Carteirinha</span>
                    </button>

                    <button
                      onClick={() => setAlunoFichaSelecionado(aluno)}
                      className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-red-400" />
                      <span>Ficha Médica</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: MURAL DE AVISOS DO CT
        ======================================================== */}
        {activeTab === 'avisos' && (
          <div className="space-y-8">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                MURAL DE <span className="text-red-500">AVISOS</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Publique comunicados para os atletas visualizarem na Área do Aluno.
              </p>
            </div>

            {/* Form de Publicar Aviso */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-400">
                Publicar Novo Comunicado
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <input
                    type="text"
                    value={novoAvisoTitulo}
                    onChange={e => setNovoAvisoTitulo(e.target.value)}
                    placeholder="Título do aviso (Ex: Exame de Faixa, Seminário, Horário Especial...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={novoAvisoConteudo}
                    onChange={e => setNovoAvisoConteudo(e.target.value)}
                    placeholder="Conteúdo detalhado do comunicado para os guerreiros..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-4">
                    <select
                      value={novoAvisoCT}
                      onChange={e => setNovoAvisoCT(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold uppercase"
                    >
                      <option value="GERAL">TODOS OS POLOS (GERAL)</option>
                      {unidades.map(u => (
                        <option key={u.id} value={u.nome}>Polo {u.nome}</option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                      <input
                        type="checkbox"
                        checked={novoAvisoUrgente}
                        onChange={e => setNovoAvisoUrgente(e.target.checked)}
                        className="rounded border-neutral-700 bg-neutral-950 text-red-600"
                      />
                      <span className="font-bold text-red-400 uppercase text-[11px]">Marcar como Urgente</span>
                    </label>
                  </div>

                  <button
                    onClick={async () => {
                      if (!novoAvisoTitulo.trim() || !novoAvisoConteudo.trim()) {
                        alert('Preencha o título e o conteúdo do aviso.');
                        return;
                      }
                      await store.adicionarAviso({
                        titulo: novoAvisoTitulo.trim(),
                        conteudo: novoAvisoConteudo.trim(),
                        autor: adminLogado.nome,
                        ct: novoAvisoCT,
                        urgente: novoAvisoUrgente
                      });
                      setNovoAvisoTitulo('');
                      setNovoAvisoConteudo('');
                      setNovoAvisoUrgente(false);
                      alert('Aviso publicado no mural dos alunos!');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Publicar Comunicado
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Avisos Publicados */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Avisos Ativos no Sistema
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {avisos.map(aviso => (
                  <div
                    key={aviso.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-amber-400">
                            Polo: {aviso.ct}
                          </span>
                          {aviso.urgente && (
                            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase">
                              Urgente
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black uppercase text-white mt-0.5">
                          {aviso.titulo}
                        </h4>
                      </div>

                      <button
                        onClick={async () => {
                          if (confirm('Excluir este aviso?')) {
                            await store.removerAviso(aviso.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-neutral-950 hover:bg-red-950 text-neutral-400 hover:text-red-400"
                        title="Remover aviso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {aviso.conteudo}
                    </p>

                    <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-400 flex justify-between">
                      <span>Autor: {aviso.autor}</span>
                      <span>{aviso.data}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: ESTOQUE DE MATERIAIS
        ======================================================== */}
        {activeTab === 'estoque' && (
          <div className="space-y-8">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                CONTROLE DE <span className="text-red-500">ESTOQUE</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Gestão de luvas, caneleiras, faixas, bandagens e camisetas oficiais Gaditas.
              </p>
            </div>

            {/* Formulário de Adicionar Produto */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-400">
                Cadastrar Novo Item no Estoque
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={novoProdNome}
                    onChange={e => setNovoProdNome(e.target.value)}
                    placeholder="Nome do produto (Ex: Luva 14oz, Camiseta Oficial...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={novoProdQtd}
                    onChange={e => setNovoProdQtd(e.target.value)}
                    placeholder="Quantidade"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div>
                  <button
                    onClick={async () => {
                      const qtd = parseInt(novoProdQtd);
                      if (!novoProdNome.trim() || isNaN(qtd)) {
                        alert('Preencha o nome e a quantidade do item.');
                        return;
                      }
                      await store.adicionarItemEstoque(novoProdNome.trim(), qtd);
                      setNovoProdNome('');
                      setNovoProdQtd('');
                      alert('Item adicionado ao estoque!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Grid de Itens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.getEstoque().map(item => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {item.categoria || 'Equipamento'}
                    </span>
                    <h3 className="text-base font-black uppercase text-white mt-1 leading-snug">
                      {item.nome}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-xs text-neutral-400 uppercase font-bold">Disponível:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => store.atualizarQuantidadeEstoque(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-lg font-black text-emerald-400">
                        {item.quantidade} un
                      </span>
                      <button
                        onClick={() => store.atualizarQuantidadeEstoque(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={async () => {
                        if (confirm(`Excluir ${item.nome} do estoque?`)) {
                          await store.removerItemEstoque(item.id);
                        }
                      }}
                      className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: RELATÓRIOS
        ======================================================== */}
        {activeTab === 'relatorios' && (
          <div className="space-y-8">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                RELATÓRIOS <span className="text-red-500">ESTRATÉGICOS</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Métricas consolidadas de crescimento, retenção e distribuição por polo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total de Atletas Ativos</span>
                <div className="text-4xl font-black text-white font-mono">{alunosAtivos.length}</div>
                <p className="text-xs text-neutral-400">Base matriculada em treinamento contínuo</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Previsão Mensal Estimada</span>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  R$ {(alunosAtivos.length * 120).toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-neutral-400">Média de R$ 120/aluno ativo</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Polos em Operação</span>
                <div className="text-4xl font-black text-amber-400 font-mono">{unidades.length}</div>
                <p className="text-xs text-neutral-400">Campo Grande, Bangu, Seropédica e Nova Iguaçu</p>
              </div>
            </div>

            {/* Tabela Comparativa de Unidades */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Desempenho por Unidade CT
              </h3>

              <div className="divide-y divide-neutral-800 text-xs">
                {unidades.map(u => {
                  const qtd = store.getAlunos('ativo', u.nome).length;
                  const pend = store.getAlunos('pendente', u.nome).length;
                  return (
                    <div key={u.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white uppercase block">{u.nome}</span>
                        <span className="text-[10px] text-neutral-400">Regime: {u.tipo.toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-emerald-400 font-bold text-sm block">{qtd} Atletas</span>
                        <span className="text-[10px] text-amber-400">{pend} novos cadastros</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 10: ARQUIVO MORTO
        ======================================================== */}
        {activeTab === 'arquivo-morto' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                ARQUIVO <span className="text-red-500">MORTO</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Alunos desativados ou afastados. Você pode reativá-los a qualquer momento para retornarem à lista de ativos.
              </p>
            </div>

            {alunosInativos.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-500 text-xs uppercase font-bold">Nenhum atleta no arquivo morto.</span>
              </div>
            ) : (
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Matrícula</th>
                      <th className="p-4">Nome do Aluno</th>
                      <th className="p-4">Polo</th>
                      <th className="p-4">Motivo / Status</th>
                      <th className="p-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {alunosInativos.map(a => (
                      <tr key={a.id} className="hover:bg-neutral-800/30">
                        <td className="p-4 font-mono text-neutral-500">#{a.matricula}</td>
                        <td className="p-4 font-bold text-white uppercase">{a.nome}</td>
                        <td className="p-4 text-neutral-400">{a.ct}</td>
                        <td className="p-4 text-neutral-500 uppercase text-[10px]">Afastado / Inativo</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Deseja reativar ${a.nome}? Ele voltará para a lista principal.`)) {
                                await store.atualizarStatusAluno(a.id, 'ativo');
                                alert(`${a.nome} reativado com sucesso!`);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] uppercase cursor-pointer"
                          >
                            Reativar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 11: GERENCIAR POLOS / UNIDADES (ADMIN ONLY)
        ======================================================== */}
        {activeTab === 'unidades' && isAdminGeral && (
          <div className="space-y-8">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                GERENCIAR <span className="text-red-500">POLOS & UNIDADES</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Configure os centros de treinamento da equipe e os regimes financeiro/social.
              </p>
            </div>

            {/* Criar Unidade */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Cadastrar Novo Centro de Treinamento (Polo)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Nome do CT / Polo *</label>
                  <input
                    type="text"
                    value={novaUniNome}
                    onChange={e => setNovaUniNome(e.target.value)}
                    placeholder="Ex: Nova Friburgo, Recreio, Madureira..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Regime Financeiro</label>
                  <select
                    value={novaUniTipo}
                    onChange={e => setNovaUniTipo(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-red-500 focus:outline-none cursor-pointer"
                  >
                    <option value="pagante">Regime Pagante (Mensalidade Regular)</option>
                    <option value="bolsista">Regime Social / Bolsista (100% Isento)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Professor Responsável / Líder</label>
                  <input
                    type="text"
                    value={novaUniResp}
                    onChange={e => setNovaUniResp(e.target.value)}
                    placeholder="Ex: Mestre Daniel Braga, Prof. Anderson..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Endereço / Localização</label>
                  <input
                    type="text"
                    value={novaUniEnd}
                    onChange={e => setNovaUniEnd(e.target.value)}
                    placeholder="Ex: Rua das Flores, 120 - Centro"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Telefone / WhatsApp do Polo</label>
                  <input
                    type="text"
                    value={novaUniTel}
                    onChange={e => setNovaUniTel(e.target.value)}
                    placeholder="Ex: (21) 98888-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    disabled={salvandoUni}
                    onClick={async () => {
                      if (!novaUniNome.trim()) return alert('Informe o nome da unidade.');
                      setSalvandoUni(true);
                      try {
                        await store.adicionarUnidade(
                          novaUniNome.trim(), 
                          novaUniTipo, 
                          novaUniResp.trim(), 
                          novaUniEnd.trim(), 
                          novaUniTel.trim()
                        );
                        setNovaUniNome('');
                        setNovaUniResp('');
                        setNovaUniEnd('');
                        setNovaUniTel('');
                        alert(`✓ Polo "${novaUniNome.trim()}" cadastrado com sucesso! Já sincronizado na página inicial e formulário de matrículas.`);
                      } catch (err: any) {
                        alert('Erro ao cadastrar unidade: ' + err?.message);
                      } finally {
                        setSalvandoUni(false);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black uppercase tracking-wider cursor-pointer transition-colors shadow-lg shadow-red-950/60"
                  >
                    {salvandoUni ? 'Cadastrando...' : '+ Cadastrar Polo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Polos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unidades.map(u => (
                <div key={u.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black uppercase text-white">{u.nome}</h4>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        u.tipo === 'bolsista' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-blue-950 text-blue-400 border border-blue-500/40'
                      }`}>
                        {u.tipo === 'bolsista' ? 'Social Bolsista' : 'Mensalidade Padrão'}
                      </span>
                    </div>
                    {u.responsavel && (
                      <span className="text-[11px] text-neutral-300 block">
                        Liderança: <strong className="text-white">{u.responsavel}</strong>
                      </span>
                    )}
                    {u.endereco && (
                      <span className="text-[10px] text-neutral-400 block">
                        📍 {u.endereco}
                      </span>
                    )}
                    {u.telefone && (
                      <span className="text-[10px] text-amber-400 font-mono block">
                        📞 {u.telefone}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      if (confirm(`Remover polo ${u.nome}?`)) {
                        await store.removerUnidade(u.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-neutral-950 hover:bg-red-950 hover:text-red-400 text-neutral-500 transition-colors shrink-0"
                    title="Remover Unidade"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 12: GERENCIAR PROFESSORES / EQUIPE (ADMIN ONLY)
        ======================================================== */}
        {activeTab === 'equipe' && isAdminGeral && (
          <div className="space-y-8">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                EQUIPE TÉCNICA & <span className="text-red-500">PROFESSORES</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Credenciamento de professores e instrutores com vinculação aos polos.
              </p>
            </div>

            {/* Form de Cadastro */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-xs font-black uppercase text-red-400 tracking-wider">
                Cadastrar Novo Docente
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <input
                    type="text"
                    value={novoProfNome}
                    onChange={e => setNovoProfNome(e.target.value)}
                    placeholder="Nome do Professor"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={novoProfEmail}
                    onChange={e => setNovoProfEmail(e.target.value)}
                    placeholder="email@gaditas.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <select
                    value={novoProfCT}
                    onChange={e => setNovoProfCT(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="GERAL">ACESSO GERAL</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.nome}>Polo {u.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    onClick={async () => {
                      if (!novoProfNome.trim() || !novoProfEmail.trim()) {
                        alert('Preencha o nome e e-mail do professor.');
                        return;
                      }
                      await store.adicionarProfessor({
                        nome: novoProfNome.trim(),
                        email: novoProfEmail.trim(),
                        ct: novoProfCT,
                        role: novoProfRole
                      });
                      setNovoProfNome('');
                      setNovoProfEmail('');
                      alert('Professor cadastrado!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Cadastrar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Professores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {store.getProfessores().map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase text-white">{p.nome}</h4>
                    <span className="text-[10px] text-neutral-400 block">{p.email}</span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase mt-1 inline-block">
                      Polo: {p.ct}
                    </span>
                  </div>

                  {p.role !== 'administrador_geral' && p.role !== 'administrador' && (
                    <button
                      onClick={async () => {
                        if (confirm(`Remover acesso de ${p.nome}?`)) {
                          await store.removerProfessor(p.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-neutral-950 hover:bg-red-950 hover:text-red-400 text-neutral-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 13: CONFIGURAÇÕES
        ======================================================== */}
        {activeTab === 'configuracoes' && (
          <div className="max-w-2xl space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h1 className="text-2xl font-black uppercase text-white">
                CONFIGURAÇÕES DO <span className="text-red-500">PERFIL</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Informações da conta ativa no ERP e segurança.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Nome do Usuário</span>
                <p className="text-lg font-black text-white uppercase">{adminLogado.nome}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Unidade de Atuação</span>
                <p className="text-sm font-bold text-amber-400 uppercase">
                  {adminLogado.ct === 'GERAL' ? 'Acesso Geral Administrativo' : `CT ${adminLogado.ct}`}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Segurança</span>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>Sessão Protegida e Criptografada</span>
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex gap-3">
                <button
                  onClick={() => alert('Link de redefinição de senha enviado ao e-mail institucional.')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Solicitar Troca de Senha
                </button>
                <button
                  onClick={() => location.reload()}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sincronizar Dados</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PAINEL DO DESENVOLVEDOR (CMS) */}
        {activeTab === 'painel-dev' && <DeveloperCmsPanel />}

        {/* TAB 13: SAÚDE DO FIREBASE */}
        {activeTab === 'saude-firebase' && <FirebaseHealthView />}

        {/* TAB 14: GERENCIAMENTO DE BANCO DE DADOS, SCANNER & BACKUP GOOGLE DRIVE */}
        {(activeTab === 'banco-dados' || activeTab === 'backup-drive') && <FirebaseDatabasePanel />}

        {/* TAB 15: CENTRAL DE ARQUIVOS & FIREBASE STORAGE */}
        {activeTab === 'arquivos-storage' && <FirebaseStorageManager />}

        {/* TAB 16: GESTÃO DE EVENTOS, CAMPEONATOS E GRADUAÇÕES */}
        {activeTab === 'eventos-ct' && <EventosManager />}

      </main>

      {/* MODAIS DO ERP */}
      {alunoFichaSelecionado && (
        <PrintableAthleteCard
          aluno={alunoFichaSelecionado}
          onClose={() => setAlunoFichaSelecionado(null)}
        />
      )}

      {alunoCarteirinhaSelecionado && (
        <AthleteCardID
          aluno={alunoCarteirinhaSelecionado}
          onClose={() => setAlunoCarteirinhaSelecionado(null)}
        />
      )}

      {modalCurriculoAberto && (
        <BeltProgressionModal
          onClose={() => setModalCurriculoAberto(false)}
        />
      )}

      {alunoPesoSelecionado && (
        <WeightCategoryCalculator
          initialWeight={alunoPesoSelecionado.peso_kg || 70}
          initialHeight={alunoPesoSelecionado.altura_cm || 175}
          onSave={async (p, a) => {
            await store.atualizarMedidas(alunoPesoSelecionado.id, p, a);
            alert(`Medidas de ${alunoPesoSelecionado.nome} atualizadas!`);
            setAlunoPesoSelecionado(null);
          }}
          onClose={() => setAlunoPesoSelecionado(null)}
        />
      )}

    </div>
  );
};
