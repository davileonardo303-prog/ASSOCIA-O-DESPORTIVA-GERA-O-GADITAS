import React, { useState, useRef } from 'react';
import { Edit3, Check, X, Upload, Image as ImageIcon, Eye, EyeOff, Loader2 } from 'lucide-react';
import { store, comprimirImagemParaWebP } from '../services/store';

interface EditableTextProps {
  value: string;
  onChange: (novoValor: string) => void;
  modoEdicao: boolean;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
  placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  modoEdicao,
  className = '',
  tag: Tag = 'span',
  multiline = false,
  placeholder = 'Clique para editar...'
}) => {
  const [editando, setEditando] = useState(false);
  const [textoTemp, setTextoTemp] = useState(value || '');

  if (!modoEdicao) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  const handleSalvar = () => {
    setEditando(false);
    if (textoTemp !== value) {
      onChange(textoTemp);
    }
  };

  const handleCancelar = () => {
    setTextoTemp(value);
    setEditando(false);
  };

  if (editando) {
    return (
      <div className="inline-flex items-center gap-1.5 relative z-30 max-w-full my-1">
        {multiline ? (
          <textarea
            value={textoTemp}
            onChange={(e) => setTextoTemp(e.target.value)}
            className="w-full bg-neutral-900 text-white border-2 border-amber-400 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans shadow-xl"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={textoTemp}
            onChange={(e) => setTextoTemp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSalvar();
              if (e.key === 'Escape') handleCancelar();
            }}
            className="bg-neutral-900 text-white border-2 border-amber-400 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans shadow-xl w-full"
            autoFocus
          />
        )}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={handleSalvar}
            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md cursor-pointer shadow"
            title="Salvar texto"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md cursor-pointer"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      onClick={() => {
        setTextoTemp(value || '');
        setEditando(true);
      }}
      className={`${className} cursor-pointer relative group rounded px-1 -mx-1 border border-dashed border-amber-400/60 hover:border-amber-400 hover:bg-amber-400/10 transition-colors inline-block`}
      title="Clique para editar este texto (Modo Edição Ativo)"
    >
      {value || <span className="italic opacity-50">{placeholder}</span>}
      <span className="absolute -top-3 -right-2 hidden group-hover:flex items-center gap-1 bg-amber-500 text-black px-1.5 py-0.5 rounded text-[9px] font-black uppercase shadow-md pointer-events-none">
        <Edit3 className="w-2.5 h-2.5" />
        Editar
      </span>
    </Tag>
  );
};

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (novaUrl: string) => void;
  modoEdicao: boolean;
  className?: string;
  containerClassName?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onChange,
  modoEdicao,
  className = '',
  containerClassName = ''
}) => {
  const [modalAberta, setModalAberta] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [arrastando, setArrastando] = useState(false);
  const [salvandoStorage, setSalvandoStorage] = useState(false);
  const [progressoStorage, setProgressoStorage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processarArquivo = async (file: File) => {
    try {
      setSalvandoStorage(true);
      setProgressoStorage(25);
      const blob = await comprimirImagemParaWebP(file, 1600, 1600, 0.85);
      setProgressoStorage(45);
      const urlFinal = await store.uploadFotoSiteParaStorage(blob, 'fotos_site/inline', (pct) => {
        setProgressoStorage(Math.max(45, pct));
      });
      setProgressoStorage(100);
      onChange(urlFinal);
      setModalAberta(false);
    } catch (e: any) {
      alert(e?.message || 'Falha ao processar imagem para o Firebase Storage.');
    } finally {
      setSalvandoStorage(false);
      setProgressoStorage(0);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setArrastando(false);
    if (!modoEdicao) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processarArquivo(e.dataTransfer.files[0]);
    }
  };

  if (!modoEdicao) {
    return (
      <div className={containerClassName}>
        <img src={src} alt={alt} className={className} />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={handleDrop}
      className={`relative group ${containerClassName} ${
        arrastando ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black' : ''
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} group-hover:brightness-75 transition-all`}
      />

      {/* Botão Sobreposto "Trocar Foto" */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
        <button
          type="button"
          onClick={() => setModalAberta(true)}
          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase rounded-xl shadow-xl flex items-center gap-1.5 cursor-pointer transform hover:scale-105 transition-transform"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Trocar Foto</span>
        </button>
        <span className="text-[10px] text-white/90 font-medium bg-black/60 px-2 py-0.5 rounded">
          ou arraste e solte uma imagem aqui
        </span>
      </div>

      {/* Modal para Trocar Imagem */}
      {modalAberta && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-black uppercase text-amber-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Atualizar Imagem</span>
              </h3>
              <button
                onClick={() => setModalAberta(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1.5">
                  1. Upload do Computador / Celular
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processarArquivo(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-neutral-700 hover:border-amber-400 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Escolher arquivo de imagem</span>
                </button>
              </div>

              {salvandoStorage && (
                <div className="space-y-1.5 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando para o Firebase Storage...</span>
                    </span>
                    <span>{progressoStorage}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all" style={{ width: `${progressoStorage}%` }} />
                  </div>
                </div>
              )}

              <div className="relative flex items-center justify-center my-2">
                <span className="h-px bg-neutral-800 w-full" />
                <span className="px-3 text-[10px] font-bold text-neutral-500 uppercase bg-neutral-950 absolute">
                  OU
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1.5">
                  2. Colar Link / URL da Imagem
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        onChange(urlInput.trim());
                        setModalAberta(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SectionBlockProps {
  tituloSecao: string;
  visivel: boolean;
  onToggleVisivel: () => void;
  modoEdicao: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  tituloSecao,
  visivel,
  onToggleVisivel,
  modoEdicao,
  children,
  className = ''
}) => {
  if (!modoEdicao && !visivel) {
    return null;
  }

  return (
    <div className={`relative ${className} ${modoEdicao && !visivel ? 'opacity-40 grayscale border border-dashed border-red-500/50 p-2 rounded-2xl' : ''}`}>
      {modoEdicao && (
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black uppercase text-neutral-300">Seção: {tituloSecao}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                visivel ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
              }`}
            >
              {visivel ? 'Visível aos visitantes' : 'Oculta aos visitantes'}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleVisivel}
            className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
              visivel
                ? 'bg-neutral-800 text-neutral-300 hover:bg-red-950 hover:text-red-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {visivel ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{visivel ? 'Ocultar Seção' : 'Exibir Seção'}</span>
          </button>
        </div>
      )}

      {children}
    </div>
  );
};
