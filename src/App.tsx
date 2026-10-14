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
import { PaginaCustomizada } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [alunoLogado, setAlunoLogado] = useState(store.getAlunoLogado());
  const [adminLogado, setAdminLogado] = useState(store.getAdminSession());
  const [paginasCustom, setPaginasCustom] = useState<PaginaCustomizada[]>(store.getPaginasCustomizadas());

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
    if (currentView === 'admin-portal') {
      setCurrentView('home');
    }
  };

  const handleLogoutAluno = () => {
    store.logoutAluno();
    if (currentView === 'aluno-portal') {
      setCurrentView('home');
    }
  };

  const isErpView = currentView === 'admin-portal' && adminLogado !== null;

  // Página Customizada CMS
  const customPageSlug = currentView.startsWith('pagina-') ? currentView.replace('pagina-', '') : null;
  const customPage = customPageSlug ? paginasCustom.find((p: PaginaCustomizada) => p.slug === customPageSlug) : null;

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navbar Superior (Presente em todas as páginas públicas e portais de login) */}
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
      <div className="flex-1">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}
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
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => handleNavigate('home')}
                className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
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
      </div>

      {/* Footer (Apenas em telas institucionais/públicas) */}
      {!isErpView && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
