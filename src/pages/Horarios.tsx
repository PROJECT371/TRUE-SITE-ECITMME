import { useEffect, useState } from "react";
import { buscarHorarioAtual, type HorarioPdfDB } from "@/lib/dados";

export default function Horarios() {
  const [pdf, setPdf] = useState<HorarioPdfDB | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarHorarioAtual().then(p => {
      setPdf(p);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🗓️</div>
        <div className="sec-title">
          <h2>Horários de Aula</h2>
          <p>Grade semanal de todas as turmas</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Carregando horário...</p>
      ) : !pdf ? (
        <div className="empty">
          <div className="empty-icon">🗓️</div>
          <p>O horário ainda não foi publicado. Volte em breve!</p>
        </div>
      ) : (
        <div className="p-card">
          <div className="p-card-header">
            <div className="p-card-icon navy">📄</div>
            <div>
              <div className="p-card-title">{pdf.nome_arquivo}</div>
              <div className="p-card-sub">Horário atual da escola</div>
            </div>
          </div>
          <div className="p-card-body">
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-btn p-btn-primary"
              style={{ width: '100%', display: 'inline-block', textAlign: 'center', marginBottom: '1.2rem' }}
            >
              📥 Baixar / Abrir PDF
            </a>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--p-border)' }}>
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(pdf.url)}&embedded=true`}
                title="Horário de aulas"
                style={{ width: '100%', height: '75vh', border: 'none', display: 'block' }}
              />
            </div>
            <p style={{ fontSize: '.78rem', color: '#9ca3af', marginTop: '.6rem' }}>
              Se a visualização demorar a carregar, aguarde alguns segundos ou use o botão de baixar acima.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
