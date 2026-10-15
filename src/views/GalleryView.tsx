import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Users, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Shield, 
  Instagram, 
  Plus, 
  Trash2, 
  Upload, 
  Sliders, 
  ExternalLink,
  Download,
  CheckCircle2
} from 'lucide-react';
import { store, comprimirImagemParaWebP } from '../services/store';
import { GaleriaItem } from '../types';
import { ImageStudioModal, ImageStyleConfig } from '../components/ImageStudioModal';

export const GalleryView: React.FC = () => {
  const [items, setItems] = useState<GaleriaItem[]>(() => store.getGaleriaItems());
  const [activeCategory, setActiveCategory] = useState<'todos' | 'campeonatos' | 'treinos' | 'cinturoes' | 'instagram'>('todos');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [isAdminGeral, setIsAdminGeral] = useState(() => store.isUsuarioAdminGeral());
  const [itemEmEdicao, setItemEmEdicao] = useState<GaleriaItem | null>(null);
  const [modalNovoCard, setModalNovoCard] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<'campeonatos' | 'treinos' | 'cinturoes' | 'instagram'>('campeonatos');
  const [novaUrl, setNovaUrl] = useState('');
  const [novaLegenda, setNovaLegenda] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setItems([...store.getGaleriaItems()]);
      setIsAdminGeral(store.isUsuarioAdminGeral());
    });
    return unsub;
  }, []);

  const filteredItems = activeCategory === 'todos'
    ? items
    : items.filter(item => item.categoria === activeCategory);

  const handleOpenLightbox = (index: number) => {
    setSelectedItemIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedItemIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
    }
  };

  // Drag and Drop de Imagens diretamente sobre o card
  const handleDropOnCard = async (e: React.DragEvent, card: GaleriaItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdminGeral) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      try {
        const compressedBlob = await comprimirImagemParaWebP(e.dataTransfer.files[0], 1200, 1200, 0.85);
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (typeof reader.result === 'string') {
            const atualizado: GaleriaItem = { ...card, url: reader.result };
            await store.salvarGaleriaItem(atualizado);
          }
        };
        reader.readAsDataURL(compressedBlob);
      } catch (err: any) {
        alert(err?.message || 'Falha ao processar imagem arrastada.');
      }
    }
  };

  const handleRemoverCard = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente remover esta foto da galeria oficial?')) return;
    try {
      await store.removerGaleriaItem(id);
    } catch (err: any) {
      alert(err?.message || 'Erro ao remover foto.');
    }
  };

  const handleCriarCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo || !novaUrl) {
      alert('Preencha o título e a foto.');
      return;
    }
    const novo: GaleriaItem = {
      id: 'gal-' + Date.now(),
      titulo: novoTitulo,
      categoria: novaCategoria,
      url: novaUrl,
      legenda: novaLegenda || '',
      instagramPostUrl: novaCategoria === 'instagram' ? 'https://www.instagram.com/gaditas_fight' : undefined,
      ordem: items.length + 1
    };

    await store.salvarGaleriaItem(novo);
    setModalNovoCard(false);
    setNovoTitulo('');
    setNovaUrl('');
    setNovaLegenda('');
  };

  const handleExportarGaleriaCSV = () => {
    const cabecalho = 'ID,Titulo,Categoria,Legenda,URL\n';
    const linhas = items.map(it => 
      `"${it.id}","${it.titulo}","${it.categoria}","${it.legenda || ''}","${it.url}"`
    ).join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gaditas_galeria_relatorio_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Título da Seção */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-500/40 rounded-full text-red-400 text-xs font-black uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Registros Históricos & Conquistas</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white">
          GALERIA DOS <span className="text-red-500">GUERREIROS</span>
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Pódios, cinturões, graduações e a força dos treinos da família Gaditas. Siga também nosso Instagram oficial <strong className="text-amber-400">@gaditas_fight</strong>.
        </p>

        {/* Botões de Ação do Admin na Galeria */}
        {isAdminGeral && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setModalNovoCard(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Card</span>
            </button>
            <button
              onClick={handleExportarGaleriaCSV}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar Galeria (CSV)</span>
            </button>
          </div>
        )}
      </div>

      {/* Filtros de Categoria */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveCategory('todos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'todos'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Todas as Fotos
          </button>
          <button
            onClick={() => setActiveCategory('campeonatos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'campeonatos'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Campeonatos & Lutas
          </button>
          <button
            onClick={() => setActiveCategory('cinturoes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'cinturoes'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cinturões & Pódios
          </button>
          <button
            onClick={() => setActiveCategory('treinos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'treinos'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Treinos & Tatame
          </button>
          <button
            onClick={() => setActiveCategory('instagram')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'instagram'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-pink-400'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@gaditas_fight</span>
          </button>
        </div>
      </div>

      {/* Grid de Imagens com Suporte a Drag & Drop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleOpenLightbox(index)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDropOnCard(e, item)}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl cursor-pointer hover:border-red-500/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Foto Wrapper */}
            <div className="h-64 overflow-hidden relative bg-neutral-950">
              <img
                src={item.url}
                alt={item.titulo}
                loading="lazy"
                style={{
                  objectFit: item.estilo?.encaixe || 'cover',
                  objectPosition: `${item.estilo?.focoX ?? 50}% ${item.estilo?.focoY ?? 50}%`,
                  transform: `scale(${(item.estilo?.zoom ?? 100) / 100}) rotate(${item.estilo?.rotacao ?? 0}deg)`
                }}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div 
                style={{ backgroundColor: `rgba(0,0,0, ${(item.estilo?.overlayEscuro ?? 40) / 100})` }}
                className="absolute inset-0 pointer-events-none transition-opacity" 
              />
              
              {/* Badge superior */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
                  {item.categoria.toUpperCase()}
                </span>
                {item.instagramPostUrl && (
                  <a
                    href={item.instagramPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1 rounded bg-pink-600/80 text-white hover:bg-pink-500"
                    title="Ver no Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Botões do Administrador sobre o card */}
              {isAdminGeral && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 z-10">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setItemEmEdicao(item);
                    }}
                    className="p-1.5 rounded-lg bg-black/80 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-400/40 transition-colors"
                    title="Ajustar tamanho, zoom e foco da foto"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e => handleRemoverCard(e, item.id)}
                    className="p-1.5 rounded-lg bg-black/80 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 transition-colors"
                    title="Excluir card da galeria"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Título Sobreposto */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-sm font-black uppercase text-white leading-snug line-clamp-2 drop-shadow-md">
                  {item.titulo}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/90 text-xs text-neutral-400 flex items-center justify-between gap-2">
              <p className="line-clamp-2 leading-relaxed">{item.legenda || 'Registro oficial Equipe Gaditas Fight Team.'}</p>
              <div className="p-1.5 rounded-lg bg-black/50 text-neutral-400 group-hover:text-red-400 shrink-0">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {currentItem && (
        <div
          onClick={handleCloseLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0a0a0c] rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Top bar do Lightbox */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span className="text-xs font-black uppercase text-amber-400">
                  {currentItem.categoria.toUpperCase()} · {currentItem.titulo}
                </span>
              </div>
              <button
                onClick={handleCloseLightbox}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Imagem Central */}
            <div className="relative bg-black flex items-center justify-center min-h-[350px] max-h-[70vh] overflow-hidden p-2">
              <img
                src={currentItem.url}
                alt={currentItem.titulo}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />

              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-neutral-700 transition-colors cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-neutral-700 transition-colors cursor-pointer"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Rodapé da Imagem */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <p>{currentItem.legenda || currentItem.titulo}</p>
              {currentItem.instagramPostUrl && (
                <a
                  href={currentItem.instagramPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-pink-600/80 hover:bg-pink-600 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Ver no Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR NOVO CARD (ADMIN) */}
      {modalNovoCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                <span>Adicionar Foto na Galeria</span>
              </h3>
              <button onClick={() => setModalNovoCard(false)} className="text-neutral-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarCard} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Título do Momento / Luta</label>
                <input
                  type="text"
                  value={novoTitulo}
                  onChange={e => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Disputa do Cinturão Estadual"
                  required
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Categoria</label>
                <select
                  value={novaCategoria}
                  onChange={e => setNovaCategoria(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-red-500"
                >
                  <option value="campeonatos">Campeonatos & Lutas</option>
                  <option value="cinturoes">Cinturões & Pódios</option>
                  <option value="treinos">Treinos & Tatame</option>
                  <option value="instagram">Instagram @gaditas_fight</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">URL da Imagem</label>
                <input
                  type="text"
                  value={novaUrl}
                  onChange={e => setNovaUrl(e.target.value)}
                  placeholder="https://... ou faça upload abaixo"
                  required
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Legenda Explicativa</label>
                <textarea
                  value={novaLegenda}
                  onChange={e => setNovaLegenda(e.target.value)}
                  rows={2}
                  placeholder="Breve descrição dos guerreiros e local da luta..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalNovoCard(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase shadow-lg shadow-red-950/50"
                >
                  Publicar Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ESTÚDIO VISUAL DE IMAGEM INLINE */}
      {itemEmEdicao && (
        <ImageStudioModal
          isOpen={true}
          onClose={() => setItemEmEdicao(null)}
          imagemAtual={itemEmEdicao.url}
          estiloAtual={itemEmEdicao.estilo}
          tituloAlvo={itemEmEdicao.titulo}
          onAplicar={async (novaUrl, novoEstilo) => {
            const atualizado: GaleriaItem = {
              ...itemEmEdicao,
              url: novaUrl,
              estilo: novoEstilo
            };
            await store.salvarGaleriaItem(atualizado);
            setItemEmEdicao(null);
          }}
        />
      )}

    </div>
  );
};
