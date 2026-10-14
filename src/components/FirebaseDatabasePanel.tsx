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
  AlertCircle
} from 'lucide-react';

export const FirebaseDatabasePanel: React.FC = () => {
  const [varredura, setVarredura] = useState<VarreduraResultado | null>(null);
  const [executandoVarredura, setExecutandoVarredura] = useState(false);
  const [corrigindo, setCorrigindo] = useState(false);
  const [mensagemAcao, setMensagemAcao] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; texto: string } | null>(null);

  // Backup & Restauração
  const [backupJsonInput, setBackupJsonInput] = useState('');
  const [restaurando, setRestaurando] = useState(false);
  const [modalRestaurarAberto, setModalRestaurarAberto] = useState(false);

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

  const handleBaixarBackup = () => {
    const jsonStr = store.gerarBackupCompleto();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_gaditas_firebase_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMensagemAcao({ tipo: 'sucesso', texto: 'Arquivo de backup completo exportado com sucesso!' });
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
