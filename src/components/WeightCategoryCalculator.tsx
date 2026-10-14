import React, { useState } from 'react';
import { Scale, Activity, ArrowRight, Shield, X, AlertCircle } from 'lucide-react';

interface WeightCategoryCalculatorProps {
  initialWeight?: number;
  initialHeight?: number;
  onSave?: (weight: number, height: number) => void;
  onClose?: () => void;
}

interface WeightDivision {
  name: string;
  maxKg: number;
  maxLbs: number;
  description: string;
}

const DIVISIONS: WeightDivision[] = [
  { name: 'Peso Palha', maxKg: 52.2, maxLbs: 115, description: 'Divisão de agilidade extrema e volume de golpes' },
  { name: 'Peso Mosca', maxKg: 56.7, maxLbs: 125, description: 'Velocidade e precisão no striking e solo' },
  { name: 'Peso Galo', maxKg: 61.2, maxLbs: 135, description: 'Equilíbrio clássico de potência e dinamismo' },
  { name: 'Peso Pena', maxKg: 65.8, maxLbs: 145, description: 'Uma das divisões mais competitivas do esporte' },
  { name: 'Peso Leve', maxKg: 70.3, maxLbs: 155, description: 'Categoria de ouro dos maiores campeões' },
  { name: 'Peso Meio-Médio', maxKg: 77.1, maxLbs: 170, description: 'Força bruta e explosão de quedas e socos' },
  { name: 'Peso Médio', maxKg: 83.9, maxLbs: 185, description: 'Potência de nocaute e envergadura' },
  { name: 'Peso Meio-Pesado', maxKg: 93.0, maxLbs: 205, description: 'Impacto devastador nos tatames e cages' },
  { name: 'Peso Pesado', maxKg: 120.2, maxLbs: 265, description: 'O ápice da força dos esportes de combate' }
];

export const WeightCategoryCalculator: React.FC<WeightCategoryCalculatorProps> = ({
  initialWeight = 72,
  initialHeight = 175,
  onSave,
  onClose
}) => {
  const [peso, setPeso] = useState(initialWeight.toString());
  const [altura, setAltura] = useState(initialHeight.toString());

  const pesoNum = parseFloat(peso.replace(',', '.')) || 0;
  const alturaM = (parseFloat(altura) || 0) / 100;
  const imc = (alturaM > 0 && pesoNum > 0) ? (pesoNum / (alturaM * alturaM)).toFixed(1) : '---';

  const currentDivision = DIVISIONS.find(d => pesoNum <= d.maxKg) || {
    name: 'Super Pesado',
    maxKg: 999,
    maxLbs: 999,
    description: 'Divisão sem limite máximo para gigantes do combate'
  };

  const handleSave = () => {
    if (onSave && pesoNum > 0) {
      onSave(pesoNum, parseFloat(altura) || 175);
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-red-500" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Calculadora de <span className="text-amber-400">Categoria de Peso</span>
              </h2>
              <span className="text-xs text-neutral-400">
                Padrão Oficial de Competições de Muay Thai e MMA
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
              Peso Atual (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={peso}
              onChange={e => setPeso(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-base font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
              Altura (cm)
            </label>
            <input
              type="number"
              value={altura}
              onChange={e => setAltura(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-base font-mono font-bold"
            />
          </div>
        </div>

        {/* Card de Resultado da Categoria */}
        <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Sua Categoria Oficial de Luta:
              </span>
              <h3 className="text-2xl font-black uppercase text-amber-400">
                {currentDivision.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Limite até {currentDivision.maxKg} kg ({currentDivision.maxLbs} lbs)
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">IMC Atleta</span>
              <span className="text-xl font-mono font-black text-white">{imc}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed pt-2 border-t border-neutral-900">
            {currentDivision.description}.
          </p>
        </div>

        {/* Lista Rápida de Divisões */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
            Escala Oficial Unificada de Combate:
          </span>
          {DIVISIONS.map(d => {
            const isMatch = d.name === currentDivision.name;
            return (
              <div
                key={d.name}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  isMatch
                    ? 'bg-red-950/40 border-red-500/60 text-white font-bold'
                    : 'bg-neutral-950/40 border-neutral-800 text-neutral-400'
                }`}
              >
                <span>{d.name}</span>
                <span className="font-mono">até {d.maxKg} kg</span>
              </div>
            );
          })}
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          {onSave && (
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Salvar na Minha Ficha
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
            >
              Fechar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
