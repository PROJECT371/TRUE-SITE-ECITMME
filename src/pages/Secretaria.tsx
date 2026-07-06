import { useState } from "react";
import { store, fmtDate } from "@/data/store";

export default function Secretaria() {
  const [cat, setCat] = useState('comunicados');

  const filtered = store.avisos.filter(a => a.cat === cat);

  const cats = [
    { id: 'comunicados', label: 'Comunicados' },
    { id: 'matricula', label: 'Matrícula' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'pais', label: 'Para Pais' },
  ];

  function PriorBadge({ p }: { p: string }) {
    const cls = p === 'urgente' ? 'p-badge-red' : p === 'info' ? 'p-badge-teal' : 'p-badge-navy';
    return <span className={`p-badge ${cls}`}>{p}</span>;
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">📢</div>
        <div className="sec-title">
          <h2>Secretaria Escolar</h2>
          <p>Comunicados, documentos e informações</p>
        </div>
      </div>

      <div className="tab-row">
        {cats.map(c => (
          <button key={c.id} className={`p-tab ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <p>Nenhum aviso nesta categoria</p>
        </div>
      ) : (
        <div>
          {filtered.map((a, i) => (
            <div key={i} className="aviso-card">
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginBottom: '.6rem' }}>
                <PriorBadge p={a.prioridade} />
                <span className="p-badge p-badge-navy">{a.cat}</span>
                <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: '#9ca3af' }}>{fmtDate(a.data)}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-h)', fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '.4rem' }}>{a.titulo}</h3>
              <p style={{ fontSize: '.88rem', color: '#4b5563', lineHeight: 1.6 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
