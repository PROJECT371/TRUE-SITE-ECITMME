import { useEffect, useState } from "react";
import { listarEventos, listarAvisos, listarAvisosSalas } from "@/lib/dados";
import type { Perfil } from "@/lib/auth";

type Item = {
  id: string;
  tipo: 'evento' | 'aviso' | 'sala';
  titulo: string;
  criadoEm: string;
};

interface Props {
  perfil: Perfil | null;
  onNavigate: (secao: string) => void;
}

const LS_KEY = 'ecit_notif_last_seen';
const ICONS: Record<Item['tipo'], string> = { evento: '🗓️', aviso: '📢', sala: '🏫' };
const SECOES: Record<Item['tipo'], string> = { evento: 'eventos', aviso: 'secretaria', sala: 'salas' };

export default function NotificationBell({ perfil, onNavigate }: Props) {
  const [itens, setItens] = useState<Item[]>([]);
  const [aberto, setAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const [eventos, avisos, avisosSalas] = await Promise.all([
      listarEventos(), listarAvisos(), listarAvisosSalas(),
    ]);

    const minhaTurma = perfil?.role === 'aluno' ? perfil.turma : null;

    const lista: Item[] = [
      ...eventos.map(e => ({ id: `evento-${e.id}`, tipo: 'evento' as const, titulo: e.titulo, criadoEm: e.data })),
      ...avisos.map(a => ({ id: `aviso-${a.id}`, tipo: 'aviso' as const, titulo: a.titulo, criadoEm: a.created_at || a.data })),
      ...avisosSalas
        .filter(s => !minhaTurma || s.sala_id === minhaTurma)
        .map(s => ({ id: `sala-${s.id}`, tipo: 'sala' as const, titulo: s.texto, criadoEm: s.created_at || '' })),
    ]
      .filter(i => i.criadoEm)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
      .slice(0, 20);

    setItens(lista);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, [perfil?.turma, perfil?.role]);

  const ultimaVista = (() => {
    try { return localStorage.getItem(LS_KEY) || '2000-01-01'; } catch { return '2000-01-01'; }
  })();

  const novos = itens.filter(i => new Date(i.criadoEm).getTime() > new Date(ultimaVista).getTime());

  function toggle() {
    const abrindo = !aberto;
    setAberto(abrindo);
    if (abrindo) {
      try { localStorage.setItem(LS_KEY, new Date().toISOString()); } catch { /* noop */ }
    }
  }

  function irPara(item: Item) {
    setAberto(false);
    onNavigate(SECOES[item.tipo]);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn-admin"
        style={{ background: 'rgba(255,255,255,.1)', color: 'var(--white)', boxShadow: 'none', marginRight: '.6rem', position: 'relative' }}
        onClick={toggle}
        title="Notificações"
      >
        🔔
        {novos.length > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px', background: '#dc2626', color: '#fff',
            fontSize: '.65rem', fontWeight: 700, borderRadius: '999px', minWidth: '18px', height: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
          }}>
            {novos.length > 9 ? '9+' : novos.length}
          </span>
        )}
      </button>

      {aberto && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setAberto(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + .5rem)', right: 0, width: '320px', maxWidth: '85vw',
            background: 'var(--white)', borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,.2)',
            zIndex: 999, maxHeight: '70vh', overflowY: 'auto',
          }}>
            <div style={{ padding: '.9rem 1rem', borderBottom: '1px solid var(--p-border)', fontWeight: 700, color: 'var(--navy)', fontSize: '.9rem' }}>
              Notificações
            </div>
            {loading ? (
              <p style={{ padding: '1rem', fontSize: '.82rem', color: '#9ca3af' }}>Carregando...</p>
            ) : itens.length === 0 ? (
              <p style={{ padding: '1rem', fontSize: '.82rem', color: '#9ca3af' }}>Nada por aqui ainda.</p>
            ) : itens.map(item => (
              <div
                key={item.id}
                onClick={() => irPara(item)}
                style={{
                  display: 'flex', gap: '.6rem', padding: '.7rem 1rem', cursor: 'pointer',
                  borderBottom: '1px solid var(--p-border)', alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{ICONS[item.tipo]}</span>
                <span style={{ fontSize: '.82rem', color: 'var(--navy2)', lineHeight: 1.4 }}>{item.titulo}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
