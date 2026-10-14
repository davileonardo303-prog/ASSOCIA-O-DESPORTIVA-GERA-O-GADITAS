import React, { useState } from 'react';
import { store } from '../services/store';
import { ArquivoItem } from '../types';
import { 
  UploadCloud, 
  File, 
  FileText, 
  Image as ImageIcon, 
  Award, 
  Trash2, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

export const FirebaseStorageManager: React.FC = () => {
  const [arquivos, setArquivos] = useState<ArquivoItem[]>(store.getArquivos());
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'foto' | 'documento' | 'certificado' | 'outro'>('todos');
  const [busca, setBusca] = useState('');
  const [uploadando, setUploadando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Formulário de Envio
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [tipoEnvio, setTipoEnvio] = useState<ArquivoItem['tipo']>('documento');
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);

  const atualizarLista = () => {
    setArquivos([...store.getArquivos()]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoSelecionado(file);
      if (!nomeArquivo.trim()) {
        setNomeArquivo(file.name);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivoSelecionado) {
      setStatusMsg({ tipo: 'erro', texto: 'Por favor, selecione um arquivo para enviar.' });
      return;
    }

    // Limite de 20MB
    if (arquivoSelecionado.size > 20 * 1024 * 1024) {
      setStatusMsg({ tipo: 'erro', texto: 'Arquivo muito grande! O limite para upload é de 20MB.' });
      return;
    }

    setUploadando(true);
    setProgresso(15);
    setStatusMsg(null);

    try {
      const caminho = `storage_central/${tipoEnvio}/${Date.now()}_${arquivoSelecionado.name}`;
      await store.fazerUploadArquivo(
        caminho,
        arquivoSelecionado,
        {
          nome: nomeArquivo.trim() || arquivoSelecionado.name,
          tipo: tipoEnvio
        },
        p => setProgresso(p)
      );

      setStatusMsg({ tipo: 'sucesso', texto: `Arquivo "${arquivoSelecionado.name}" enviado com sucesso ao Firebase Storage!` });
      setArquivoSelecionado(null);
      setNomeArquivo('');
      atualizarLista();
    } catch (err: any) {
      setStatusMsg({ tipo: 'erro', texto: err?.message || 'Erro ao enviar para o Firebase Storage.' });
    } finally {
      setUploadando(false);
      setProgresso(0);
    }
  };

  const handleExcluir = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${nome}" do Firebase?`)) return;
    try {
      await store.removerArquivo(id);
      atualizarLista();
      setStatusMsg({ tipo: 'sucesso', texto: `Arquivo "${nome}" removido do sistema.` });
    } catch (err: any) {
      setStatusMsg({ tipo: 'erro', texto: 'Falha ao remover arquivo: ' + err?.message });
    }
  };

  const arquivosFiltrados = arquivos.filter(a => {
    const matchTipo = tipoFiltro === 'todos' || a.tipo === tipoFiltro;
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase()) || (a.autor && a.autor.toLowerCase().includes(busca.toLowerCase()));
    return matchTipo && matchBusca;
  });

  const formatarTamanho = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Cabeçalho */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-2.5">
          <UploadCloud className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-black uppercase text-white tracking-wide">
            CENTRAL DE ARQUIVOS <span className="text-red-500">FIREBASE STORAGE</span>
          </h1>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Upload e custódia segura de fotos de eventos, certificados Projarde, documentos PDF e imagens de atletas.
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          statusMsg.tipo === 'sucesso' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/60 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {statusMsg.tipo === 'sucesso' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{statusMsg.texto}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-neutral-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* ÁREA DE UPLOAD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 shadow-xl">
        <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-red-500" />
          <span>Enviar Novo Arquivo para o Firebase Storage</span>
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Nome de Exibição / Descrição
              </label>
              <input
                type="text"
                value={nomeArquivo}
                onChange={e => setNomeArquivo(e.target.value)}
                placeholder="Ex: Regulamento Campeonato 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Categoria do Arquivo
              </label>
              <select
                value={tipoEnvio}
                onChange={e => setTipoEnvio(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="documento">Documento PDF (Regulamentos, Laudos)</option>
                <option value="foto">Foto de Evento / Treino (JPG, PNG)</option>
                <option value="certificado">Certificado de Graduação Projarde</option>
                <option value="outro">Arquivo Diverso</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Arquivo do Computador / Celular
              </label>
              <input
                type="file"
                required
                onChange={handleFileChange}
                className="w-full text-xs text-neutral-300 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              />
            </div>
          </div>

          {uploadando && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>Enviando para o Firebase Storage...</span>
                <span>{progresso}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-950 overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={uploadando || !arquivoSelecionado}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-red-950/60 cursor-pointer disabled:opacity-50"
            >
              {uploadando ? 'Transferindo...' : 'Fazer Upload Seguro'}
            </button>
          </div>
        </form>
      </div>

      {/* REPOSITÓRIO DE ARQUIVOS CADASTRADOS */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              Arquivos Armazenados ({arquivosFiltrados.length})
            </h3>
            <p className="text-[11px] text-neutral-400">
              Arquivos protegidos no bucket oficial: equipe-gaditas.firebasestorage.app
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar arquivo..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 w-44"
              />
            </div>

            <div className="flex gap-1">
              {(['todos', 'foto', 'documento', 'certificado'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTipoFiltro(t)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    tipoFiltro === t ? 'bg-red-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grade de Arquivos */}
        {arquivosFiltrados.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-10">
            Nenhum arquivo encontrado neste filtro. Faça upload de fotos, certificados ou documentos acima.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {arquivosFiltrados.map(arq => (
              <div key={arq.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    {arq.tipo === 'foto' ? (
                      <ImageIcon className="w-5 h-5 text-red-400" />
                    ) : arq.tipo === 'certificado' ? (
                      <Award className="w-5 h-5 text-amber-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <strong className="text-xs text-white block truncate uppercase">{arq.nome}</strong>
                    <span className="text-[10px] text-neutral-500 block">
                      {formatarTamanho(arq.tamanhoBytes)} · {arq.tipo.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-neutral-500 block truncate font-mono">
                      {arq.dataUpload.split('T')[0]} · Por: {arq.autor?.split('@')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                  <a
                    href={arq.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Visualizar</span>
                  </a>

                  <button
                    onClick={() => handleExcluir(arq.id, arq.nome)}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950 hover:text-red-400 text-neutral-500 transition-colors cursor-pointer"
                    title="Excluir arquivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
