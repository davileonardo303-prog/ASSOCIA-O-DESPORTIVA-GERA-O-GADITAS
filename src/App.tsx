import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { GalleryView } from './views/GalleryView';
import { EnrollmentView } from './views/EnrollmentView';
import { StudentPortalView } from './views/StudentPortalView';
import { AdminPortalView } from './views/AdminPortalView';
import { FirebaseHealthView } from './components/FirebaseHealthView';
import { DeveloperCmsPanel } from './components/DeveloperCmsPanel';
import { CustomPageView } from './views/CustomPageView';
import { AdminFloatingToolbar } from './components/AdminFloatingToolbar';
import { ChatbotAtendenteVirtual } from './components/ChatbotAtendenteVirtual';
import { PaginaCustomizada } from './types';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [alunoLogado, setAlunoLogado] = useState(store.getAlunoLogado());
  const [adminLogado, setAdminLogado] = useState(store.getAdminSession());
  const [paginasCustom, setPaginasCustom] = useState<PaginaCustomizada[]>(store.getPaginasCustomizadas());

  // Estado do CMS Visual e Barra Flutuante
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [alteracoesPendentes, setAlteracoesPendentes] = useState<number>(0);
  const [dispositivoPreview, setDispositivoPreview] = useState<'desktop' | 'mobile'>('desktop');

  const isAdminGeral = store.isUsuarioAdminGeral() || (adminLogado && (adminLogado.isAdmin || adminLogado.role === 'administrador_geral'));

  useEffect(() => {
    const config = store.getSiteConfig();
    if (config?.nomeSite) {
      document.title = `${config.nomeSite} - CT de Elite & Sistema de Gestão`;
    }
    const unsub = store.subscribe(() => {
      setAlunoLogado(store.getAlunoLogado());
      setAdminLogado(store.getAdminSession());
      setPaginasCustom(store.getPaginasCustomizadas());
      const cfg = store.getSiteConfig();
      if (cfg?.nomeSite) {
        document.title = `${cfg.nomeSite} - CT de Elite & Sistema de Gestão`;
      }
    });
    return unsub;
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutAdmin = () => {
    store.logoutAdmin();
    setModoEdicao(false);
    if (currentView === 'admin-portal' || currentView === 'saude-firebase' || currentView === 'painel-dev') {
      setCurrentView('home');
    }
  };

  const handleLogoutAluno = () => {
    store.logoutAluno();
    if (currentView === 'aluno-portal') {
      setCurrentView('home');
    }
  };

  const handleSalvarEdicoes = async () => {
    const screens = store.getGlobalScreens();
    await store.salvarGlobalScreens(screens);
    setAlteracoesPendentes(0);
  };

  const handleDescartarEdicoes = () => {
    store.sincronizarBancoGeral();
    setAlteracoesPendentes(0);
  };

  const isErpView = currentView === 'admin-portal' && adminLogado !== null;

  // Página Customizada CMS
  const customPageSlug = currentView.startsWith('pagina-') ? currentView.replace('pagina-', '') : null;
  const customPage = customPageSlug ? paginasCustom.find((p: PaginaCustomizada) => p.slug === customPageSlug) : null;

  // ROUTE GUARDS: Proteção de rotas sensíveis contra acesso direto não autorizado
  const isViewSensivel = currentView === 'saude-firebase' || currentView === 'painel-dev' || currentView === 'cms';
  const temPermissaoAdmin = isAdminGeral;

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-6 px-6">
      
      {/* Navbar Superior com Respiro e Proteção RBAC */}
      {!isErpView && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          alunoLogado={alunoLogado}
          adminLogado={adminLogado}
          onLogoutAdmin={handleLogoutAdmin}
          onLogoutAluno={handleLogoutAluno}
        />
      )}

      {/* Roteamento e Renderização de Telas */}
      <main className="flex-1 w-full pt-2 sm:pt-4">
        
        {/* Simulação Mobile se ativada pelo Admin */}
        <div className={dispositivoPreview === 'mobile' ? 'max-w-[420px] mx-auto border-8 border-neutral-800 rounded-[40px] shadow-2xl overflow-hidden my-6 bg-[#070708] ring-4 ring-amber-500/30' : 'w-full'}>
          
          {/* Caso de Route Guard: Bloqueio de Acesso Não Autorizado */}
          {isViewSensivel && !temPermissaoAdmin ? (
            <div className="max-w-xl mx-auto my-20 p-8 bg-neutral-950 border border-red-500/40 rounded-3xl text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center mx-auto text-red-500">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase text-white">Acesso Restrito ao Sistema</h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Esta ferramenta requer credenciais ativas do grupo <strong className="text-red-400">Administrador Geral</strong> da Equipe Gaditas. Seu perfil atual não possui autorização para visualizar este módulo.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleNavigate('home')}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar ao Início</span>
                </button>
                <button
                  onClick={() => handleNavigate('admin-portal')}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase transition-colors cursor-pointer"
                >
                  Fazer Login Admin
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentView === 'home' && (
                <HomeView 
                  onNavigate={handleNavigate} 
                  modoEdicao={modoEdicao} 
                  onAlteracaoPendente={() => setAlteracoesPendentes(prev => prev + 1)}
                />
              )}
              {currentView === 'sobre' && <AboutView onNavigate={handleNavigate} />}
              {currentView === 'galeria' && <GalleryView />}
              {currentView === 'matricula' && <EnrollmentView onNavigate={handleNavigate} />}
              {currentView === 'aluno-portal' && (
                <StudentPortalView
                  alunoLogado={alunoLogado}
                  onLogout={handleLogoutAluno}
                  onNavigate={handleNavigate}
                />
              )}
              {currentView === 'admin-portal' && (
                <AdminPortalView
                  adminLogado={adminLogado}
                  onLogout={handleLogoutAdmin}
                  onNavigate={handleNavigate}
                />
              )}
              {currentView === 'saude-firebase' && (
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <div className="mb-6 flex items-center justify-between">
                    <button
                      onClick={() => handleNavigate('home')}
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      ← Voltar para o Início
                    </button>
                  </div>
                  <FirebaseHealthView />
                </div>
              )}

              {(currentView === 'painel-dev' || currentView === 'cms') && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <button
                      onClick={() => handleNavigate('home')}
                      className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      ← Voltar para o Site Oficial
                    </button>
                    <span className="text-[11px] font-mono text-amber-400 uppercase">
                      Modo Desenvolvedor & CMS Interativo
                    </span>
                  </div>
                  <DeveloperCmsPanel />
                </div>
              )}

              {/* Exibição de Páginas Customizadas Criadas no CMS */}
              {customPage && (
                <CustomPageView
                  pagina={customPage}
                  onVoltar={() => handleNavigate('home')}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* Footer (Apenas em telas institucionais/públicas) */}
      {!isErpView && <Footer onNavigate={handleNavigate} />}

      {/* BARRA FLUTUANTE DE ADMIN (Exclusiva para Administradores Gerais) */}
      {isAdminGeral && !isErpView && (
        <AdminFloatingToolbar
          modoEdicao={modoEdicao}
          onToggleModoEdicao={() => setModoEdicao(!modoEdicao)}
          alteracoesPendentes={alteracoesPendentes}
          onSalvar={handleSalvarEdicoes}
          onDescartar={handleDescartarEdicoes}
          dispositivoPreview={dispositivoPreview}
          onToggleDispositivo={() => setDispositivoPreview(prev => prev === 'desktop' ? 'mobile' : 'desktop')}
        />
      )}

      {/* CHATBOT ATENDENTE VIRTUAL INTELIGENTE (Substitui WhatsApp Genérico com IA e Triagem) */}
      {!isErpView && <ChatbotAtendenteVirtual />}

    </div>
  );
}
