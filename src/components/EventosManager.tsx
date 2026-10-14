import React, { useState } from 'react';
import { store } from '../services/store';
import { EventoItem } from '../types';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Trophy, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const EventosManager: React.FC = () => {
  const [eventos, setEventos] = useState<EventoItem[]>(store.getEventos());
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Form
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<EventoItem['tipo']>('campeonato');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [local, setLocal] = useState('');
  const [ct, setCt] = useState('Campo Grande');
  const [descricao, setDescricao] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const unidades = store.getUnidades();

  const handleSalvarEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !local.trim()) {
      setMsg({ tipo: 'erro', texto: 'Preencha o título e o local do evento.' });
      return;
    }

    setSalvando(true);
    setMsg(null);

    try {
      let fotoUrl: string | undefined = undefined;
      if (fotoFile) {
        const caminho = `eventos/${Date.now()}_${fotoFile.name}`;
        const arq = await store.fazerUploadArquivo(caminho, fotoFile, {
          nome: fotoFile.name,
          tipo: 'foto',
          descricao: `Banner do evento: ${titulo}`
        });
        fotoUrl = arq.url;
      }

      await store.adicionarEvento({
        titulo: titulo.trim(),
        tipo,
        data,
        local: local.trim(),
        descricao: descricao.trim(),
        ct,
        fotoUrl
      });

      setEventos([...store.getEventos()]);
      setModalNovoAberto(false);
      setTitulo('');
      setLocal('');
      setDescricao('');
      setFotoFile(null);
      setMsg({ tipo: 'sucesso', texto: 'Evento oficial registrado com sucesso no Firebase!' });
    } catch (err: any) {
      setMsg({ tipo: 'erro', texto: 'Falha ao salvar evento: ' + err?.message });
    } finally {
      setSalvando(false);
    }
  };

  const handleRemoverEvento = async (id: string, tituloEv: string) => {
    if (!confirm(`Deseja remover o evento "${tituloEv}" do calendário oficial?`)) return;
    try {
      await store.removerEvento(id);
      setEventos([...store.getEventos()]);
      setMsg({ tipo: 'sucesso', texto: `Evento "${tituloEv}" removido.` });
    } catch (err: any) {
      setMsg({ tipo: 'erro', texto: 'Erro ao remover evento: ' + err?.message });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black uppercase text-white tracking-wide">
              CALENDÁRIO OFICIAL & <span className="text-red-500">EVENTOS</span>
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Gestão oficial de campeonatos, exames de graduação Projarde e seminários técnicos.
          </p>
        </div>

        <button
          onClick={() => setModalNovoAberto(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-red-950/60 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Evento</span>
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          msg.tipo === 'sucesso' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/60 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {msg.tipo === 'sucesso' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{msg.texto}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-neutral-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Grid de Eventos */}
      {eventos.length === 0 ? (
        <div className="p-12 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase">Nenhum evento agendado</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Cadastre os próximos campeonatos e exames de graduação da Equipe Gaditas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventos.map(ev => (
            <div
              key={ev.id}
              className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                {ev.fotoUrl ? (
                  <div className="h-44 w-full overflow-hidden relative">
                    <img src={ev.fotoUrl} alt={ev.titulo} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/80 text-white border border-neutral-700">
                      {ev.tipo.toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-br from-red-950/60 to-neutral-950 p-4 flex items-center justify-between border-b border-neutral-800">
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-neutral-900 text-amber-400 border border-neutral-700">
                      {ev.tipo.toUpperCase()}
                    </span>
                    {ev.tipo === 'campeonato' ? <Trophy className="w-8 h-8 text-amber-400/40" /> : <Award className="w-8 h-8 text-red-500/40" />}
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-black uppercase text-white leading-snug">
                    {ev.titulo}
                  </h3>
                  
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2 text-amber-400 font-mono">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{ev.data}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{ev.local} ({ev.ct})</span>
                    </div>
                  </div>

                  {ev.descricao && (
                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {ev.descricao}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-neutral-950/60 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => handleRemoverEvento(ev.id, ev.titulo)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950 hover:text-red-400 text-neutral-400 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL NOVO EVENTO */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                <span>Novo Evento Gaditas</span>
              </h3>
              <button onClick={() => setModalNovoAberto(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSalvarEvento} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Ex: Campeonato Estadual de Muay Thai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Tipo</label>
                  <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  >
                    <option value="campeonato">Campeonato</option>
                    <option value="graduacao">Graduação Projarde</option>
                    <option value="seminario">Seminário Técnico</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={data}
                    onChange={e => setData(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Local</label>
                  <input
                    type="text"
                    required
                    value={local}
                    onChange={e => setLocal(e.target.value)}
                    placeholder="Ex: Arena Carioca 1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Polo Responsável</label>
                  <select
                    value={ct}
                    onChange={e => setCt(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  >
                    <option value="GERAL">Todos os Polos</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.nome}>Polo {u.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Informações sobre pesagem, inscrições, regras..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Banner do Evento (Firebase Storage)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFotoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-neutral-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-neutral-800 file:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase cursor-pointer"
                >
                  {salvando ? 'Salvando...' : 'Cadastrar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
