import React, { useState, useEffect, useRef } from 'react';
import { store, comprimirImagemParaWebP } from '../services/store';
import { Unidade, GaleriaItem } from '../types';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Loader2, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Shield, 
  Flame, 
  Trash2,
  Sparkles
} from 'lucide-react';
import lionEmblemImg from '../assets/images/gaditas_lion_emblem_1791983074366.jpg';
import heroRingImg from '../assets/images/gaditas_fight_ring_1791983084347.jpg';

interface GerenciadorFotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  alvoInicial?: 'logo' | 'hero' | 'modalidade1' | 'modalidade2' | 'modalidade3' | 'polo' | 'galeria' | 'banner';
}

export const GerenciadorFotosModal: React.FC<GerenciadorFotosModalProps> = ({
  isOpen,
  onClose,
  alvoInicial = 'hero'
}) => {
  const [alvo, setAlvo] = useState<'logo' | 'hero' | 'modalidade1' | 'modalidade2' | 'modalidade3' | 'polo' | 'galeria' | 'banner'>(alvoInicial);
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [poloSelecionadoId, setPoloSelecionadoId] = useState<string>(() => store.getUnidades()[0]?.id || '');
  const [globalScreens, setGlobalScreens] = useState(() => store.getGlobalScreens());
  const [siteConfig, setSiteConfig] = useState(() => store.getSiteConfig());

  // Upload state
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [previewLocal, setPreviewLocal] = useState<string>('');
  const [uploadando, setUploadando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Campos extras para Galeria
  const [galeriaTitulo, setGaleriaTitulo] = useState('');
  const [galeriaCategoria, setGaleriaCategoria] = useState<'campeonatos' | 'treinos' | 'cinturoes' | 'instagram'>('campeonatos');
  const [galeriaLegenda, setGaleriaLegenda] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setUnidades([...store.getUnidades()]);
      setGlobalScreens(store.getGlobalScreens());
      setSiteConfig(store.getSiteConfig());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (alvoInicial) {
      setAlvo(alvoInicial);
    }
  }, [alvoInicial]);

  if (!isOpen) return null;

  // Foto Atual
  const obterFotoAtual = (): string => {
    switch (alvo) {
      case 'logo':
        return siteConfig.logoUrl || globalScreens.global.logoUrl || lionEmblemImg;
      case 'hero':
        return globalScreens.home.heroImagemUrl || heroRingImg;
      case 'modalidade1':
        return globalScreens.home.modalidade1FotoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80';
      case 'modalidade2':
        return globalScreens.home.modalidade2FotoUrl || 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80';
      case 'modalidade3':
        return globalScreens.home.modalidade3FotoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80';
      case 'polo': {
        const u = unidades.find(item => item.id === poloSelecionadoId);
        return u?.fotoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80';
      }
      case 'banner':
        return globalScreens.home.ctaBannerFotoUrl || 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=1200&auto=format&fit=crop&q=80';
      case 'galeria':
        return '';
      default:
        return '';
    }
  };

  const handleSelectArquivo = (file: File) => {
    setArquivoSelecionado(file);
    setStatusMsg(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setPreviewLocal(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectArquivo(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleSalvarNoStorage = async () => {
    if (!arquivoSelecionado && !previewLocal) {
      setStatusMsg({ tipo: 'erro', texto: 'Por favor, selecione ou arraste uma foto para enviar.' });
      return;
    }

    setUploadando(true);
    setProgresso(15);
    setStatusMsg(null);

    try {
      // 1. Otimiza a imagem para WebP se for arquivo
      let blobFinal: Blob | File = arquivoSelecionado!;
      try {
        if (arquivoSelecionado) {
          blobFinal = await comprimirImagemParaWebP(arquivoSelecionado, 1600, 1600, 0.85);
        }
      } catch (e) {
        console.warn('Compressão WebP ignorada:', e);
      }

      setProgresso(35);

      // 2. Pasta e nome no Firebase Storage
      const pastaStorage = `fotos_site/${alvo}`;
      const downloadUrl = await store.uploadFotoSiteParaStorage(blobFinal, pastaStorage, (pct) => {
        setProgresso(Math.max(35, pct));
      });

      setProgresso(95);

      // 3. Atualiza no Firestore dependendo do alvo
      switch (alvo) {
        case 'logo':
          await store.salvarFotoLogo(downloadUrl);
          break;
        case 'hero':
          await store.salvarFotoHero(downloadUrl);
          break;
        case 'modalidade1':
          await store.salvarFotoModalidade(1, downloadUrl);
          break;
        case 'modalidade2':
          await store.salvarFotoModalidade(2, downloadUrl);
          break;
        case 'modalidade3':
          await store.salvarFotoModalidade(3, downloadUrl);
          break;
        case 'polo':
          if (poloSelecionadoId) {
            await store.salvarFotoPolo(poloSelecionadoId, downloadUrl);
          }
          break;
        case 'banner':
          await store.salvarGlobalScreens({
            home: {
              ...globalScreens.home,
              ctaBannerFotoUrl: downloadUrl
            }
          });
          break;
        case 'galeria': {
          const novoItem: GaleriaItem = {
            id: 'gal-' + Date.now(),
            titulo: galeriaTitulo.trim() || 'Foto Oficial dos Guerreiros',
            categoria: galeriaCategoria,
            url: downloadUrl,
            legenda: galeriaLegenda.trim() || '',
            ordem: Date.now()
          };
          await store.salvarGaleriaItem(novoItem);
          break;
        }
      }

      setProgresso(100);
      setStatusMsg({
        tipo: 'sucesso',
        texto: 'Foto enviada com sucesso para o Firebase Storage e atualizada no Firestore!'
      });
      setArquivoSelecionado(null);
      setPreviewLocal('');
      setGaleriaTitulo('');
      setGaleriaLegenda('');

      setTimeout(() => {
        setStatusMsg(null);
      }, 4000);
    } catch (err: any) {
      setStatusMsg({
        tipo: 'erro',
        texto: err?.message || 'Falha ao enviar foto para o Firebase Storage.'
      });
    } finally {
      setUploadando(false);
      setProgresso(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-white relative">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>GERENCIADOR DE FOTOS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 font-bold">
                  Firebase Storage
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Altere qualquer foto do site com salvamento no Firebase Storage e Firestore.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-900 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificação de Status */}
        {statusMsg && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            statusMsg.tipo === 'sucesso'
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
              : 'bg-red-950/60 border-red-500/60 text-red-300'
          }`}>
            {statusMsg.tipo === 'sucesso' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            )}
            <span>{statusMsg.texto}</span>
          </div>
        )}

        {/* Seletor de Alvo / O que deseja alterar */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
            1. Selecione a Foto que Deseja Alterar:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => { setAlvo('hero'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'hero'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Flame className="w-4 h-4 text-red-500" />
              <span>Hero / Fundo Home</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('logo'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'logo'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Logo Oficial CT</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('modalidade1'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'modalidade1'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <span>Luta Livre (Mod. 1)</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('modalidade2'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'modalidade2'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Muay Thai (Mod. 2)</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('modalidade3'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'modalidade3'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>MMA (Mod. 3)</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('polo'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'polo'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Polos & CTs</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('galeria'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'galeria'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Camera className="w-4 h-4 text-purple-400" />
              <span>Nova Foto Galeria</span>
            </button>

            <button
              type="button"
              onClick={() => { setAlvo('banner'); setPreviewLocal(''); }}
              className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                alvo === 'banner'
                  ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Banner Matrícula</span>
            </button>
          </div>
        </div>

        {/* Se for Polo, seleciona qual polo */}
        {alvo === 'polo' && (
          <div className="space-y-1.5 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
            <label className="text-xs font-bold uppercase text-neutral-300 block">
              Selecione o Polo / CT do Firestore:
            </label>
            <select
              value={poloSelecionadoId}
              onChange={(e) => {
                setPoloSelecionadoId(e.target.value);
                setPreviewLocal('');
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
            >
              {unidades.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.tipo === 'bolsista' ? 'Polo Social' : 'Polo Oficial'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Se for Galeria, campos adicionais */}
        {alvo === 'galeria' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Título da Foto na Galeria *
              </label>
              <input
                type="text"
                value={galeriaTitulo}
                onChange={(e) => setGaleriaTitulo(e.target.value)}
                placeholder="Ex: Treino Graduação Faixa Preta"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Categoria
              </label>
              <select
                value={galeriaCategoria}
                onChange={(e) => setGaleriaCategoria(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="campeonatos">Campeonatos & Pódios</option>
                <option value="treinos">Treinos Diários & Dojos</option>
                <option value="cinturoes">Cinturões & Disputas</option>
                <option value="instagram">Instagram Oficial</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Legenda Descritiva (Opcional)
              </label>
              <input
                type="text"
                value={galeriaLegenda}
                onChange={(e) => setGaleriaLegenda(e.target.value)}
                placeholder="Ex: CT Campo Grande reunido sob a liderança do Mestre Daniel Braga"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        )}

        {/* Visualização da Foto Atual vs Nova Foto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Foto Atual */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-neutral-400 block">
              Foto Atual no Site:
            </span>
            <div className="h-44 rounded-2xl bg-black border border-neutral-800 flex items-center justify-center overflow-hidden relative">
              {obterFotoAtual() ? (
                <img
                  src={obterFotoAtual()}
                  alt="Foto Atual"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-neutral-500 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span>Sem foto personalizada</span>
                </div>
              )}
            </div>
          </div>

          {/* Nova Foto (Preview Local) */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-amber-400 block">
              Nova Foto (Pré-visualização):
            </span>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all cursor-pointer relative overflow-hidden ${
                previewLocal
                  ? 'border-amber-500 bg-black'
                  : 'border-neutral-700 hover:border-amber-400 bg-neutral-900/40 hover:bg-neutral-900'
              }`}
            >
              {previewLocal ? (
                <img
                  src={previewLocal}
                  alt="Nova Foto Pré-visualização"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2 pointer-events-none">
                  <Upload className="w-7 h-7 text-neutral-400 mx-auto" />
                  <p className="text-xs font-bold text-neutral-300">
                    Clique ou arraste uma foto aqui
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    JPG, PNG ou WEBP (até 20MB)
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Barra de Progresso do Firebase Storage */}
        {uploadando && (
          <div className="space-y-1.5 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-amber-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enviando para o Firebase Storage...</span>
              </span>
              <span className="text-white font-mono">{progresso}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-200"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        )}

        {/* Rodapé e Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            disabled={uploadando}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleSalvarNoStorage}
            disabled={uploadando || (!previewLocal && !arquivoSelecionado)}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/60 cursor-pointer transition-all"
          >
            {uploadando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando no Storage...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Salvar Foto no Firebase</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
