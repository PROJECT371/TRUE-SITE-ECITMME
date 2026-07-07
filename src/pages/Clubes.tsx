import { useEffect, useState } from "react";
import { listarClubes, type ClubeDB } from "@/lib/dados";

export default function Clubes() {
  const [clubes, setClubes] = useState<ClubeDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  useEffect(() => {
    listarClubes().then(lista => {
      setClubes(lista);
      setLoading(false);
    });
  }, []);

  function toggle(id: string) {
    setJoined(prev => ({ ...prev, [id]: !prev[id] }));
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

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Carregando clubes...</p>
      ) : (
        <div className="grid-2">
          {clubes.map(c => (
            <div key={c.id} className="p-card">
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
                  className={`p-btn ${joined[c.id] ? 'p-btn-outline' : 'p-btn-primary'}`}
                  style={{ width: '100%' }}
                  onClick={() => toggle(c.id)}
                >
                  {joined[c.id] ? '✓ Participando' : 'Entrar no clube'}
                </button>
              </div>
            </div>
          ))}
          {clubes.length === 0 && (
            <div className="empty"><div className="empty-icon">🎭</div><p>Nenhum clube cadastrado</p></div>
          )}
        </div>
      )}
    </div>
  );
}
