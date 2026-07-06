import { useState } from "react";
import { eventos, type Evento, fmtDate } from "@/data/store";

const CAT_LABELS: Record<string, string> = {
  cultural: '🎭 Cultural',
  academico: '🔬 Acadêmico',
  social: '🌱 Social',
  reuniao: '👨‍👩‍👧 Reunião',
  esporte: '🏆 Esporte',
};

const CAT_COLORS: Record<string, string> = {
  cultural:  '#e8b84b',
  academico: '#2e7d52',
  social:    '#1e6fa0',
  reuniao:   '#c9993a',
  esporte:   '#7c3aed',
};

export default function Eventos() {
  const [filter, setFilter] = useState('todos');
  const [selected, setSelected] = useState<Evento | null>(null);

  const today = new Date();

  const sorted = [...eventos].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  const filtered = filter === 'todos'
    ? sorted
    : sorted.filter(e => e.cat === filter);

  const upcoming = sorted.filter(e => new Date(e.data) >= today);
  const next = upcoming[0];

  function daysUntil(dateStr: string) {
    const diff = Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
    if (diff < 0) return null;
    if (diff === 0) return 'Hoje!';
    if (diff === 1) return 'Amanhã';
    return `em ${diff} dias`;
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🗓️</div>
        <div className="sec-title">
          <h2>Eventos Escolares</h2>
          <p>Calendário de eventos, datas e atividades</p>
        </div>
      </div>

      {/* Próximo destaque */}
      {next && (
        <div className="event-hero" style={{ borderColor: next.cor }}>
          <div className="event-hero-badge" style={{ background: next.cor }}>
            PRÓXIMO EVENTO
          </div>
          <div className="event-hero-body">
            <div className="event-hero-date" style={{ color: next.cor }}>
              <span className="event-hero-day">{next.data.split('-')[2]}</span>
              <span className="event-hero-month">
                {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(next.data.split('-')[1]) - 1]}
              </span>
            </div>
            <div className="event-hero-info">
              <div className="event-hero-title">{next.titulo}</div>
              <div className="event-hero-meta">
                🕐 {next.hora} &nbsp;·&nbsp; 📍 {next.local}
              </div>
              <p className="event-hero-desc">{next.desc}</p>
            </div>
            <div className="event-hero-countdown" style={{ background: `${next.cor}18`, color: next.cor }}>
              {daysUntil(next.data)}
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="tab-row" style={{ marginTop: '1.5rem' }}>
        <button className={`p-tab ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>
          Todos ({eventos.length})
        </button>
        {Object.entries(CAT_LABELS).map(([k, v]) => {
          const count = eventos.filter(e => e.cat === k).length;
          if (count === 0) return null;
          return (
            <button key={k} className={`p-tab ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
              {v} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de eventos */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🗓️</div>
          <p>Nenhum evento nesta categoria</p>
        </div>
      ) : (
        <div className="event-list">
          {filtered.map(ev => {
            const isPast = new Date(ev.data) < today;
            const countdown = daysUntil(ev.data);
            return (
              <div
                key={ev.id}
                className={`event-card ${isPast ? 'past' : ''}`}
                style={{ borderLeftColor: ev.cor }}
                onClick={() => setSelected(ev)}
              >
                <div className="event-card-date">
                  <div className="event-card-day">{ev.data.split('-')[2]}</div>
                  <div className="event-card-month">
                    {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(ev.data.split('-')[1]) - 1]}
                  </div>
                </div>
                <div className="event-card-body">
                  <div className="event-card-title">{ev.titulo}</div>
                  <div className="event-card-meta">
                    <span>🕐 {ev.hora}</span>
                    <span>📍 {ev.local}</span>
                  </div>
                  <span
                    className="event-card-cat"
                    style={{ background: `${CAT_COLORS[ev.cat]}18`, color: CAT_COLORS[ev.cat] }}
                  >
                    {CAT_LABELS[ev.cat] ?? ev.cat}
                  </span>
                </div>
                <div className="event-card-right">
                  {isPast ? (
                    <span className="event-tag past-tag">Realizado</span>
                  ) : countdown ? (
                    <span className="event-tag" style={{ background: `${ev.cor}15`, color: ev.cor }}>
                      {countdown}
                    </span>
                  ) : null}
                  <span className="event-card-arrow">›</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal detalhes */}
      {selected && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="modal">
            <div className="modal-header" style={{ borderBottomColor: selected.cor }}>
              <h3>{selected.titulo}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <div className="event-detail-item">
                  <span>📅</span>
                  <div>
                    <div style={{ fontSize: '.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Data</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>
                      {new Date(selected.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="event-detail-item">
                  <span>🕐</span>
                  <div>
                    <div style={{ fontSize: '.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Horário</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{selected.hora}</div>
                  </div>
                </div>
                <div className="event-detail-item">
                  <span>📍</span>
                  <div>
                    <div style={{ fontSize: '.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Local</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{selected.local}</div>
                  </div>
                </div>
              </div>
              <div
                className="p-badge"
                style={{ background: `${CAT_COLORS[selected.cat]}15`, color: CAT_COLORS[selected.cat], marginBottom: '1rem' }}
              >
                {CAT_LABELS[selected.cat] ?? selected.cat}
              </div>
              <p style={{ fontSize: '.9rem', color: '#4b5563', lineHeight: 1.7 }}>{selected.desc}</p>
            </div>
            <div className="modal-footer">
              <button className="p-btn p-btn-outline" onClick={() => setSelected(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
