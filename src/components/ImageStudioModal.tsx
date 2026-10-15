import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Maximize2, 
  RotateCw, 
  Eye, 
  Check, 
  Sliders, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { comprimirImagemParaWebP } from '../services/store';

export interface ImageStyleConfig {
  larguraPercentual?: number;
  alturaPx?: number;
  encaixe?: 'cover' | 'contain';
  focoX?: number;
  focoY?: number;
  zoom?: number;
  rotacao?: number;
  overlayEscuro?: number;
  bordaArredondada?: string;
}

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagemAtual: string;
  estiloAtual?: ImageStyleConfig;
  tituloAlvo?: string;
  onAplicar: (novaUrl: string, novoEstilo: ImageStyleConfig) => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  imagemAtual,
  estiloAtual,
  tituloAlvo,
  onAplicar
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(imagemAtual || '');
  const [largura, setLargura] = useState(estiloAtual?.larguraPercentual ?? 100);
  const [altura, setAltura] = useState(estiloAtual?.alturaPx ?? 400);
  const [encaixe, setEncaixe] = useState<'cover' | 'contain'>(estiloAtual?.encaixe ?? 'cover');
  const [focoX, setFocoX] = useState(estiloAtual?.focoX ?? 50);
  const [focoY, setFocoY] = useState(estiloAtual?.focoY ?? 50);
  const [zoom, setZoom] = useState(estiloAtual?.zoom ?? 100);
  const [rotacao, setRotacao] = useState(estiloAtual?.rotacao ?? 0);
  const [overlay, setOverlay] = useState(estiloAtual?.overlayEscuro ?? 0);
  const [borda, setBorda] = useState(estiloAtual?.bordaArredondada ?? '16px');
  const [processando, setProcessando] = useState(false);

  const handleArquivo = async (file: File) => {
    try {
      setProcessando(true);
      const webpBlob = await comprimirImagemParaWebP(file, 1200, 1200, 0.85);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUrl(reader.result);
        }
        setProcessando(false);
      };
      reader.readAsDataURL(webpBlob);
    } catch (err: any) {
      alert(err?.message || 'Falha ao processar arquivo.');
      setProcessando(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleGirar90 = () => {
    setRotacao((prev) => (prev + 90) % 360);
  };

  const handleSalvar = () => {
    onAplicar(url, {
      larguraPercentual: largura,
      alturaPx: altura,
      encaixe,
      focoX,
      focoY,
      zoom,
      rotacao,
      overlayEscuro: overlay,
      bordaArredondada: borda
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0b0e] border border-neutral-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Lado Esquerdo: Controles & Sliders */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-white">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black uppercase">
                Estúdio Visual de Imagem {tituloAlvo ? `· ${tituloAlvo}` : ''}
              </h3>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer md:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload / Drag & Drop */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-neutral-900/50"
          >
            <input
              type="file"
              accept="image/*"
              id="file-upload-studio"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleArquivo(e.target.files[0])}
            />
            <label htmlFor="file-upload-studio" className="cursor-pointer flex flex-col items-center gap-1.5 text-xs text-neutral-300">
              <Upload className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="font-bold">Arraste uma foto aqui ou clique para selecionar</span>
              <span className="text-[10px] text-neutral-500">Comprime automaticamente em WebP leve via Canvas</span>
            </label>
          </div>

          {/* URL direta */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase">Ou cole uma URL de imagem externa</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Sliders de Largura e Altura */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase">
                <span>Largura</span>
                <span className="text-amber-400">{largura}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={largura}
                onChange={e => setLargura(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase">
                <span>Altura</span>
                <span className="text-amber-400">{altura}px</span>
              </div>
              <input
                type="range"
                min="120"
                max="650"
                value={altura}
                onChange={e => setAltura(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Encaixe (Object Fit) */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Modo de Encaixe</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEncaixe('cover')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  encaixe === 'cover' ? 'bg-amber-500 text-black font-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                Preencher Caixa (Cover)
              </button>
              <button
                type="button"
                onClick={() => setEncaixe('contain')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  encaixe === 'contain' ? 'bg-amber-500 text-black font-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                Foto Inteira (Contain)
              </button>
            </div>
          </div>

          {/* Foco e Posição X e Y */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase">
                <span>Foco Horizontal (X)</span>
                <span className="text-amber-400">{focoX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={focoX}
                onChange={e => setFocoX(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase">
                <span>Foco Vertical (Y)</span>
                <span className="text-amber-400">{focoY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={focoY}
                onChange={e => setFocoY(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Zoom e Rotação */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase">
                <span>Zoom</span>
                <span className="text-amber-400">{zoom}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="200"
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handleGirar90}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Girar 90° ({rotacao}°)</span>
              </button>
            </div>
          </div>

          {/* Escurecimento de Fundo (Overlay) */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase">
              <span>Escurecer Fundo (Overlay)</span>
              <span className="text-amber-400">{overlay}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={overlay}
              onChange={e => setOverlay(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Borda */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">Formato da Moldura</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBorda('0px')}
                className={`py-1 text-xs font-bold uppercase rounded-xl cursor-pointer ${
                  borda === '0px' ? 'bg-amber-500 text-black font-black' : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                Retangular
              </button>
              <button
                type="button"
                onClick={() => setBorda('16px')}
                className={`py-1 text-xs font-bold uppercase rounded-xl cursor-pointer ${
                  borda === '16px' ? 'bg-amber-500 text-black font-black' : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                Arredondada
              </button>
              <button
                type="button"
                onClick={() => setBorda('9999px')}
                className={`py-1 text-xs font-bold uppercase rounded-xl cursor-pointer ${
                  borda === '9999px' ? 'bg-amber-500 text-black font-black' : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                Circular
              </button>
            </div>
          </div>
        </div>

        {/* Lado Direito: Preview ao Vivo da Foto Ajustada */}
        <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Preview ao Vivo</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {largura}% × {altura}px
              </span>
            </div>

            {/* Container da Imagem com medidas dinâmicas */}
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 flex items-center justify-center min-h-[300px] overflow-hidden relative">
              <div
                style={{
                  width: `${largura}%`,
                  height: `${altura}px`,
                  borderRadius: borda,
                  overflow: 'hidden',
                  position: 'relative'
                }}
                className="transition-all duration-200 border border-neutral-700/50 shadow-2xl"
              >
                {url ? (
                  <>
                    <img
                      src={url}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: encaixe,
                        objectPosition: `${focoX}% ${focoY}%`,
                        transform: `scale(${zoom / 100}) rotate(${rotacao}deg)`,
                        transition: 'transform 0.15s ease'
                      }}
                      className="w-full h-full"
                    />
                    {overlay > 0 && (
                      <div
                        style={{ backgroundColor: `rgba(0,0,0, ${overlay / 100})` }}
                        className="absolute inset-0 pointer-events-none"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-xs gap-2 bg-neutral-900">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span>Nenhuma imagem selecionada</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={!url || processando}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar na Tela</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
