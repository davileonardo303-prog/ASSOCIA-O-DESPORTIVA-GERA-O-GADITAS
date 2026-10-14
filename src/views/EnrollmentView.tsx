import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Unidade, Aluno } from '../types';
import confetti from 'canvas-confetti';
import { Shield, CheckCircle2, AlertCircle, ArrowLeft, HeartPulse, User, Lock, Phone, FileCheck, ArrowRight } from 'lucide-react';

interface EnrollmentViewProps {
  onNavigate: (view: string) => void;
}

export const EnrollmentView: React.FC<EnrollmentViewProps> = ({ onNavigate }) => {
  const [unidades, setUnidades] = useState<Unidade[]>(() => store.getUnidades());
  const [matriculaConfig, setMatriculaConfig] = useState(() => store.getGlobalScreens().matricula);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [ct, setCt] = useState(() => store.getUnidades()[0]?.nome || 'Campo Grande');
  const [tipoSanguineo, setTipoSanguineo] = useState('Não Sei');
  const [alergias, setAlergias] = useState('');
  const [problemasSaude, setProblemasSaude] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [termoAceito, setTermoAceito] = useState(false);

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

  const [loading, setLoading] = useState(false);
  const [matriculaCriada, setMatriculaCriada] = useState<Aluno | null>(null);
  const [erroMsg, setErroMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');

    if (!nome.trim() || !email.trim() || !telefone.trim() || !contatoEmergencia.trim()) {
      setErroMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha.length < 6) {
      setErroMsg('A senha deve possuir no mínimo 6 dígitos.');
      return;
    }

    if (!termoAceito) {
      setErroMsg('Você deve aceitar os termos do dojo e autorização médica.');
      return;
    }

    // Verifica se e-mail já existe
    const existente = store.getAlunoByEmail(email);
    if (existente) {
      setErroMsg('Este e-mail já possui cadastro. Faça login na Área do Aluno.');
      return;
    }

    setLoading(true);

    try {
      const novo = await store.cadastrarAluno({
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        telefone: telefone.trim(),
        ct,
        faixa: 'Amarela',
        graus: 0,
        tipo_sanguineo: tipoSanguineo,
        alergias: alergias.trim() || 'Nenhuma',
        problemas_saude: problemasSaude.trim() || '',
        contato_emergencia: contatoEmergencia.trim(),
        termo_aceito: true
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }

      setMatriculaCriada(novo);
    } catch (err: any) {
      setErroMsg(err?.message || 'Erro ao registrar matrícula. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (matriculaCriada) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Matrícula Realizada com Sucesso!
            </span>
            <h2 className="text-3xl font-black uppercase text-white">
              BEM-VINDO À <span className="text-red-500">EQUIPE GADITAS</span>
            </h2>
            <p className="text-xs text-neutral-300">
              Sua ficha foi enviada para o polo <strong className="text-white">{matriculaCriada.ct}</strong> sob a liderança do Mestre Daniel Braga.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black border border-neutral-800 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Seu Número Oficial de Guerreiro</span>
            <div className="text-4xl font-black font-mono text-amber-400">
              #{matriculaCriada.matricula}
            </div>
            <span className="text-xs text-neutral-400 block">
              Guarde este número para identificação nas aulas e campeonatos.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left text-xs space-y-1.5 text-neutral-300">
            <div><strong>Atleta:</strong> {matriculaCriada.nome}</div>
            <div><strong>E-mail de Acesso:</strong> {matriculaCriada.email}</div>
            <div><strong>Unidade:</strong> {matriculaCriada.ct}</div>
            <div><strong>Graduação Inicial:</strong> Faixa {matriculaCriada.faixa} (Projarde)</div>
            <div><strong>Status Atual:</strong> <span className="text-amber-400 font-bold uppercase">Pendente de Homologação</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                store.setAlunoLogado(matriculaCriada.id);
                onNavigate('aluno-portal');
              }}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/60"
            >
              <span>Acessar Meu Painel do Aluno</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      
      {/* Botão Voltar */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a página inicial</span>
      </button>

      {/* Card do Formulário */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-8">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-2 border-b border-neutral-800 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 mx-auto flex items-center justify-center mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
            {matriculaConfig.titulo || 'MATRÍCULA ONLINE GADITAS'}
          </h1>
          <p className="text-xs text-neutral-400">
            {matriculaConfig.subtitulo || 'Cadastre-se para treinar na Equipe Gaditas. O número de matrícula sequencial é gerado automaticamente.'}
          </p>

          {/* Benefícios configurados no CMS */}
          {(matriculaConfig.beneficio1 || matriculaConfig.beneficio2 || matriculaConfig.beneficio3) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 text-left">
              {matriculaConfig.beneficio1 && (
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{matriculaConfig.beneficio1}</span>
                </div>
              )}
              {matriculaConfig.beneficio2 && (
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{matriculaConfig.beneficio2}</span>
                </div>
              )}
              {matriculaConfig.beneficio3 && (
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{matriculaConfig.beneficio3}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {erroMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{erroMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* GRUPO 1: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2 border-b border-neutral-800 pb-2">
              <User className="w-4 h-4" />
              <span>1. Dados Pessoais & Polo</span>
            </h3>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Nome Completo do Aluno *
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Matheus Oliveira Santos"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  placeholder="(21) 99999-9999"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  Polo / CT Desejado *
                </label>
                <select
                  value={ct}
                  onChange={e => setCt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                >
                  {unidades.map(u => (
                    <option key={u.id} value={u.nome}>
                      {u.nome.toUpperCase()} {u.tipo === 'bolsista' ? '(Regime Social)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  E-mail (Será seu Login) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  Crie uma Senha (Mínimo 6 dígitos) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="******"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* GRUPO 2: FICHA MÉDICA & EMERGÊNCIA */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2 border-b border-neutral-800 pb-2">
              <HeartPulse className="w-4 h-4" />
              <span>2. Ficha Médica & Contato de Emergência</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  Tipo Sanguíneo
                </label>
                <select
                  value={tipoSanguineo}
                  onChange={e => setTipoSanguineo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
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
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  Possui Alergias? (Medicamentos, etc)
                </label>
                <input
                  type="text"
                  value={alergias}
                  onChange={e => setAlergias(e.target.value)}
                  placeholder="Ex: Nenhuma ou Dipirona..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Problemas de Saúde, Cirurgias ou Lesões Recentes?
              </label>
              <textarea
                value={problemasSaude}
                onChange={e => setProblemasSaude(e.target.value)}
                rows={2}
                placeholder="Ex: Asma, hipertensão, lesão em joelho..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Contato de Emergência (Nome, Parentesco e Telefone) *
              </label>
              <input
                type="text"
                required
                value={contatoEmergencia}
                onChange={e => setContatoEmergencia(e.target.value)}
                placeholder="Ex: Maria (Mãe) - (21) 98888-8888"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          {/* GRUPO 3: TERMOS E AUTORIZAÇÃO */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-2 border-b border-neutral-800 pb-2">
              <FileCheck className="w-4 h-4" />
              <span>3. Termo de Compromisso e Consentimento</span>
            </h3>

            <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed max-h-32 overflow-y-auto">
              Declaro estar em perfeitas condições físicas e mentais para a prática de artes marciais de contato (Muay Thai, Luta Livre, MMA e Boxe). Autorizo o uso da minha imagem em fotos e vídeos institucionais para divulgação dos treinos e competições da Associação Desportiva Gaditas. Comprometo-me a zelar pela integridade dos parceiros de treino, honrar a hierarquia e manter a disciplina marcial dentro e fora do dojo.
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={termoAceito}
                onChange={e => setTermoAceito(e.target.checked)}
                className="mt-0.5 rounded border-neutral-700 bg-neutral-950 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-neutral-300">
                Li, compreendo e concordo com os termos de prática esportiva e autorização médica.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Processando Matrícula...</span>
            ) : (
              <>
                <span>Finalizar Matrícula & Gerar Identificação</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-neutral-400 pt-2">
            Já possui matrícula ativa?{' '}
            <button
              type="button"
              onClick={() => onNavigate('aluno-portal')}
              className="text-red-400 font-bold hover:underline cursor-pointer"
            >
              Fazer Login na Área do Aluno
            </button>
          </p>

        </form>
      </div>

    </div>
  );
};
