import { useState } from "react";
import { clubes } from "@/data/store";

export default function Clubes() {
  const [joined, setJoined] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setJoined(prev => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🎭</div>
        <div className="sec-title">
          <h2>Clubes e Grêmio</h2>
          <p>Atividades extracurriculares da escola</p>
        </div>
      </div>

      <div className="grid-2">
        {clubes.map((c, i) => (
          <div key={i} className="p-card">
            <div className="p-card-header">
              <div className="p-card-icon navy">🎭</div>
              <div>
                <div className="p-card-title">{c.nome}</div>
                <div className="p-card-sub">{c.professor} · {c.horario}</div>
              </div>
            </div>
            <div className="p-card-body">
              <p style={{ fontSize: '.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                {c.integrantes} integrantes
              </p>
              <button
                className={`p-btn ${joined[i] ? 'p-btn-outline' : 'p-btn-primary'}`}
                style={{ width: '100%' }}
                onClick={() => toggle(i)}
              >
                {joined[i] ? '✓ Participando' : 'Entrar no clube'}
              </button>
            </div>
          </div>
        ))}
        {clubes.length === 0 && (
          <div className="empty"><div className="empty-icon">🎭</div><p>Nenhum clube cadastrado</p></div>
        )}
      </div>
    </div>
  );
}
