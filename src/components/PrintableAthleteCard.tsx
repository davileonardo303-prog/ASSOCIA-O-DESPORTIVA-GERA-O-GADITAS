import React from 'react';
import { Aluno } from '../types';
import { BeltDisplay } from './BeltDisplay';
import { Shield, Printer, X, HeartPulse, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

interface PrintableAthleteCardProps {
  aluno: Aluno;
  onClose: () => void;
}

export const PrintableAthleteCard: React.FC<PrintableAthleteCardProps> = ({ aluno, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-white card-print">
        
        {/* Botões Superiores de Ação */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-neutral-800 no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Ficha Oficial de Atleta & Competição
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir Ficha</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cabeçalho da Ficha Oficial */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-red-500">
              EQUIPE GADITAS FIGHT TEAM · RIO DE JANEIRO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              {aluno.nome}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-400">
              <span><strong>Matrícula:</strong> #{aluno.matricula}</span>
              <span>·</span>
              <span><strong>CT:</strong> {aluno.ct}</span>
              <span>·</span>
              <span><strong>Status:</strong> {aluno.status.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="inline-block px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-amber-400 font-mono text-sm font-black">
              #{aluno.matricula.toString().padStart(4, '0')}
            </div>
            <p className="text-[10px] text-neutral-400 uppercase mt-1">Identificação Cadastral</p>
          </div>
        </div>

        {/* Graduação Projarde */}
        <div className="py-5 border-b border-neutral-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Graduação Oficial Projarde
            </span>
            <span className="text-sm font-black uppercase text-amber-400">
              Faixa {aluno.faixa}
            </span>
          </div>
          <BeltDisplay faixa={aluno.faixa} graus={aluno.graus} size="lg" />
        </div>

        {/* Dados de Saúde & Emergência */}
        <div className="py-6 border-b border-neutral-800 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2">
            <HeartPulse className="w-4 h-4" />
            <span>Ficha Médica & Emergência</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 block mb-1">Tipo Sanguíneo:</span>
              <span className="text-base font-black text-white">{aluno.tipo_sanguineo || 'Não informado'}</span>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 block mb-1">Alergias Relatadas:</span>
              <span className="font-semibold text-white">{aluno.alergias || 'Nenhuma'}</span>
            </div>
          </div>

          {aluno.problemas_saude && (
            <div className="p-3.5 bg-red-950/30 border border-red-500/40 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-red-400 block">Observação Médica / Lesão Prévia:</span>
                <span className="text-neutral-300">{aluno.problemas_saude}</span>
              </div>
            </div>
          )}

          <div className="p-3.5 bg-neutral-950/80 rounded-lg border border-neutral-800 flex items-center gap-3">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Contato em Caso de Emergência:</span>
              <span className="font-bold text-white text-sm">{aluno.contato_emergencia || 'Não informado'}</span>
            </div>
          </div>
        </div>

        {/* Termos & Validação */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Termo de Responsabilidade & Uso de Imagem Assinado Digitalmente</span>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-neutral-800 text-center text-xs text-neutral-400">
            <div>
              <div className="border-b border-neutral-700 h-8 mb-1" />
              <span>Assinatura do Atleta / Responsável</span>
            </div>
            <div>
              <div className="border-b border-neutral-700 h-8 mb-1" />
              <span>Mestre Daniel Braga · Direção Técnica</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
