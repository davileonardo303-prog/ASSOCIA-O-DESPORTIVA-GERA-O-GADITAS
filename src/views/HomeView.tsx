import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { HorarioTreino, Unidade } from '../types';
import { 
  Shield, 
  ArrowRight, 
  MapPin, 
  Award, 
  Users, 
  Flame, 
  CheckCircle, 
  ChevronRight, 
  Instagram, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Dumbbell, 
  Check, 
  Sparkles, 
  Trophy 
} from 'lucide-react';
import heroRingImg from '../assets/images/gaditas_hero_ring_1791983055353.jpg';
import lionEmblemImg from '../assets/images/gaditas_lion_emblem_1791983074366.jpg';
import actionImg from '../assets/images/muay_thai_action_1791983074498.jpg';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [poloHorario, setPoloHorario] = useState<string>(() => store.getUnidades()[0]?.nome || 'Campo Grande');
  const [homeConfig, setHomeConfig] = useState(() => store.getGlobalScreens().home);
  const [globalConfig, setGlobalConfig] = useState(() => store.getGlobalScreens().global);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const u = store.getUnidades();
      setUnidades([...u]);
      setHomeConfig(store.getGlobalScreens().home);
      setGlobalConfig(store.getGlobalScreens().global);
      if (u.length > 0 && !u.some(x => x.nome.toLowerCase() === poloHorario.toLowerCase())) {
        setPoloHorario(u[0].nome);
      }
    });
    return unsub;
  }, [poloHorario]);

  const horarios = store.getHorarios(poloHorario);

  const cleanPhone = (globalConfig.whatsapp || '5521999990001').replace(/\D/g, '');
  const whatsappDojoUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
    'Olá Mestre Daniel! Gostaria de agendar uma aula experimental gratuita na Equipe Gaditas. Como posso iniciar?'
  )}`;

  return (
    <div className="space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-800">
        {/* Background image com overlay profissional */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroRingImg}
            alt="Ringue de Luta Gaditas"
            className="w-full h-full object-cover object-center filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-transparent to-black/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
          
          {/* Tag de Destaque */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-lg shadow-black/50">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-200">
              {homeConfig.badge || 'Associação Desportiva Gaditas · Desde 2017'}
            </span>
          </div>

          {/* Título Principal de Impacto */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            {homeConfig.tituloHero || 'FORJE SUA MELHOR VERSÃO NOS TATAMES'}
          </h1>

          {/* Subtítulo Claro e Direto */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
            {homeConfig.subtituloHero || (
              <>Luta Livre, Muay Thai Tradicional e MMA sob a liderança técnica do <strong className="text-white">Mestre Daniel Braga</strong>. Unidades ativas em {unidades.map(u => u.nome).join(', ')}.</>
            )}
          </p>

          {/* Ações Primárias */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('matricula')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{homeConfig.ctaPrimario || 'Matricule-se Agora'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappDojoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 font-bold text-sm uppercase tracking-wider backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{homeConfig.ctaSecundario || 'Aula Experimental Grátis'}</span>
            </a>
          </div>

          {/* Faixa de Números / Prova Social Adjacente */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-neutral-800/80">
            <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                {homeConfig.statAnosNumero || '2017'}
              </span>
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                {homeConfig.statAnosTexto || 'Fundação Oficial'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
                {homeConfig.statFaixasNumero || '+12'}
              </span>
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                {homeConfig.statFaixasTexto || 'Faixas Pretas Formados'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-red-500 font-mono tabular-nums">
                {homeConfig.statPolosNumero && homeConfig.statPolosNumero !== '4' ? homeConfig.statPolosNumero : unidades.length}
              </span>
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                {homeConfig.statPolosTexto || 'Polos Ativos no RJ'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                {homeConfig.statMetodologiaNumero || '100%'}
              </span>
              <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                {homeConfig.statMetodologiaTexto || 'Metodologia Projarde'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO MODALIDADES & FILOSOFIA DE COMBATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-500">
              <Flame className="w-4 h-4" />
              <span>Tradição, Eficiência e Honra</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white leading-tight">
              ARTE MARCIAL COM PROPÓSITO E <span className="text-amber-400">DISCIPLINA DE FERRO</span>
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              A Equipe Gaditas não é apenas uma academia de artes marciais — somos uma irmandade fundamentada na transformação de vidas pelo esporte, disciplina física e evolução técnica contínua.
            </p>
            
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-bold uppercase">Luta Livre Esportiva</h4>
                  <p className="text-neutral-400 text-xs">Graduação Faixa Preta diplomada em 2017 pelo Mestre Leandro Vilela (Equipe Gladiador).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-bold uppercase">Muay Thai (Grau Preta e Branca)</h4>
                  <p className="text-neutral-400 text-xs">Golpes precisos de socos, cotovelos, joelhos e chutes com metodologia autêntica.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-bold uppercase">MMA & Competições de Alto Nível</h4>
                  <p className="text-neutral-400 text-xs">Preparação física, técnica de octógono e suporte em campeonatos estaduais e nacionais.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('sobre')}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <span>Conheça a história completa do Mestre Daniel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl group">
              <div className="h-48 overflow-hidden">
                <img
                  src={actionImg}
                  alt="Treino Muay Thai"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[11px] uppercase font-bold text-amber-400">Artes de Striking</span>
                <h3 className="text-lg font-black uppercase text-white">Muay Thai & Kickboxing</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Treinos técnicos dinâmicos para iniciantes, praticantes recreativos e atletas competidores com foco em condicionamento e defesa pessoal.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl group">
              <div className="h-48 overflow-hidden bg-neutral-950 flex items-center justify-center p-4">
                <img
                  src={lionEmblemImg}
                  alt="Brasão Gaditas"
                  className="w-36 h-36 object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[11px] uppercase font-bold text-red-400">Grappling & Finalizações</span>
                <h3 className="text-lg font-black uppercase text-white">Luta Livre Esportiva</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Tradição brasileira de submissão sem quimono (No-Gi), com chaves de perna, estrangulamentos e controle posicional impecável.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO GRADE DE HORÁRIOS & CRONOGRAMA DE AULAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-black tracking-widest text-red-500">
                Grade de Treinamentos
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white mt-1">
                HORÁRIOS DAS AULAS POR POLO
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Turmas matutinas, vespertinas e noturnas para todas as faixas etárias.
              </p>
            </div>

            {/* Seletor de Polo */}
            <div className="flex items-center gap-1.5 p-1 bg-black rounded-xl border border-neutral-800 overflow-x-auto max-w-full">
              {unidades.map(u => (
                <button
                  key={u.id}
                  onClick={() => setPoloHorario(u.nome)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    poloHorario === u.nome
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {u.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Cards dos Horários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {horarios.length === 0 ? (
              <p className="col-span-full text-center text-xs text-neutral-500 py-8">
                Consulte a secretaria para horários específicos desta unidade.
              </p>
            ) : (
              horarios.map((h: HorarioTreino) => (
                <div
                  key={h.id}
                  className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-3 hover:border-red-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] uppercase font-bold">
                      {h.nivel}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">
                      CT {h.ct}
                    </span>
                  </div>

                  <h3 className="text-base font-black uppercase text-white">
                    {h.modalidade}
                  </h3>

                  <div className="space-y-1 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{h.dias}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-red-500" />
                      <span className="font-mono font-bold text-white">{h.horario}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 pt-1">
                      Instrutor: <strong>{h.instrutor}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-400">
              Quer fazer uma aula experimental hoje mesmo? Não precisa de equipamento inicial.
            </span>
            <a
              href={whatsappDojoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO NOSSAS UNIDADES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-black tracking-widest text-red-500">
            Rede de Treinamento
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
            {homeConfig.polosTitulo || 'NOSSOS POLOS & CENTROS DE TREINAMENTO'}
          </h2>
          <p className="text-neutral-400 text-sm">
            {homeConfig.polosSubtitulo || 'Encontre a unidade mais próxima de você e agende uma aula experimental gratuita.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {unidades.map((u, idx) => {
            const isSocial = u.tipo === 'bolsista';
            return (
              <div
                key={u.id || idx}
                className={`p-6 rounded-2xl bg-neutral-900/80 border transition-all flex flex-col justify-between space-y-4 ${
                  isSocial 
                    ? 'border-emerald-500/40 hover:border-emerald-500' 
                    : idx === 0 
                    ? 'border-red-500/40 hover:border-red-500' 
                    : 'border-neutral-800 hover:border-red-500/50'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${
                    isSocial 
                      ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' 
                      : 'bg-red-950/60 border-red-500/30 text-red-400'
                  }`}>
                    {isSocial ? <Award className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${
                    isSocial ? 'text-emerald-400' : idx === 0 ? 'text-amber-400' : 'text-neutral-400'
                  }`}>
                    {isSocial ? 'Polo Social & Bolsistas' : idx === 0 ? 'Sede Principal' : 'Centro de Treinamento'}
                  </span>
                  <h3 className="text-lg font-black uppercase text-white mt-1">{u.nome}</h3>
                  <p className="text-xs text-neutral-400 mt-2">
                    {u.endereco || 'Tatame oficial, ringue de combate e preparação física de alto nível.'}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-300 space-y-1">
                  <span className="block font-semibold">
                    {isSocial ? 'Regime Social 100% Isento' : 'Regime Mensalidade Regular'}
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    {u.responsavel ? `Liderança: ${u.responsavel}` : 'Liderança Técnica Oficial'}
                  </span>
                  {u.telefone && (
                    <span className="text-[10px] text-amber-400 font-mono block">
                      Contato: {u.telefone}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BANNER DE MATRÍCULA E CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-950/60 via-neutral-900 to-black border border-red-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Matrículas Abertas para Todas as Idades
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">
              {homeConfig.ctaBannerTitulo || 'PRONTO PARA COMEÇAR SUA JORNADA DE GUERREIRO?'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {homeConfig.ctaBannerTexto || 'Preencha o cadastro online em 2 minutos. Receba seu número de matrícula instantaneamente e comece a treinar na unidade mais próxima.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => onNavigate('matricula')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{homeConfig.ctaBannerBotao || 'Fazer Matrícula Online'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('aluno-portal')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Já sou Aluno</span>
            </button>
          </div>
        </div>
      </section>

      {/* BOTÃO FLUTUANTE DE WHATSAPP DO DOJO */}
      <a
        href={whatsappDojoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl shadow-emerald-950/80 transition-all transform hover:scale-110 flex items-center gap-2 font-black text-xs uppercase tracking-wider cursor-pointer border-2 border-white/30"
        title="Falar no WhatsApp da Equipe Gaditas"
      >
        <MessageCircle className="w-6 h-6 fill-black" />
        <span className="hidden sm:inline">WhatsApp do CT</span>
      </a>

    </div>
  );
};
