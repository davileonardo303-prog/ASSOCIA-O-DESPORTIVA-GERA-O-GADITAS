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

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [alunoLogado, setAlunoLogado] = useState(store.getAlunoLogado());
  const [adminLogado, setAdminLogado] = useState(store.getAdminSession());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setAlunoLogado(store.getAlunoLogado());
      setAdminLogado(store.getAdminSession());
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
      </div>

      {/* Footer (Apenas em telas institucionais/públicas) */}
      {!isErpView && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
