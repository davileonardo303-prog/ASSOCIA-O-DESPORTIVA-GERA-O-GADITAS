import React, { useState } from 'react';
import { Shield, Menu, X, User, Lock, Award, ArrowRight, Bell, UserCheck, LogOut, Code } from 'lucide-react';
import { Aluno } from '../types';
import { store } from '../services/store';

import lionEmblemImg from '../assets/images/gaditas_lion_emblem_1791983074366.jpg';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  alunoLogado: Aluno | null;
  adminLogado: { ct: string; nome: string; isAdmin: boolean } | null;
  onLogoutAdmin: () => void;
  onLogoutAluno: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  alunoLogado,
  adminLogado,
  onLogoutAdmin,
  onLogoutAluno
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState(() => store.getSiteConfig());
  const [impersonado, setImpersonado] = useState(() => store.getUsuarioImpersonado());

  const [globalScreens, setGlobalScreens] = useState(() => store.getGlobalScreens());

  React.useEffect(() => {
    const unsub = store.subscribe(() => {
      setSiteConfig(store.getSiteConfig());
      setGlobalScreens(store.getGlobalScreens());
      setImpersonado(store.getUsuarioImpersonado());
    });
    return unsub;
  }, []);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const avisoAtivo = (globalScreens?.global?.notificacaoTopoAtiva && globalScreens?.global?.notificacaoTopoTexto) || (siteConfig.notificacoesAtivas && siteConfig.notificacaoTexto);
  const textoAviso = globalScreens?.global?.notificacaoTopoTexto || siteConfig.notificacaoTexto || '';
  const corAviso = globalScreens?.global?.notificacaoTopoCor || 'amarelo';
  const expiracao = globalScreens?.global?.notificacaoDataExpiracao;
  const expirado = expiracao ? new Date(expiracao + 'T23:59:59').getTime() < Date.now() : false;

  const bgCorClasses = {
    amarelo: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black',
    vermelho: 'bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white',
    verde: 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white',
    azul: 'bg-gradient-to-r from-sky-700 via-sky-600 to-sky-700 text-white'
  }[corAviso] || 'bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white';

  return (
    <>
      {/* Barra de Impersonação / Modo Suporte */}
      {impersonado && (
        <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-between text-xs font-black uppercase tracking-wider z-50 sticky top-0 shadow-lg">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 animate-bounce" />
            <span>MODO SUPORTE ATIVO: NAVEGANDO COMO {impersonado.nome.toUpperCase()} ({impersonado.email})</span>
          </div>
          <button
            onClick={() => {
              store.pararImpersonacao();
              location.reload();
            }}
            className="px-3 py-1 bg-black text-amber-400 hover:text-white rounded-lg text-[10px] font-black uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Modo Suporte</span>
          </button>
        </div>
      )}

      {/* Barra de Notificação Global configurada no CMS com cores e agendamento */}
      {avisoAtivo && !expirado && (
        <div className={`${bgCorClasses} text-[11px] font-black uppercase tracking-wider py-1.5 px-4 text-center shadow-md flex items-center justify-center gap-2 transition-colors`}>
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>{textoAviso}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#070708]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Zone 1: Brand Wordmark / Custom Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <img 
              src={siteConfig.logoUrl || lionEmblemImg} 
              alt="Logo Oficial Equipe Gaditas" 
              className="w-11 h-11 object-contain rounded-full border border-amber-500/50 p-0.5 bg-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-none">
                {siteConfig.nomeSite ? (
                  siteConfig.nomeSite
                ) : (
                  <>EQUIPE <span className="text-red-500 text-shadow-red">GADITAS</span></>
                )}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 leading-tight mt-0.5">
                {siteConfig.descricaoHero?.slice(0, 32) || 'Fight Team · Mestre Daniel'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-neutral-300">
            <button
              onClick={() => handleNav('home')}
              className={`transition-colors py-1 border-b-2 cursor-pointer ${
                currentView === 'home'
                  ? 'text-white border-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => handleNav('sobre')}
              className={`transition-colors py-1 border-b-2 cursor-pointer ${
                currentView === 'sobre'
                  ? 'text-white border-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Sobre o CT
            </button>
            <button
              onClick={() => handleNav('galeria')}
              className={`transition-colors py-1 border-b-2 cursor-pointer ${
                currentView === 'galeria'
                  ? 'text-white border-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Galeria
            </button>
            <button
              onClick={() => handleNav('matricula')}
              className={`transition-colors py-1 border-b-2 cursor-pointer ${
                currentView === 'matricula'
                  ? 'text-white border-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Matrícula Online
            </button>

            {/* Links Dinâmicos do CMS (Apenas os públicos ou permitidos) */}
            {siteConfig.menuItens?.filter(m => (m.ativo ?? m.visivel) && !['admin-portal', 'saude-firebase', 'painel-dev', 'cms'].includes(m.viewOuLink || m.url || '')).map(item => {
              const urlDestino = item.url || item.viewOuLink || 'home';
              const tituloMenu = item.titulo || item.label || 'Link';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (urlDestino.startsWith('http')) {
                      window.open(urlDestino, '_blank');
                    } else {
                      handleNav(urlDestino);
                    }
                  }}
                  className={`transition-colors py-1 border-b-2 cursor-pointer ${
                    currentView === urlDestino
                      ? 'text-white border-red-500'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  {tituloMenu}
                </button>
              );
            })}

            {/* Ferramentas Administrativas: EXCLUSIVAS PARA ADMINISTRADORES AUTENTICADOS (RBAC) */}
            {adminLogado && (adminLogado.isAdmin || store.isUsuarioAdminGeral()) && (
              <>
                <button
                  onClick={() => handleNav('saude-firebase')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'saude-firebase'
                      ? 'text-emerald-400 border-emerald-500'
                      : 'border-transparent text-neutral-400 hover:text-emerald-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Saúde Firebase</span>
                </button>

                <button
                  onClick={() => handleNav('painel-dev')}
                  className={`transition-colors py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'painel-dev'
                      ? 'text-amber-400 border-amber-500 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-amber-400'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>CMS Visual</span>
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Action & Session Portals */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Botão Área do Aluno */}
            {alunoLogado ? (
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 rounded-lg p-1.5 pl-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white uppercase truncate max-w-[120px]">
                    {alunoLogado.nome.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-amber-400 font-semibold uppercase">
                    #{alunoLogado.matricula} · {alunoLogado.faixa}
                  </span>
                </div>
                <button
                  onClick={() => handleNav('aluno-portal')}
                  className="px-2.5 py-1 text-xs font-bold bg-neutral-800 text-neutral-200 rounded hover:bg-neutral-700 cursor-pointer"
                >
                  Painel
                </button>
                <button
                  onClick={onLogoutAluno}
                  className="text-[10px] text-neutral-400 hover:text-red-400 px-1 cursor-pointer"
                  title="Sair da conta"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('aluno-portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-all border cursor-pointer ${
                  currentView === 'aluno-portal'
                    ? 'bg-neutral-800 text-white border-neutral-600'
                    : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Área do Aluno</span>
              </button>
            )}

            {/* Botão Painel Professor / Admin */}
            {adminLogado ? (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-lg p-1.5 pl-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white uppercase truncate max-w-[130px]">
                    {adminLogado.nome.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-red-400 font-bold uppercase">
                    {adminLogado.ct === 'GERAL' ? 'Admin Geral' : `CT ${adminLogado.ct}`}
                  </span>
                </div>
                <button
                  onClick={() => handleNav('admin-portal')}
                  className="px-2.5 py-1.5 text-xs font-black bg-red-600 text-white rounded hover:bg-red-500 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  ERP CT
                </button>
                <button
                  onClick={() => handleNav('painel-dev')}
                  className="px-2.5 py-1.5 text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 text-white rounded hover:opacity-90 transition-all uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1"
                  title="Painel CMS Visual com Preview Real"
                >
                  <Code className="w-3.5 h-3.5 text-amber-200" />
                  <span>CMS</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="text-[10px] text-neutral-400 hover:text-red-400 px-1 cursor-pointer"
                  title="Desconectar do painel"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('admin-portal')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Docente / Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-800">
              <button
                onClick={() => handleNav('home')}
                className={`p-3 text-left rounded-lg text-xs font-bold uppercase ${
                  currentView === 'home' ? 'bg-red-600/20 text-red-400 border border-red-500/40' : 'bg-neutral-900 text-neutral-300'
                }`}
              >
                Início
              </button>
              <button
                onClick={() => handleNav('sobre')}
                className={`p-3 text-left rounded-lg text-xs font-bold uppercase ${
                  currentView === 'sobre' ? 'bg-red-600/20 text-red-400 border border-red-500/40' : 'bg-neutral-900 text-neutral-300'
                }`}
              >
                Sobre o CT
              </button>
              <button
                onClick={() => handleNav('galeria')}
                className={`p-3 text-left rounded-lg text-xs font-bold uppercase ${
                  currentView === 'galeria' ? 'bg-red-600/20 text-red-400 border border-red-500/40' : 'bg-neutral-900 text-neutral-300'
                }`}
              >
                Galeria
              </button>
              <button
                onClick={() => handleNav('matricula')}
                className={`p-3 text-left rounded-lg text-xs font-bold uppercase ${
                  currentView === 'matricula' ? 'bg-red-600/20 text-red-400 border border-red-500/40' : 'bg-neutral-900 text-neutral-300'
                }`}
              >
                Matrícula
              </button>

              {/* Menu items dinâmicos públicos */}
              {siteConfig.menuItens?.filter(m => (m.ativo ?? m.visivel) && !['admin-portal', 'saude-firebase', 'painel-dev', 'cms'].includes(m.viewOuLink || m.url || '')).map(item => {
                const urlDestino = item.url || item.viewOuLink || 'home';
                const tituloMenu = item.titulo || item.label || 'Link';
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(urlDestino)}
                    className={`p-3 text-left rounded-lg text-xs font-bold uppercase ${
                      currentView === urlDestino ? 'bg-red-600/20 text-red-400 border border-red-500/40' : 'bg-neutral-900 text-neutral-300'
                    }`}
                  >
                    {tituloMenu}
                  </button>
                );
              })}

              {/* Ferramentas de Admin no Mobile: SOMENTE SE LOGADO COMO ADMIN */}
              {adminLogado && (adminLogado.isAdmin || store.isUsuarioAdminGeral()) && (
                <>
                  <button
                    onClick={() => handleNav('saude-firebase')}
                    className={`p-3 text-left rounded-lg text-xs font-bold uppercase flex items-center gap-2 ${
                      currentView === 'saude-firebase' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40' : 'bg-neutral-900 text-neutral-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Saúde Firebase</span>
                  </button>

                  <button
                    onClick={() => handleNav('painel-dev')}
                    className={`p-3 text-left rounded-lg text-xs font-bold uppercase flex items-center gap-2 ${
                      currentView === 'painel-dev' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/40' : 'bg-neutral-900 text-amber-400'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>CMS Visual</span>
                  </button>
                </>
              )}
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => handleNav('aluno-portal')}
                className="w-full flex items-center justify-between p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-bold text-xs uppercase cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{alunoLogado ? `Portal: ${alunoLogado.nome}` : 'Portal do Aluno (Login)'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </button>

              <button
                onClick={() => handleNav('admin-portal')}
                className="w-full flex items-center justify-between p-3.5 rounded-lg bg-red-950/40 border border-red-700/50 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>{adminLogado ? `ERP: ${adminLogado.nome}` : 'Painel Professor / Admin'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </button>

              {(alunoLogado || adminLogado) && (
                <div className="flex justify-between items-center pt-2 px-1 text-xs text-neutral-400">
                  <span>Sessão ativa</span>
                  <div className="flex gap-4">
                    {alunoLogado && (
                      <button onClick={onLogoutAluno} className="text-red-400 underline cursor-pointer">
                        Sair Aluno
                      </button>
                    )}
                    {adminLogado && (
                      <button onClick={onLogoutAdmin} className="text-red-400 underline cursor-pointer">
                        Sair Admin
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
