import { useState, useEffect } from "react";
import Inicio from "@/pages/Inicio";
import Disciplinas from "@/pages/Disciplinas";
import Biblioteca from "@/pages/Biblioteca";
import Provas from "@/pages/Provas";
import Conteudos from "@/pages/Conteudos";
import Secretaria from "@/pages/Secretaria";
import Clubes from "@/pages/Clubes";
import Salas from "@/pages/Salas";
import Cardapio from "@/pages/Cardapio";
import Interclasse from "@/pages/Interclasse";
import Eventos from "@/pages/Eventos";
import Admin from "@/pages/Admin";
import InstallPrompt from "@/components/InstallPrompt";
import OfflineScreen from "@/components/OfflineScreen";

type Section = 'inicio' | 'disciplinas' | 'biblioteca' | 'provas' | 'conteudos' | 'secretaria' | 'clubes' | 'salas' | 'cardapio' | 'interclasse' | 'eventos' | 'admin';

const NAV_ITEMS: Array<{ id: Section; label: string; icon: string }> = [
  { id: 'inicio',      label: 'Início',      icon: '🏠' },
  { id: 'disciplinas', label: 'Disciplinas', icon: '📘' },
  { id: 'biblioteca',  label: 'Biblioteca',  icon: '📚' },
  { id: 'provas',      label: 'Provas',      icon: '📋' },
  { id: 'conteudos',   label: 'Conteúdos',   icon: '📖' },
  { id: 'secretaria',  label: 'Secretaria',  icon: '📢' },
  { id: 'clubes',      label: 'Clubes',      icon: '🎭' },
  { id: 'salas',       label: 'Salas',       icon: '🏫' },
  { id: 'cardapio',    label: 'Cardápio',    icon: '🍽️' },
  { id: 'interclasse', label: 'Interclasse', icon: '🏆' },
  { id: 'eventos',     label: 'Eventos',     icon: '🗓️' },
];

interface Toast { id: number; msg: string }

export default function App() {
  const [section, setSection] = useState<Section>('inicio');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('ecit_theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('ecit_theme', darkMode ? 'dark' : 'light'); } catch { /* noop */ }
  }, [darkMode]);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  function navigate(s: string) {
    setSection(s as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showToast(msg: string) {
    const id = toastId + 1;
    setToastId(id);
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }

  const noticeBand = [
    '📢 Reunião de pais: 15/06 às 14h',
    '📋 Prova de Matemática: 1º Ano – 10/06',
    '📚 Novos livros chegaram na biblioteca',
    '🏆 Interclasse 2025 começa em 20/06',
    '🍽️ Cardápio especial na próxima semana',
  ];

  if (!isOnline) {
    return (
      <OfflineScreen
        lastSection={section}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off)' }}>

      {/* Notice band */}
      <div className="notice-band">
        <span style={{ flexShrink: 0, fontSize: '1rem' }}>📣</span>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <span className="marquee-text">
            {noticeBand.map((n, i) => <span key={i}>{n}</span>)}
            {noticeBand.map((n, i) => <span key={`r${i}`}>{n}</span>)}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="portal-header">
        <div className="header-inner">
          <div className="logo-wrap">
            <div className="logo-badge">🏫</div>
            <div className="school-info">
              <h1>ECIT João Da Matta</h1>
              <p>Mamanguape – Paraíba · SEDUC-PB</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className="btn-admin"
              style={{ background: 'rgba(255,255,255,.1)', color: 'var(--white)', boxShadow: 'none', marginRight: '.6rem' }}
              onClick={() => setDarkMode(d => !d)}
              title="Alternar modo escuro"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="btn-admin" onClick={() => navigate('admin')}>
              ⚙️ Admin
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="portal-nav">
          <div className="nav-inner">
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                className={`nav-item ${section === n.id ? 'active' : ''}`}
                onClick={() => navigate(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: '70vh' }}>
        {section === 'inicio'      && <Inicio onNavigate={navigate} />}
        {section === 'disciplinas' && <Disciplinas />}
        {section === 'biblioteca'  && <Biblioteca onToast={showToast} />}
        {section === 'provas'      && <Provas />}
        {section === 'conteudos'   && <Conteudos />}
        {section === 'secretaria'  && <Secretaria onToast={showToast} />}
        {section === 'clubes'      && <Clubes />}
        {section === 'salas'       && <Salas />}
        {section === 'cardapio'    && <Cardapio />}
        {section === 'interclasse' && <Interclasse />}
        {section === 'eventos'     && <Eventos />}
        {section === 'admin'       && <Admin onToast={showToast} />}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,.5)', textAlign: 'center', padding: '2rem 1.5rem', fontSize: '.78rem' }}>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: '1rem', color: 'var(--gold2)', marginBottom: '.4rem' }}>ECIT João Da Matta</div>
        <div>Mamanguape – Paraíba · SEDUC-PB · Portal Escolar 2025</div>
        <div style={{ marginTop: '.8rem', color: 'rgba(201,153,58,.5)', fontSize: '.7rem' }}>Desenvolvido pela equipe pedagógica · Ano letivo 2025</div>
      </footer>

      {/* PWA install prompt */}
      <InstallPrompt />

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {toasts.map(t => (
          <div key={t.id} className="p-toast">
            <span className="toast-icon">{t.msg.startsWith('❌') ? '❌' : t.msg.startsWith('⚠️') ? '⚠️' : '✅'}</span>
            {t.msg.replace(/^(❌|✅|⚠️|📚|🗑️)\s*/, '')}
          </div>
        ))}
      </div>
    </div>
  );
}
