import { useEffect, useState } from "react";
import { listarFotos, type FotoDB } from "@/lib/dados";

export default function Galeria() {
  const [fotos, setFotos] = useState<FotoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecionada, setSelecionada] = useState<FotoDB | null>(null);

  useEffect(() => {
    listarFotos().then(lista => {
      setFotos(lista);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🖼️</div>
        <div className="sec-title">
          <h2>Galeria de Fotos</h2>
          <p>Momentos dos eventos e atividades da escola</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Carregando fotos...</p>
      ) : fotos.length === 0 ? (
        <div className="empty"><div className="empty-icon">🖼️</div><p>Nenhuma foto publicada ainda</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '.8rem' }}>
          {fotos.map(f => (
            <div
              key={f.id}
              onClick={() => setSelecionada(f)}
              style={{
                cursor: 'pointer', borderRadius: '10px', overflow: 'hidden',
                aspectRatio: '1', background: '#e5e9f5', position: 'relative',
              }}
            >
              <img src={f.url} alt={f.legenda || 'Foto da escola'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      )}

      {selecionada && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setSelecionada(null); }}
        >
          <div className="modal" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{selecionada.legenda || 'Foto'}</h3>
              <button className="modal-close" onClick={() => setSelecionada(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <img src={selecionada.url} alt={selecionada.legenda || 'Foto da escola'} style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
