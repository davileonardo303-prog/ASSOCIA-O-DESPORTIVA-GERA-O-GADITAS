import React, { useState } from 'react';
import { store } from '../services/store';
import { Aluno } from '../types';
import { BeltDisplay } from '../components/BeltDisplay';
import { PrintableAthleteCard } from '../components/PrintableAthleteCard';
import { AthleteCardID } from '../components/AthleteCardID';
import { BeltProgressionModal } from '../components/BeltProgressionModal';
import { WeightCategoryCalculator } from '../components/WeightCategoryCalculator';
import { 
  User, 
  Lock, 
  Copy, 
  Check, 
  Award, 
  CalendarCheck, 
  FileText, 
  LogOut, 
  AlertCircle, 
  CreditCard,
  IdCard,
  Scale,
  Bell,
  BookOpen,
  Upload,
  FileCheck
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
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);
  
  // Modais do Aluno
  const [modalFichaAberta, setModalFichaAberta] = useState(false);
  const [modalCarteirinhaAberta, setModalCarteirinhaAberta] = useState(false);
  const [modalCurriculoAberto, setModalCurriculoAberto] = useState(false);
  const [modalPesoAberto, setModalPesoAberto] = useState(false);

  // Configurações do CMS em tempo real
  const [alunoConfig, setAlunoConfig] = useState(() => store.getGlobalScreens().aluno);

  React.useEffect(() => {
    const unsub = store.subscribe(() => {
      setAlunoConfig(store.getGlobalScreens().aluno);
    });
    return unsub;
  }, []);

  // Upload de arquivos
  const [uploadando, setUploadando] = useState(false);
  const [mensagemUpload, setMensagemUpload] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const chavePixOficial = "gaditasfightteam@gmail.com";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(chavePixOficial)}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroLogin('');
    setLoading(true);

    try {
      const res = await store.loginComEmail(emailInput, senhaInput);
      if (!res.sucesso) {
        setErroLogin(res.mensagem || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err: any) {
      setErroLogin(err?.message || 'Falha na conexão com o Firebase Auth.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    setErroLogin('');
    setLoadingGoogle(true);
    try {
      const res = await store.loginComGoogle();
      if (!res.sucesso) {
        setErroLogin(res.mensagem || 'Falha ao autenticar com o Google.');
      }
    } catch (err: any) {
      setErroLogin(err?.message || 'Erro ao conectar ao Google Authentication.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixOficial);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2500);
  };

  const handleUploadDocumento = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'foto' | 'documento' | 'certificado') => {
    const file = e.target.files?.[0];
    if (!file || !alunoLogado) return;

    // Validação de tamanho (máx 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setMensagemUpload({ tipo: 'erro', texto: 'Arquivo muito grande! O limite é de 15MB.' });
      return;
    }

    setUploadando(true);
    setMensagemUpload(null);

    try {
      const caminho = `alunos/${alunoLogado.id}/${tipo}_${Date.now()}_${file.name}`;
      const arquivoSalvo = await store.fazerUploadArquivo(caminho, file, {
        nome: file.name,
        tipo,
        alunoId: alunoLogado.id,
        descricao: `Enviado pelo aluno ${alunoLogado.nome}`
      });

      if (tipo === 'foto') {
        await store.atualizarFotoAluno(alunoLogado.id, arquivoSalvo.url);
      }

      setMensagemUpload({ tipo: 'sucesso', texto: `Arquivo "${file.name}" salvo com sucesso no Firebase Storage!` });
      setTimeout(() => setMensagemUpload(null), 4000);
    } catch (err: any) {
      setMensagemUpload({ tipo: 'erro', texto: err?.message || 'Erro ao fazer upload para o Firebase Storage.' });
    } finally {
      setUploadando(false);
    }
  };

  // Se NÃO estiver logado: Tela de Login do Aluno (SEM BOTÕES DE DEMO/MOCK)
  if (!alunoLogado) {
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
              Acesso seguro oficial via Firebase Authentication.
            </p>
          </div>

          {erroLogin && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{erroLogin}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                E-mail ou Matrícula Oficial
              </label>
              <input
                type="text"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="seu.email@exemplo.com ou número"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                Senha Cadastrada
              </label>
              <input
                type="password"
                required
                value={senhaInput}
                onChange={e => setSenhaInput(e.target.value)}
                placeholder="******"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-red-500 focus:outline-none text-white text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Autenticando no Firebase...' : 'Entrar no Portal do Aluno'}</span>
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-neutral-500">ou</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          <button
            type="button"
            onClick={handleLoginGoogle}
            disabled={loadingGoogle}
            className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{loadingGoogle ? 'Conectando ao Google...' : 'Entrar com Conta Google'}</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate('matricula')}
              className="text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Ainda não é matriculado? <strong>Faça sua matrícula online</strong>
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
  const avisosDoCT = store.getAvisos(alunoLogado.ct);
  const arquivosDoAluno = store.getArquivos().filter(a => a.alunoId === alunoLogado.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner de Aviso do CMS para o Aluno */}
      {alunoConfig.avisoMural && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-neutral-900 to-amber-950/40 border border-red-500/40 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <p className="text-xs text-neutral-200 font-semibold leading-relaxed">
              {alunoConfig.avisoMural}
            </p>
          </div>
          {alunoConfig.linkSuporteWhatsApp && (
            <a
              href={alunoConfig.linkSuporteWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
            >
              {alunoConfig.suporteWhatsAppTexto || 'Suporte'}
            </a>
          )}
        </div>
      )}

      {/* Barra de Topo do Aluno */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-lg shadow-red-950/40 overflow-hidden">
            {alunoLogado.fotoUrl ? (
              <img src={alunoLogado.fotoUrl} alt={alunoLogado.nome} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center font-black text-2xl text-white">
                {alunoLogado.nome.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-black text-amber-400">
                #{alunoLogado.matricula.toString().padStart(4, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                Polo {alunoLogado.ct}
              </span>
              {isBolsista ? (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Bolsista Social
                </span>
              ) : isMensalidadePaga ? (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Mensalidade em Dia
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40">
                  Mensalidade Aberta
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              {alunoLogado.nome}
            </h1>
          </div>
        </div>

        {/* Botões Rápidos */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setModalCarteirinhaAberta(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <IdCard className="w-4 h-4" />
            <span>Carteirinha Digital</span>
          </button>

          <button
            onClick={() => setModalFichaAberta(true)}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Ver prontuário médico de atleta"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ficha Médica</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-xs font-bold uppercase text-neutral-400 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MURAL DE AVISOS DO CT */}
      {avisosDoCT.length > 0 && (
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-400">
            <Bell className="w-4 h-4" />
            <span>Mural de Avisos & Comunicados do CT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {avisosDoCT.map(aviso => (
              <div
                key={aviso.id}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  aviso.urgente
                    ? 'bg-red-950/30 border-red-500/50 text-neutral-200'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase text-white text-sm">
                    {aviso.titulo}
                  </span>
                  {aviso.urgente && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase">
                      Urgente
                    </span>
                  )}
                </div>
                <p className="leading-relaxed text-neutral-300">{aviso.conteudo}</p>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                  <span>Por: {aviso.autor}</span>
                  <span>{aviso.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRID DE CARDS PRINCIPAIS: GRADUAÇÃO & FINANCEIRO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: GRADUAÇÃO OFICIAL PROJARDE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Graduação Oficial Projarde
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-400">
                Graus: {alunoLogado.graus}/4
              </span>
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Nível Atual do Atleta</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-amber-400">
                Faixa {alunoLogado.faixa}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800">
              <BeltDisplay faixa={alunoLogado.faixa} graus={alunoLogado.graus} size="lg" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setModalCurriculoAberto(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver Requisitos de Faixa</span>
              </button>

              <button
                onClick={() => setModalPesoAberto(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-red-400" />
                <span>Calculadora de Categoria</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Presenças Registradas em Treinos:</span>
            <span className="font-mono font-black text-emerald-400 text-base">{frequenciasDoAluno.length} aulas</span>
          </div>
        </div>

        {/* CARD 2: SITUAÇÃO FINANCEIRA & PIX */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6 flex flex-col justify-between shadow-xl">
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

            <div>
              {isBolsista ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Perfil Social Bolsista · Isento de Mensalidade</span>
                </div>
              ) : isMensalidadePaga ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Mensalidade Paga · Acesso aos Tatames Liberado</span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-black uppercase flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Mensalidade em Aberto referente a este mês</span>
                </div>
              )}
            </div>

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
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            <span>Secretaria do Polo: {alunoLogado.ct}</span>
          </div>
        </div>

      </div>

      {/* ENVIO DE DOCUMENTOS & ARQUIVOS PARA O FIREBASE STORAGE */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              Documentos & Arquivos do Aluno (Firebase Storage)
            </h3>
          </div>
          {uploadando && (
            <span className="text-xs text-amber-400 font-mono animate-pulse">
              Enviando arquivo para a nuvem...
            </span>
          )}
        </div>

        {mensagemUpload && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            mensagemUpload.tipo === 'sucesso' 
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
              : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{mensagemUpload.texto}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Foto de Perfil */}
          <label className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer flex flex-col items-center text-center space-y-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              disabled={uploadando} 
              onChange={e => handleUploadDocumento(e, 'foto')} 
            />
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
              <User className="w-5 h-5" />
            </div>
            <strong className="text-xs text-white uppercase">Atualizar Foto</strong>
            <span className="text-[10px] text-neutral-400">JPG ou PNG para a carteirinha</span>
          </label>

          {/* Atestado Médico */}
          <label className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer flex flex-col items-center text-center space-y-2">
            <input 
              type="file" 
              accept=".pdf,image/*" 
              className="hidden" 
              disabled={uploadando} 
              onChange={e => handleUploadDocumento(e, 'documento')} 
            />
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <strong className="text-xs text-white uppercase">Atestado Médico</strong>
            <span className="text-[10px] text-neutral-400">PDF ou foto do laudo médico</span>
          </label>

          {/* Certificado de Graduação */}
          <label className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer flex flex-col items-center text-center space-y-2">
            <input 
              type="file" 
              accept=".pdf,image/*" 
              className="hidden" 
              disabled={uploadando} 
              onChange={e => handleUploadDocumento(e, 'certificado')} 
            />
            <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <strong className="text-xs text-white uppercase">Certificado de Faixa</strong>
            <span className="text-[10px] text-neutral-400">Certificado oficial Projarde</span>
          </label>
        </div>

        {/* Lista de Arquivos do Aluno */}
        {arquivosDoAluno.length > 0 && (
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Seus Arquivos Armazenados no Firebase
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {arquivosDoAluno.map(arq => (
                <div key={arq.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-white font-bold block truncate">{arq.nome}</span>
                    <span className="text-[10px] text-neutral-500 uppercase">{arq.tipo} · {arq.dataUpload.split('T')[0]}</span>
                  </div>
                  <a
                    href={arq.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] uppercase font-bold shrink-0"
                  >
                    Visualizar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HISTÓRICO DE PRESENÇAS DO ALUNO */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              Histórico de Frequência nos Treinos
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 font-bold">
            Total: {frequenciasDoAluno.length} aulas computadas
          </span>
        </div>

        {frequenciasDoAluno.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-6">
            Nenhuma presença registrada ainda. Compareça aos treinos para que os professores computem sua frequência na chamada digital.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {frequenciasDoAluno.map((f, i) => (
              <div key={f.id || i} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-0.5">
                <span className="text-emerald-400 font-bold font-mono block text-sm">Aula #{i + 1}</span>
                <span className="text-white block font-mono">{f.dataRef || f.data.split('T')[0]}</span>
                <span className="text-[10px] text-neutral-400 uppercase">{f.unidade}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAIS INTERATIVOS */}
      {modalCarteirinhaAberta && (
        <AthleteCardID
          aluno={alunoLogado}
          onClose={() => setModalCarteirinhaAberta(false)}
        />
      )}

      {modalFichaAberta && (
        <PrintableAthleteCard
          aluno={alunoLogado}
          onClose={() => setModalFichaAberta(false)}
        />
      )}

      {modalCurriculoAberto && (
        <BeltProgressionModal
          currentBelt={alunoLogado.faixa}
          onClose={() => setModalCurriculoAberto(false)}
        />
      )}

      {modalPesoAberto && (
        <WeightCategoryCalculator
          initialWeight={alunoLogado.peso_kg || 70}
          initialHeight={alunoLogado.altura_cm || 175}
          onSave={async (p, a) => {
            await store.atualizarMedidas(alunoLogado.id, p, a);
          }}
          onClose={() => setModalPesoAberto(false)}
        />
      )}

    </div>
  );
};
