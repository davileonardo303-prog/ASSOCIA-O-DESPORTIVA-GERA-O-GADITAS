import React from 'react';
import { Award, Shield, CheckCircle, Flame, Calendar, Users, MapPin, ChevronRight } from 'lucide-react';
import lionEmblemImg from '../assets/images/gaditas_lion_emblem_1791983074366.jpg';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* HEADER DO MESTRE */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-black border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl p-1 bg-gradient-to-br from-red-500 via-amber-500 to-neutral-900 shadow-2xl shadow-red-950/40 relative">
              <div className="w-full h-full rounded-2xl bg-neutral-950 flex flex-col items-center justify-center p-3 text-center border border-neutral-800 overflow-hidden">
                <img
                  src={lionEmblemImg}
                  alt="Emblema Mestre Daniel"
                  className="w-28 h-28 object-contain mb-1 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                />
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Mestre Daniel Braga
                </span>
                <span className="text-[9px] text-neutral-400 uppercase">
                  Líder & Fundador
                </span>
              </div>
            </div>

            <div className="mt-4 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-black uppercase text-red-400">
              Muay Thai · Grau Preta e Branca
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
              <Award className="w-4 h-4" />
              <span>Direção Geral e Técnica</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
              MESTRE DANIEL <span className="text-red-500">BRAGA</span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Com mais de duas décadas dedicadas às artes marciais e à formação de atletas e cidadãos, o Mestre Daniel Braga lidera a <strong>Equipe Gaditas Fight Team</strong> com foco absoluto em técnica apurada, respeito à hierarquia do dojo e transformação social.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Muay Thai</span>
                <span className="text-xs font-black text-white uppercase">Grau Preta e Branca</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Luta Livre</span>
                <span className="text-xs font-black text-white uppercase">Faixa Preta (2017)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Linhagem Marcial</span>
                <span className="text-xs font-black text-amber-400 uppercase">Mestre Leandro Vilela</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LINHA DO TEMPO & HISTÓRICO */}
      <section className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-xs font-black uppercase tracking-widest text-red-500">
            Trajetória & Linhagem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            DA FORMAÇÃO DE BASE À CONSOLIDAÇÃO GADITAS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 font-black font-mono text-sm">
              01
            </div>
            <h3 className="text-base font-black uppercase text-white">Início aos 15 Anos</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Primeiros passos nos esportes de combate com forte disciplina nos treinos de Boxe e Kickboxing, construindo a base de striking que hoje molda a equipe.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 font-black font-mono text-sm">
              02
            </div>
            <h3 className="text-base font-black uppercase text-white">Base Nael Pedra & Faixa Preta</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Formação na Equipe Nael Pedra e consagração da Faixa Preta de Luta Livre Esportiva em 2017 pelas mãos do respeitado Mestre Leandro Vilela (Equipe Gladiador).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black font-mono text-sm">
              03
            </div>
            <h3 className="text-base font-black uppercase text-white">Nascimento da Equipe Gaditas</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fundada em 2017 em Nova Iguaçu, transformou-se de um projeto local em uma potência com múltiplos polos, formando campeões estaduais e mais de 12 faixas pretas.
            </p>
          </div>
        </div>
      </section>

      {/* MODALIDADES TÉCNICAS */}
      <section className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <h3 className="text-xl font-black uppercase text-white">
          Especialidades & Domínio Técnico
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Nossa metodologia integra as mais eficientes escolas de combate do mundo em um currículo pedagógico progressivo:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800 text-center">
            <span className="text-xs font-black uppercase text-white block">Muay Thai</span>
            <span className="text-[10px] text-neutral-400">Preta e Branca</span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800 text-center">
            <span className="text-xs font-black uppercase text-white block">Luta Livre</span>
            <span className="text-[10px] text-neutral-400">Faixa Preta</span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800 text-center">
            <span className="text-xs font-black uppercase text-white block">Kickboxing</span>
            <span className="text-[10px] text-neutral-400">Regras K-1</span>
          </div>
          <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800 text-center">
            <span className="text-xs font-black uppercase text-white block">MMA & Sambo</span>
            <span className="text-[10px] text-neutral-400">Transição Completa</span>
          </div>
        </div>
      </section>

      {/* CTA DE ENTRADA NO TIME */}
      <section className="text-center space-y-4 pt-6 border-t border-neutral-800">
        <h3 className="text-2xl font-black uppercase text-white">
          FAÇA PARTE DESTA HISTÓRIA
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
          Treine diretamente com a liderança técnica do Mestre Daniel Braga ou nos polos oficiais da equipe no Rio de Janeiro.
        </p>
        <button
          onClick={() => onNavigate('matricula')}
          className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/60"
        >
          <span>Realizar Matrícula Online</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
