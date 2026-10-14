import React from 'react';
import { Shield, Instagram, MapPin, Phone, Award, ExternalLink, MessageCircle, Facebook } from 'lucide-react';
import { store } from '../services/store';
import { PaginaCustomizada } from '../types';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [siteConfig, setSiteConfig] = React.useState(() => store.getSiteConfig());
  const [paginas, setPaginas] = React.useState(() => 
    store.getPaginasCustomizadas().filter((p: PaginaCustomizada) => p.publicada !== false)
  );

  React.useEffect(() => {
    const unsub = store.subscribe(() => {
      setSiteConfig(store.getSiteConfig());
      setPaginas(store.getPaginasCustomizadas().filter((p: PaginaCustomizada) => p.publicada !== false));
    });
    return unsub;
  }, []);

  const instagramLink = siteConfig.instagramUrl || 'https://www.instagram.com/gaditas_fight?igsh=OHIzaW9uc2psamQw';
  const whatsappNum = siteConfig.whatsappContato || '(21) 98888-0101';
  const whatsappLink = `https://wa.me/55${whatsappNum.replace(/\D/g, '')}`;

  return (
    <footer className="bg-black border-t border-neutral-800 text-neutral-400 text-sm mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Coluna 1: Marca e Missão */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              {siteConfig.logoUrl ? (
                <img src={siteConfig.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-neutral-900 border border-neutral-800 p-0.5" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <span className="font-black text-lg uppercase tracking-tight text-white">
                {siteConfig.nomeSite ? siteConfig.nomeSite : <>EQUIPE <span className="text-red-500">GADITAS</span></>}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {siteConfig.rodapeTexto || 'Associação Desportiva Gaditas. Formando campeões nos tatames e na vida através da disciplina marcial, do respeito e da perseverança desde 2017.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Resgatando Vidas</span>
            </div>
          </div>

          {/* Coluna 2: Modalidades */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Modalidades & Páginas
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-red-400 transition-colors cursor-pointer" onClick={() => onNavigate('sobre')}>
                Muay Thai Tradicional & Moderno
              </li>
              <li className="hover:text-red-400 transition-colors cursor-pointer" onClick={() => onNavigate('sobre')}>
                Luta Livre Esportiva (Faixa Preta)
              </li>
              <li className="hover:text-red-400 transition-colors cursor-pointer" onClick={() => onNavigate('sobre')}>
                Mixed Martial Arts (MMA Pro & Amador)
              </li>
              <li className="hover:text-red-400 transition-colors cursor-pointer" onClick={() => onNavigate('sobre')}>
                Boxe & Kickboxing K-1
              </li>
              {paginas.map((p: PaginaCustomizada) => (
                <li 
                  key={p.id} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-neutral-300 font-semibold"
                  onClick={() => onNavigate(`pagina-${p.slug}`)}
                >
                  {p.titulo}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Polos e Unidades CT */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Polos & Unidades
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Campo Grande (Sede):</strong> Zona Oeste - Rio de Janeiro</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Bangu:</strong> Centro de Treinamento e Competições</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Seropédica:</strong> Polo Universitário e Alto Rendimento</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Nova Iguaçu:</strong> Polo Social & Inclusão de Jovens</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Redes & Contato */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-wider border-b border-neutral-800 pb-2">
              Canais Oficiais
            </h4>
            <p className="text-xs text-neutral-400">
              Conecte-se com nossa equipe e diretoria através dos canais diretos:
            </p>
            
            <div className="flex flex-col gap-2.5">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram Oficial</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>

              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook Oficial</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>
              )}

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {whatsappNum}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
          </div>

        </div>

        {/* Linha Inferior */}
        <div className="border-t border-neutral-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} {siteConfig.nomeSite || 'Equipe Gaditas Fight Team'}. Todos os direitos reservados.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
            <button onClick={() => onNavigate('matricula')} className="hover:text-white transition-colors cursor-pointer">
              Matrícula
            </button>
            <button onClick={() => onNavigate('aluno-portal')} className="hover:text-white transition-colors cursor-pointer">
              Área do Aluno
            </button>
            <button onClick={() => onNavigate('admin-portal')} className="hover:text-white transition-colors cursor-pointer">
              Acesso Docente
            </button>
            <button onClick={() => onNavigate('saude-firebase')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-emerald-400/90 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Saúde do Firebase</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
