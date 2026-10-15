import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  Smartphone, 
  Monitor, 
  ShieldAlert, 
  Users, 
  History, 
  CheckCircle2, 
  Loader2, 
  X, 
  Plus, 
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { GerenciadorFotosModal } from './GerenciadorFotosModal';

interface AdminFloatingToolbarProps {
  modoEdicao: boolean;
  onToggleModoEdicao: () => void;
  alteracoesPendentes: number;
  onSalvar: () => Promise<void>;
  onDescartar: () => void;
  dispositivoPreview: 'desktop' | 'mobile';
  onToggleDispositivo: () => void;
  onOpenImageStudio?: (targetField: string) => void;
}

export const AdminFloatingToolbar: React.FC<AdminFloatingToolbarProps> = ({
  modoEdicao,
  onToggleModoEdicao,
  alteracoesPendentes,
  onSalvar,
  onDescartar,
  dispositivoPreview,
  onToggleDispositivo
}) => {
  const [salvando, setSalvando] = useState(false);
  const [alertaSucesso, setAlertaSucesso] = useState(false);
  const [modalAdmins, setModalAdmins] = useState(false);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [modalFotos, setModalFotos] = useState(false);
  const [novoEmailAdmin, setNovoEmailAdmin] = useState('');
  const [erroAdmin, setErroAdmin] = useState('');
  const [adminsList, setAdminsList] = useState<string[]>(() => store.getAdminsGerais());
  const [lockdown, setLockdown] = useState(() => store.isLockdownAtivo());
  const [historico, setHistorico] = useState<any[]>(() => store.getCmsHistory());

  const user = store.getCurrentUser();
  const userEmail = (user?.email || '').toLowerCase();
  const isSuperAdmin = userEmail === 'davileonardo303@gmail.com';

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setAdminsList(store.getAdminsGerais());
      setLockdown(store.isLockdownAtivo());
      setHistorico(store.getCmsHistory());
    });
    return unsub;
  }, []);

  const handleSalvarPublicar = async () => {
    try {
      setSalvando(true);
      await onSalvar();
      setAlertaSucesso(true);
      setTimeout(() => setAlertaSucesso(false), 4000);
    } catch (err: any) {
      alert(err?.message || 'Falha ao salvar edições no Firebase.');
    } finally {
      setSalvando(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroAdmin('');
    try {
      await store.adicionarAdminGeral(novoEmailAdmin);
      setNovoEmailAdmin('');
    } catch (err: any) {
      setErroAdmin(err?.message || 'Erro ao adicionar administrador.');
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Revogar privilégios de Administrador Geral para ${email}?`)) return;
    try {
      await store.removerAdminGeral(email);
    } catch (err: any) {
      alert(err?.message || 'Erro ao remover administrador.');
    }
  };

  const handleToggleLockdown = async () => {
    try {
      await store.toggleLockdown(!lockdown);
    } catch (err: any) {
      alert(err?.message || 'Falha ao alternar modo lockdown.');
    }
  };

  const handleReverterVersao = async (historyId: string) => {
    if (!confirm('Deseja restaurar esta versão histórica das telas? Todas as configurações serão substituídas.')) return;
    try {
      await store.reverterVersaoCMS(historyId);
      setModalHistorico(false);
      setAlertaSucesso(true);
      setTimeout(() => setAlertaSucesso(false), 4000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao reverter versão.');
    }
  };

  return (
    <>
      {/* Alerta de Sucesso Flutuante */}
      {alertaSucesso && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce text-sm">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Alterações salvas no Firebase e aplicadas em todas as telas em tempo real!</span>
        </div>
      )}

      {/* Alerta de Lockdown Ativo */}
      {lockdown && (
        <div className="fixed top-24 right-6 z-50 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-2xl border border-amber-300">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>Lockdown Ativo (Edições Congeladas para Manutenção)</span>
        </div>
      )}

      {/* BARRA FLUTUANTE FIXA */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-5xl w-[95%] sm:w-auto bg-[#0a0a0c]/95 backdrop-blur-xl border-2 border-red-500/40 rounded-2xl p-2.5 sm:px-5 sm:py-3 shadow-2xl shadow-black/90 flex flex-wrap items-center justify-between gap-3 text-white">
        
        {/* Toggle Modo Edição */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleModoEdicao}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              modoEdicao
                ? 'bg-amber-500 text-black border border-amber-300 shadow-amber-500/30'
                : 'bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Modo Edição: {modoEdicao ? 'ATIVO' : 'DESATIVADO'}</span>
          </button>

          {modoEdicao && alteracoesPendentes > 0 && (
            <span className="px-2.5 py-1 bg-red-600/90 text-white text-[11px] font-black rounded-lg animate-pulse border border-red-400">
              {alteracoesPendentes} pendente{alteracoesPendentes > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Ações de Edição */}
        <div className="flex items-center gap-2 flex-wrap">
          {modoEdicao && (
            <>
              <button
                onClick={handleSalvarPublicar}
                disabled={salvando}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50"
                title="Salvar alterações no Firebase e atualizar para todos os visitantes"
              >
                {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Salvar e Publicar</span>
              </button>

              <button
                onClick={onDescartar}
                disabled={salvando || alteracoesPendentes === 0}
                className="px-3 py-2 rounded-xl text-xs font-bold uppercase bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer disabled:opacity-40"
                title="Descartar alterações não salvas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Descartar</span>
              </button>
            </>
          )}

          {/* Simulador Mobile / Desktop */}
          <button
            onClick={onToggleDispositivo}
            className="p-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer flex items-center gap-1.5"
            title={dispositivoPreview === 'desktop' ? 'Simular tela de celular (Smartphone)' : 'Voltar para tela cheia de computador'}
          >
            {dispositivoPreview === 'desktop' ? (
              <>
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Simular Celular</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline text-[11px]">Computador</span>
              </>
            )}
          </button>

          {/* Histórico / Rollback */}
          <button
            onClick={() => setModalHistorico(true)}
            className="p-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Ver histórico das últimas 10 versões e restaurar"
          >
            <History className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline text-[11px]">Histórico</span>
          </button>

          {/* Gerenciar Administradores */}
          <button
            onClick={() => setModalAdmins(true)}
            className="p-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Gerenciar e-mails do grupo Administrador Geral"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline text-[11px]">Admins</span>
          </button>

          {/* Trocar Fotos do Site (Firebase Storage) */}
          <button
            onClick={() => setModalFotos(true)}
            className="p-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:border-purple-500/50"
            title="Alterar qualquer foto do site e salvar no Firebase Storage"
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline text-[11px]">Trocar Fotos</span>
          </button>

          {/* Botão de Lockdown Exclusivo Super Admin */}
          {isSuperAdmin && (
            <button
              onClick={handleToggleLockdown}
              className={`p-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
                lockdown
                  ? 'bg-amber-600 text-black border-amber-300'
                  : 'bg-neutral-900 text-neutral-400 hover:text-amber-400 border-neutral-800'
              }`}
              title="Congelar edições no site durante manutenções"
            >
              {lockdown ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span className="hidden lg:inline text-[11px]">Lockdown</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL: GERENCIAR ADMINISTRADORES */}
      {modalAdmins && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black uppercase">Administradores Gerais</h3>
              </div>
              <button
                onClick={() => setModalAdmins(false)}
                className="text-neutral-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Usuários cadastrados como Administrador Geral possuem acesso total para editar textos, fotos, polícias e aprovações sem restrições.
            </p>

            <form onSubmit={handleAddAdmin} className="flex gap-2">
              <input
                type="email"
                placeholder="novo.admin@email.com"
                value={novoEmailAdmin}
                onChange={e => setNovoEmailAdmin(e.target.value)}
                required
                className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </form>

            {erroAdmin && (
              <p className="text-xs text-red-400 font-medium">{erroAdmin}</p>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {adminsList.map(email => (
                <div
                  key={email}
                  className="flex items-center justify-between p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs"
                >
                  <span className="font-mono text-neutral-200 truncate">{email}</span>
                  {email === 'davileonardo303@gmail.com' ? (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase rounded border border-amber-500/30">
                      Super Admin
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRemoveAdmin(email)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      title="Revogar permissão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalAdmins(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HISTÓRICO DE VERSÕES & ROLLBACK */}
      {modalHistorico && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <History className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-black uppercase">Histórico das Últimas 10 Versões</h3>
              </div>
              <button
                onClick={() => setModalHistorico(false)}
                className="text-neutral-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Caso ocorra algum erro ou exclusão indevida, selecione uma versão anterior para restaurar todo o site imediatamente com 1 clique.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {historico.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500 border border-neutral-800/80 rounded-2xl bg-neutral-900/40">
                  Nenhuma versão histórica anterior arquivada ainda.
                </div>
              ) : (
                historico.map(h => (
                  <div
                    key={h.id}
                    className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{new Date(h.data).toLocaleString('pt-BR')}</span>
                      <span className="text-[10px] text-neutral-400">Autor: {h.autor}</span>
                    </div>
                    <button
                      onClick={() => handleReverterVersao(h.id)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Restaurar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalHistorico(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GERENCIADOR DE FOTOS (FIREBASE STORAGE) */}
      <GerenciadorFotosModal
        isOpen={modalFotos}
        onClose={() => setModalFotos(false)}
      />
    </>
  );
};
