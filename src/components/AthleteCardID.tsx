import React, { useRef } from 'react';
import { Aluno } from '../types';
import { BeltDisplay } from './BeltDisplay';
import { Shield, QrCode, Award, CheckCircle, Printer, X, Download } from 'lucide-react';

interface AthleteCardIDProps {
  aluno: Aluno;
  onClose?: () => void;
}

export const AthleteCardID: React.FC<AthleteCardIDProps> = ({ aluno, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 flex flex-col items-center">
        
        {/* Controles de Ação no topo */}
        <div className="w-full flex items-center justify-between pb-3 text-xs text-neutral-300 no-print">
          <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Carteirinha Digital Oficial
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimir</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CARTEIRINHA DIGITAL DO ATLETA (DESIGN PREMIUM DE FEDERAÇÃO) */}
        <div
          ref={cardRef}
          className="w-full rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-[#1c1c24] via-[#0d0d10] to-[#070708] border-2 border-amber-500/40 shadow-[0_20px_50px_rgba(204,0,0,0.25)] card-print"
        >
          {/* Efeito Holográfico Dourado de Fundo */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/10 via-red-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Cabeçalho da Carteirinha */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-white tracking-wider block">
                  EQUIPE GADITAS
                </span>
                <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest block">
                  Carteira Oficial de Guerreiro
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-neutral-400 uppercase font-mono block">Matrícula</span>
              <span className="font-mono text-base font-black text-amber-400 leading-none">
                #{aluno.matricula.toString().padStart(4, '0')}
              </span>
            </div>
          </div>

          {/* Corpo do Cartão: Foto e Informações Principais */}
          <div className="relative z-10 py-5 flex items-center gap-5">
            {/* Foto / Avatar com Borda Marcial */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 border-2 border-red-500 p-1 flex items-center justify-center shadow-lg overflow-hidden">
                <div className="w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center text-2xl font-black text-white uppercase">
                  {aluno.nome.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-black border border-black shadow">
                <CheckCircle className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Dados do Atleta */}
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">
                Atleta Federado
              </span>
              <h3 className="text-base font-black uppercase text-white truncate leading-tight">
                {aluno.nome}
              </h3>
              <p className="text-[11px] text-neutral-300 font-semibold truncate">
                Polo CT: <strong className="text-white">{aluno.ct}</strong>
              </p>
              <div className="flex items-center gap-3 pt-0.5 text-[10px] text-neutral-400">
                <span>Tipo Sangue: <strong className="text-red-400">{aluno.tipo_sanguineo || 'N/I'}</strong></span>
                <span>·</span>
                <span>Status: <strong className="text-emerald-400 uppercase">Ativo</strong></span>
              </div>
            </div>
          </div>

          {/* Nível Projarde com Faixa e Graus */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-black/60 border border-neutral-800/80 space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold">
              <span className="text-neutral-400">Graduação Projarde</span>
              <span className="text-amber-400 font-black">Faixa {aluno.faixa}</span>
            </div>
            <BeltDisplay faixa={aluno.faixa} graus={aluno.graus} size="sm" />
          </div>

          {/* Rodapé da Carteirinha: Autenticação & Validade */}
          <div className="relative z-10 pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between text-[9px] text-neutral-400">
            <div className="space-y-0.5">
              <span>Validade Nacional · Válido para Torneios</span>
              <span className="block font-mono text-neutral-300">
                Hash: GAD-{aluno.matricula}-{aluno.ct.slice(0, 3).toUpperCase()}-2026
              </span>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-bold block uppercase">Mestre Daniel Braga</span>
              <span className="text-[8px] text-neutral-400">Direção Geral</span>
            </div>
          </div>

        </div>

        <p className="text-[11px] text-neutral-400 text-center mt-3 no-print">
          Apresente esta carteirinha digital nas entradas dos eventos e pesagens oficiais.
        </p>

      </div>
    </div>
  );
};
