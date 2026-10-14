import React, { useState } from 'react';
import { Trophy, Award, Users, X, ChevronLeft, ChevronRight, Maximize2, Shield } from 'lucide-react';
import heroRingImg from '../assets/images/gaditas_hero_ring_1791983055353.jpg';
import lionEmblemImg from '../assets/images/gaditas_lion_emblem_1791983074366.jpg';
import actionImg from '../assets/images/muay_thai_action_1791983074498.jpg';

interface GalleryItem {
  id: string;
  title: string;
  category: 'campeonatos' | 'treinos' | 'cinturoes';
  tag: string;
  imgUrl: string;
  description: string;
}

export const GalleryView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'campeonatos' | 'treinos' | 'cinturoes'>('todos');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Equipe Gaditas Fight Team - Confraternização & Graduação',
      category: 'treinos',
      tag: 'Equipe Oficial',
      imgUrl: actionImg,
      description: 'Atletas e professores reunidos no polo de treinamento da Equipe Gaditas após treino intensivo de preparação.'
    },
    {
      id: 'g-2',
      title: 'Disputa de Cinturão e Arena de Combate',
      category: 'campeonatos',
      tag: 'Campeonato Oficial',
      imgUrl: heroRingImg,
      description: 'Estrutura oficial de ringue e octógono para as lutas de Muay Thai e MMA dos guerreiros Gaditas.'
    },
    {
      id: 'g-3',
      title: 'Consagração de Campeões e Troféus de Ouro',
      category: 'cinturoes',
      tag: 'Conquista Gaditas',
      imgUrl: lionEmblemImg,
      description: 'Brasão de glória dos campeões da Associação Desportiva Gaditas - Resgatando Vidas.'
    },
    {
      id: 'g-4',
      title: 'Arena Portal Kombat - Vitória por Nocaute',
      category: 'campeonatos',
      tag: 'Arena Combat',
      imgUrl: heroRingImg,
      description: 'Equipe de atletas no octógono com medalhas douradas e troféu de melhor equipe do torneio.'
    },
    {
      id: 'g-5',
      title: 'Cinturão de Campeão de Muay Thai',
      category: 'cinturoes',
      tag: 'Cinturão Ouro',
      imgUrl: lionEmblemImg,
      description: 'Atleta juvenil Gaditas conquistando o cinturão estadual no ringue de Muay Thai Stadium.'
    },
    {
      id: 'g-6',
      title: 'Treinamento Tático de Sparring & Clinch',
      category: 'treinos',
      tag: 'Treino de Sparring',
      imgUrl: actionImg,
      description: 'Aprimoramento técnico de joelhadas, cotoveladas e projeções de Luta Livre no tatame.'
    }
  ];

  const filteredItems = activeCategory === 'todos'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

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

  const currentItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Título da Seção */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-black tracking-widest text-red-500">
          Registros Históricos & Conquistas
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white">
          GALERIA DOS <span className="text-red-500">GUERREIROS</span>
        </h1>
        <p className="text-neutral-400 text-sm">
          Momentos de superação, pódios, graduações e a energia dos treinos diários da família Gaditas.
        </p>
      </div>

      {/* Filtros de Categoria (Segmented Control) */}
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
        </div>
      </div>

      {/* Grid de Imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleOpenLightbox(index)}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl cursor-pointer hover:border-red-500/60 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Foto Wrapper */}
            <div className="h-64 overflow-hidden relative bg-neutral-950">
              <img
                src={item.imgUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* Badge superior */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-amber-400 border border-amber-400/30">
                  {item.tag}
                </span>
              </div>

              {/* Botão Expandir no hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 rounded-lg bg-black/80 text-white hover:text-red-400">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Título Sobreposto */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-sm font-bold uppercase text-white leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/90 text-xs text-neutral-400">
              <p className="line-clamp-2 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {currentItem && (
        <div
          onClick={handleCloseLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Top bar do Lightbox */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase text-amber-400">
                  {currentItem.tag}
                </span>
              </div>
              <button
                onClick={handleCloseLightbox}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Imagem Central com Controles */}
            <div className="relative bg-black flex items-center justify-center min-h-[350px] max-h-[60vh] overflow-hidden">
              <img
                src={currentItem.imgUrl}
                alt={currentItem.title}
                className="max-w-full max-h-[60vh] object-contain"
              />

              <button
                onClick={handlePrev}
                className="absolute left-3 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-700 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-700 transition-colors"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Legenda Inferior */}
            <div className="p-6 bg-neutral-950 border-t border-neutral-800 space-y-1">
              <h2 className="text-lg font-black uppercase text-white">
                {currentItem.title}
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {currentItem.description}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
