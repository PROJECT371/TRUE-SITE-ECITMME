import { useEffect, useState } from "react";
import { fmtDate, turmaNome } from "@/data/store";
import { listarProvas, type ProvaDB } from "@/lib/dados";

export default function Provas() {
  const [provas, setProvas] = useState<ProvaDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const today = new Date();

  useEffect(() => {
    listarProvas().then(lista => {
      setProvas(lista);
      setLoading(false);
    });
  }, []);

  // Calendar for June 2025
  const labels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const firstDay = new Date(2025, 5, 1).getDay();
  const days = 30;
  const eventDays = provas.filter(p => p.data.startsWith('2025-06')).map(p => parseInt(p.data.split('-')[2]));

  const calDays: Array<{ day: number | null; today: boolean; hasEvent: boolean }> = [];
  for (let i = 0; i < firstDay; i++) calDays.push({ day: null, today: false, hasEvent: false });
  for (let d = 1; d <= days; d++) {
    calDays.push({ day: d, today: d === 3, hasEvent: eventDays.includes(d) });
  }

  const upcoming4 = provas
    .filter(p => new Date(p.data) >= today)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 4);

  const list = provas.filter(p => filter === 'todas' || p.turma === filter);

  function getDiff(dataStr: string) {
    const d = new Date(dataStr);
    return Math.ceil((d.getTime() - today.getTime()) / 86400000);
  }

  function StatusBadge({ data }: { data: string }) {
    const diff = getDiff(data);
    if (diff < 0) return <span className="p-badge p-badge-navy">Realizada</span>;
    if (diff === 0) return <span className="p-badge p-badge-red">Hoje</span>;
    if (diff <= 3) return <span className="p-badge p-badge-red">{diff}d</span>;
    return <span className="p-badge p-badge-gold">{diff}d</span>;
  }

  if (loading) {
    return (
      <div className="animate-fade-up">
        <div className="sec-header">
          <div className="sec-icon">📋</div>
          <div className="sec-title">
            <h2>Calendário de Provas</h2>
            <p>Avaliações, datas e comunicados</p>
          </div>
        </div>
        <p style={{ color: '#9ca3af' }}>Carregando provas...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">📋</div>
        <div className="sec-title">
          <h2>Calendário de Provas</h2>
          <p>Avaliações, datas e comunicados</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Calendar */}
        <div className="p-card">
          <div className="p-card-header">
            <div className="p-card-icon gold">📅</div>
            <div><div className="p-card-title">Junho 2025</div></div>
          </div>
          <div className="p-card-body">
            <div className="cal-grid">
              {labels.map(l => <div key={l} className="cal-day-label">{l}</div>)}
            </div>
            <div className="cal-grid">
              {calDays.map((c, i) => (
                <div
                  key={i}
                  className={`cal-day${c.day === null ? ' other-month' : c.today ? ' today' : c.hasEvent ? ' has-event' : ''}`}
                >
                  {c.day ?? ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Destaque */}
        <div className="p-card">
          <div className="p-card-header">
            <div className="p-card-icon gold">⭐</div>
            <div><div className="p-card-title">Em Destaque</div><div className="p-card-sub">Próximas avaliações</div></div>
          </div>
          <div className="p-card-body">
            {upcoming4.length === 0 && <p style={{ fontSize: '.85rem', color: '#9ca3af' }}>Nenhuma prova cadastrada.</p>}
            {upcoming4.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start', padding: '.75rem 0', borderBottom: i < upcoming4.length - 1 ? '1px solid var(--p-border)' : 'none' }}>
                <div style={{ textAlign: 'center', minWidth: '44px' }}>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: '1.4rem', color: 'var(--gold)', lineHeight: 1 }}>{p.data.split('-')[2]}</div>
                  <div style={{ fontSize: '.65rem', color: '#9ca3af', textTransform: 'uppercase' }}>jun</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--navy)' }}>{p.disciplina}</div>
                  <div style={{ fontSize: '.78rem', color: '#6b7280' }}>{p.tipo} · {p.hora}</div>
                  <div style={{ fontSize: '.75rem', color: '#9ca3af', marginTop: '.15rem' }}>{p.obs}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tab-row">
        {[['todas','Todas'],['1a','1º Ano'],['2a','2º Ano'],['3a','3º Ano']].map(([v, l]) => (
          <button key={v} className={`p-tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="p-table">
          <thead>
            <tr>
              <th>Disciplina</th><th>Turma</th><th>Data</th><th>Horário</th><th>Tipo</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id}>
                <td><strong>{p.disciplina}</strong></td>
                <td>{turmaNome(p.turma)}</td>
                <td>{fmtDate(p.data)}</td>
                <td>{p.hora}</td>
                <td><span className="p-badge p-badge-teal">{p.tipo}</span></td>
                <td><StatusBadge data={p.data} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
