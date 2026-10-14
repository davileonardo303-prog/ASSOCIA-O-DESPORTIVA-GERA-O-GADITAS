import React from 'react';
import { PaginaCustomizada } from '../types';
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react';

interface CustomPageViewProps {
  pagina: PaginaCustomizada;
  onVoltar: () => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ pagina, onVoltar }) => {
  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Início</span>
        </button>

        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Página Institucional</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            {pagina.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Atualizado em: {new Date(pagina.dataAtualizacao || pagina.dataCriacao).toLocaleDateString('pt-BR')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Publicado por: {pagina.autor}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans text-sm sm:text-base">
          {pagina.conteudo}
        </div>
      </div>
    </div>
  );
};
