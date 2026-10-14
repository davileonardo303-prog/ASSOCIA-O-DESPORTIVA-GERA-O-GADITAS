import React, { useState } from 'react';
import { store } from '../services/store';
import { Aluno } from '../types';
import { BeltDisplay } from '../components/BeltDisplay';
import { PrintableAthleteCard } from '../components/PrintableAthleteCard';
import { 
  User, 
  Lock, 
  QrCode, 
  Copy, 
  Check, 
  Award, 
  CalendarCheck, 
  FileText, 
  LogOut, 
  AlertCircle, 
  HeartPulse, 
  Phone,
  Shield,
  CreditCard
} from 'lucide-react';

interface StudentPortalViewProps {
  alunoLogado: Aluno | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  alunoLogado,
  onLogout,
  onNavigate
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);
  const [modalFichaAberta, setModalFichaAberta] = useState(false);

  const chavePixOficial = "gaditasfightteam@gmail.com";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(chavePixOficial)}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErroLogin('');
    setLoading(true);

    const emailTrim = emailInput.trim().toLowerCase();
    const aluno = store.getAlunoByEmail(emailTrim) || 
      store.getAlunos().find(a => a.matricula.toString() === emailTrim);

    if (!aluno) {
      setErroLogin('Perfil de guerreiro não encontrado. Verifique seu e-mail ou matrícula.');
      setLoading(false);
      return;
    }

    if (aluno.status === 'inativo') {
      setErroLogin('Este cadastro está inativo no Arquivo Morto. Contate o Mestre Daniel para reativação.');
      setLoading(false);
      return;
    }

    store.setAlunoLogado(aluno.id);
    setLoading(false);
  };

  const handleQuickLogin = (alunoDemo: Aluno) => {
    store.setAlunoLogado(alunoDemo.id);
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixOficial);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2500);
  };

  // Se NÃO estiver logado: Tela de Login do Aluno
  if (!alunoLogado) {
    const alunosAtivos = store.getAlunos('ativo');

    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 mx-auto flex items-center justify-center text-red-500">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase text-white">
              PORTAL DO <span className="text-red-500">ALUNO</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Consulte seu nível Projarde, mensalidades e histórico de presenças.
            </p>
          </div>

          {erroLogin && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{erroLogin}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                E-mail ou Matrícula
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="Ex: seu.email@exemplo.com ou 1"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={senhaInput}
                  onChange={e => setSenhaInput(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition-all cursor-pointer"
            >
              {loading ? 'Verificando Cadastro...' : 'Entrar no Painel do Guerreiro'}
            </button>
          </form>

          {/* Atalho de Demonstração Rápida */}
          <div className="pt-4 border-t border-neutral-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block text-center">
              Acesso Rápido para Teste
            </span>
            <div className="grid grid-cols-2 gap-2">
              {alunosAtivos.slice(0, 2).map(a => (
                <button
                  key={a.id}
                  onClick={() => handleQuickLogin(a)}
                  className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <strong className="block truncate text-white">{a.nome.split(' ')[0]}</strong>
                  <span className="text-[10px] text-amber-400">Faixa {a.faixa}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate('matricula')}
              className="text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Ainda não é cadastrado? <strong>Faça sua matrícula</strong>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Se ESTIVER logado: Painel Completo do Aluno
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();
  const isBolsista = store.isUnidadeBolsista(alunoLogado.ct);
  const isMensalidadePaga = isBolsista || (alunoLogado.ultimo_mes_pago === mesAtual && alunoLogado.ultimo_ano_pago === anoAtual);

  const frequenciasDoAluno = store.getFrequencias().filter(f => f.alunoId === alunoLogado.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Barra de Topo do Aluno */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center font-black text-xl">
            {alunoLogado.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                #{alunoLogado.matricula.toString().padStart(4, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                CT {alunoLogado.ct}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white mt-0.5">
              {alunoLogado.nome}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setModalFichaAberta(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Ficha de Atleta</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-red-950/60 hover:text-red-400 text-xs font-bold uppercase text-neutral-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: GRADUAÇÃO OFICIAL PROJARDE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Nível Projarde de Evolução
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-400">
                Graus: {alunoLogado.graus}/4
              </span>
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Faixa Atual</span>
              <h2 className="text-2xl font-black uppercase text-amber-400">
                {alunoLogado.faixa}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800">
              <BeltDisplay faixa={alunoLogado.faixa} graus={alunoLogado.graus} size="lg" />
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              O sistema Projarde avalia o domínio técnico, regularidade nos treinos, postura disciplinar e tempo de prática. A cada grau concluído, o atleta se aproxima da próxima graduação.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Presenças Registradas:</span>
            <span className="font-mono font-bold text-white text-sm">{frequenciasDoAluno.length} aulas</span>
          </div>
        </div>

        {/* CARD 2: SITUAÇÃO FINANCEIRA & PIX */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Status de Mensalidade
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-400 uppercase">
                {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(agora)}
              </span>
            </div>

            {/* Badge de Status */}
            <div>
              {isBolsista ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Perfil Social Bolsista · Isento de Mensalidade</span>
                </div>
              ) : isMensalidadePaga ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Mensalidade em Dia · Acesso Liberado</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-black uppercase flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Mensalidade Pendente do Mês Atual</span>
                </div>
              )}
            </div>

            {/* Caixa PIX se estiver pendente */}
            {!isMensalidadePaga && !isBolsista && (
              <div className="p-4 rounded-2xl bg-black border border-neutral-800 text-center space-y-3">
                <p className="text-xs text-neutral-300">
                  Efetue o pagamento da sua mensalidade via PIX instantâneo:
                </p>

                <div className="flex justify-center p-2 bg-white rounded-xl max-w-[160px] mx-auto shadow-md">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-36 h-36 object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Chave PIX (E-mail)</span>
                  <div className="font-mono text-xs text-amber-400 font-bold break-all">
                    {chavePixOficial}
                  </div>
                </div>

                <button
                  onClick={handleCopiarPix}
                  className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {pixCopiado ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Chave Copiada com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Chave PIX</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-neutral-400">
                  Após pagar, envie o comprovante no WhatsApp do seu Mestre/Professor.
                </p>
              </div>
            )}

            {isMensalidadePaga && !isBolsista && (
              <p className="text-xs text-neutral-400 leading-relaxed">
                Obrigado por manter sua matrícula em dia. Sua dedicação sustenta a estrutura dos nossos treinos e a evolução dos atletas.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            <span>Dúvidas financeiras? Contate a secretaria do polo {alunoLogado.ct}.</span>
          </div>
        </div>

      </div>

      {/* MODAL DE FICHA OFICIAL */}
      {modalFichaAberta && (
        <PrintableAthleteCard
          aluno={alunoLogado}
          onClose={() => setModalFichaAberta(false)}
        />
      )}

    </div>
  );
};
