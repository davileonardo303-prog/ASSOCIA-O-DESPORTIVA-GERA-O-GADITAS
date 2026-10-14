import React from 'react';
import { ProjardeBelt } from '../types';

interface BeltDisplayProps {
  faixa: ProjardeBelt;
  graus: number;
  interactive?: boolean;
  onUpdateGraus?: (novoGrau: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const getBeltClass = (faixa: string) => {
  if (!faixa) return 'proj-amarela';
  return 'proj-' + faixa
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
};

export const BeltDisplay: React.FC<BeltDisplayProps> = ({
  faixa,
  graus,
  interactive = false,
  onUpdateGraus,
  size = 'md'
}) => {
  const beltClass = getBeltClass(faixa);
  const heightClass = size === 'sm' ? 'h-3' : size === 'lg' ? 'h-6' : 'h-4';
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="w-full">
      {/* Barra visual da Faixa Projarde */}
      <div 
        className={`w-full ${heightClass} rounded-full border border-neutral-700 shadow-inner ${beltClass} transition-all duration-300 relative overflow-hidden`}
        title={`Faixa: ${faixa}`}
      >
        {/* Costura visual de faixa marcial */}
        <div className="absolute inset-0 border-y border-black/20 pointer-events-none" />
      </div>

      {/* 4 Graus / Pontas Projarde */}
      <div className="flex items-center justify-between mt-2.5 px-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
          Graus ({graus}/4)
        </span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(idx => {
            const isAtivo = idx <= graus;
            return (
              <button
                key={idx}
                type="button"
                disabled={!interactive}
                onClick={() => {
                  if (interactive && onUpdateGraus) {
                    const novoGrau = idx === graus ? idx - 1 : idx;
                    onUpdateGraus(novoGrau);
                  }
                }}
                className={`
                  ${dotSize} rounded-full transition-all duration-200 border
                  ${isAtivo 
                    ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-105' 
                    : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500'
                  }
                  ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}
                `}
                title={interactive ? `Clique para alterar grau para ${idx}` : undefined}
                aria-label={`Grau ${idx}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
