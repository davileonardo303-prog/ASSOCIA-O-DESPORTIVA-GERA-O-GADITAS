import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Unidade, ProjardeBelt } from '../types';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  User, 
  GraduationCap, 
  Users, 
  Phone, 
  MapPin, 
  Shield, 
  Check, 
  Flame,
  ArrowRight
} from 'lucide-react';

interface GooglePreCadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  dadosGoogle: {
    nome: string;
    email: string;
    uid?: string;
    foto?: string;
  } | null;
  onSucessoAprovacao?: () => void;
}

export const GooglePreCadastroModal: React.FC<GooglePreCadastroModalProps> = ({
  isOpen,
  onClose,
  dadosGoogle,
  onSucessoAprovacao
}) => {
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [tipoPerfil, setTipoPerfil] = useState<'aluno' | 'professor'>('aluno');
  const [nome, setNome] = useState(dadosGoogle?.nome || '');
  const [email, setEmail] = useState(dadosGoogle?.email || '');
  const [telefone, setTelefone] = useState('');
  const [ct, setCt] = useState(() => store.getUnidades()[0]?.nome || 'Campo Grande (Sede)');
  const [modalidade, setModalidade] = useState('Todas (Luta Livre, Muay Thai e MMA)');
  const [dataNascimento, setDataNascimento] = useState('');
  const [faixaDesejada, setFaixaDesejada] = useState<ProjardeBelt>('Amarela');
  const [termoAceito, setTermoAceito] = useState(true);

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const u = store.getUnidades();
      setUnidades([...u]);
      if (u.length > 0 && !ct) {
        setCt(u[0].nome);
      }
    });
    return unsub;
  }, [ct]);

  useEffect(() => {
    if (dadosGoogle) {
      setNome(dadosGoogle.nome || '');
      setEmail(dadosGoogle.email || '');
    }
  }, [dadosGoogle]);

  if (!isOpen) return null;

  const formatarTelefone = (valor: string) => {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 11);
    if (apenasDigitos.length <= 2) return apenasDigitos;
    if (apenasDigitos.length <= 7) return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`;
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');

    if (!nome.trim() || !email.trim() || !telefone.trim() || !ct) {
      setErroMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    if (!termoAceito) {
      setErroMsg('É obrigatório concordar com as diretrizes e conduta do dojo.');
      return;
    }

    setLoading(true);

    try {
      const res = await store.submeterPreCadastroGoogle({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        tipo: tipoPerfil,
        ct,
        telefone: telefone.trim(),
        modalidade,
        dataNascimento,
        foto: dadosGoogle?.foto
      });

      if (!res.sucesso) {
        setErroMsg(res.mensagem || 'Falha ao registrar pré-cadastro.');
        return;
      }

      setSucesso(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onSucessoAprovacao) {
        onSucessoAprovacao();
      }
    } catch (err: any) {
      setErroMsg(err?.message || 'Erro inesperado ao registrar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-white relative">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            {dadosGoogle?.foto ? (
              <img
                src={dadosGoogle.foto}
                alt={dadosGoogle.nome}
                className="w-11 h-11 rounded-full border-2 border-emerald-500/60 p-0.5 object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-white leading-tight">
                COMPLETAR CADASTRO <span className="text-emerald-400">VIA GOOGLE</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Aguardando aprovação da diretoria para liberação do acesso.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tela de Sucesso */}
        {sucesso ? (
          <div className="p-8 text-center space-y-5 bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-2xl border border-emerald-500/30">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase text-white">
                Cadastro Enviado com Sucesso!
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-md mx-auto">
                Olá <strong className="text-white">{nome}</strong>, seu pedido de adesão ({tipoPerfil === 'aluno' ? 'Aluno / Atleta' : 'Professor / Instrutor'}) no polo <strong className="text-amber-400">{ct}</strong> foi registrado em nossa base de dados.
              </p>
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 text-left space-y-1">
                <p>🔹 <strong>Status:</strong> <span className="text-amber-400 font-bold uppercase">Pendente de Aprovação</span></p>
                <p>🔹 <strong>E-mail Google:</strong> {email}</p>
                <p>🔹 <strong>Próximo passo:</strong> O Mestre Daniel Braga ou o Administrador do Polo irá aprovar sua solicitação no painel ERP. Assim que aprovado, seu login com a Conta Google será liberado imediatamente!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 cursor-pointer transition-all"
            >
              Entendido / Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {erroMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{erroMsg}</span>
              </div>
            )}

            {/* SELEÇÃO OBRIGATÓRIA DE PERFIL */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                1. Perfil de Solicitação *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoPerfil('aluno')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    tipoPerfil === 'aluno'
                      ? 'bg-red-950/60 border-red-500 text-white shadow-md shadow-red-950/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-black uppercase">Aluno / Atleta</span>
                  <span className="text-[10px] text-neutral-400">Treinos e aulas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoPerfil('professor')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    tipoPerfil === 'professor'
                      ? 'bg-amber-950/60 border-amber-500 text-white shadow-md shadow-amber-950/40'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-black uppercase">Professor / Instrutor</span>
                  <span className="text-[10px] text-neutral-400">Conduzir turmas</span>
                </button>
              </div>
            </div>

            {/* DADOS DE IDENTIFICAÇÃO GOOGLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-900/50 p-3.5 rounded-2xl border border-neutral-800/80">
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  E-mail Google Autenticado
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono cursor-not-allowed opacity-90"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  WhatsApp / Celular com DDD *
                </label>
                <input
                  type="text"
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  placeholder="(21) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* POLO / CT DESEJADO & MODALIDADE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-amber-400 block mb-1">
                  Polo / Centro de Treinamento Pretendido *
                </label>
                <select
                  value={ct}
                  onChange={(e) => setCt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                >
                  {unidades.map((u) => (
                    <option key={u.id} value={u.nome}>
                      {u.nome} ({u.tipo === 'bolsista' ? 'Polo Social' : 'Polo Oficial'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-amber-400 block mb-1">
                  Modalidade Principal
                </label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Todas (Luta Livre, Muay Thai e MMA)">Todas (Luta Livre, Muay Thai e MMA)</option>
                  <option value="Luta Livre Esportiva">Luta Livre Esportiva</option>
                  <option value="Muay Thai Tradicional">Muay Thai Tradicional</option>
                  <option value="MMA (Artes Marciais Mistas)">MMA (Artes Marciais Mistas)</option>
                  <option value="Jiu-Jitsu / Nogi">Jiu-Jitsu / Nogi</option>
                </select>
              </div>
            </div>

            {/* TERMO DE CONDUTA */}
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="termo-google"
                checked={termoAceito}
                onChange={(e) => setTermoAceito(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 border-neutral-700 cursor-pointer"
              />
              <label htmlFor="termo-google" className="text-[11px] text-neutral-300 cursor-pointer select-none">
                Declaro aptidão física para prática de artes marciais de contato e comprometo-me a seguir a hierarquia do dojo e as diretrizes do Mestre Daniel Braga.
              </label>
            </div>

            {/* BOTÃO DE SUBMISSÃO */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando para Aprovação da Diretoria...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Enviar Cadastro para Aprovação</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
