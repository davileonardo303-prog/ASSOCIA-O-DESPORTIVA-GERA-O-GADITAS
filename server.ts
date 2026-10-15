import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Inicialização do Google GenAI Server-side conforme skill gemini-api
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.warn('Falha ao instanciar GoogleGenAI server-side:', err);
  }
}

// Endpoint do Atendente Virtual IA (Triagem e Atendimento Pré-WhatsApp)
app.post('/api/atendente-virtual', async (req: Request, res: Response) => {
  try {
    const { mensagem, historico, polo, nome } = req.body;
    const msgUsuario = (mensagem || '').trim();

    if (!msgUsuario) {
      return res.status(400).json({ error: 'Mensagem obrigatória.' });
    }

    // Contexto oficial da Equipe Gaditas
    const systemPrompt = `
Você é o Atendente Virtual Oficial da Equipe Gaditas Fight Team (fundada em 2017 e liderada pelo Mestre Daniel Braga).
Sua missão é atender com entusiasmo, respeito marcial ("Oss!"), simpatia e objetividade os novos visitantes e interessados nos treinos.

Dados Oficiais da Equipe Gaditas:
- Líder Técnico: Mestre Daniel Braga (Grau Preta e Branca em Muay Thai Tradicional, Faixa Preta de Luta Livre diplomado em 2017 por Leandro Vilela, linhagem Nael Pedra).
- Polos / CTs Ativos no Rio de Janeiro:
  1. Campo Grande (Sede) - Rua Principal, Campo Grande - RJ
  2. Vila Ieda CG - Campo Grande - RJ
  3. Parque Riviera Tropical - Campo Grande - RJ
  4. Torre Forte - RJ
  5. KM34 - Rodovia KM34 - RJ
  6. Jardins do Brito - Campo Grande - RJ
  7. Bangu - Av. Cônego de Vasconcelos, Bangu - RJ
  8. Seropédica - Km 40, Seropédica - RJ
  9. Nova Iguaçu (Polo Social Bolsista Isento) - Associação Desportiva Gaditas
- Modalidades: Muay Thai Tradicional, Luta Livre Esportiva (Submission / No-Gi), Kickboxing K-1, MMA e turmas Kids/Feminino.
- Valores: Mensalidade regular de R$ 120,00 (unidade social de Nova Iguaçu atende bolsistas isentos).
- Chave PIX Oficial: gaditasfightteam@gmail.com
- Benefício Especial: 1ª AULA EXPERIMENTAL 100% GRATUITA em qualquer polo!
- WhatsApp Oficial da Coordenação: (21) 98888-0101

Instruções de Resposta:
1. Responda em no máximo 3 ou 4 parágrafos curtos, acolhedores e diretos.
2. Incentive sempre o aluno a agendar sua Aula Experimental Gratuita.
3. Se o visitante perguntar sobre horários, informe que temos turmas matutinas, vespertinas e noturnas (iniciante ao avançado).
4. No final de sua resposta, forneça uma frase amigável convidando para clicar no botão e prosseguir no WhatsApp para confirmar o polo e horário.
`;

    if (aiClient) {
      try {
        const contents: any[] = [];
        if (Array.isArray(historico)) {
          for (const h of historico.slice(-6)) {
            contents.push({
              role: h.autor === 'user' ? 'user' : 'model',
              parts: [{ text: h.texto }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: `Meu nome: ${nome || 'Interessado'}, Polo selecionado: ${polo || 'A definir'}. Pergunta: ${msgUsuario}` }]
        });

        const callGemini = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            topP: 0.95
          }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de resposta Gemini')), 4000)
        );

        const response: any = await Promise.race([callGemini, timeoutPromise]);
        const textoResposta = response.text || 'Oss! Seja muito bem-vindo à Equipe Gaditas. Estamos à disposição para agendar sua aula experimental gratuita!';
        
        return res.json({
          resposta: textoResposta,
          polo: polo || 'Campo Grande',
          sucesso: true
        });
      } catch (geminiError: any) {
        console.warn('Fallback ativado:', geminiError?.message);
      }
    }

    // Fallback inteligente caso Gemini não esteja configurado com chave ou atinja limite
    let fallbackResposta = 'Oss! Seja bem-vindo à Equipe Gaditas Fight Team!';
    const msgLower = msgUsuario.toLowerCase();

    if (msgLower.includes('preco') || msgLower.includes('valor') || msgLower.includes('mensalidade') || msgLower.includes('quanto')) {
      fallbackResposta = 'A mensalidade padrão nos polos da Equipe Gaditas é de apenas R$ 120,00 mensais sem taxa de matrícula oculta! Além disso, oferecemos bolsa 100% gratuita no polo social de Nova Iguaçu e sua primeira aula experimental é totalmente gratuita!';
    } else if (msgLower.includes('onde') || msgLower.includes('endereco') || msgLower.includes('polo') || msgLower.includes('ct') || msgLower.includes('unidade')) {
      fallbackResposta = 'Temos polos ativos em Campo Grande (Sede), Vila Ieda, Parque Riviera Tropical, Torre Forte, KM34, Jardins do Brito, Bangu, Seropédica e Nova Iguaçu. Em qual região fica melhor para você treinar?';
    } else if (msgLower.includes('horario') || msgLower.includes('hora') || msgLower.includes('dias') || msgLower.includes('treino')) {
      fallbackResposta = 'Nossos treinos ocorrem de segunda a sábado em horários pela manhã (07h às 08h30), tarde e noite (18h às 21h), com turmas para iniciantes, kids, feminino e atletas de competição.';
    } else if (msgLower.includes('mestre') || msgLower.includes('daniel') || msgLower.includes('professor')) {
      fallbackResposta = 'O Mestre Daniel Braga é Grau Preta e Branca de Muay Thai e Faixa Preta de Luta Livre formado em 2017 por Leandro Vilela (linhagem Nael Pedra), dedicando décadas à formação técnica e cidadã de jovens e adultos.';
    } else {
      fallbackResposta = 'Oss! Na Equipe Gaditas você treina Muay Thai, Luta Livre e MMA com metodologia de excelência. Agende agora sua aula experimental gratuita com o Mestre Daniel!';
    }

    return res.json({
      resposta: fallbackResposta,
      polo: polo || 'Campo Grande',
      sucesso: true
    });
  } catch (error: any) {
    console.error('Erro no /api/atendente-virtual:', error);
    return res.status(500).json({
      error: 'Erro interno ao processar mensagem.',
      resposta: 'Oss! No momento nosso assistente virtual está com alta demanda. Clique no botão abaixo para falar diretamente no WhatsApp oficial com nossa coordenação!'
    });
  }
});

// Configuração do Vite dev / servidor estático
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Equipe Gaditas Server ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer();
