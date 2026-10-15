import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Unidade } from '../types';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  HeartPulse, 
  User, 
  Lock, 
  Phone, 
  FileCheck, 
  ArrowRight,
  GraduationCap,
  Users
} from 'lucide-react';

interface EnrollmentViewProps {
  onNavigate: (view: string) => void;
}

export const EnrollmentView: React.FC<EnrollmentViewProps> = ({ onNavigate }) => {
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [matriculaConfig, setMatriculaConfig] = useState(() => store.getGlobalScreens().matricula);

  // Perfil obrigatório
  const [tipoPerfil, setTipoPerfil] = useState<'aluno' | 'professor'>('aluno');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [ct, setCt] = useState(() => store.getUnidades()[0]?.nome || 'Campo Grande (Sede)');
  const [faixaDesejada, setFaixaDesejada] = useState('Amarela');
  const [tipoSanguineo, setTipoSanguineo] = useState('Não Sei');
  const [alergias, setAlergias] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [termoAceito, setTermoAceito] = useState(false);

  const [loading, setLoading] = useState(false);
  const [solicitacaoCriada, setSolicitacaoCriada] = useState<any | null>(null);
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const u = store.getUnidades();
      setUnidades([...u]);
      setMatriculaConfig(store.getGlobalScreens().matricula);
      if (u.length > 0 && !ct) {
        setCt(u[0].nome);
      }
    });
    return unsub;
  }, [ct]);

  // Formatação automática de telefone (XX) XXXXX-XXXX
  const formatarTelefone = (valor: string) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11);
    if (apenasDigitos.length <= 2) return apenasDigitos;
    if (apenasDigitos.length <= 7) return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`;
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value));
  };

  const handleContatoEmergenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContatoEmergencia(formatarTelefone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');

    if (!nome.trim() || !email.trim() || !telefone.trim() || !ct) {
      setErroMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    if (!termoAceito) {
      setErroMsg('É obrigatório aceitar o termo de responsabilidade e conduta do dojo.');
      return;
    }

    setLoading(true);

    try {
      const res = await store.solicitarPreCadastro({
        tipo: tipoPerfil,
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        telefone: telefone.trim(),
        cpf: cpf.trim(),
        ct,
        faixa: (faixaDesejada as any) || 'Amarela',
        graus: 0,
        observacoes: observacoes.trim(),
        termoAceito: true
      });

      // Efeito festivo de boas-vindas
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {}

      setSolicitacaoCriada(res);
    } catch (err: any) {
      setErroMsg(err?.message || 'Falha ao processar solicitação de pré-cadastro.');
    } finally {
      setLoading(false);
    }
  };

  if (solicitacaoCriada) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 animate-pulse">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Solicitação Registrada no Firebase!
            </span>
            <h2 className="text-3xl font-black uppercase text-white">
              BEM-VINDO À <span className="text-red-500">EQUIPE GADITAS</span>
            </h2>
            <p className="text-xs text-neutral-300">
              Sua solicitação de cadastro como <strong className="text-amber-400 uppercase">{solicitacaoCriada.tipo}</strong> foi enviada para o polo <strong className="text-white">{solicitacaoCriada.ct}</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Status do Cadastro</span>
            <div className="text-2xl font-black uppercase text-amber-400 flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
              <span>Pendente de Aprovação</span>
            </div>
            <p className="text-xs text-neutral-400">
              O Administrador Geral ou o Professor responsável do polo irá homologar sua ficha no sistema ERP para liberar seu acesso completo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left text-xs space-y-1.5 text-neutral-300">
            <div><strong>Guerreiro:</strong> {solicitacaoCriada.nome}</div>
            <div><strong>E-mail:</strong> {solicitacaoCriada.email}</div>
            <div><strong>Telefone:</strong> {solicitacaoCriada.telefone}</div>
            <div><strong>Polo Selecionado:</strong> {solicitacaoCriada.ct}</div>
            <div><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
            >
              Voltar ao Início
            </button>
            <a
              href={`https://api.whatsapp.com/send?phone=5521988880101&text=${encodeURIComponent(
                `Olá Mestre Daniel! Acabei de enviar minha solicitação de pré-cadastro como ${solicitacaoCriada.tipo.toUpperCase()} no Polo ${solicitacaoCriada.ct}. Meu nome é ${solicitacaoCriada.nome}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Avisar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Botão Voltar */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a Página Inicial</span>
      </button>

      {/* Header Institucional */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-500/40 rounded-full text-red-400 text-xs font-black uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Inscrição Oficial & Alistamento de Guerreiro</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white">
          {matriculaConfig.titulo || 'PRÉ-CADASTRO & MATRÍCULA ONLINE'}
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          {matriculaConfig.subtitulo || 'Junte-se à Equipe Gaditas Fight Team. Preencha seus dados para treinar no CT mais próximo ou atuar como instrutor credenciado.'}
        </p>
      </div>

      {/* Formulário de Matrícula */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-8">
        
        {/* SELEÇÃO OBRIGATÓRIA DE PERFIL */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
            1. Perfil de Solicitação *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTipoPerfil('aluno')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                tipoPerfil === 'aluno'
                  ? 'bg-red-950/60 border-red-500 text-white shadow-lg shadow-red-950/50'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Users className="w-6 h-6 text-red-500" />
              <span className="text-sm font-black uppercase">Quero ser Aluno / Atleta</span>
              <span className="text-[10px] text-neutral-400 text-center">Treinos de Muay Thai, Luta Livre e MMA</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoPerfil('professor')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                tipoPerfil === 'professor'
                  ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950/50'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <GraduationCap className="w-6 h-6 text-amber-400" />
              <span className="text-sm font-black uppercase">Professor / Instrutor</span>
              <span className="text-[10px] text-neutral-400 text-center">Ministrar aulas e conduzir turmas de CT</span>
            </button>
          </div>
        </div>

        {/* DADOS PESSOAIS */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-wider text-amber-400 block border-t border-neutral-800 pt-6">
            2. Dados de Identificação *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Nome Completo *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                required
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">E-mail Principal *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">WhatsApp / Telefone com DDD *</label>
              <input
                type="text"
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(21) 99999-9999"
                required
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">CPF (Opcional para carteirinha)</label>
              <input
                type="text"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* POLO E GRADUAÇÃO */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-wider text-amber-400 block border-t border-neutral-800 pt-6">
            3. Polo de Atuação & Informações Técnicas *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Centro de Treinamento (CT) *</label>
              <select
                value={ct}
                onChange={e => setCt(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-red-500"
              >
                {unidades.map(u => (
                  <option key={u.id} value={u.nome}>
                    {u.nome} ({u.tipo === 'bolsista' ? 'Social Isento' : 'Regular R$ 120'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                {tipoPerfil === 'aluno' ? 'Graduação Atual (Projarde)' : 'Faixa de Docência'}
              </label>
              <select
                value={faixaDesejada}
                onChange={e => setFaixaDesejada(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Amarela">Amarela (Iniciante)</option>
                <option value="Amarela e Branca">Amarela e Branca</option>
                <option value="Verde">Verde</option>
                <option value="Verde e Branca">Verde e Branca</option>
                <option value="Azul">Azul</option>
                <option value="Azul e Branca">Azul e Branca</option>
                <option value="Marrom">Marrom</option>
                <option value="Marrom e Branca">Marrom e Branca</option>
                <option value="Vermelha">Vermelha</option>
                <option value="Vermelha e Branca">Vermelha e Branca</option>
                <option value="Vermelho e Amarelo">Vermelho e Amarelo</option>
                <option value="Preta">Preta</option>
                <option value="Preta e Branca">Preta e Branca</option>
              </select>
            </div>
          </div>
        </div>

        {/* FICHA MÉDICA BÁSICA & EMERGÊNCIA */}
        {tipoPerfil === 'aluno' && (
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 block border-t border-neutral-800 pt-6">
              4. Ficha Médica de Segurança & Contato de Emergência
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Tipo Sanguíneo</label>
                <select
                  value={tipoSanguineo}
                  onChange={e => setTipoSanguineo(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Não Sei">Não Sei</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Alergias ou Restrições</label>
                <input
                  type="text"
                  value={alergias}
                  onChange={e => setAlergias(e.target.value)}
                  placeholder="Ex: Nenhuma / Rinite"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">Contato de Emergência</label>
                <input
                  type="text"
                  value={contatoEmergencia}
                  onChange={handleContatoEmergenciaChange}
                  placeholder="(21) 99999-9999"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TERMO DE RESPONSABILIDADE */}
        <div className="space-y-3 border-t border-neutral-800 pt-6">
          <label className="flex items-start gap-3 cursor-pointer p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
            <input
              type="checkbox"
              checked={termoAceito}
              onChange={e => setTermoAceito(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
            />
            <span className="text-xs text-neutral-300 leading-relaxed">
              {matriculaConfig.avisoTermo || 'Declaro estar apto para a prática de artes marciais de contato (Muay Thai, Luta Livre e MMA), isentando a Associação Desportiva Gaditas de lesões decorrentes do treino e comprometendo-me a respeitar a hierarquia marcial e as diretrizes do Mestre Daniel Braga.'}
            </span>
          </label>
        </div>

        {erroMsg && (
          <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        {/* BOTÃO SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <span>Processando Solicitação...</span>
          ) : (
            <>
              <span>{matriculaConfig.botaoTexto || 'Enviar Solicitação de Matrícula'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

    </div>
  );
};
