import React, { useState, useEffect, useRef } from 'react';
import { store } from '../services/store';
import { 
  UsuarioSistema, 
  UserRole, 
  Aluno, 
  PaginaCustomizada, 
  MenuItemSite,
  GlobalScreensConfig,
  Unidade
} from '../types';
import { 
  Code, 
  Settings, 
  Palette, 
  Globe, 
  Users, 
  ShieldAlert, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  LogOut, 
  Eye, 
  Save, 
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Shield,
  Layers,
  FileText,
  Menu,
  Bell,
  Check,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Award,
  Flame,
  Calendar,
  Clock,
  MessageCircle,
  HelpCircle,
  RotateCcw,
  Maximize2,
  CheckCircle
} from 'lucide-react';
import heroRingImg from '../assets/images/gaditas_hero_ring_1791983055353.jpg';
import lionEmblemImg from '../assets/images/gaditas_lion_emblem_1791983074366.jpg';

export const DeveloperCmsPanel: React.FC = () => {
  // Configurações em tempo real do Firestore (cms_settings/global_screens)
  const [screensConfig, setScreensConfig] = useState<GlobalScreensConfig>(() => store.getGlobalScreens());
  const [localScreens, setLocalScreens] = useState<GlobalScreensConfig>(() => store.getGlobalScreens());
  
  // Status da Conexão e Última Alteração
  const [cmsStatus, setCmsStatus] = useState(() => store.getCmsStatus());
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [modalConfirmarRestauracao, setModalConfirmarRestauracao] = useState<string | null>(null);

  // Navegação do Editor (Lado Esquerdo)
  const [activeEditorTab, setActiveEditorTab] = useState<
    'home' | 'sobre' | 'matricula' | 'aluno' | 'global' | 'permissoes' | 'paginas' | 'usuarios' | 'unidades'
  >('home');

  // Preview (Lado Direito)
  const [previewScreen, setPreviewScreen] = useState<'home' | 'sobre' | 'matricula' | 'aluno'>('home');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor-only' | 'preview-only'>('split');

  // Controle de Permissões da Equipe (Admin Geral)
  const [adminsGerais, setAdminsGerais] = useState<string[]>(() => store.getAdminsGerais());
  const [novoAdminEmail, setNovoAdminEmail] = useState('');
  const [salvandoAdmin, setSalvandoAdmin] = useState(false);

  // Gestão de Usuários
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>(() => store.getUsuarios());
  const [alunos, setAlunos] = useState<Aluno[]>(() => store.getAlunos());
  const [buscaUsuario, setBuscaUsuario] = useState('');
  const [filtroRole, setFiltroRole] = useState<string>('todos');

  // Modais de Usuários
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoRole, setNovoRole] = useState<UserRole>('professor');
  const [novoCT, setNovoCT] = useState('Campo Grande');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [modalTrocaSenha, setModalTrocaSenha] = useState<{ aberto: boolean; userId: string; nome: string } | null>(null);
  const [novaSenhaInput, setNovaSenhaInput] = useState('');
  const [modalTrocaEmail, setModalTrocaEmail] = useState<{ aberto: boolean; userId: string; nome: string; emailAtual: string } | null>(null);
  const [novoEmailInput, setNovoEmailInput] = useState('');

  // Páginas Customizadas
  const [paginas, setPaginas] = useState<PaginaCustomizada[]>(() => store.getPaginas());
  const [modalNovaPagina, setModalNovaPagina] = useState(false);
  const [novaPaginaTitulo, setNovaPaginaTitulo] = useState('');
  const [novaPaginaSlug, setNovaPaginaSlug] = useState('');
  const [novaPaginaConteudo, setNovaPaginaConteudo] = useState('');

  // Polos & Centros de Treinamento (CTs) - 100% REATIVO COM FIREBASE
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [novaUniNome, setNovaUniNome] = useState('');
  const [novaUniTipo, setNovaUniTipo] = useState<'pagante' | 'bolsista'>('pagante');
  const [novaUniResp, setNovaUniResp] = useState('');
  const [novaUniEnd, setNovaUniEnd] = useState('');
  const [novaUniTel, setNovaUniTel] = useState('');
  const [salvandoUni, setSalvandoUni] = useState(false);

  // Controle de edição pendente para sincronia perfeita com Firestore
  const [temEdicaoPendente, setTemEdicaoPendente] = useState(false);

  // Escuta em tempo real do Store / Firestore onSnapshot
  useEffect(() => {
    const unsub = store.subscribe(() => {
      const gs = store.getGlobalScreens();
      setScreensConfig(gs);
      if (!temEdicaoPendente) {
        setLocalScreens(gs);
      }
      setCmsStatus(store.getCmsStatus());
      setAdminsGerais(store.getAdminsGerais());
      setUsuarios([...store.getUsuarios()]);
      setAlunos([...store.getAlunos()]);
      setPaginas([...store.getPaginas()]);
      setUnidades([...store.getUnidades()]);
    });
    return unsub;
  }, [temEdicaoPendente]);

  // Alinha a aba do preview com a aba do editor quando mudar
  useEffect(() => {
    if (activeEditorTab === 'home' || activeEditorTab === 'unidades') setPreviewScreen('home');
    else if (activeEditorTab === 'sobre') setPreviewScreen('sobre');
    else if (activeEditorTab === 'matricula') setPreviewScreen('matricula');
    else if (activeEditorTab === 'aluno') setPreviewScreen('aluno');
  }, [activeEditorTab]);

  // Atualização de campos no estado local para renderização instantânea no Preview
  const handleUpdateField = <T extends keyof GlobalScreensConfig>(
    section: T,
    field: keyof GlobalScreensConfig[T],
    value: any
  ) => {
    setTemEdicaoPendente(true);
    setLocalScreens(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  // Salvar no Firebase Firestore (setDoc merge: true + serverTimestamp + updatedBy)
  const handleSalvarNoFirebase = async () => {
    setSalvando(true);
    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      await store.salvarGlobalScreens(localScreens);
      setTemEdicaoPendente(false);
      setMensagemSucesso('Alterações salvas no Firebase Firestore e aplicadas em todas as telas em tempo real!');
      setTimeout(() => setMensagemSucesso(null), 5000);
    } catch (err: any) {
      setMensagemErro(err?.message || 'Falha ao salvar no Firebase Firestore. Verifique suas regras de segurança.');
      setTimeout(() => setMensagemErro(null), 7000);
    } finally {
      setSalvando(false);
    }
  };

  // Cadastrar Novo CT diretamente pelo CMS
  const handleCadastrarCT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaUniNome.trim()) {
      alert('Informe o nome do CT / Polo.');
      return;
    }
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
      setUnidades([...store.getUnidades()]);
      setMensagemSucesso(`✓ Polo "${novaUniNome.trim()}" cadastrado com sucesso e sincronizado no Firebase em tempo real!`);
      setTimeout(() => setMensagemSucesso(null), 5000);
    } catch (err: any) {
      alert('Erro ao cadastrar CT: ' + err?.message);
    } finally {
      setSalvandoUni(false);
    }
  };

  // Remover CT
  const handleRemoverCT = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o Polo "${nome}"? Esta alteração será refletida em todas as telas.`)) {
      try {
        await store.removerUnidade(id);
        setUnidades([...store.getUnidades()]);
        setMensagemSucesso(`Polo "${nome}" removido do sistema.`);
        setTimeout(() => setMensagemSucesso(null), 3000);
      } catch (err: any) {
        alert('Erro ao remover polo: ' + err?.message);
      }
    }
  };

  // Restaurar padrão de fábrica da tela
  const handleRestaurarPadrao = async (tela: 'home' | 'sobre' | 'matricula' | 'aluno' | 'global' | 'todas') => {
    setSalvando(true);
    try {
      await store.restaurarPadraoGlobalScreens(tela);
      setLocalScreens(store.getGlobalScreens());
      setMensagemSucesso(`Padrão original da tela ${tela.toUpperCase()} restaurado com sucesso no Firebase!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      setMensagemErro('Erro ao restaurar padrão: ' + err?.message);
    } finally {
      setSalvando(false);
      setModalConfirmarRestauracao(null);
    }
  };

  // Adicionar Administrador Geral no Firestore
  const handleAdicionarAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAdminEmail.trim() || !novoAdminEmail.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }
    setSalvandoAdmin(true);
    try {
      await store.adicionarAdminGeral(novoAdminEmail.trim());
      setNovoAdminEmail('');
      setMensagemSucesso(`Usuário ${novoAdminEmail} agora é Administrador Geral com permissão total!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao adicionar administrador.');
    } finally {
      setSalvandoAdmin(false);
    }
  };

  // Remover Administrador Geral
  const handleRemoverAdmin = async (email: string) => {
    if (!confirm(`Remover as permissões de Administrador Geral para ${email}?`)) return;
    try {
      await store.removerAdminGeral(email);
      setMensagemSucesso(`Permissão de Administrador Geral revogada para ${email}.`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao remover permissão.');
    }
  };

  // Ações de Usuário
  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoEmail.trim()) {
      alert('Preencha nome e e-mail válidos.');
      return;
    }
    try {
      await store.criarUsuario({
        nome: novoNome.trim(),
        email: novoEmail.trim(),
        senha: novaSenha || undefined,
        role: novoRole,
        ct: novoCT,
        telefone: novoTelefone.trim()
      });
      setModalNovoUsuario(false);
      setNovoNome('');
      setNovoEmail('');
      setNovaSenha('');
      setMensagemSucesso(`Usuário ${novoNome} cadastrado com sucesso!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao criar conta.');
    }
  };

  const handleSalvarTrocaSenha = async () => {
    if (!modalTrocaSenha || novaSenhaInput.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    try {
      await store.alterarSenhaUsuario(modalTrocaSenha.userId, novaSenhaInput);
      setModalTrocaSenha(null);
      setNovaSenhaInput('');
      setMensagemSucesso(`Senha de ${modalTrocaSenha.nome} alterada com sucesso!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao alterar senha.');
    }
  };

  const handleSalvarTrocaEmail = async () => {
    if (!modalTrocaEmail || !novoEmailInput.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }
    try {
      await store.alterarEmailUsuario(modalTrocaEmail.userId, novoEmailInput);
      setModalTrocaEmail(null);
      setNovoEmailInput('');
      setMensagemSucesso(`E-mail atualizado com sucesso!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao alterar e-mail.');
    }
  };

  const handleToggleBloqueio = async (u: UsuarioSistema) => {
    try {
      await store.bloquearUsuario(u.id, !u.bloqueado);
      setMensagemSucesso(`Status de acesso de ${u.nome} alterado.`);
      setTimeout(() => setMensagemSucesso(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao alterar bloqueio.');
    }
  };

  const handleCriarPagina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPaginaTitulo.trim() || !novaPaginaSlug.trim()) {
      alert('Preencha título e slug da página.');
      return;
    }
    try {
      await store.criarPagina({
        titulo: novaPaginaTitulo.trim(),
        slug: novaPaginaSlug.trim(),
        conteudo: novaPaginaConteudo.trim(),
        visivelMenu: true,
        publicada: true,
        autor: store.currentUser?.email || 'admin_geral'
      });
      setModalNovaPagina(false);
      setNovaPaginaTitulo('');
      setNovaPaginaSlug('');
      setNovaPaginaConteudo('');
      setMensagemSucesso('Nova página customizada publicada no CMS!');
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao criar página.');
    }
  };

  // Helper para focar campo
  const focarCampo = (fieldKey: string) => {
    setFocusedField(fieldKey);
    const el = document.getElementById(`editor-input-${fieldKey}`);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Preview Highlight Wrapper
  const HighlightedElement: React.FC<{
    fieldKey: string;
    label: string;
    children: React.ReactNode;
    className?: string;
  }> = ({ fieldKey, label, children, className = '' }) => {
    const isFocused = focusedField === fieldKey;
    return (
      <div
        onClick={() => focarCampo(fieldKey)}
        className={`group relative cursor-pointer transition-all duration-300 rounded-xl ${className} ${
          isFocused 
            ? 'ring-4 ring-amber-400 bg-amber-500/10 shadow-2xl scale-[1.01] z-30' 
            : 'hover:ring-2 hover:ring-red-500/80 hover:bg-red-500/5'
        }`}
        title={`Clique para editar: ${label}`}
      >
        {isFocused && (
          <div className="absolute -top-3 left-3 bg-amber-400 text-black font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-40 animate-pulse">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Editando: {label}</span>
          </div>
        )}
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* ============================================================== */}
      {/* BARRA FIXA DE CONTROLE DO FIREBASE & PUBLICAÇÃO (SUPERIOR)      */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#0d0d10]/95 backdrop-blur-md border-b border-neutral-800 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Lado Esquerdo: Identificação & Status de Conexão */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-red-950/50">
              <div className="w-full h-full bg-neutral-950 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase text-white tracking-wide">
                  Painel do Desenvolvedor & CMS Visual
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-black uppercase text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Conectado em Tempo Real
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 flex items-center gap-2">
                <span>Última alteração: <strong className="text-neutral-200">{cmsStatus.updatedBy}</strong></span>
                {cmsStatus.updatedAt && (
                  <>
                    <span>•</span>
                    <span className="font-mono">{cmsStatus.updatedAt}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Lado Direito: Modos de Visualização & Botões de Ação */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Seletor de Modo de Visualização */}
            <div className="hidden lg:flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setLayoutMode('split')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                  layoutMode === 'split' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tela Dividida
              </button>
              <button
                onClick={() => setLayoutMode('editor-only')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                  layoutMode === 'editor-only' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Só Editor
              </button>
              <button
                onClick={() => setLayoutMode('preview-only')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                  layoutMode === 'preview-only' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Só Preview
              </button>
            </div>

            {/* Botão Restaurar Padrão */}
            <button
              onClick={() => setModalConfirmarRestauracao(activeEditorTab)}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restaurar os textos e parâmetros de fábrica da tela"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Padrão</span>
            </button>

            {/* BOTÃO PRINCIPAL: SALVAR E PUBLICAR NO FIREBASE */}
            <button
              onClick={handleSalvarNoFirebase}
              disabled={salvando}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              {salvando ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Publicando no Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar e Publicar no Firebase</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* ALERTA VISUAL DE SUCESSO OU ERRO */}
        {mensagemSucesso && (
          <div className="mt-2.5 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-center gap-3 shadow-xl animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1">{mensagemSucesso}</div>
          </div>
        )}

        {mensagemErro && (
          <div className="mt-2.5 p-3 rounded-xl bg-red-950/90 border border-red-500/80 text-red-200 text-xs font-bold flex items-center gap-3 shadow-xl animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <div className="flex-1">{mensagemErro}</div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* CORPO PRINCIPAL: TELA DIVIDIDA (EDITOR À ESQ. + PREVIEW À DIR.) */}
      {/* ============================================================== */}
      <div className={`grid gap-8 ${
        layoutMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
      }`}>
        
        {/* ============================================================ */}
        {/* LADO ESQUERDO: EDITOR EXPLICATIVO COM ABAS DE TELAS         */}
        {/* ============================================================ */}
        {layoutMode !== 'preview-only' && (
          <div className={`${layoutMode === 'split' ? 'lg:col-span-6' : 'max-w-4xl mx-auto w-full'} space-y-6`}>
            
            {/* ABAS DO EDITOR */}
            <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
              <button
                onClick={() => setActiveEditorTab('home')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'home'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>🏠 Início (Home)</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('sobre')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'sobre'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>🥋 Sobre Nós</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('matricula')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'matricula'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>📝 Matrícula</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('aluno')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'aluno'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>👤 Área do Aluno</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('global')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'global'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>🌐 Identidade & PIX</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('permissoes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'permissoes'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-neutral-900 text-amber-400 hover:text-white hover:bg-neutral-800 border border-amber-500/30'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Permissões da Equipe</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('paginas')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'paginas'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>📄 Páginas CMS</span>
              </button>

              <button
                onClick={() => setActiveEditorTab('usuarios')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'usuarios'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Gestão de Usuários</span>
              </button>

              <button
                onClick={() => {
                  setActiveEditorTab('unidades');
                  setPreviewScreen('home');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeEditorTab === 'unidades'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Polos & CTs</span>
              </button>
            </div>

            {/* PAINEL EXPLICATIVO COM OS CAMPOS DA ABA ATIVA */}
            <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-6">
              
              {/* ====================================================== */}
              {/* ABA 1: TELA INICIAL (HOME)                             */}
              {/* ====================================================== */}
              {activeEditorTab === 'home' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <span>Configurações da Tela Inicial</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">Home</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Edite os textos, faixas de números e chamadas de ação da primeira página vista por todos os visitantes.
                    </p>
                  </div>

                  {/* Campo: Badge Topo */}
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      1. Tag / Emblema no Topo do Hero
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Este texto aparece em formato de pílula dourada no topo da página inicial para todos os usuários.
                    </p>
                    <input
                      id="editor-input-badge"
                      type="text"
                      value={localScreens.home.badge}
                      onChange={e => handleUpdateField('home', 'badge', e.target.value)}
                      onFocus={() => setFocusedField('badge')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm"
                    />
                  </div>

                  {/* Campo: Título Principal (Hero) */}
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      2. Título de Impacto (Hero H1)
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      O título de destaque com letras gigantes que resume a missão da equipe.
                    </p>
                    <textarea
                      id="editor-input-tituloHero"
                      rows={2}
                      value={localScreens.home.tituloHero}
                      onChange={e => handleUpdateField('home', 'tituloHero', e.target.value)}
                      onFocus={() => setFocusedField('tituloHero')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm"
                    />
                  </div>

                  {/* Campo: Subtítulo do Hero */}
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      3. Subtítulo Explicativo do Hero
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Apresenta as modalidades (Muay Thai, Luta Livre, MMA) e a liderança do Mestre Daniel Braga.
                    </p>
                    <textarea
                      id="editor-input-subtituloHero"
                      rows={3}
                      value={localScreens.home.subtituloHero}
                      onChange={e => handleUpdateField('home', 'subtituloHero', e.target.value)}
                      onFocus={() => setFocusedField('subtituloHero')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm"
                    />
                  </div>

                  {/* Botões de Ação do Hero */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">
                        4. Botão Principal (CTA 1)
                      </label>
                      <p className="text-[11px] text-neutral-400">Leva o visitante para a tela de matrícula online.</p>
                      <input
                        id="editor-input-ctaPrimario"
                        type="text"
                        value={localScreens.home.ctaPrimario}
                        onChange={e => handleUpdateField('home', 'ctaPrimario', e.target.value)}
                        onFocus={() => setFocusedField('ctaPrimario')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">
                        5. Botão Secundário (CTA 2)
                      </label>
                      <p className="text-[11px] text-neutral-400">Abre o WhatsApp oficial para agendar aula gratuita.</p>
                      <input
                        id="editor-input-ctaSecundario"
                        type="text"
                        value={localScreens.home.ctaSecundario}
                        onChange={e => handleUpdateField('home', 'ctaSecundario', e.target.value)}
                        onFocus={() => setFocusedField('ctaSecundario')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* 4 Blocos de Estatísticas / Prova Social */}
                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <h3 className="text-xs font-black uppercase text-amber-400">
                      6. Faixa de Números Oficiais (Prova Social)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-400">Bloco 1 (Número & Rótulo)</label>
                        <input
                          type="text"
                          value={localScreens.home.statAnosNumero}
                          onChange={e => handleUpdateField('home', 'statAnosNumero', e.target.value)}
                          onFocus={() => setFocusedField('statAnos')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono font-bold"
                          placeholder="2017"
                        />
                        <input
                          type="text"
                          value={localScreens.home.statAnosTexto}
                          onChange={e => handleUpdateField('home', 'statAnosTexto', e.target.value)}
                          onFocus={() => setFocusedField('statAnos')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px]"
                          placeholder="Fundação Oficial"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-400">Bloco 2 (Faixas Pretas)</label>
                        <input
                          type="text"
                          value={localScreens.home.statFaixasNumero}
                          onChange={e => handleUpdateField('home', 'statFaixasNumero', e.target.value)}
                          onFocus={() => setFocusedField('statFaixas')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono font-bold"
                          placeholder="+12"
                        />
                        <input
                          type="text"
                          value={localScreens.home.statFaixasTexto}
                          onChange={e => handleUpdateField('home', 'statFaixasTexto', e.target.value)}
                          onFocus={() => setFocusedField('statFaixas')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px]"
                          placeholder="Faixas Pretas Formados"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-400">Bloco 3 (Polos Ativos)</label>
                        <input
                          type="text"
                          value={localScreens.home.statPolosNumero}
                          onChange={e => handleUpdateField('home', 'statPolosNumero', e.target.value)}
                          onFocus={() => setFocusedField('statPolos')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-red-500 text-xs font-mono font-bold"
                          placeholder="4"
                        />
                        <input
                          type="text"
                          value={localScreens.home.statPolosTexto}
                          onChange={e => handleUpdateField('home', 'statPolosTexto', e.target.value)}
                          onFocus={() => setFocusedField('statPolos')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px]"
                          placeholder="Polos Ativos no RJ"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-400">Bloco 4 (Metodologia)</label>
                        <input
                          type="text"
                          value={localScreens.home.statMetodologiaNumero}
                          onChange={e => handleUpdateField('home', 'statMetodologiaNumero', e.target.value)}
                          onFocus={() => setFocusedField('statMetodologia')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs font-mono font-bold"
                          placeholder="100%"
                        />
                        <input
                          type="text"
                          value={localScreens.home.statMetodologiaTexto}
                          onChange={e => handleUpdateField('home', 'statMetodologiaTexto', e.target.value)}
                          onFocus={() => setFocusedField('statMetodologia')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px]"
                          placeholder="Metodologia Projarde"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Título Seção Polos */}
                  <div className="border-t border-neutral-800 pt-4 space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      7. Título da Seção de Polos & CTs
                    </label>
                    <p className="text-[11px] text-neutral-400">Aparece acima dos cards das unidades cadastradas.</p>
                    <input
                      id="editor-input-polosTitulo"
                      type="text"
                      value={localScreens.home.polosTitulo}
                      onChange={e => handleUpdateField('home', 'polosTitulo', e.target.value)}
                      onFocus={() => setFocusedField('polosTitulo')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>

                  {/* Banner CTA Final */}
                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <h3 className="text-xs font-black uppercase text-neutral-200">
                      8. Banner de Convite no Rodapé da Página
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={localScreens.home.ctaBannerTitulo}
                        onChange={e => handleUpdateField('home', 'ctaBannerTitulo', e.target.value)}
                        onFocus={() => setFocusedField('ctaBanner')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-bold"
                        placeholder="Título do Banner"
                      />
                      <textarea
                        rows={2}
                        value={localScreens.home.ctaBannerTexto}
                        onChange={e => handleUpdateField('home', 'ctaBannerTexto', e.target.value)}
                        onFocus={() => setFocusedField('ctaBanner')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs"
                        placeholder="Texto explicativo do banner"
                      />
                      <input
                        type="text"
                        value={localScreens.home.ctaBannerBotao}
                        onChange={e => handleUpdateField('home', 'ctaBannerBotao', e.target.value)}
                        onFocus={() => setFocusedField('ctaBanner')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        placeholder="Texto do Botão"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 2: SOBRE O CT & MESTRE                             */}
              {/* ====================================================== */}
              {activeEditorTab === 'sobre' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <span>Configurações da Página Sobre Nós</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">História</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Edite a biografia do Mestre Daniel Braga, a história da fundação da equipe e os pilares de honra.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Nome do Líder / Mestre
                    </label>
                    <input
                      type="text"
                      value={localScreens.sobre.tituloMestre}
                      onChange={e => handleUpdateField('sobre', 'tituloMestre', e.target.value)}
                      onFocus={() => setFocusedField('sobreMestre')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Graduação Oficial do Mestre
                    </label>
                    <input
                      type="text"
                      value={localScreens.sobre.grauMestre}
                      onChange={e => handleUpdateField('sobre', 'grauMestre', e.target.value)}
                      onFocus={() => setFocusedField('sobreMestre')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-red-400 text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Biografia & Trajetória Marcial
                    </label>
                    <textarea
                      rows={4}
                      value={localScreens.sobre.biografiaMestre}
                      onChange={e => handleUpdateField('sobre', 'biografiaMestre', e.target.value)}
                      onFocus={() => setFocusedField('sobreMestre')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm leading-relaxed"
                    />
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      História da Fundação Gaditas
                    </label>
                    <textarea
                      rows={4}
                      value={localScreens.sobre.historiaTexto}
                      onChange={e => handleUpdateField('sobre', 'historiaTexto', e.target.value)}
                      onFocus={() => setFocusedField('sobreHistoria')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm leading-relaxed"
                    />
                  </div>

                  {/* 3 Pilares */}
                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <label className="text-xs font-black uppercase text-amber-400">
                      Os 3 Pilares da Equipe (Honra, Disciplina, Lealdade)
                    </label>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <input
                          type="text"
                          value={localScreens.sobre.pilar1Titulo}
                          onChange={e => handleUpdateField('sobre', 'pilar1Titulo', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-bold text-xs uppercase"
                        />
                        <textarea
                          rows={2}
                          value={localScreens.sobre.pilar1Texto}
                          onChange={e => handleUpdateField('sobre', 'pilar1Texto', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <input
                          type="text"
                          value={localScreens.sobre.pilar2Titulo}
                          onChange={e => handleUpdateField('sobre', 'pilar2Titulo', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-bold text-xs uppercase"
                        />
                        <textarea
                          rows={2}
                          value={localScreens.sobre.pilar2Texto}
                          onChange={e => handleUpdateField('sobre', 'pilar2Texto', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                        <input
                          type="text"
                          value={localScreens.sobre.pilar3Titulo}
                          onChange={e => handleUpdateField('sobre', 'pilar3Titulo', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-bold text-xs uppercase"
                        />
                        <textarea
                          rows={2}
                          value={localScreens.sobre.pilar3Texto}
                          onChange={e => handleUpdateField('sobre', 'pilar3Texto', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 3: MATRÍCULA ONLINE                                */}
              {/* ====================================================== */}
              {activeEditorTab === 'matricula' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <span>Configurações da Tela de Matrícula</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">Inscrição</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Edite as chamadas, benefícios em destaque e o termo de compromisso médico que os alunos aceitam.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Título da Página de Matrícula
                    </label>
                    <input
                      type="text"
                      value={localScreens.matricula.titulo}
                      onChange={e => handleUpdateField('matricula', 'titulo', e.target.value)}
                      onFocus={() => setFocusedField('matriculaTitulo')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Subtítulo Explicativo
                    </label>
                    <textarea
                      rows={2}
                      value={localScreens.matricula.subtitulo}
                      onChange={e => handleUpdateField('matricula', 'subtitulo', e.target.value)}
                      onFocus={() => setFocusedField('matriculaTitulo')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm"
                    />
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      3 Benefícios Oficiais em Destaque
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={localScreens.matricula.beneficio1}
                        onChange={e => handleUpdateField('matricula', 'beneficio1', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs"
                        placeholder="Benefício 1"
                      />
                      <input
                        type="text"
                        value={localScreens.matricula.beneficio2}
                        onChange={e => handleUpdateField('matricula', 'beneficio2', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs"
                        placeholder="Benefício 2"
                      />
                      <input
                        type="text"
                        value={localScreens.matricula.beneficio3}
                        onChange={e => handleUpdateField('matricula', 'beneficio3', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs"
                        placeholder="Benefício 3"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Texto do Botão de Conclusão
                    </label>
                    <input
                      type="text"
                      value={localScreens.matricula.botaoTexto}
                      onChange={e => handleUpdateField('matricula', 'botaoTexto', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Termo de Responsabilidade & Aptidão Médica
                    </label>
                    <textarea
                      rows={3}
                      value={localScreens.matricula.avisoTermo}
                      onChange={e => handleUpdateField('matricula', 'avisoTermo', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs leading-relaxed"
                    />
                  </div>

                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 4: PORTAL DO ALUNO                                 */}
              {/* ====================================================== */}
              {activeEditorTab === 'aluno' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <span>Configurações do Portal do Aluno</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">Área Restrita</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Defina avisos do mural do atleta, botão de suporte do WhatsApp e ative/desative recursos para os alunos.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Título do Portal do Aluno
                    </label>
                    <input
                      type="text"
                      value={localScreens.aluno.tituloPortal}
                      onChange={e => handleUpdateField('aluno', 'tituloPortal', e.target.value)}
                      onFocus={() => setFocusedField('alunoTitulo')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Aviso Global no Topo do Portal do Aluno
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Aparece com destaque em vermelho para todos os alunos logados avisando sobre eventos ou graduações.
                    </p>
                    <textarea
                      rows={3}
                      value={localScreens.aluno.avisoMural}
                      onChange={e => handleUpdateField('aluno', 'avisoMural', e.target.value)}
                      onFocus={() => setFocusedField('alunoAviso')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 text-sm leading-relaxed"
                    />
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Suporte WhatsApp para os Alunos
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Rótulo do Botão</span>
                        <input
                          type="text"
                          value={localScreens.aluno.suporteWhatsAppTexto}
                          onChange={e => handleUpdateField('aluno', 'suporteWhatsAppTexto', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Link de Atendimento</span>
                        <input
                          type="text"
                          value={localScreens.aluno.linkSuporteWhatsApp}
                          onChange={e => handleUpdateField('aluno', 'linkSuporteWhatsApp', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-3">
                    <label className="text-xs font-black uppercase text-neutral-200">
                      Módulos Visíveis para o Aluno (Toggles)
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                        <span className="text-xs font-bold text-neutral-200">Mostrar Calculadora de Categoria de Peso</span>
                        <input
                          type="checkbox"
                          checked={localScreens.aluno.mostrarCalculadoraPeso}
                          onChange={e => handleUpdateField('aluno', 'mostrarCalculadoraPeso', e.target.checked)}
                          className="w-4 h-4 text-red-600 rounded bg-neutral-900 border-neutral-700"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                        <span className="text-xs font-bold text-neutral-200">Mostrar Grade de Horários Oficiais</span>
                        <input
                          type="checkbox"
                          checked={localScreens.aluno.mostrarGradeHorarios}
                          onChange={e => handleUpdateField('aluno', 'mostrarGradeHorarios', e.target.checked)}
                          className="w-4 h-4 text-red-600 rounded bg-neutral-900 border-neutral-700"
                        />
                      </label>
                    </div>
                  </div>

                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 5: IDENTIDADE & CONTATOS GLOBAIS                   */}
              {/* ====================================================== */}
              {activeEditorTab === 'global' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <span>Identidade Visual, PIX & Redes Sociais</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">Global</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Configurações que afetam todo o site, Navbar, Footer e dados bancários para pagamentos via PIX.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">Nome Oficial do CT / Site</label>
                      <input
                        type="text"
                        value={localScreens.global.nomeSite}
                        onChange={e => handleUpdateField('global', 'nomeSite', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">Slogan</label>
                      <input
                        type="text"
                        value={localScreens.global.slogan}
                        onChange={e => handleUpdateField('global', 'slogan', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">Chave PIX Oficial</label>
                      <input
                        type="text"
                        value={localScreens.global.chavePix}
                        onChange={e => handleUpdateField('global', 'chavePix', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 font-mono text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">Valor Padrão da Mensalidade (R$)</label>
                      <input
                        type="number"
                        value={localScreens.global.valorMensalidade}
                        onChange={e => handleUpdateField('global', 'valorMensalidade', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">WhatsApp de Atendimento</label>
                      <input
                        type="text"
                        value={localScreens.global.whatsapp}
                        onChange={e => handleUpdateField('global', 'whatsapp', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-neutral-200">Link do Instagram</label>
                      <input
                        type="text"
                        value={localScreens.global.instagram}
                        onChange={e => handleUpdateField('global', 'instagram', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-pink-400 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                      <span className="text-xs font-bold text-neutral-200">Ativar Faixa de Notificação no Topo do Site</span>
                      <input
                        type="checkbox"
                        checked={localScreens.global.notificacaoTopoAtiva}
                        onChange={e => handleUpdateField('global', 'notificacaoTopoAtiva', e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded bg-neutral-900 border-neutral-700"
                      />
                    </label>
                    {localScreens.global.notificacaoTopoAtiva && (
                      <input
                        type="text"
                        value={localScreens.global.notificacaoTopoTexto}
                        onChange={e => handleUpdateField('global', 'notificacaoTopoTexto', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 text-xs font-bold"
                        placeholder="Texto que corre na faixa do topo do site"
                      />
                    )}
                  </div>

                  <div className="border-t border-neutral-800 pt-4 space-y-1">
                    <label className="text-xs font-black uppercase text-neutral-200">Texto do Rodapé (Copyright & CNPJ)</label>
                    <textarea
                      rows={2}
                      value={localScreens.global.rodapeTexto}
                      onChange={e => handleUpdateField('global', 'rodapeTexto', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs"
                    />
                  </div>

                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 6: PERMISSÕES DA EQUIPE (ADMIN GERAL RBAC)        */}
              {/* ====================================================== */}
              {activeEditorTab === 'permissoes' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span>Ciclo de Administradores Gerais (RBAC)</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Usuários autorizados nesta lista possuem acesso total ao CMS, edição de todas as telas reais e gerenciamento de permissões no Firestore.
                    </p>
                  </div>

                  {/* Formulário para adicionar novo administrador geral */}
                  <form onSubmit={handleAdicionarAdmin} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <span className="text-xs font-black uppercase text-amber-400 block">
                      Adicionar Novo Administrador Geral
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Digite o e-mail exato do usuário para conceder acesso imediato ao Painel CMS e salvar no Firestore:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={novoAdminEmail}
                        onChange={e => setNovoAdminEmail(e.target.value)}
                        placeholder="ex: lider.ct@gmail.com"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:outline-none text-white text-sm"
                      />
                      <button
                        type="submit"
                        disabled={salvandoAdmin}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{salvandoAdmin ? 'Adicionando...' : 'Autorizar'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Lista de Administradores Autorizados */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black uppercase text-neutral-300 block">
                      Administradores Ativos no Firestore ({adminsGerais.length})
                    </span>

                    <div className="space-y-2">
                      {adminsGerais.map(email => {
                        const isSuperAdmin = email.toLowerCase() === 'davileonardo303@gmail.com';
                        return (
                          <div
                            key={email}
                            className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isSuperAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-neutral-800 text-white'
                              }`}>
                                <Shield className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-white font-mono block">
                                  {email}
                                </span>
                                <span className={`text-[10px] uppercase font-black ${
                                  isSuperAdmin ? 'text-amber-400' : 'text-neutral-400'
                                }`}>
                                  {isSuperAdmin ? 'Criador / Desenvolvedor Oficial' : 'Administrador Geral Autorizado'}
                                </span>
                              </div>
                            </div>

                            {isSuperAdmin ? (
                              <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                                Permanente
                              </span>
                            ) : (
                              <button
                                onClick={() => handleRemoverAdmin(email)}
                                className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950 hover:text-red-400 text-neutral-400 text-xs font-bold transition-colors cursor-pointer"
                                title="Revogar permissão de Administrador Geral"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 7: PÁGINAS CUSTOMIZADAS & MENUS                    */}
              {/* ====================================================== */}
              {activeEditorTab === 'paginas' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">
                        Páginas Customizadas do CMS
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1">
                        Crie novas páginas de campeonatos, regulamentos ou eventos com URLs amigáveis.
                      </p>
                    </div>
                    <button
                      onClick={() => setModalNovaPagina(true)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Página</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {paginas.length === 0 ? (
                      <p className="text-xs text-neutral-400 text-center py-6">
                        Nenhuma página customizada criada ainda. Clique em "Nova Página" acima para criar.
                      </p>
                    ) : (
                      paginas.map(p => (
                        <div key={p.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black uppercase text-white block">{p.titulo}</span>
                            <span className="text-xs text-neutral-400 font-mono">Slug: /{p.slug}</span>
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm(`Excluir a página "${p.titulo}"?`)) {
                                await store.excluirPagina(p.id);
                                setPaginas([...store.getPaginas()]);
                              }
                            }}
                            className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 8: GESTÃO DE USUÁRIOS & SUPORTE                     */}
              {/* ====================================================== */}
              {activeEditorTab === 'usuarios' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-white">
                        Gestão de Usuários, Senhas & Acesso
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1">
                        Troca de senhas, alteração de e-mails, bloqueio de contas e login de suporte técnico.
                      </p>
                    </div>
                    <button
                      onClick={() => setModalNovoUsuario(true)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Usuário</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={buscaUsuario}
                        onChange={e => setBuscaUsuario(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <select
                      value={filtroRole}
                      onChange={e => setFiltroRole(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    >
                      <option value="todos">Todos os Papéis</option>
                      <option value="administrador_geral">Admin Geral</option>
                      <option value="professor">Professores</option>
                      <option value="aluno">Alunos</option>
                    </select>
                  </div>

                  {/* Lista de Contas */}
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {usuarios
                      .filter(u => {
                        const matchBusca = u.nome.toLowerCase().includes(buscaUsuario.toLowerCase()) || u.email.toLowerCase().includes(buscaUsuario.toLowerCase());
                        const matchRole = filtroRole === 'todos' || u.role === filtroRole;
                        return matchBusca && matchRole;
                      })
                      .map(u => (
                        <div key={u.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-xs font-black uppercase text-white block truncate">{u.nome}</span>
                            <span className="text-[11px] text-neutral-400 font-mono block truncate">{u.email}</span>
                            <span className="text-[10px] text-amber-400 font-bold uppercase">{u.role} • {u.ct}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setModalTrocaSenha({ aberto: true, userId: u.id, nome: u.nome })}
                              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                              title="Trocar Senha"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setModalTrocaEmail({ aberto: true, userId: u.id, nome: u.nome, emailAtual: u.email })}
                              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                              title="Trocar E-mail"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleBloqueio(u)}
                              className={`p-2 rounded-lg ${u.bloqueado ? 'bg-red-950 text-red-400' : 'bg-neutral-900 text-emerald-400'}`}
                              title={u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => store.impersonarUsuario(u, 'usuario')}
                              className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black"
                              title="Assumir Visão (Modo Suporte)"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ====================================================== */}
              {/* ABA 9: POLOS & CENTROS DE TREINAMENTO (CTs)            */}
              {/* ====================================================== */}
              {activeEditorTab === 'unidades' && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>Gerenciar Polos & CTs (Centros de Treinamento)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {unidades.length} Polos Ativos
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Cadastre novos polos ou edite centros de treinamento existentes. Toda alteração reflete imediatamente na página inicial, na matrícula e no formulário de inscrição em tempo real.
                    </p>
                  </div>

                  {/* Formulário de Cadastro Direto de CT */}
                  <form onSubmit={handleCadastrarCT} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                    <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cadastrar Novo Polo / CT no Firebase</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                          Nome do CT / Polo *
                        </label>
                        <input
                          type="text"
                          required
                          value={novaUniNome}
                          onChange={e => setNovaUniNome(e.target.value)}
                          placeholder="Ex: Jacarepaguá, Madureira, Niterói..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                          Regime Financeiro
                        </label>
                        <select
                          value={novaUniTipo}
                          onChange={e => setNovaUniTipo(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-red-500 focus:outline-none cursor-pointer"
                        >
                          <option value="pagante">Pagante (Mensalidade Regular)</option>
                          <option value="bolsista">Social / Bolsista (100% Isento)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                          Professor / Responsável
                        </label>
                        <input
                          type="text"
                          value={novaUniResp}
                          onChange={e => setNovaUniResp(e.target.value)}
                          placeholder="Ex: Mestre Daniel Braga, Prof. Marcos..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                          Telefone / WhatsApp de Contato
                        </label>
                        <input
                          type="text"
                          value={novaUniTel}
                          onChange={e => setNovaUniTel(e.target.value)}
                          placeholder="Ex: (21) 98888-0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                          Endereço / Localização do CT
                        </label>
                        <input
                          type="text"
                          value={novaUniEnd}
                          onChange={e => setNovaUniEnd(e.target.value)}
                          placeholder="Ex: Av. das Américas, 500 - Bloco 2"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={salvandoUni}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-950/60"
                    >
                      {salvandoUni ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Salvando no Firestore...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Salvar Polo no Firebase em Tempo Real</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Lista de Polos Cadastrados com Botão de Excluir */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center justify-between">
                      <span>Polos Registrados ({unidades.length})</span>
                      <span className="text-[10px] text-neutral-400 font-mono">Sincronizado via onSnapshot</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                      {unidades.map(u => (
                        <div
                          key={u.id}
                          className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-2 hover:border-neutral-700 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black uppercase text-white truncate">{u.nome}</h4>
                              <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                u.tipo === 'bolsista'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                              }`}>
                                {u.tipo}
                              </span>
                            </div>
                            {u.responsavel && (
                              <p className="text-[11px] text-neutral-300">
                                Líder: <strong className="text-white">{u.responsavel}</strong>
                              </p>
                            )}
                            {u.endereco && (
                              <p className="text-[10px] text-neutral-400 truncate">
                                📍 {u.endereco}
                              </p>
                            )}
                            {u.telefone && (
                              <p className="text-[10px] text-amber-400 font-mono">
                                📞 {u.telefone}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-neutral-900 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoverCT(u.id, u.nome)}
                              className="text-[11px] text-neutral-500 hover:text-red-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Excluir polo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remover</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* LADO DIREITO: PREVIEW REAL INTERATIVO AO VIVO                */}
        {/* ============================================================ */}
        {layoutMode !== 'editor-only' && (
          <div className={`${layoutMode === 'split' ? 'lg:col-span-6' : 'max-w-5xl mx-auto w-full'} space-y-4`}>
            
            {/* BARRA SUPERIOR DO PREVIEW: SELETOR DE DISPOSITIVOS E TELAS */}
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
              
              {/* Seletor de Telas do Preview */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-neutral-400 mr-1">Preview:</span>
                <button
                  onClick={() => setPreviewScreen('home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                    previewScreen === 'home' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-950'
                  }`}
                >
                  Início
                </button>
                <button
                  onClick={() => setPreviewScreen('sobre')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                    previewScreen === 'sobre' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-950'
                  }`}
                >
                  Sobre Nós
                </button>
                <button
                  onClick={() => setPreviewScreen('matricula')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                    previewScreen === 'matricula' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-950'
                  }`}
                >
                  Matrícula
                </button>
                <button
                  onClick={() => setPreviewScreen('aluno')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                    previewScreen === 'aluno' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white bg-neutral-950'
                  }`}
                >
                  Área Aluno
                </button>
              </div>

              {/* Seletor de Resolução / Dispositivo */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    deviceView === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Visão Desktop"
                >
                  <Laptop className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('tablet')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    deviceView === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Visão Tablet (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    deviceView === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Visão Smartphone (390px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* CONTAINER MOLDURA DO PREVIEW AO VIVO */}
            <div className="p-3 rounded-3xl bg-[#050507] border border-neutral-800 shadow-2xl flex justify-center overflow-x-auto min-h-[700px]">
              
              <div className={`transition-all duration-300 bg-[#070708] rounded-2xl border border-neutral-800/80 overflow-y-auto max-h-[850px] ${
                deviceView === 'mobile' 
                  ? 'w-[390px] p-4 ring-8 ring-neutral-900 shadow-2xl' 
                  : deviceView === 'tablet' 
                  ? 'w-[768px] p-6 ring-8 ring-neutral-900 shadow-2xl' 
                  : 'w-full p-6'
              }`}>

                {/* ==================================================== */}
                {/* PREVIEW DA TELA INICIAL (HOME)                       */}
                {/* ==================================================== */}
                {previewScreen === 'home' && (
                  <div className="space-y-12">
                    
                    {/* Hero Preview */}
                    <div className="relative rounded-2xl overflow-hidden p-8 border border-neutral-800 text-center space-y-6">
                      <div className="absolute inset-0 z-0">
                        <img src={heroRingImg} alt="Ringue" className="w-full h-full object-cover filter brightness-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/60 to-transparent" />
                      </div>

                      <div className="relative z-10 space-y-4">
                        {/* Badge */}
                        <HighlightedElement fieldKey="badge" label="Emblema do Topo">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-black uppercase text-neutral-200">
                              {localScreens.home.badge}
                            </span>
                          </div>
                        </HighlightedElement>

                        {/* Título H1 */}
                        <HighlightedElement fieldKey="tituloHero" label="Título Hero H1">
                          <h1 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">
                            {localScreens.home.tituloHero}
                          </h1>
                        </HighlightedElement>

                        {/* Subtítulo */}
                        <HighlightedElement fieldKey="subtituloHero" label="Subtítulo">
                          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
                            {localScreens.home.subtituloHero}
                          </p>
                        </HighlightedElement>

                        {/* Botões CTA */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <HighlightedElement fieldKey="ctaPrimario" label="Botão Matrícula">
                            <div className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-lg">
                              <span>{localScreens.home.ctaPrimario}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </HighlightedElement>

                          <HighlightedElement fieldKey="ctaSecundario" label="Botão WhatsApp">
                            <div className="px-4 py-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs uppercase flex items-center gap-1.5">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{localScreens.home.ctaSecundario}</span>
                            </div>
                          </HighlightedElement>
                        </div>

                        {/* Faixa de Estatísticas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 border-t border-neutral-800">
                          <HighlightedElement fieldKey="statAnos" label="Ano de Fundação">
                            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                              <span className="block text-xl font-black text-white font-mono">{localScreens.home.statAnosNumero}</span>
                              <span className="text-[9px] uppercase font-bold text-neutral-400">{localScreens.home.statAnosTexto}</span>
                            </div>
                          </HighlightedElement>

                          <HighlightedElement fieldKey="statFaixas" label="Faixas Pretas">
                            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                              <span className="block text-xl font-black text-amber-400 font-mono">{localScreens.home.statFaixasNumero}</span>
                              <span className="text-[9px] uppercase font-bold text-neutral-400">{localScreens.home.statFaixasTexto}</span>
                            </div>
                          </HighlightedElement>

                          <HighlightedElement fieldKey="statPolos" label="Polos Ativos">
                            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                              <span className="block text-xl font-black text-red-500 font-mono">{localScreens.home.statPolosNumero}</span>
                              <span className="text-[9px] uppercase font-bold text-neutral-400">{localScreens.home.statPolosTexto}</span>
                            </div>
                          </HighlightedElement>

                          <HighlightedElement fieldKey="statMetodologia" label="Metodologia Projarde">
                            <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                              <span className="block text-xl font-black text-emerald-400 font-mono">{localScreens.home.statMetodologiaNumero}</span>
                              <span className="text-[9px] uppercase font-bold text-neutral-400">{localScreens.home.statMetodologiaTexto}</span>
                            </div>
                          </HighlightedElement>
                        </div>

                      </div>
                    </div>

                    {/* Polos Preview */}
                    <div className="space-y-4">
                      <HighlightedElement fieldKey="polosTitulo" label="Título da Seção de Polos">
                        <div className="text-center space-y-1">
                          <span className="text-[10px] uppercase font-black text-red-500">Rede de Treinamento</span>
                          <h3 className="text-xl font-black uppercase text-white">{localScreens.home.polosTitulo}</h3>
                          <p className="text-xs text-neutral-400">{localScreens.home.polosSubtitulo}</p>
                        </div>
                      </HighlightedElement>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {unidades.map((u, i) => (
                          <div key={u.id || i} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase font-bold text-amber-400">Polo Oficial</span>
                              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${u.tipo === 'bolsista' ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-300'}`}>
                                {u.tipo}
                              </span>
                            </div>
                            <h4 className="text-sm font-black uppercase text-white">{u.nome}</h4>
                            <p className="text-[11px] text-neutral-400">{u.endereco || 'Tatame oficial e estrutura Gaditas'}</p>
                            {u.responsavel && <p className="text-[10px] text-neutral-500">Liderança: {u.responsavel}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Banner CTA Preview */}
                    <HighlightedElement fieldKey="ctaBanner" label="Banner Rodapé">
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/80 to-neutral-900 border border-red-500/40 space-y-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <h4 className="text-base font-black uppercase text-white">{localScreens.home.ctaBannerTitulo}</h4>
                          <p className="text-xs text-neutral-300">{localScreens.home.ctaBannerTexto}</p>
                        </div>
                        <div className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase shrink-0">
                          {localScreens.home.ctaBannerBotao}
                        </div>
                      </div>
                    </HighlightedElement>

                  </div>
                )}

                {/* ==================================================== */}
                {/* PREVIEW DA TELA SOBRE NÓS                            */}
                {/* ==================================================== */}
                {previewScreen === 'sobre' && (
                  <div className="space-y-8">
                    
                    <HighlightedElement fieldKey="sobreMestre" label="Bloco do Mestre Daniel">
                      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-neutral-950 border border-neutral-800 p-2 flex flex-col items-center justify-center shrink-0">
                          <img src={lionEmblemImg} alt="Mestre" className="w-14 h-14 object-contain" />
                          <span className="text-[8px] font-black text-amber-400 uppercase mt-1">Líder Oficial</span>
                        </div>
                        <div className="space-y-2 text-center sm:text-left">
                          <span className="text-[10px] uppercase font-black text-red-500">{localScreens.sobre.subtituloMestre}</span>
                          <h3 className="text-2xl font-black uppercase text-white">{localScreens.sobre.tituloMestre}</h3>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-[10px] font-bold text-red-400">
                            {localScreens.sobre.grauMestre}
                          </span>
                          <p className="text-xs text-neutral-300 leading-relaxed">{localScreens.sobre.biografiaMestre}</p>
                        </div>
                      </div>
                    </HighlightedElement>

                    <HighlightedElement fieldKey="sobreHistoria" label="História da Equipe">
                      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                        <span className="text-[10px] uppercase font-black text-amber-400">Origens & Fundação</span>
                        <h4 className="text-lg font-black uppercase text-white">{localScreens.sobre.historiaTitulo}</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed">{localScreens.sobre.historiaTexto}</p>
                      </div>
                    </HighlightedElement>

                    {/* 3 Pilares */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                        <span className="text-xs font-black uppercase text-amber-400">{localScreens.sobre.pilar1Titulo}</span>
                        <p className="text-[11px] text-neutral-400">{localScreens.sobre.pilar1Texto}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                        <span className="text-xs font-black uppercase text-red-400">{localScreens.sobre.pilar2Titulo}</span>
                        <p className="text-[11px] text-neutral-400">{localScreens.sobre.pilar2Texto}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                        <span className="text-xs font-black uppercase text-emerald-400">{localScreens.sobre.pilar3Titulo}</span>
                        <p className="text-[11px] text-neutral-400">{localScreens.sobre.pilar3Texto}</p>
                      </div>
                    </div>

                  </div>
                )}

                {/* ==================================================== */}
                {/* PREVIEW DA TELA DE MATRÍCULA                         */}
                {/* ==================================================== */}
                {previewScreen === 'matricula' && (
                  <div className="max-w-xl mx-auto space-y-6">
                    <HighlightedElement fieldKey="matriculaTitulo" label="Cabeçalho de Matrícula">
                      <div className="text-center space-y-2 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                        <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 mx-auto flex items-center justify-center">
                          <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-white">{localScreens.matricula.titulo}</h3>
                        <p className="text-xs text-neutral-400">{localScreens.matricula.subtitulo}</p>
                      </div>
                    </HighlightedElement>

                    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                        ✓ {localScreens.matricula.beneficio1}
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                        ✓ {localScreens.matricula.beneficio2}
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                        ✓ {localScreens.matricula.beneficio3}
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 italic">
                        "{localScreens.matricula.avisoTermo}"
                      </div>

                      <div className="pt-2">
                        <div className="w-full py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider text-center">
                          {localScreens.matricula.botaoTexto}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* PREVIEW DO PORTAL DO ALUNO                           */}
                {/* ==================================================== */}
                {previewScreen === 'aluno' && (
                  <div className="space-y-6">
                    
                    <HighlightedElement fieldKey="alunoAviso" label="Mural de Aviso do Aluno">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950 to-neutral-900 border border-red-500/40 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                          <p className="text-xs text-neutral-200 font-semibold">{localScreens.aluno.avisoMural}</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-[9px] uppercase shrink-0">
                          {localScreens.aluno.suporteWhatsAppTexto}
                        </div>
                      </div>
                    </HighlightedElement>

                    <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">#0042 • Polo Campo Grande</span>
                          <h4 className="text-xl font-black uppercase text-white">Guerreiro de Exemplo</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase">
                          Em Dia
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Graduação</span>
                          <span className="text-xs font-black text-amber-400 uppercase">Faixa Amarela (Projarde)</span>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Frequência Total</span>
                          <span className="text-xs font-black text-white uppercase">18 Treinos Concluídos</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: CONFIRMAR RESTAURAÇÃO DE PADRÃO                         */}
      {/* ============================================================== */}
      {modalConfirmarRestauracao && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-white">
              Restaurar Padrão da Tela?
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Tem certeza que deseja restaurar os valores padrão de fábrica desta tela no Firebase? Todas as alterações salvas serão substituídas pelos textos originais.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleRestaurarPadrao(modalConfirmarRestauracao as any)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Sim, Restaurar Padrão
              </button>
              <button
                onClick={() => setModalConfirmarRestauracao(null)}
                className="py-3 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAIS DE USUÁRIOS (CRIAÇÃO, TROCA DE SENHA, TROCA DE E-MAIL)    */}
      {/* ============================================================== */}
      {modalNovoUsuario && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCriarUsuario} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black uppercase text-white">Cadastrar Novo Usuário</h3>
            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nome Completo"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
              />
              <input
                type="email"
                required
                placeholder="E-mail de acesso"
                value={novoEmail}
                onChange={e => setNovoEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
              />
              <input
                type="password"
                placeholder="Senha inicial (opcional)"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={novoRole}
                  onChange={e => setNovoRole(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                >
                  <option value="professor">Professor</option>
                  <option value="administrador">Administrador</option>
                  <option value="aluno">Aluno</option>
                </select>
                <select
                  value={novoCT}
                  onChange={e => setNovoCT(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                >
                  <option value="GERAL">Acesso Geral</option>
                  {unidades.map(u => (
                    <option key={u.id} value={u.nome}>{u.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase"
              >
                Cadastrar no Firebase
              </button>
              <button
                type="button"
                onClick={() => setModalNovoUsuario(false)}
                className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs uppercase"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {modalTrocaSenha && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black uppercase text-white">Trocar Senha de {modalTrocaSenha.nome}</h3>
            <input
              type="password"
              placeholder="Nova senha (min. 6 dígitos)"
              value={novaSenhaInput}
              onChange={e => setNovaSenhaInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSalvarTrocaSenha}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase"
              >
                Salvar Nova Senha
              </button>
              <button
                onClick={() => setModalTrocaSenha(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold uppercase"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalTrocaEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black uppercase text-white">Trocar E-mail de {modalTrocaEmail.nome}</h3>
            <input
              type="email"
              placeholder="Novo endereço de e-mail"
              value={novoEmailInput}
              onChange={e => setNovoEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSalvarTrocaEmail}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase"
              >
                Atualizar E-mail
              </button>
              <button
                onClick={() => setModalTrocaEmail(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold uppercase"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalNovaPagina && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCriarPagina} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black uppercase text-white">Criar Nova Página Customizada</h3>
            <input
              type="text"
              required
              placeholder="Título da Página (ex: Regulamento de Graduação)"
              value={novaPaginaTitulo}
              onChange={e => {
                setNovaPaginaTitulo(e.target.value);
                setNovaPaginaSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
            <input
              type="text"
              required
              placeholder="Slug de URL (ex: regulamento-graduacao)"
              value={novaPaginaSlug}
              onChange={e => setNovaPaginaSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 font-mono text-sm"
            />
            <textarea
              rows={6}
              required
              placeholder="Conteúdo completo da página..."
              value={novaPaginaConteudo}
              onChange={e => setNovaPaginaConteudo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase"
              >
                Publicar Página
              </button>
              <button
                type="button"
                onClick={() => setModalNovaPagina(false)}
                className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs uppercase"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
