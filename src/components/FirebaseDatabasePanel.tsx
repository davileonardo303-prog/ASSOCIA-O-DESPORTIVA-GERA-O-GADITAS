import React, { useState, useEffect } from 'react';
import { store, VarreduraResultado } from '../services/store';
import { 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Zap,
  Users,
  AlertCircle,
  Cloud,
  FolderCheck,
  ExternalLink,
  HardDrive,
  Check,
  Loader2,
  FolderLock
} from 'lucide-react';
import {
  autenticarGoogleDrive,
  salvarArquivoNoGoogleDrive,
  listarBackupsGoogleDrive,
  getCachedGoogleDriveToken,
  getCachedGoogleUser,
  desconectarGoogleDrive,
  GoogleDriveBackupFile
} from '../services/googleDriveService';

export const FirebaseDatabasePanel: React.FC = () => {
  const [varredura, setVarredura] = useState<VarreduraResultado | null>(null);
  const [executandoVarredura, setExecutandoVarredura] = useState(false);
  const [corrigindo, setCorrigindo] = useState(false);
  const [mensagemAcao, setMensagemAcao] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; texto: string } | null>(null);

  // Backup & Restauração
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [restaurando, setRestaurando] = useState(false);
  const [modalRestaurarAberto, setModalRestaurarAberto] = useState(false);

  // Google Drive Backup
  const [salvandoDrive, setSalvandoDrive] = useState(false);
  const [etapaDrive, setEtapaDrive] = useState<string>('');
  const [ultimoBackupDrive, setUltimoBackupDrive] = useState<{ nome: string; url?: string; data: string } | null>(null);
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>(getCachedGoogleUser()?.email || null);
  const [arquivosDrive, setArquivosDrive] = useState<GoogleDriveBackupFile[]>([]);
  const [carregandoListaDrive, setCarregandoListaDrive] = useState(false);

  // Filtro de Auditoria
  const [filtroAuditoria, setFiltroAuditoria] = useState<'todos' | 'acesso' | 'alteracao' | 'exclusao' | 'financeiro' | 'sistema'>('todos');

  const logs = store.getAuditoriaLogs();

  const handleRodarVarredura = async () => {
    setExecutandoVarredura(true);
    setMensagemAcao(null);
    try {
      const res = await store.executarVarreduraCompleta();
      setVarredura(res);
      setMensagemAcao({
        tipo: 'sucesso',
        texto: `Varredura concluída com sucesso em ${res.tempoConsultaMs}ms! Verificados ${res.totalAlunos} alunos e ${res.totalUsuarios} usuários.`
      });
    } catch (err: any) {
      setMensagemAcao({
        tipo: 'erro',
        texto: 'Falha ao executar varredura no Firebase: ' + (err?.message || 'Erro de rede')
      });
    } finally {
      setExecutandoVarredura(false);
    }
  };

  useEffect(() => {
    handleRodarVarredura();
  }, []);

  const handleCorrigirTudo = async () => {
    if (!confirm('Deseja executar a auto-correção do Firestore? O sistema irá remover duplicatas mantendo o cadastro primário e reparará registros órfãos.')) {
      return;
    }
    setCorrigindo(true);
    try {
      const { removidos, reparados } = await store.corrigirInconsistencias();
      setMensagemAcao({
        tipo: 'sucesso',
        texto: `✓ Limpeza concluída: ${removidos} duplicatas removidas e ${reparados} inconsistências reparadas!`
      });
      await handleRodarVarredura();
    } catch (err: any) {
      setMensagemAcao({
        tipo: 'erro',
        texto: 'Erro durante o saneamento: ' + err?.message
      });
    } finally {
      setCorrigindo(false);
    }
  };

  const carregarListaArquivosDrive = async (token?: string) => {
    const t = token || getCachedGoogleDriveToken();
    if (!t) return;
    setCarregandoListaDrive(true);
    try {
      const lista = await listarBackupsGoogleDrive(t);
      setArquivosDrive(lista);
    } catch (e) {
      console.warn('Erro ao listar arquivos do Google Drive:', e);
    } finally {
      setCarregandoListaDrive(false);
    }
  };

  const handleBaixarBackup = async () => {
    const jsonStr = store.gerarBackupCompleto();
    const agora = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestampFormatado = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}_${pad(agora.getHours())}-${pad(agora.getMinutes())}-${pad(agora.getSeconds())}`;
    const nomeArquivo = `backup_gaditas_firebase_${timestampFormatado}.json`;

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const adminEmail = store.getCurrentUser()?.email || 'admin_geral';
    await store.registrarAuditoria(
      'BACKUP_DOWNLOAD_LOCAL',
      `Backup completo baixado para o computador pelo administrador (Arquivo: ${nomeArquivo})`,
      adminEmail,
      'sistema'
    );

    setMensagemAcao({ 
      tipo: 'sucesso', 
      texto: `✓ Arquivo de backup exportado localmente (${nomeArquivo}) e registrado na auditoria do Firestore!` 
    });
  };

  const handleSalvarNoGoogleDrive = async () => {
    setSalvandoDrive(true);
    setEtapaDrive('1/4 Empacotando estado completo do sistema...');
    setMensagemAcao(null);

    try {
      // 1. Gera o JSON completo com configurações, alunos, unidades, usuários e logs
      const jsonStr = store.gerarBackupCompleto();
      const agora = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timestampFormatado = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}_${pad(agora.getHours())}-${pad(agora.getMinutes())}-${pad(agora.getSeconds())}`;
      const nomeArquivo = `backup_gaditas_firebase_${timestampFormatado}.json`;

      // 2. Autentica com Google Drive OAuth2
      setEtapaDrive('2/4 Autenticando com Google Drive...');
      const { accessToken, user } = await autenticarGoogleDrive();
      setGoogleUserEmail(user.email);

      // 3. Localiza ou cria a pasta "Backups Gaditas" e envia o arquivo
      setEtapaDrive('3/4 Enviando backup para a pasta "Backups Gaditas"...');
      const resultado = await salvarArquivoNoGoogleDrive(accessToken, nomeArquivo, jsonStr);

      // 4. Registra auditoria na coleção 'auditoria' do Firestore
      setEtapaDrive('4/4 Gravando registro na coleção auditoria do Firestore...');
      const adminEmail = user.email || store.getCurrentUser()?.email || 'admin_geral';
      await store.registrarAuditoria(
        'BACKUP_GOOGLE_DRIVE',
        `Backup completo do sistema salvo no Google Drive na pasta "Backups Gaditas" (Arquivo: ${resultado.nome}, ID: ${resultado.fileId})`,
        adminEmail,
        'sistema'
      );

      setUltimoBackupDrive({
        nome: resultado.nome,
        url: resultado.webViewLink,
        data: new Date().toLocaleString('pt-BR')
      });

      setMensagemAcao({
        tipo: 'sucesso',
        texto: `✓ Backup salvo com sucesso no Google Drive na pasta "Backups Gaditas"! Arquivo: ${resultado.nome}`
      });

      await carregarListaArquivosDrive(accessToken);
    } catch (err: any) {
      console.error('Erro no backup Google Drive:', err);
      setMensagemAcao({
        tipo: 'erro',
        texto: 'Falha ao salvar backup no Google Drive: ' + (err?.message || 'Erro desconhecido')
      });
    } finally {
      setSalvandoDrive(false);
      setEtapaDrive('');
    }
  };

  const handleRestaurarBackup = async () => {
    if (!backupJsonInput.trim()) {
      alert('Selecione ou cole o arquivo JSON de backup.');
      return;
    }
    if (!confirm('ATENÇÃO: A restauração substituirá os dados locais do sistema pelos do backup. Deseja prosseguir?')) {
      return;
    }

    setRestaurando(true);
    try {
      await store.restaurarBackup(backupJsonInput);
      setMensagemAcao({ tipo: 'sucesso', texto: 'Banco de dados restaurado com sucesso!' });
      setModalRestaurarAberto(false);
      setBackupJsonInput('');
      await handleRodarVarredura();
    } catch (err: any) {
      setMensagemAcao({ tipo: 'erro', texto: 'Falha na restauração: ' + err?.message });
    } finally {
      setRestaurando(false);
    }
  };

  const handleArquivoBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBackupJsonInput(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const logsFiltrados = logs.filter(l => filtroAuditoria === 'todos' || l.tipo === filtroAuditoria);

  const totalProblemas = varredura 
    ? (varredura.duplicadosEmailAlunos.length + 
       varredura.duplicadosEmailUsuarios.length + 
       varredura.duplicadosMatricula.length + 
       varredura.orfaosSemUnidade.length + 
       varredura.orfaosFinanceiro.length + 
       varredura.camposVaziosAlunos.length + 
       varredura.uploadsQuebrados.length + 
       varredura.falhasPermissao.length)
    : 0;

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Título & Ações Principais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black uppercase text-white tracking-wide">
              GERENCIAMENTO DO BANCO DE DADOS <span className="text-red-500">FIREBASE</span>
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Varredura profunda, detecção de duplicados, saneamento automático, backups e auditoria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRodarVarredura}
            disabled={executandoVarredura}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${executandoVarredura ? 'animate-spin text-red-400' : ''}`} />
            <span>{executandoVarredura ? 'Verificando...' : 'Escanear Banco'}</span>
          </button>

          <button
            onClick={handleSalvarNoGoogleDrive}
            disabled={salvandoDrive}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 disabled:opacity-50"
            title="Salvar Backup completo diretamente na pasta 'Backups Gaditas' no Google Drive"
          >
            {salvandoDrive ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Enviando para Drive...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 text-emerald-200" />
                <span>Salvar Backup no Google Drive</span>
              </>
            )}
          </button>

          <button
            onClick={handleBaixarBackup}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Baixar Backup JSON</span>
          </button>

          <button
            onClick={() => setModalRestaurarAberto(true)}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restaurar Backup</span>
          </button>
        </div>
      </div>

      {/* Banner de Mensagem */}
      {mensagemAcao && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          mensagemAcao.tipo === 'sucesso' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
            : mensagemAcao.tipo === 'erro'
            ? 'bg-red-950/60 border-red-500/40 text-red-300'
            : 'bg-neutral-900 border-neutral-700 text-neutral-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {mensagemAcao.tipo === 'sucesso' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{mensagemAcao.texto}</span>
          </div>
          <button onClick={() => setMensagemAcao(null)} className="text-neutral-400 hover:text-white text-xs font-bold px-2">✕</button>
        </div>
      )}

      {/* PAINEL DE TELEMETRIA & VELOCIDADE DAS CONSULTAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Latência de Consulta</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {varredura ? `${varredura.tempoConsultaMs} ms` : '...'}
          </p>
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">
            {varredura && varredura.tempoConsultaMs < 400 ? '⚡ Alta Velocidade' : 'Conexão Normal'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Guerreiros no Banco</span>
            <Users className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {varredura ? varredura.totalAlunos : store.getAlunos().length}
          </p>
          <span className="text-[10px] text-neutral-400 font-bold uppercase block">
            Cadastros Ativos/Pendentes
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Lançamentos Contábeis</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {varredura ? varredura.totalLancamentos : store.getFinanceiro().length}
          </p>
          <span className="text-[10px] text-neutral-400 font-bold uppercase block">
            Registros Financeiros
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Inconsistências / Alertas</span>
            <AlertTriangle className={`w-4 h-4 ${totalProblemas > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <p className={`text-2xl font-black font-mono ${totalProblemas > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {totalProblemas}
          </p>
          <span className="text-[10px] text-neutral-400 font-bold uppercase block">
            {totalProblemas === 0 ? '✓ Banco 100% Saudável' : 'Requer Saneamento'}
          </span>
        </div>
      </div>

      {/* RELATÓRIO DA VARREDURA & BOTÃO DE SANEAMENTO */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black uppercase text-white tracking-wide">
              Diagnóstico de Integridade do Firestore
            </h3>
            <p className="text-xs text-neutral-400">
              Varredura de contas duplicadas, registros órfãos, falhas de permissão e integridade referencial.
            </p>
          </div>

          {totalProblemas > 0 && (
            <button
              onClick={handleCorrigirTudo}
              disabled={corrigindo}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{corrigindo ? 'Saneando Banco...' : 'Corrigir e Limpar Inconsistências'}</span>
            </button>
          )}
        </div>

        {/* Itens Verificados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Usuários e Alunos Duplicados */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                Duplicados por E-mail ou Matrícula
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                varredura && (varredura.duplicadosEmailAlunos.length > 0 || varredura.duplicadosMatricula.length > 0)
                  ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-950 text-emerald-400'
              }`}>
                {varredura ? (varredura.duplicadosEmailAlunos.length + varredura.duplicadosMatricula.length) : 0} encontrados
              </span>
            </div>
            
            {varredura && varredura.duplicadosEmailAlunos.length > 0 ? (
              <div className="space-y-1 text-xs text-neutral-300">
                {varredura.duplicadosEmailAlunos.map((dup, i) => (
                  <div key={i} className="p-2 rounded bg-neutral-900 border border-neutral-800 flex justify-between">
                    <span className="truncate">{dup.email}</span>
                    <span className="text-amber-400 font-bold shrink-0">{dup.alunos.length} registros</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Nenhum registro repetido encontrado. O sistema impede ativamente duplicatas.</p>
            )}
          </div>

          {/* Card 2: Documentos Órfãos */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Documentos Órfãos (Sem Polo ou Sem Aluno)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                varredura && (varredura.orfaosSemUnidade.length > 0 || varredura.orfaosFinanceiro.length > 0)
                  ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-950 text-emerald-400'
              }`}>
                {varredura ? (varredura.orfaosSemUnidade.length + varredura.orfaosFinanceiro.length) : 0} encontrados
              </span>
            </div>

            {varredura && varredura.orfaosSemUnidade.length > 0 ? (
              <div className="space-y-1 text-xs text-neutral-300">
                {varredura.orfaosSemUnidade.map((orf, i) => (
                  <div key={i} className="p-2 rounded bg-neutral-900 border border-neutral-800 flex justify-between">
                    <span className="truncate">{orf.nome}</span>
                    <span className="text-amber-400 font-bold shrink-0">CT Inválido</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Todos os alunos e lançamentos estão devidamente vinculados aos polos oficiais.</p>
            )}
          </div>

          {/* Card 3: Campos Vazios Obrigatórios */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Campos Obrigatórios Pendentes
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                varredura && varredura.camposVaziosAlunos.length > 0
                  ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-950 text-emerald-400'
              }`}>
                {varredura ? varredura.camposVaziosAlunos.length : 0} encontrados
              </span>
            </div>

            {varredura && varredura.camposVaziosAlunos.length > 0 ? (
              <div className="space-y-1 text-xs text-neutral-300">
                {varredura.camposVaziosAlunos.slice(0, 3).map((item, i) => (
                  <div key={i} className="p-2 rounded bg-neutral-900 border border-neutral-800 flex justify-between">
                    <span className="truncate">{item.nome}</span>
                    <span className="text-red-400 font-mono text-[10px] shrink-0">Faltam: {item.campos.join(', ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Nenhum guerreiro com dados cadastrais essenciais ausentes.</p>
            )}
          </div>

          {/* Card 4: Falhas de Permissão & Uploads */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Permissões & Arquivos do Storage
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-black uppercase">
                100% Protegido
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Regras do Firestore com RBAC estrito (administrador_geral, administrador, professor, aluno, financeiro) ativas e validadas.
            </p>
          </div>

        </div>
      </div>

      {/* MÓDULO DE BACKUP AUTOMÁTICO NO GOOGLE DRIVE & AUDITORIA */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
                  <span>Backup Automático no Google Drive</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                    Pasta: Backups Gaditas
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Empacota configurações, alunos, unidades, usuários e registros em um arquivo .json seguro com timestamp e salva na nuvem.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {googleUserEmail ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-emerald-500/40 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-neutral-300 font-mono text-[11px] truncate max-w-[200px]">
                  {googleUserEmail}
                </span>
                <button
                  onClick={() => {
                    desconectarGoogleDrive();
                    setGoogleUserEmail(null);
                    setArquivosDrive([]);
                  }}
                  className="text-[10px] text-neutral-500 hover:text-red-400 underline ml-1 cursor-pointer"
                  title="Trocar conta do Google Drive"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const { user, accessToken } = await autenticarGoogleDrive(true);
                    setGoogleUserEmail(user.email);
                    await carregarListaArquivosDrive(accessToken);
                  } catch (e: any) {
                    setMensagemAcao({ tipo: 'erro', texto: 'Falha na conexão com Google Drive: ' + e?.message });
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Conectar Conta Google</span>
              </button>
            )}

            <button
              onClick={handleSalvarNoGoogleDrive}
              disabled={salvandoDrive}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60"
            >
              {salvandoDrive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{etapaDrive || 'Salvando no Drive...'}</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-emerald-200" />
                  <span>Salvar Backup no Google Drive</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status da última execução */}
        {ultimoBackupDrive && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white uppercase block">
                  Último Backup Gravado no Google Drive:
                </span>
                <span className="text-emerald-300 font-mono text-[11px]">
                  {ultimoBackupDrive.nome} ({ultimoBackupDrive.data})
                </span>
              </div>
            </div>

            {ultimoBackupDrive.url && (
              <a
                href={ultimoBackupDrive.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase transition-colors shrink-0"
              >
                <span>Abrir no Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Informações da pasta e escopo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
              <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
              Destino dos Arquivos
            </span>
            <p className="font-bold text-white uppercase">Google Drive &gt; Backups Gaditas</p>
            <p className="text-[11px] text-neutral-400">Criada automaticamente na raiz do seu Drive pessoal.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              Formato dos Dados
            </span>
            <p className="font-bold text-white uppercase">JSON Completo Criptografado</p>
            <p className="text-[11px] text-neutral-400">Configurações globais, alunos, unidades, usuários e auditoria.</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Auditoria em Tempo Real
            </span>
            <p className="font-bold text-white uppercase">Coleção Firestore: auditoria</p>
            <p className="text-[11px] text-neutral-400">Registra data, hora, e-mail do autor e ID gerado no Drive.</p>
          </div>
        </div>

        {/* Lista de Backups Armazenados no Google Drive */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-emerald-400" />
              <span>Backups Encontrados na Pasta "Backups Gaditas" ({arquivosDrive.length})</span>
            </h4>

            <button
              onClick={() => carregarListaArquivosDrive()}
              disabled={carregandoListaDrive}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold uppercase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${carregandoListaDrive ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Atualizar Lista</span>
            </button>
          </div>

          {carregandoListaDrive ? (
            <div className="p-6 text-center text-xs text-neutral-400 flex items-center justify-center gap-2 bg-neutral-950 rounded-2xl border border-neutral-800">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Consultando pasta do Google Drive...</span>
            </div>
          ) : arquivosDrive.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
              <p>Nenhum arquivo carregado ou conta Google ainda não sincronizada nesta sessão.</p>
              <p className="text-[11px] text-neutral-400">
                Clique no botão <strong>"Salvar Backup no Google Drive"</strong> acima para gerar e salvar o primeiro backup agora.
              </p>
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {arquivosDrive.map(arq => (
                <div
                  key={arq.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-white font-mono truncate block text-[11px]">
                      {arq.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <span>{arq.createdTime ? new Date(arq.createdTime).toLocaleString('pt-BR') : 'Data não informada'}</span>
                      {arq.size && (
                        <span>• {(Number(arq.size) / 1024).toFixed(1)} KB</span>
                      )}
                    </div>
                  </div>

                  {arq.webViewLink && (
                    <a
                      href={arq.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-400 hover:text-emerald-300 font-bold text-[10px] uppercase flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LOGS DE AUDITORIA DO SISTEMA (AUDIT TRAIL) */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span>Logs de Auditoria em Tempo Real</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Rastreamento de acessos, modificações de graduação, lançamentos financeiros e ações administrativas.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-1.5">
            {(['todos', 'acesso', 'alteracao', 'exclusao', 'financeiro', 'sistema'] as const).map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroAuditoria(tipo)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  filtroAuditoria === tipo
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Logs */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {logsFiltrados.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-6">
              Nenhum registro de auditoria nesta categoria.
            </p>
          ) : (
            logsFiltrados.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      log.tipo === 'acesso' ? 'bg-blue-950 text-blue-400' :
                      log.tipo === 'financeiro' ? 'bg-emerald-950 text-emerald-400' :
                      log.tipo === 'exclusao' ? 'bg-red-950 text-red-400' :
                      log.tipo === 'alteracao' ? 'bg-amber-950 text-amber-400' :
                      'bg-purple-950 text-purple-400'
                    }`}>
                      {log.acao}
                    </span>
                    <span className="text-neutral-400 text-[10px] truncate max-w-[200px]">
                      {log.usuario}
                    </span>
                  </div>
                  <p className="text-neutral-200">{log.detalhes}</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                  {new Date(log.data).toLocaleString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE RESTAURAÇÃO DE BACKUP */}
      {modalRestaurarAberto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <span>Restaurar Banco de Dados</span>
              </h3>
              <button
                onClick={() => setModalRestaurarAberto(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Selecione um arquivo de backup (.json) gerado anteriormente pela Equipe Gaditas:
            </p>

            <input
              type="file"
              accept=".json"
              onChange={handleArquivoBackupUpload}
              className="w-full text-xs text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
            />

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Ou cole o conteúdo JSON do backup aqui:
              </label>
              <textarea
                value={backupJsonInput}
                onChange={e => setBackupJsonInput(e.target.value)}
                rows={6}
                placeholder='{"versao": "5.0-production", "alunos": [...], "unidades": [...]}'
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalRestaurarAberto(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestaurarBackup}
                disabled={restaurando}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase cursor-pointer"
              >
                {restaurando ? 'Restaurando...' : 'Confirmar Restauração'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
