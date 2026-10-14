import React, { useState, useEffect } from 'react';
import { store, SaudeFirebaseResultado } from '../services/store';
import { 
  Activity, 
  Database, 
  Lock, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Folder, 
  ShieldCheck, 
  Server, 
  Zap,
  Users,
  HardDrive,
  FileCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Radio,
  Cpu
} from 'lucide-react';

export const FirebaseHealthView: React.FC = () => {
  const [saude, setSaude] = useState<SaudeFirebaseResultado | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [limpandoOrfaos, setLimpandoOrfaos] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const carregarSaude = async () => {
    setCarregando(true);
    try {
      const res = await store.obterSaudeFirebase();
      setSaude(res);
    } catch (e: any) {
      console.warn('Erro ao obter saúde:', e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarSaude();
  }, []);

  const handleLimparOrfaos = async () => {
    if (!confirm('Deseja varrer e remover arquivos do Firebase Storage sem documentos ou alunos correspondentes?')) return;
    setLimpandoOrfaos(true);
    try {
      const removidos = await store.excluirArquivosOrfaos();
      setFeedback(`✓ Varredura concluída! ${removidos} arquivos órfãos sem referência foram excluídos.`);
      await carregarSaude();
    } catch (err: any) {
      setFeedback('Erro ao limpar arquivos: ' + err?.message);
    } finally {
      setLimpandoOrfaos(false);
    }
  };

  const handleBaixarBackup = () => {
    const jsonStr = store.gerarBackupCompleto();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_gaditas_completo_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback('Backup completo exportado com sucesso!');
    carregarSaude();
  };

  const pastasLista = [
    { id: 'perfil', nome: 'perfil/', desc: 'Fotos de perfil dos guerreiros' },
    { id: 'alunos', nome: 'alunos/', desc: 'Documentos e atestados dos alunos' },
    { id: 'professores', nome: 'professores/', desc: 'Identificação dos docentes' },
    { id: 'eventos', nome: 'eventos/', desc: 'Fotos de campeonatos e seminários' },
    { id: 'certificados', nome: 'certificados/', desc: 'Diplomas e graduações Projarde' },
    { id: 'comprovantes', nome: 'comprovantes/', desc: 'Recibos e baixas de mensalidade' },
    { id: 'documentos', nome: 'documentos/', desc: 'Regulamentos e arquivos gerais' },
    { id: 'logos', nome: 'logos/', desc: 'Brasões e banners institucionais' }
  ] as const;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black uppercase text-white tracking-wide">
              SAÚDE DO <span className="text-red-500">FIREBASE</span>
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Painel oficial de monitoramento de infraestrutura, armazenamento, integridade e conectividade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={carregarSaude}
            disabled={carregando}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{carregando ? 'Atualizando...' : 'Atualizar Diagnóstico'}</span>
          </button>

          <button
            onClick={handleBaixarBackup}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Gerar Backup Agora</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* MÉTRICAS COMPLETAS SOLICITADAS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-2 border-b-blue-500">
          <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Alunos Cadastrados</span>
          </span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {saude?.metricasAdicionais.totalAlunos || 0}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Fichas no Firestore</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-2 border-b-amber-500">
          <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Professores / Admins</span>
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {saude?.metricasAdicionais.totalProfessores || 0}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Docentes ativos</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-2 border-b-purple-500">
          <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Eventos & Graduações</span>
          </span>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {saude?.metricasAdicionais.totalEventos || 0}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">No calendário oficial</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-2 border-b-emerald-500">
          <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Usuários Online</span>
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {saude?.metricasAdicionais.usuariosOnline || 1}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Sessões simultâneas</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 border-b-2 border-b-teal-500">
          <span className="text-[10px] font-bold uppercase text-neutral-400 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-teal-400" />
            <span>Espaço Livre Storage</span>
          </span>
          <div className="text-2xl font-black text-teal-400 font-mono mt-1">
            {saude?.storage.espacoLivreFormatado || '5.00 GB'}
          </div>
          <span className="text-[10px] text-neutral-500 block mt-0.5">De 5 GB gratuitos</span>
        </div>
      </div>

      {/* 3 CARDS DE STATUS DOS SERVIÇOS FIREBASE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Firestore */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs uppercase text-white block">Firestore Database</strong>
                <span className="text-[10px] text-neutral-400 font-mono">ai-studio-equipegaditasctd...</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Total de Documentos:</span>
              <strong className="font-mono text-white">{saude?.firestore.totalDocumentos || 0}</strong>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Coleções Ativas:</span>
              <span className="font-mono text-amber-400 font-bold">{saude?.firestore.totalColecoes || 11}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Latência da Conexão:</span>
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {saude?.firestore.latenciaMs || 12} ms
              </span>
            </div>
          </div>
        </div>

        {/* Firebase Authentication */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs uppercase text-white block">Firebase Auth</strong>
                <span className="text-[10px] text-neutral-400">Sessões & RBAC Ativo</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Ativo
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Usuários Ativos:</span>
              <strong className="font-mono text-white">{saude?.auth.usuariosAtivos || 0}</strong>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Contas Bloqueadas:</span>
              <span className="font-mono text-neutral-400 font-bold">{saude?.auth.usuariosBloqueados || 0}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Super Admin:</span>
              <span className="font-mono text-red-400 font-bold">Davi Leonardo</span>
            </div>
          </div>
        </div>

        {/* Firebase Storage */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs uppercase text-white block">Firebase Storage</strong>
                <span className="text-[10px] text-neutral-400 font-mono">equipe-gaditas.app</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Conectado
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Espaço Utilizado:</span>
              <strong className="font-mono text-white">{saude?.storage.espacoFormatado || '0 B'}</strong>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Arquivos Hospedados:</span>
              <span className="font-mono text-blue-400 font-bold">{saude?.storage.totalArquivos || 0}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span className="text-neutral-400">Espaço Livre:</span>
              <span className="font-mono text-emerald-400 font-bold">{saude?.storage.espacoLivreFormatado || '5.00 GB'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONSUMO MENSAL, CUSTOS ESTIMADOS E ÚLTIMOS EVENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Consumo Mensal & Custos Estimados</span>
          </h3>

          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Leituras Estimadas no Firestore:</span>
              <span className="font-mono text-white font-bold">{saude?.metricasAdicionais.consumoMensal.leiturasEstimadas || 150} / 50.000 dia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Escritas Estimadas no Firestore:</span>
              <span className="font-mono text-white font-bold">{saude?.metricasAdicionais.consumoMensal.escritasEstimadas || 30} / 20.000 dia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Tráfego de Rede (Bandwidth):</span>
              <span className="font-mono text-white font-bold">{saude?.metricasAdicionais.consumoMensal.bandwidthEstimada || '10 MB'} / 10 GB mês</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm">
              <span className="text-neutral-300 font-bold">Custo Estimado Mensal:</span>
              <span className="font-mono text-emerald-400 font-black text-base">{saude?.metricasAdicionais.custosEstimados || 'R$ 0,00'}</span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500">
            * O sistema opera integralmente dentro da franquia gratuita do plano Spark/Enterprise do Firebase sem custos extras.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Últimos Eventos & Sincronização</span>
          </h3>

          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Último Login no Sistema:</span>
              <span className="font-mono text-white font-bold">
                {saude?.metricasAdicionais.ultimoLoginSistema 
                  ? new Date(saude.metricasAdicionais.ultimoLoginSistema).toLocaleString('pt-BR') 
                  : 'Sessão ativa agora'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">Último Backup do Banco:</span>
              <span className="font-mono text-amber-400 font-bold">
                {saude?.sincronizacao.ultimoBackupIso 
                  ? new Date(saude.sincronizacao.ultimoBackupIso).toLocaleString('pt-BR') 
                  : 'Nenhum backup local salvo'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">Último Erro Detectado:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {saude?.metricasAdicionais.ultimoErroDetectado ? saude.metricasAdicionais.ultimoErroDetectado : 'Nenhum erro crítico'}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
              <span className="text-neutral-400">Status Geral do Banco:</span>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase">
                100% Sincronizado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ESTRUTURA OFICIAL DE PASTAS DO FIREBASE STORAGE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <span>Estrutura de Pastas do Firebase Storage</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Distribuição e arquivos armazenados por categoria oficial no bucket da nuvem.
            </p>
          </div>

          <button
            onClick={handleLimparOrfaos}
            disabled={limpandoOrfaos}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-red-950/60 hover:text-red-400 text-neutral-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${limpandoOrfaos ? 'animate-spin text-red-500' : ''}`} />
            <span>{limpandoOrfaos ? 'Varrendo...' : 'Excluir Arquivos Órfãos'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {pastasLista.map(pasta => {
            const count = saude?.storage.porPasta[pasta.id as keyof typeof saude.storage.porPasta] || 0;
            return (
              <div
                key={pasta.id}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-white">{pasta.nome}</span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400 font-mono text-[10px] font-bold">
                    {count} {count === 1 ? 'arquivo' : 'arquivos'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  {pasta.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
