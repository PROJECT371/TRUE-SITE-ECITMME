import { useState, useEffect } from "react";

interface OfflineScreenProps {
  lastSection: string;
  onRetry: () => void;
}

const SECTION_LABELS: Record<string, { label: string; icon: string }> = {
  inicio:      { label: 'Início',      icon: '🏠' },
  biblioteca:  { label: 'Biblioteca',  icon: '📚' },
  provas:      { label: 'Provas',      icon: '📋' },
  conteudos:   { label: 'Conteúdos',   icon: '📖' },
  secretaria:  { label: 'Secretaria',  icon: '📢' },
  cardapio:    { label: 'Cardápio',    icon: '🍽️' },
  interclasse: { label: 'Interclasse', icon: '🏆' },
  eventos:     { label: 'Eventos',     icon: '🗓️' },
};

const OFFLINE_TIPS = [
  'Você ainda pode ver as provas e conteúdos cadastrados.',
  'O cardápio da semana fica disponível mesmo sem internet.',
  'As informações da secretaria estão salvas no seu celular.',
  'Os jogos do interclasse são acessíveis offline.',
];

export default function OfflineScreen({ lastSection, onRetry }: OfflineScreenProps) {
  const [dots, setDots] = useState('');
  const [tip] = useState(() => OFFLINE_TIPS[Math.floor(Math.random() * OFFLINE_TIPS.length)]);
  const sec = SECTION_LABELS[lastSection] ?? SECTION_LABELS['inicio'];

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="offline-screen">
      <div className="offline-inner">

        {/* Icon */}
        <div className="offline-icon-wrap">
          <svg className="offline-wifi" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="rgba(201,153,58,.12)" stroke="rgba(201,153,58,.3)" strokeWidth="2"/>
            <path d="M20 38 Q40 20 60 38" stroke="rgba(201,153,58,.25)" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M27 46 Q40 34 53 46" stroke="rgba(201,153,58,.45)" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M34 54 Q40 48 46 54" stroke="#c9993a" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <circle cx="40" cy="60" r="3.5" fill="#c9993a"/>
            <line x1="18" y1="18" x2="62" y2="62" stroke="#c9993a" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Heading */}
        <h2 className="offline-title">Sem conexão{dots}</h2>
        <p className="offline-subtitle">
          O portal detectou que você está sem internet.<br />
          Mas não se preocupe — o conteúdo salvo ainda está disponível.
        </p>

        {/* Last section badge */}
        <div className="offline-last-section">
          <span className="offline-last-icon">{sec.icon}</span>
          <div>
            <div className="offline-last-label">Última seção visitada</div>
            <div className="offline-last-name">{sec.label}</div>
          </div>
        </div>

        {/* Available sections */}
        <div className="offline-avail">
          <div className="offline-avail-title">📦 Disponível no cache</div>
          <div className="offline-avail-grid">
            {Object.entries(SECTION_LABELS).map(([id, { label, icon }]) => (
              <div key={id} className="offline-avail-chip">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="offline-tip">
          💡 {tip}
        </div>

        {/* Retry */}
        <button className="offline-retry" onClick={onRetry}>
          🔄 Tentar novamente
        </button>

      </div>
    </div>
  );
}
