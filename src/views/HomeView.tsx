import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { HorarioTreino, Unidade, HomeScreenConfig } from '../types';
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
import { EditableText, EditableImage, SectionBlock } from '../components/EditableComponent';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  modoEdicao?: boolean;
  onAlteracaoPendente?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigate, 
  modoEdicao = false, 
  onAlteracaoPendente 
}) => {
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [alunos, setAlunos] = useState(() => store.getAlunos());
  const [poloHorario, setPoloHorario] = useState<string>(() => store.getUnidades()[0]?.nome || 'Campo Grande');
  const [homeConfig, setHomeConfig] = useState<HomeScreenConfig>(() => store.getGlobalScreens().home);
  const [globalConfig, setGlobalConfig] = useState(() => store.getGlobalScreens().global);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const u = store.getUnidades();
      setUnidades([...u]);
      setAlunos([...store.getAlunos()]);
      setHomeConfig(store.getGlobalScreens().home);
      setGlobalConfig(store.getGlobalScreens().global);
      if (u.length > 0 && !u.some(x => x.nome.toLowerCase() === poloHorario.toLowerCase())) {
        setPoloHorario(u[0].nome);
      }
    });
    return unsub;
  }, [poloHorario]);

  const faixasPretasReais = alunos.filter(a => (a.faixa || '').toLowerCase().includes('preta')).length;
  const faixasNumeroDisplay = homeConfig.statFaixasNumero && homeConfig.statFaixasNumero !== '+12' ? homeConfig.statFaixasNumero : (faixasPretasReais > 0 ? `+${faixasPretasReais}` : '+12');
  const polosNumeroDisplay = homeConfig.statPolosNumero && homeConfig.statPolosNumero !== '4' ? homeConfig.statPolosNumero : String(unidades.length);

  const handleUpdateField = (campo: keyof HomeScreenConfig, valor: any) => {
    const currentScreens = store.getGlobalScreens();
    const novoHome = { ...currentScreens.home, [campo]: valor };
    store.atualizarGlobalScreensDraft({ ...currentScreens, home: novoHome });
    if (onAlteracaoPendente) onAlteracaoPendente();
  };

  const horarios = store.getHorarios(poloHorario);

  const cleanPhone = (globalConfig.whatsapp || '5521999990001').replace(/\D/g, '');
  const whatsappDojoUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
    'Olá Mestre Daniel! Gostaria de agendar uma aula experimental gratuita na Equipe Gaditas. Como posso iniciar?'
  )}`;

  return (
    <div className="space-y-24">
      
      {/* HERO SECTION */}
      <SectionBlock
        tituloSecao="Destaque Principal (Hero Banner)"
        visivel={homeConfig.heroVisivel !== false}
        onToggleVisivel={() => handleUpdateField('heroVisivel', homeConfig.heroVisivel === false)}
        modoEdicao={modoEdicao}
      >
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-800">
          {/* Background image com suporte a Drag & Drop e Upload */}
          <div className="absolute inset-0 z-0">
            <EditableImage
              src={homeConfig.heroImagemUrl || heroRingImg}
              alt="Ringue de Luta Gaditas"
              onChange={(novaUrl) => handleUpdateField('heroImagemUrl', novaUrl)}
              modoEdicao={modoEdicao}
              className="w-full h-full object-cover object-center filter brightness-40"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-transparent to-black/80 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
            
            {/* Tag de Destaque */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-lg shadow-black/50">
              <Shield className="w-4 h-4 text-amber-400" />
              <EditableText
                value={homeConfig.badge || 'Associação Desportiva Gaditas · Desde 2017'}
                onChange={(v) => handleUpdateField('badge', v)}
                modoEdicao={modoEdicao}
                className="text-xs uppercase font-extrabold tracking-widest text-neutral-200"
              />
            </div>

            {/* Título Principal de Impacto */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              <EditableText
                value={homeConfig.tituloHero || 'FORJE SUA MELHOR VERSÃO NOS TATAMES'}
                onChange={(v) => handleUpdateField('tituloHero', v)}
                modoEdicao={modoEdicao}
                tag="span"
              />
            </h1>

            {/* Subtítulo Claro e Direto */}
            <div className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              <EditableText
                value={typeof homeConfig.subtituloHero === 'string' ? homeConfig.subtituloHero : 'Luta Livre, Muay Thai Tradicional e MMA sob a liderança técnica do Mestre Daniel Braga. Unidades ativas no Rio de Janeiro.'}
                onChange={(v) => handleUpdateField('subtituloHero', v)}
                modoEdicao={modoEdicao}
                tag="p"
                multiline
              />
            </div>

            {/* Ações Primárias */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('matricula')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
              >
                <EditableText
                  value={homeConfig.ctaPrimario || 'Matricule-se Agora'}
                  onChange={(v) => handleUpdateField('ctaPrimario', v)}
                  modoEdicao={modoEdicao}
                />
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappDojoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 font-bold text-sm uppercase tracking-wider backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <EditableText
                  value={homeConfig.ctaSecundario || 'Aula Experimental Grátis'}
                  onChange={(v) => handleUpdateField('ctaSecundario', v)}
                  modoEdicao={modoEdicao}
                />
              </a>
            </div>

            {/* Faixa de Números / Prova Social Adjacente */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-neutral-800/80">
              <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                  <EditableText
                    value={homeConfig.statAnosNumero || '2017'}
                    onChange={(v) => handleUpdateField('statAnosNumero', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
                <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                  <EditableText
                    value={homeConfig.statAnosTexto || 'Fundação Oficial'}
                    onChange={(v) => handleUpdateField('statAnosTexto', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
                  <EditableText
                    value={faixasNumeroDisplay}
                    onChange={(v) => handleUpdateField('statFaixasNumero', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
                <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                  <EditableText
                    value={homeConfig.statFaixasTexto || 'Faixas Pretas Formados'}
                    onChange={(v) => handleUpdateField('statFaixasTexto', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-black text-red-500 font-mono tabular-nums">
                  <EditableText
                    value={polosNumeroDisplay}
                    onChange={(v) => handleUpdateField('statPolosNumero', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
                <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                  <EditableText
                    value={homeConfig.statPolosTexto || 'Polos Ativos no RJ'}
                    onChange={(v) => handleUpdateField('statPolosTexto', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                  <EditableText
                    value={homeConfig.statMetodologiaNumero || '100%'}
                    onChange={(v) => handleUpdateField('statMetodologiaNumero', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
                <span className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                  <EditableText
                    value={homeConfig.statMetodologiaTexto || 'Metodologia Projarde'}
                    onChange={(v) => handleUpdateField('statMetodologiaTexto', v)}
                    modoEdicao={modoEdicao}
                  />
                </span>
              </div>
            </div>

          </div>
        </section>
      </SectionBlock>

      {/* SEÇÃO MODALIDADES & FILOSOFIA DE COMBATE */}
      <SectionBlock
        tituloSecao="Modalidades & Filosofia de Combate"
        visivel={homeConfig.modalidadesVisivel !== false}
        onToggleVisivel={() => handleUpdateField('modalidadesVisivel', homeConfig.modalidadesVisivel === false)}
        modoEdicao={modoEdicao}
      >
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
                  <EditableImage
                    src={homeConfig.modalidade1FotoUrl || actionImg}
                    alt="Treino Muay Thai"
                    onChange={(url) => handleUpdateField('modalidade1FotoUrl', url)}
                    modoEdicao={modoEdicao}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
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
                  <EditableImage
                    src={homeConfig.modalidade2FotoUrl || lionEmblemImg}
                    alt="Brasão Gaditas"
                    onChange={(url) => handleUpdateField('modalidade2FotoUrl', url)}
                    modoEdicao={modoEdicao}
                    className="w-36 h-36 object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full flex items-center justify-center"
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
      </SectionBlock>

      {/* SEÇÃO GRADE DE HORÁRIOS & CRONOGRAMA DE AULAS */}
      <SectionBlock
        tituloSecao="Grade de Horários & Treinos"
        visivel={homeConfig.horariosVisivel !== false}
        onToggleVisivel={() => handleUpdateField('horariosVisivel', homeConfig.horariosVisivel === false)}
        modoEdicao={modoEdicao}
      >
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-black tracking-widest text-red-500">
                  Grade de Treinamentos
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase text-white mt-1">
                  <EditableText
                    value={homeConfig.horariosTitulo || 'HORÁRIOS DAS AULAS POR POLO'}
                    onChange={(v) => handleUpdateField('horariosTitulo', v)}
                    modoEdicao={modoEdicao}
                  />
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                  <EditableText
                    value={homeConfig.horariosSubtitulo || 'Turmas matutinas, vespertinas e noturnas para todas as faixas etárias.'}
                    onChange={(v) => handleUpdateField('horariosSubtitulo', v)}
                    modoEdicao={modoEdicao}
                  />
                </p>
              </div>

              {/* Seletor de Polo Dinâmico */}
              <div className="flex flex-wrap items-center gap-2 p-2 bg-black/80 rounded-2xl border border-neutral-800 max-w-full">
                {unidades.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setPoloHorario(u.nome)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      poloHorario.toLowerCase() === u.nome.toLowerCase()
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50 font-black'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
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
              <button
                onClick={() => onNavigate('matricula')}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Solicitar Aula Experimental Grátis</span>
              </button>
            </div>
          </div>
        </section>
      </SectionBlock>

      {/* SEÇÃO NOSSAS UNIDADES */}
      <SectionBlock
        tituloSecao="Nossos Polos & Centros de Treinamento"
        visivel={homeConfig.polosVisivel !== false}
        onToggleVisivel={() => handleUpdateField('polosVisivel', homeConfig.polosVisivel === false)}
        modoEdicao={modoEdicao}
      >
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-black tracking-widest text-red-500">
              Rede de Treinamento
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
              <EditableText
                value={homeConfig.polosTitulo || 'NOSSOS POLOS & CENTROS DE TREINAMENTO'}
                onChange={(v) => handleUpdateField('polosTitulo', v)}
                modoEdicao={modoEdicao}
              />
            </h2>
            <p className="text-neutral-400 text-sm">
              <EditableText
                value={homeConfig.polosSubtitulo || 'Encontre a unidade mais próxima de você e agende uma aula experimental gratuita.'}
                onChange={(v) => handleUpdateField('polosSubtitulo', v)}
                modoEdicao={modoEdicao}
                multiline
              />
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
      </SectionBlock>

      {/* BANNER DE MATRÍCULA E CALL TO ACTION */}
      <SectionBlock
        tituloSecao="Banner de Matrícula Online"
        visivel={homeConfig.ctaBannerVisivel !== false}
        onToggleVisivel={() => handleUpdateField('ctaBannerVisivel', homeConfig.ctaBannerVisivel === false)}
        modoEdicao={modoEdicao}
      >
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-950/60 via-neutral-900 to-black border border-red-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Matrículas Abertas para Todas as Idades
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">
                <EditableText
                  value={homeConfig.ctaBannerTitulo || 'PRONTO PARA COMEÇAR SUA JORNADA DE GUERREIRO?'}
                  onChange={(v) => handleUpdateField('ctaBannerTitulo', v)}
                  modoEdicao={modoEdicao}
                />
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                <EditableText
                  value={homeConfig.ctaBannerTexto || 'Preencha o cadastro online em 2 minutos. Receba seu número de matrícula instantaneamente e comece a treinar na unidade mais próxima.'}
                  onChange={(v) => handleUpdateField('ctaBannerTexto', v)}
                  modoEdicao={modoEdicao}
                  multiline
                />
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => onNavigate('matricula')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <EditableText
                  value={homeConfig.ctaBannerBotao || 'Fazer Matrícula Online'}
                  onChange={(v) => handleUpdateField('ctaBannerBotao', v)}
                  modoEdicao={modoEdicao}
                />
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
      </SectionBlock>

    </div>
  );
};
