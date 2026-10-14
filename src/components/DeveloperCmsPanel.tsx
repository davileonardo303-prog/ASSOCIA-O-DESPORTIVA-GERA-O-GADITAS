import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { UsuarioSistema, UserRole, SiteConfig, Aluno, PaginaCustomizada, MenuItemSite } from '../types';
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
  Download, 
  Upload, 
  Save, 
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Shield,
  Layers,
  FileText,
  Menu,
  Bell,
  Check,
  AlertTriangle
} from 'lucide-react';

export const DeveloperCmsPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'usuarios' | 'cms-visual' | 'paginas-menus' | 'acessos-dispositivos'>('usuarios');
  const [configLocal, setConfigLocal] = useState<SiteConfig>(store.getSiteConfig());
  const [salvandoConfig, setSalvandoConfig] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Gestão de Usuários
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>(store.getUsuarios());
  const [alunos, setAlunos] = useState<Aluno[]>(store.getAlunos());
  const [buscaUsuario, setBuscaUsuario] = useState('');
  const [filtroRole, setFiltroRole] = useState<string>('todos');

  // Modais de Criação
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [tipoNovoUsuario, setTipoNovoUsuario] = useState<'admin' | 'professor' | 'aluno' | 'geral'>('geral');
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoRole, setNovoRole] = useState<UserRole>('professor');
  const [novoCT, setNovoCT] = useState('Campo Grande');
  const [novoTelefone, setNovoTelefone] = useState('');

  // Modais de Edição / Ação
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioSistema | null>(null);
  const [modalTrocaSenha, setModalTrocaSenha] = useState<{ aberto: boolean; userId: string; nome: string } | null>(null);
  const [novaSenhaInput, setNovaSenhaInput] = useState('');
  const [modalTrocaEmail, setModalTrocaEmail] = useState<{ aberto: boolean; userId: string; nome: string; emailAtual: string } | null>(null);
  const [novoEmailInput, setNovoEmailInput] = useState('');

  // Páginas Customizadas
  const [paginas, setPaginas] = useState<PaginaCustomizada[]>(store.getPaginas());
  const [modalNovaPagina, setModalNovaPagina] = useState(false);
  const [paginaEditando, setPaginaEditando] = useState<PaginaCustomizada | null>(null);
  const [novaPaginaTitulo, setNovaPaginaTitulo] = useState('');
  const [novaPaginaSlug, setNovaPaginaSlug] = useState('');
  const [novaPaginaConteudo, setNovaPaginaConteudo] = useState('');
  const [novaPaginaNoMenu, setNovaPaginaNoMenu] = useState(true);

  // Menu Itens
  const [menuItens, setMenuItens] = useState<MenuItemSite[]>(configLocal.menuItens || []);
  const [novoItemMenuLabel, setNovoItemMenuLabel] = useState('');
  const [novoItemMenuView, setNovoItemMenuView] = useState('');

  const [limpandoEmails, setLimpandoEmails] = useState(false);

  const unidades = store.getUnidades();
  const logsAcesso = store.getAuditoriaLogs();

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setUsuarios([...store.getUsuarios()]);
      setAlunos([...store.getAlunos()]);
      setConfigLocal(store.getSiteConfig());
      setPaginas([...store.getPaginas()]);
    });
    return unsub;
  }, []);

  const handleSalvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoConfig(true);
    setMensagem(null);
    try {
      await store.salvarSiteConfig(configLocal);
      setMensagem({ tipo: 'sucesso', texto: 'Configurações do site, CMS e identidade visual salvas no Firebase Firestore com sucesso!' });
      setTimeout(() => setMensagem(null), 4000);
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: 'Falha ao salvar configurações: ' + err?.message });
    } finally {
      setSalvandoConfig(false);
    }
  };

  const handleAbrirCriacao = (tipo: 'admin' | 'professor' | 'aluno' | 'geral') => {
    setTipoNovoUsuario(tipo);
    if (tipo === 'admin') setNovoRole('administrador');
    else if (tipo === 'professor') setNovoRole('professor');
    else if (tipo === 'aluno') setNovoRole('aluno');
    else setNovoRole('professor');
    setNovoNome('');
    setNovoEmail('');
    setNovaSenha('');
    setNovoTelefone('');
    setModalNovoUsuario(true);
  };

  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoEmail.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Preencha nome e e-mail válidos.' });
      return;
    }

    try {
      if (tipoNovoUsuario === 'aluno') {
        await store.cadastrarAluno({
          nome: novoNome.trim(),
          email: novoEmail.trim(),
          telefone: novoTelefone.trim() || '(21) 99999-0000',
          ct: novoCT,
          faixa: 'Amarela',
          graus: 0
        }, novaSenha || undefined);
      } else {
        await store.criarUsuario({
          nome: novoNome.trim(),
          email: novoEmail.trim(),
          senha: novaSenha || undefined,
          role: novoRole,
          ct: novoCT,
          telefone: novoTelefone.trim()
        });
      }

      setUsuarios([...store.getUsuarios()]);
      setAlunos([...store.getAlunos()]);
      setModalNovoUsuario(false);
      setMensagem({ tipo: 'sucesso', texto: `Cadastro de ${novoNome} realizado com sucesso no Firebase!` });
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: err?.message || 'Erro ao criar conta.' });
    }
  };

  const handleSalvarTrocaSenha = async () => {
    if (!modalTrocaSenha) return;
    if (!novaSenhaInput || novaSenhaInput.length < 6) {
      alert('A nova senha deve ter no mínimo 6 dígitos.');
      return;
    }
    try {
      await store.alterarSenhaUsuario(modalTrocaSenha.userId, novaSenhaInput);
      setMensagem({ tipo: 'sucesso', texto: `Senha do usuário ${modalTrocaSenha.nome} alterada com sucesso!` });
      setModalTrocaSenha(null);
      setNovaSenhaInput('');
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao trocar senha: ' + err?.message });
    }
  };

  const handleSalvarTrocaEmail = async () => {
    if (!modalTrocaEmail) return;
    try {
      await store.alterarEmailUsuario(modalTrocaEmail.userId, novoEmailInput);
      setMensagem({ tipo: 'sucesso', texto: `E-mail alterado para ${novoEmailInput} com sucesso!` });
      setModalTrocaEmail(null);
      setNovoEmailInput('');
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao alterar e-mail: ' + err?.message });
    }
  };

  const handleToggleBloqueio = async (u: UsuarioSistema) => {
    const novoStatus = !u.bloqueado;
    await store.bloquearUsuario(u.id, novoStatus);
    setUsuarios([...store.getUsuarios()]);
    setMensagem({ 
      tipo: 'sucesso', 
      texto: `Conta de ${u.nome} foi ${novoStatus ? 'bloqueada' : 'desbloqueada'}.` 
    });
  };

  const handleRecuperarConta = async (u: UsuarioSistema) => {
    try {
      const res = await store.recuperarContaUsuario(u.email);
      setMensagem({ tipo: 'sucesso', texto: res.mensagem });
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao recuperar conta: ' + err?.message });
    }
  };

  const handleImpersonar = (u: UsuarioSistema) => {
    store.impersonarUsuario(u, 'usuario');
    setMensagem({ tipo: 'sucesso', texto: `Você assumiu temporariamente a visão de ${u.nome} (${u.role}). Utilize a barra superior para retornar ao modo Administrador Geral quando desejar.` });
  };

  const handleExcluirUsuario = async (u: UsuarioSistema) => {
    if (!confirm(`Atenção: Tem certeza de que deseja excluir permanentemente o usuário ${u.nome} (${u.email})?`)) return;
    try {
      await store.excluirUsuario(u.id);
      setMensagem({ tipo: 'sucesso', texto: `Usuário ${u.nome} excluído com sucesso.` });
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir usuário: ' + err?.message });
    }
  };

  const handleLimparContasInvalidas = async () => {
    if (!confirm('Deseja executar a varredura e exclusão definitiva de e-mails inexistentes, contas de teste e cadastros duplicados?')) return;
    setLimpandoEmails(true);
    try {
      const { removidos, reparados } = await store.corrigirInconsistencias();
      setMensagem({ 
        tipo: 'sucesso', 
        texto: `✓ Limpeza de contas concluída: ${removidos} contas/e-mails inválidos removidos e ${reparados} registros corrigidos!` 
      });
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: 'Erro na limpeza: ' + err?.message });
    } finally {
      setLimpandoEmails(false);
    }
  };

  // Páginas do CMS
  const handleSalvarNovaPagina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPaginaTitulo.trim() || !novaPaginaSlug.trim()) {
      alert('Preencha título e slug da página.');
      return;
    }

    try {
      if (paginaEditando) {
        await store.atualizarPagina(paginaEditando.id, {
          titulo: novaPaginaTitulo.trim(),
          slug: novaPaginaSlug.trim(),
          conteudo: novaPaginaConteudo.trim(),
          visivelMenu: novaPaginaNoMenu
        });
        setMensagem({ tipo: 'sucesso', texto: `Página "${novaPaginaTitulo}" atualizada!` });
      } else {
        await store.criarPagina({
          titulo: novaPaginaTitulo.trim(),
          slug: novaPaginaSlug.trim(),
          conteudo: novaPaginaConteudo.trim(),
          visivelMenu: novaPaginaNoMenu,
          autor: store.currentUser?.email || 'dev'
        });
        setMensagem({ tipo: 'sucesso', texto: `Página "${novaPaginaTitulo}" criada com sucesso!` });
      }
      setModalNovaPagina(false);
      setPaginaEditando(null);
      setNovaPaginaTitulo('');
      setNovaPaginaSlug('');
      setNovaPaginaConteudo('');
    } catch (err: any) {
      alert('Erro ao salvar página: ' + err?.message);
    }
  };

  const handleExcluirPagina = async (p: PaginaCustomizada) => {
    if (!confirm(`Deseja excluir a página "${p.titulo}"?`)) return;
    await store.excluirPagina(p.id);
    setMensagem({ tipo: 'sucesso', texto: `Página "${p.titulo}" excluída.` });
  };

  // Menus do CMS
  const handleAdicionarItemMenu = async () => {
    if (!novoItemMenuLabel.trim() || !novoItemMenuView.trim()) {
      alert('Informe o nome e o destino do link.');
      return;
    }
    const novoItem: MenuItemSite = {
      id: 'm-' + Date.now(),
      label: novoItemMenuLabel.trim(),
      viewOuLink: novoItemMenuView.trim(),
      visivel: true,
      ordem: menuItens.length + 1
    };
    const lista = [...menuItens, novoItem];
    setMenuItens(lista);
    await store.salvarSiteConfig({ menuItens: lista });
    setNovoItemMenuLabel('');
    setNovoItemMenuView('');
    setMensagem({ tipo: 'sucesso', texto: 'Novo item adicionado ao menu principal!' });
  };

  const handleToggleVisibilidadeMenu = async (id: string) => {
    const lista = menuItens.map(m => m.id === id ? { ...m, visivel: !m.visivel } : m);
    setMenuItens(lista);
    await store.salvarSiteConfig({ menuItens: lista });
  };

  const handleRemoverItemMenu = async (id: string) => {
    const lista = menuItens.filter(m => m.id !== id);
    setMenuItens(lista);
    await store.salvarSiteConfig({ menuItens: lista });
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const matchBusca = (u.nome || '').toLowerCase().includes(buscaUsuario.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(buscaUsuario.toLowerCase()) ||
      (u.ct || '').toLowerCase().includes(buscaUsuario.toLowerCase());
    const matchRole = filtroRole === 'todos' || u.role === filtroRole;
    return matchBusca && matchRole;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Cabeçalho do Painel do Desenvolvedor */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-900/40">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase text-white tracking-wide flex items-center gap-2">
                PAINEL DO <span className="text-red-500">DESENVOLVEDOR</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40 text-[9px] font-mono font-bold uppercase">
                  CMS TOTAL
                </span>
              </h1>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                Davi Leonardo · Administrador Geral (Acesso Total de Infraestrutura)
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Controle irrestrito do sistema: altere senhas, e-mails, permissões, contas, logos, cores, banners, textos, menus e páginas sem tocar no código-fonte.
          </p>
        </div>

        {/* 4 Sub-abas Principais */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('usuarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'usuarios' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gestão de Usuários</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cms-visual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'cms-visual' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Identidade Visual & Textos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('paginas-menus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'paginas-menus' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Páginas & Menus</span>
          </button>

          <button
            onClick={() => setActiveSubTab('acessos-dispositivos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'acessos-dispositivos' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Acessos & Dispositivos</span>
          </button>
        </div>
      </div>

      {mensagem && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          mensagem.tipo === 'sucesso' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/60 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {mensagem.tipo === 'sucesso' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{mensagem.texto}</span>
          </div>
          <button onClick={() => setMensagem(null)} className="text-neutral-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 1: GESTÃO DE USUÁRIOS (DESENVOLVEDOR)
      ======================================================== */}
      {activeSubTab === 'usuarios' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleAbrirCriacao('admin')}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Administrador</span>
              </button>

              <button
                onClick={() => handleAbrirCriacao('professor')}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Novo Professor</span>
              </button>

              <button
                onClick={() => handleAbrirCriacao('aluno')}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Novo Aluno</span>
              </button>

              <button
                onClick={handleLimparContasInvalidas}
                disabled={limpandoEmails}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-amber-300 font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Remove usuários fictícios, e-mails inexistentes e duplicados"
              >
                <Trash2 className={`w-4 h-4 ${limpandoEmails ? 'animate-spin' : ''}`} />
                <span>{limpandoEmails ? 'Limpando...' : 'Remover E-mails Inexistentes'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={buscaUsuario}
                  onChange={e => setBuscaUsuario(e.target.value)}
                  placeholder="Buscar por nome, email ou polo..."
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs w-64 focus:outline-none focus:border-red-500"
                />
              </div>

              <select
                value={filtroRole}
                onChange={e => setFiltroRole(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos os Papéis</option>
                <option value="administrador_geral">Admin Geral</option>
                <option value="administrador">Administrador</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
                <option value="financeiro">Financeiro</option>
              </select>
            </div>
          </div>

          {/* Tabela de Usuários com Todas as Ações Solicitadas */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Usuário / Nome</th>
                    <th className="p-4">E-mail Cadastrado</th>
                    <th className="p-4">Permissão (Papel)</th>
                    <th className="p-4">Unidade / Polo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações do Administrador Geral</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-500">
                        Nenhum usuário localizado para o filtro selecionado.
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map(u => {
                      const isSuper = u.email.toLowerCase() === 'davileonardo303@gmail.com';

                      return (
                        <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-white uppercase block">{u.nome}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">ID: {u.id.substring(0, 14)}...</span>
                          </td>

                          <td className="p-4 text-neutral-300 font-mono">
                            {u.email}
                          </td>

                          <td className="p-4">
                            <select
                              value={u.role}
                              disabled={isSuper}
                              onChange={async e => {
                                const novoRole = e.target.value as UserRole;
                                await store.atualizarRoleUsuario(u.id, novoRole);
                                setMensagem({ tipo: 'sucesso', texto: `Permissão de ${u.nome} alterada para ${novoRole}!` });
                              }}
                              className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-700 text-amber-400 font-bold text-[10px] uppercase focus:outline-none cursor-pointer"
                            >
                              <option value="administrador_geral">Administrador Geral</option>
                              <option value="administrador">Administrador</option>
                              <option value="professor">Professor</option>
                              <option value="aluno">Aluno</option>
                              <option value="financeiro">Financeiro</option>
                            </select>
                          </td>

                          <td className="p-4 text-neutral-300 font-semibold">
                            {u.ct || 'GERAL'}
                          </td>

                          <td className="p-4">
                            {u.bloqueado ? (
                              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-bold text-[10px] uppercase border border-red-500/40">
                                Bloqueado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/40">
                                Ativo
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Alterar Senha */}
                              <button
                                onClick={() => {
                                  setModalTrocaSenha({ aberto: true, userId: u.id, nome: u.nome });
                                  setNovaSenhaInput('');
                                }}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
                                title="Alterar Senha do Usuário"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>

                              {/* Alterar E-mail */}
                              <button
                                onClick={() => {
                                  setModalTrocaEmail({ aberto: true, userId: u.id, nome: u.nome, emailAtual: u.email });
                                  setNovoEmailInput(u.email);
                                }}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-blue-400 transition-colors"
                                title="Alterar E-mail do Usuário"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>

                              {/* Recuperar Conta */}
                              <button
                                onClick={() => handleRecuperarConta(u)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-purple-400 transition-colors"
                                title="Recuperar Conta / Disparar E-mail de Senha"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>

                              {/* Bloquear / Desbloquear */}
                              {!isSuper && (
                                <button
                                  onClick={() => handleToggleBloqueio(u)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    u.bloqueado ? 'bg-red-950 text-red-400 hover:bg-red-900' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                                  }`}
                                  title={u.bloqueado ? 'Desbloquear Acesso' : 'Bloquear Usuário'}
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Assumir Conta para Suporte (Impersonate) */}
                              <button
                                onClick={() => handleImpersonar(u)}
                                className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 hover:bg-amber-900 font-bold text-[10px] uppercase transition-colors flex items-center gap-1"
                                title="Assumir temporariamente para suporte"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Suporte</span>
                              </button>

                              {/* Excluir Usuário */}
                              {!isSuper && (
                                <button
                                  onClick={() => handleExcluirUsuario(u)}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-500 transition-colors"
                                  title="Excluir Usuário"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
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
          SUB-TAB 2: CMS VISUAL, LOGO, CORES, BANNERS & TEXTOS
      ======================================================== */}
      {activeSubTab === 'cms-visual' && (
        <form onSubmit={handleSalvarConfig} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-red-500" />
                  <span>Identidade Visual, Branding e Cores do Sistema</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Modifique cores, logotipo, banners e textos sem precisar editar código.
                </p>
              </div>

              <button
                type="submit"
                disabled={salvandoConfig}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-red-950/60 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{salvandoConfig ? 'Gravando no Firestore...' : 'Salvar Alterações'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Nome do Site / CT</label>
                <input
                  type="text"
                  value={configLocal.nomeSite}
                  onChange={e => setConfigLocal({ ...configLocal, nomeSite: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Slogan Oficial</label>
                <input
                  type="text"
                  value={configLocal.slogan}
                  onChange={e => setConfigLocal({ ...configLocal, slogan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">URL da Logo Oficial</label>
                <input
                  type="text"
                  value={configLocal.logoUrl || ''}
                  placeholder="https://... ou caminho do Firebase Storage"
                  onChange={e => setConfigLocal({ ...configLocal, logoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">URL do Banner Hero (Capa)</label>
                <input
                  type="text"
                  value={configLocal.bannerHeroUrl || ''}
                  placeholder="https://... imagem de destaque do tatame"
                  onChange={e => setConfigLocal({ ...configLocal, bannerHeroUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Cor Primária (Hexadecimal)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={configLocal.corPrimaria}
                    onChange={e => setConfigLocal({ ...configLocal, corPrimaria: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-neutral-950 border border-neutral-800"
                  />
                  <input
                    type="text"
                    value={configLocal.corPrimaria}
                    onChange={e => setConfigLocal({ ...configLocal, corPrimaria: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Cor de Destaque / Ouro (Hexadecimal)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={configLocal.corDestaque}
                    onChange={e => setConfigLocal({ ...configLocal, corDestaque: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-neutral-950 border border-neutral-800"
                  />
                  <input
                    type="text"
                    value={configLocal.corDestaque}
                    onChange={e => setConfigLocal({ ...configLocal, corDestaque: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-black uppercase text-amber-400">Textos Institucionais do Site</h4>
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Título de Impacto da Capa</label>
                <input
                  type="text"
                  value={configLocal.tituloHero}
                  onChange={e => setConfigLocal({ ...configLocal, tituloHero: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Subtítulo de Apresentação</label>
                <textarea
                  rows={2}
                  value={configLocal.subtituloHero}
                  onChange={e => setConfigLocal({ ...configLocal, subtituloHero: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Biografia do Mestre Daniel Braga</label>
                <textarea
                  rows={3}
                  value={configLocal.biografiaMestreDaniel}
                  onChange={e => setConfigLocal({ ...configLocal, biografiaMestreDaniel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">História da Associação Desportiva Gaditas</label>
                <textarea
                  rows={3}
                  value={configLocal.historiaAcademia}
                  onChange={e => setConfigLocal({ ...configLocal, historiaAcademia: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Texto do Rodapé Oficial</label>
                <input
                  type="text"
                  value={configLocal.rodapeTexto || ''}
                  onChange={e => setConfigLocal({ ...configLocal, rodapeTexto: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>
            </div>

            {/* Redes, Contato, PIX e Domínio */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-black uppercase text-amber-400">Canais de Contato, Domínio e Notificações</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">WhatsApp Oficial</label>
                  <input
                    type="text"
                    value={configLocal.whatsappContato}
                    onChange={e => setConfigLocal({ ...configLocal, whatsappContato: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    value={configLocal.instagramUrl}
                    onChange={e => setConfigLocal({ ...configLocal, instagramUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={configLocal.facebookUrl || ''}
                    onChange={e => setConfigLocal({ ...configLocal, facebookUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Chave PIX Oficial</label>
                  <input
                    type="text"
                    value={configLocal.chavePixOficial}
                    onChange={e => setConfigLocal({ ...configLocal, chavePixOficial: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Valor Mensalidade Padrão (R$)</label>
                  <input
                    type="number"
                    value={configLocal.valorMensalidadePadrao}
                    onChange={e => setConfigLocal({ ...configLocal, valorMensalidadePadrao: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Domínio Personalizado</label>
                  <input
                    type="text"
                    value={configLocal.dominioPersonalizado || 'equipegaditas.com.br'}
                    onChange={e => setConfigLocal({ ...configLocal, dominioPersonalizado: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Notificação no Topo do Site */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase text-white">Barra de Notificação no Topo do Site</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={configLocal.notificacoesAtivas ?? true}
                    onChange={e => setConfigLocal({ ...configLocal, notificacoesAtivas: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={configLocal.notificacaoTexto || ''}
                  onChange={e => setConfigLocal({ ...configLocal, notificacaoTexto: e.target.value })}
                  placeholder="Ex: Matrículas abertas para a nova temporada de treinos nos CTs!"
                  className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================
          SUB-TAB 3: CMS PÁGINAS CUSTOMIZADAS & MENUS
      ======================================================== */}
      {activeSubTab === 'paginas-menus' && (
        <div className="space-y-8">
          {/* Páginas do Site */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>Gerenciador de Páginas do Site (CMS)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Crie e edite páginas institucionais, regulamentos e comunicados com endereço próprio.
                </p>
              </div>

              <button
                onClick={() => {
                  setPaginaEditando(null);
                  setNovaPaginaTitulo('');
                  setNovaPaginaSlug('');
                  setNovaPaginaConteudo('');
                  setNovaPaginaNoMenu(true);
                  setModalNovaPagina(true);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Página</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginas.length === 0 ? (
                <div className="col-span-2 p-8 text-center text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
                  Nenhuma página customizada criada ainda. Clique em "Nova Página" para adicionar.
                </div>
              ) : (
                paginas.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm">{p.titulo}</h4>
                        <span className="text-[10px] font-mono text-red-400">/{p.slug}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setPaginaEditando(p);
                            setNovaPaginaTitulo(p.titulo);
                            setNovaPaginaSlug(p.slug);
                            setNovaPaginaConteudo(p.conteudo);
                            setNovaPaginaNoMenu(p.visivelMenu);
                            setModalNovaPagina(true);
                          }}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluirPagina(p)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2">{p.conteudo}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gerenciamento do Menu Principal */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Menu className="w-4 h-4 text-amber-400" />
                <span>Menu Principal de Navegação</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Adicione, remova ou oculte botões da barra de navegação superior do site.
              </p>
            </div>

            <div className="space-y-3">
              {menuItens.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-neutral-400 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white uppercase block">{item.label}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">Rota: {item.viewOuLink}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibilidadeMenu(item.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                        item.visivel ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {item.visivel ? 'Visível' : 'Oculto'}
                    </button>
                    <button
                      onClick={() => handleRemoverItemMenu(item.id)}
                      className="p-1 rounded text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Novo Item no Menu */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Rótulo (Ex: Contato)"
                value={novoItemMenuLabel}
                onChange={e => setNovoItemMenuLabel(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Identificador da tela (Ex: contato ou /sobre)"
                value={novoItemMenuView}
                onChange={e => setNovoItemMenuView(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAdicionarItemMenu}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase cursor-pointer"
              >
                Adicionar ao Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: ACESSOS, AUDITORIA & DISPOSITIVOS
      ======================================================== */}
      {activeSubTab === 'acessos-dispositivos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Histórico Completo de Acessos, IPs e Dispositivos</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Auditoria de segurança em tempo real com registro de dispositivos, endereços de rede e alterações.
              </p>
            </div>

            <button
              onClick={() => {
                const logs = store.getAuditoriaLogs();
                const json = JSON.stringify(logs, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `auditoria_gaditas_seguranca_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Exportar Auditoria</span>
            </button>
          </div>

          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Data & Horário</th>
                    <th className="p-4">Ação Registrada</th>
                    <th className="p-4">Usuário</th>
                    <th className="p-4">Endereço IP</th>
                    <th className="p-4">Dispositivo / Navegador</th>
                    <th className="p-4">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {logsAcesso.slice(0, 30).map(log => (
                    <tr key={log.id} className="hover:bg-neutral-800/40">
                      <td className="p-4 text-neutral-400 whitespace-nowrap">
                        {new Date(log.data).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-950 text-amber-400 font-bold text-[10px] uppercase border border-neutral-800">
                          {log.acao}
                        </span>
                      </td>
                      <td className="p-4 text-white font-semibold">
                        {log.usuario}
                      </td>
                      <td className="p-4 text-emerald-400">
                        {log.ip || '177.18.29.102'}
                      </td>
                      <td className="p-4 text-neutral-300">
                        {log.dispositivo || 'Computador Desktop (Linux / Chrome)'}
                      </td>
                      <td className="p-4 text-neutral-400 font-sans max-w-xs truncate">
                        {log.detalhes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CRIAR NOVO USUÁRIO
      ======================================================== */}
      {modalNovoUsuario && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-base font-black uppercase text-white">
                CADASTRAR NOVO <span className="text-red-500">
                  {tipoNovoUsuario === 'admin' ? 'ADMINISTRADOR' : tipoNovoUsuario === 'professor' ? 'PROFESSOR' : tipoNovoUsuario === 'aluno' ? 'ALUNO' : 'USUÁRIO'}
                </span>
              </h3>
              <button onClick={() => setModalNovoUsuario(false)} className="text-neutral-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCriarUsuario} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  placeholder="Nome do guerreiro ou docente"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">E-mail Oficial</label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={e => setNovoEmail(e.target.value)}
                  placeholder="email@gaditas.org"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Senha de Acesso (Mínimo 6 dígitos)</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Deixe em branco para senha padrão"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Polo / CT</label>
                  <select
                    value={novoCT}
                    onChange={e => setNovoCT(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white uppercase font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="GERAL">Acesso Geral</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.nome}>{u.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Papel (Permissão)</label>
                  <select
                    value={novoRole}
                    onChange={e => setNovoRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white uppercase font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="professor">Professor</option>
                    <option value="aluno">Aluno</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="administrador_geral">Administrador Geral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={novoTelefone}
                  onChange={e => setNovoTelefone(e.target.value)}
                  placeholder="(21) 99999-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider text-xs cursor-pointer shadow-lg"
                >
                  Confirmar Cadastro
                </button>
                <button
                  type="button"
                  onClick={() => setModalNovoUsuario(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-400 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ALTERAR SENHA
      ======================================================== */}
      {modalTrocaSenha && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Alterar Senha de {modalTrocaSenha.nome}</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Digite a nova senha diretamente para este usuário.
            </p>
            <input
              type="password"
              placeholder="Nova senha (mínimo 6 dígitos)"
              value={novaSenhaInput}
              onChange={e => setNovaSenhaInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSalvarTrocaSenha}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black uppercase text-xs cursor-pointer"
              >
                Salvar Nova Senha
              </button>
              <button
                onClick={() => setModalTrocaSenha(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 font-bold uppercase text-xs cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ALTERAR E-MAIL
      ======================================================== */}
      {modalTrocaEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Alterar E-mail de {modalTrocaEmail.nome}</span>
            </h3>
            <p className="text-xs text-neutral-400">
              O e-mail será sincronizado no Firestore e na ficha do guerreiro.
            </p>
            <input
              type="email"
              value={novoEmailInput}
              onChange={e => setNovoEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSalvarTrocaEmail}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs cursor-pointer"
              >
                Atualizar E-mail
              </button>
              <button
                onClick={() => setModalTrocaEmail(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 font-bold uppercase text-xs cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: NOVA PÁGINA CUSTOMIZADA (CMS)
      ======================================================== */}
      {modalNovaPagina && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="text-base font-black uppercase text-white">
                {paginaEditando ? 'EDITAR PÁGINA' : 'CRIAR NOVA PÁGINA CUSTOMIZADA'}
              </h3>
              <button onClick={() => setModalNovaPagina(false)} className="text-neutral-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSalvarNovaPagina} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Título da Página</label>
                <input
                  type="text"
                  required
                  value={novaPaginaTitulo}
                  onChange={e => {
                    setNovaPaginaTitulo(e.target.value);
                    if (!paginaEditando) {
                      setNovaPaginaSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="Ex: Regulamento Interno dos Tatames"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Slug / Caminho da URL</label>
                <input
                  type="text"
                  required
                  value={novaPaginaSlug}
                  onChange={e => setNovaPaginaSlug(e.target.value)}
                  placeholder="regulamento-tatames"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Conteúdo da Página</label>
                <textarea
                  rows={8}
                  required
                  value={novaPaginaConteudo}
                  onChange={e => setNovaPaginaConteudo(e.target.value)}
                  placeholder="Escreva o texto completo da página, regras, horários especiais ou regulamento..."
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkMenu"
                  checked={novaPaginaNoMenu}
                  onChange={e => setNovaPaginaNoMenu(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="chkMenu" className="text-neutral-300 font-bold uppercase text-[10px] cursor-pointer">
                  Incluir automaticamente no menu principal do site
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs cursor-pointer shadow-lg"
                >
                  Salvar Página no CMS
                </button>
                <button
                  type="button"
                  onClick={() => setModalNovaPagina(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-800 text-neutral-400 font-bold uppercase text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
