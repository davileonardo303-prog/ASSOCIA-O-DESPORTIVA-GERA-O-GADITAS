import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  ExternalLink,
  Shield,
  Bot
} from 'lucide-react';
import { store } from '../services/store';

interface MensagemChat {
  id: string;
  autor: 'user' | 'ia';
  texto: string;
  timestamp: string;
  sugestoes?: string[];
  botaoWhatsApp?: boolean;
}

export const ChatbotAtendenteVirtual: React.FC = () => {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [inputTexto, setInputTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [poloSelecionado, setPoloSelecionado] = useState('Campo Grande (Sede)');
  const [nomeVisitante, setNomeVisitante] = useState('');
  const [leadRegistradoId, setLeadRegistradoId] = useState<string | null>(null);

  const mensagensEndRef = useRef<HTMLDivElement>(null);
  const unidades = store.getUnidades();
  const siteConfig = store.getSiteConfig();

  // Inicializa mensagens com mensagem personalizada do CMS
  useEffect(() => {
    const screens = store.getGlobalScreens();
    const mensagemInicial = screens?.global?.chatbotBoasVindas || (screens as any)?.chatbot?.mensagemBoasVindas || 
      'Oss! Seja muito bem-vindo à Equipe Gaditas Fight Team! Sou o Atendente Virtual e posso tirar suas dúvidas sobre horários, valores, polos e agendar sua 1ª Aula Experimental Gratuita com o Mestre Daniel Braga. Como posso te ajudar hoje?';

    setMensagens([
      {
        id: 'msg-welcome',
        autor: 'ia',
        texto: mensagemInicial,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sugestoes: [
          'Quero fazer aula experimental grátis',
          'Valores de mensalidade',
          'Quais são os polos e endereços?',
          'Grade de horários de treino'
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, aberto]);

  const enviarMensagem = async (texto: string) => {
    const textoLimpo = texto.trim();
    if (!textoLimpo || carregando) return;

    const userMsg: MensagemChat = {
      id: 'msg-' + Date.now(),
      autor: 'user',
      texto: textoLimpo,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const novoHistorico = [...mensagens, userMsg];
    setMensagens(novoHistorico);
    setInputTexto('');
    setCarregando(true);

    try {
      // Chama o endpoint server-side /api/atendente-virtual
      const resp = await fetch('/api/atendente-virtual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: textoLimpo,
          historico: novoHistorico.map(m => ({ autor: m.autor, texto: m.texto })),
          polo: poloSelecionado,
          nome: nomeVisitante
        })
      });

      const data = await resp.json();
      const respostaTexto = data.resposta || 'Oss! Estou à sua disposição para agendar seu treino!';

      const iaMsg: MensagemChat = {
        id: 'msg-' + (Date.now() + 1),
        autor: 'ia',
        texto: respostaTexto,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        botaoWhatsApp: true,
        sugestoes: ['Quero confirmar no WhatsApp', 'Ver outros polos', 'Dúvidas sobre graduação']
      };

      setMensagens([...novoHistorico, iaMsg]);

      // Registra Lead no Firestore para acompanhamento da secretaria
      const leadPayload = {
        id: leadRegistradoId || undefined,
        nome: nomeVisitante || 'Visitante Web',
        poloInteresse: poloSelecionado,
        duvidaPrincipal: textoLimpo,
        historicoMensagens: [...novoHistorico, iaMsg].map(m => ({
          autor: m.autor,
          texto: m.texto,
          timestamp: m.timestamp
        }))
      };
      const leadSalvo = await store.salvarLeadAtendimento(leadPayload);
      if (!leadRegistradoId && leadSalvo.id) {
        setLeadRegistradoId(leadSalvo.id);
      }

    } catch (err) {
      console.warn('Erro ao conectar ao assistente virtual:', err);
      const fallbackMsg: MensagemChat = {
        id: 'msg-err-' + Date.now(),
        autor: 'ia',
        texto: 'Oss! A mensalidade padrão nos polos da Equipe Gaditas é de apenas R$ 120,00 (sem taxa de adesão) e sua primeira aula experimental é 100% gratuita! Clique abaixo para falar direto com o Mestre no WhatsApp.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        botaoWhatsApp: true
      };
      setMensagens([...novoHistorico, fallbackMsg]);
    } finally {
      setCarregando(false);
    }
  };

  const gerarUrlWhatsAppFormatada = () => {
    const foneOficial = (siteConfig.whatsappContato || '(21) 98888-0101').replace(/\D/g, '');
    const ultimaDuvida = mensagens.filter(m => m.autor === 'user').slice(-1)[0]?.texto || 'Aula Experimental';
    const textoMsg = encodeURIComponent(
      `Olá Mestre Daniel / Equipe Gaditas! Estava conversando com o Atendente Virtual no site sobre o Polo ${poloSelecionado}. Minha dúvida / interesse: "${ultimaDuvida}". Gostaria de confirmar minha aula experimental gratuita!`
    );
    return `https://wa.me/55${foneOficial}?text=${textoMsg}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* Botão Flutuante quando fechado */}
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-red-600 via-red-700 to-neutral-900 text-white px-4 py-3.5 rounded-full shadow-2xl shadow-red-950/80 border-2 border-red-500/50 hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-label="Falar com Atendente Virtual da Equipe Gaditas"
        >
          {/* Badge Online Pulsante */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
          </span>

          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wide uppercase leading-tight flex items-center gap-1.5">
              <span>Atendimento Gaditas</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            </span>
            <span className="text-[10px] text-amber-200 font-bold leading-tight">
              Tire dúvidas & Agende Aula Grátis
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center border border-red-400/40 group-hover:bg-red-600 transition-colors">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
        </button>
      )}

      {/* Janela de Chat Aberta */}
      {aberto && (
        <div className="w-[92vw] sm:w-[380px] md:w-[420px] h-[560px] max-h-[85vh] bg-[#0c0c0f] border-2 border-red-500/40 rounded-3xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header do Chat */}
          <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-black px-4 py-3.5 border-b border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase text-white tracking-wider">Atendente Virtual</span>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 text-[9px] font-bold rounded border border-emerald-500/40 uppercase">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">Equipe Gaditas · Mestre Daniel</span>
              </div>
            </div>

            <button
              onClick={() => setAberto(false)}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="Minimizar atendimento"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Seletor Rápido de Polo */}
          <div className="bg-neutral-900/90 px-3.5 py-2 border-b border-neutral-800 flex items-center justify-between text-xs gap-2">
            <span className="text-[10px] uppercase font-bold text-neutral-400 whitespace-nowrap">Seu Polo:</span>
            <select
              value={poloSelecionado}
              onChange={e => setPoloSelecionado(e.target.value)}
              className="bg-neutral-950 text-amber-300 text-xs font-bold border border-neutral-700 rounded-lg px-2 py-1 w-full focus:outline-none focus:border-amber-400"
            >
              {unidades.map(u => (
                <option key={u.id} value={u.nome}>
                  {u.nome} ({u.tipo === 'bolsista' ? 'Social Isento' : 'R$ 120/mês'})
                </option>
              ))}
            </select>
          </div>

          {/* Área de Mensagens com Scroll */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-gradient-to-b from-neutral-950 to-[#070708]">
            {mensagens.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.autor === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-md ${
                    msg.autor === 'user'
                      ? 'bg-red-600 text-white rounded-br-none font-medium'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.texto}</p>
                </div>
                <span className="text-[9px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>

                {/* Botão de Prosseguir no WhatsApp gerado pela IA */}
                {msg.botaoWhatsApp && (
                  <div className="mt-2 w-full max-w-[85%]">
                    <a
                      href={gerarUrlWhatsAppFormatada()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/60 transition-all border border-emerald-400 cursor-pointer"
                    >
                      <span>Prosseguir no WhatsApp com o Resumo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Sugestões de Respostas Rápidas */}
                {msg.sugestoes && msg.sugestoes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.sugestoes.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => enviarMensagem(sug)}
                        className="px-2.5 py-1 bg-neutral-900/90 hover:bg-neutral-800 text-[11px] font-bold text-amber-300 rounded-lg border border-neutral-700/80 transition-colors text-left cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {carregando && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs italic bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Atendente digitando resposta...</span>
              </div>
            )}
            <div ref={mensagensEndRef} />
          </div>

          {/* Input de Envio */}
          <form
            onSubmit={e => {
              e.preventDefault();
              enviarMensagem(inputTexto);
            }}
            className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputTexto}
              onChange={e => setInputTexto(e.target.value)}
              placeholder="Digite sua dúvida ou pergunta..."
              disabled={carregando}
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputTexto.trim() || carregando}
              className="p-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-md"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
