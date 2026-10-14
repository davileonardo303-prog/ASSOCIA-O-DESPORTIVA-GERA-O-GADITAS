import React, { useState } from 'react';
import { ProjardeBelt } from '../types';
import { BeltDisplay } from './BeltDisplay';
import { Award, X, CheckCircle, Clock, BookOpen, Shield } from 'lucide-react';

interface BeltProgressionModalProps {
  onClose: () => void;
  currentBelt?: ProjardeBelt;
}

interface BeltInfo {
  nome: ProjardeBelt;
  tempoMedio: string;
  foco: string;
  requisitos: string[];
}

export const BELT_CURRICULUM: BeltInfo[] = [
  {
    nome: 'Amarela',
    tempoMedio: '3 a 6 meses',
    foco: 'Fundamentos e Postura Marcial',
    requisitos: ['Guarda clássica de combate', 'Jab, Direto e Cruzado', 'Chute circular na coxa (Low Kick)', 'Sprawl e defesa básica de queda', 'Etiqueta e respeito no dojo']
  },
  {
    nome: 'Amarela e Branca',
    tempoMedio: '4 a 6 meses',
    foco: 'Combinações e Defesa Ativa',
    requisitos: ['Combinação 1-2 com chute médio', 'Frontal (Teep) para controle de distância', 'Passagem de guarda aberta', 'Estrangulamento Mata-Leão e saída básica']
  },
  {
    nome: 'Verde',
    tempoMedio: '6 a 9 meses',
    foco: 'Clinch e Transição Queda-Solo',
    requisitos: ['Clinch tailandês com joelhadas', 'Defesa de queda com contra-ataque de joelho', 'Guilhotina e Armlock da guarda', 'Sparring técnico leve com protetor']
  },
  {
    nome: 'Verde e Branca',
    tempoMedio: '6 a 9 meses',
    foco: 'Ataques de Submissão e Cotovelos',
    requisitos: ['Golpes de cotovelo horizontais e diagonais', 'Kimura e Americana', 'Queda de quadril (Ippon Seoi Nage / O-Goshi)', 'Controle de respiração sob pressão']
  },
  {
    nome: 'Azul',
    tempoMedio: '1 a 2 anos',
    foco: 'Consistência de Combate e Ritmo',
    requisitos: ['Sparring livre com intensidade média', 'Combinações complexas de 4 a 5 golpes', 'Defesa de finalizações variadas', 'Suporte técnico aos alunos iniciantes']
  },
  {
    nome: 'Azul e Branca',
    tempoMedio: '1 a 2 anos',
    foco: 'Chaves Articulares e No-Gi Dinâmico',
    requisitos: ['Chave de calcanhar e americana de pé', 'Bloqueios dinâmicos e contra-golpes em tempo real', 'Condicionamento de alta intensidade']
  },
  {
    nome: 'Marrom',
    tempoMedio: '2 a 3 anos',
    foco: 'Refinamento Técnico e Liderança',
    requisitos: ['Domínio de todas as transições de striking para queda', 'Capacidade de puxar treinos de sparring', 'Estratégia personalizada de combate']
  },
  {
    nome: 'Marrom e Branca',
    tempoMedio: '2 a 3 anos',
    foco: 'Pré-Exame de Maestria Marcial',
    requisitos: ['Execução perfeita de todo o currículo de Luta Livre e Muay Thai', 'Apresentação teórica da história marcial', 'Conduta moral exemplar']
  },
  {
    nome: 'Vermelha',
    tempoMedio: '3+ anos',
    foco: 'Maestria & Autoridade Técnica',
    requisitos: ['Precisão cirúrgica de golpes', 'Gestão de lesões e pedagogia esportiva', 'Orientação de competidores em campeonatos']
  },
  {
    nome: 'Vermelha e Branca',
    tempoMedio: '3+ anos',
    foco: 'Formador de Instrutores',
    requisitos: ['Capacidade de formar faixas marrons e vermelhas', 'Representação oficial em federações']
  },
  {
    nome: 'Vermelho e Amarelo',
    tempoMedio: '4+ anos',
    foco: 'Tradição & Honra Marcial',
    requisitos: ['Reconhecimento institucional pleno por mérito e história de combate']
  },
  {
    nome: 'Preta',
    tempoMedio: '5+ anos dedicados',
    foco: 'Consagração Faixa Preta',
    requisitos: ['Exame oficial com banca de mestres', 'Domínio total de luta em pé, clinch, quedas e chão', 'Formação comprovada de guerreiros']
  },
  {
    nome: 'Preta e Branca',
    tempoMedio: 'Grau Máximo de Mestre',
    foco: 'Mestre Titular e Guardião da Linhagem',
    requisitos: ['Grau conferido ao Mestre Daniel Braga · Direção Geral da Equipe Gaditas']
  }
];

export const BeltProgressionModal: React.FC<BeltProgressionModalProps> = ({ onClose, currentBelt }) => {
  const [selectedBelt, setSelectedBelt] = useState<BeltInfo>(
    BELT_CURRICULUM.find(b => b.nome === currentBelt) || BELT_CURRICULUM[0]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Currículo & Graduação <span className="text-red-500">Projarde</span>
              </h2>
              <span className="text-xs text-neutral-400">
                Sistema Oficial de Avaliação Técnica da Equipe Gaditas
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout Split: Lista de Faixas na Esquerda & Detalhes na Direita */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
          
          {/* Seletor de Faixas */}
          <div className="md:col-span-5 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Selecione o Nível para Ver os Requisitos:
            </span>
            {BELT_CURRICULUM.map(belt => {
              const isSelected = selectedBelt.nome === belt.nome;
              const isCurrent = currentBelt === belt.nome;

              return (
                <button
                  key={belt.nome}
                  onClick={() => setSelectedBelt(belt)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800 border-amber-400/80 shadow-md'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-white">
                        Faixa {belt.nome}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                          Sua Faixa
                        </span>
                      )}
                    </div>
                    <BeltDisplay faixa={belt.nome} graus={4} size="sm" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalhes do Nível Selecionado */}
          <div className="md:col-span-7 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Nível Avaliado</span>
                  <h3 className="text-2xl font-black uppercase text-amber-400">
                    Faixa {selectedBelt.nome}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Tempo Médio</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1 justify-end font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {selectedBelt.tempoMedio}
                  </span>
                </div>
              </div>

              {/* Faixa Grande */}
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                <BeltDisplay faixa={selectedBelt.nome} graus={4} size="lg" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">
                  Foco Central do Nível:
                </span>
                <p className="text-sm font-semibold text-white">
                  {selectedBelt.foco}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Requisitos Obrigatórios para Graduação:
                </span>
                <ul className="space-y-2">
                  {selectedBelt.requisitos.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Metodologia supervisionada por Mestre Daniel Braga.</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
