import { useState } from "react";
import { store, fmtDate, solicitacoes, addSolicitacao } from "@/data/store";

interface Props {
  onToast: (msg: string) => void;
}

export default function Secretaria({ onToast }: Props) {
  const [cat, setCat] = useState('comunicados');
  const [, forceUpdate] = useState(0);

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

  function statusPill(status: string) {
    const map: Record<string, [string, string]> = {
      'em análise': ['#c9993a', 'Em análise'],
      'aprovado': ['#1e6fa0', 'Aprovado'],
      'finalizado': ['#2e7d52', 'Finalizado'],
    };
    const [color, label] = map[status] || map['em análise'];
    return <span className="p-badge" style={{ background: `${color}1A`, color }}>{label}</span>;
  }

  function solicitar(tipo: string) {
    addSolicitacao(tipo);
    forceUpdate(n => n + 1);
    onToast(`✅ Solicitação de "${tipo}" enviada!`);
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">📢</div>
        <div className="sec-title">
          <h2>Secretaria Escolar</h2>
          <p>Solicite documentos, acompanhe o status e veja os comunicados</p>
        </div>
      </div>

      {/* Nova solicitação */}
      <div className="p-card" style={{ marginBottom: '1.5rem' }}>
        <div className="p-card-header">
          <div className="p-card-icon gold">📝</div>
          <div className="p-card-title">Solicitar documento</div>
        </div>
        <div className="p-card-body">
          <div className="grid-2">
            {['Declaração escolar', 'Comprovante de matrícula', 'Histórico escolar', 'Boletim'].map(tp => (
              <button key={tp} className="p-btn p-btn-outline" style={{ width: '100%' }} onClick={() => solicitar(tp)}>
                + {tp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Minhas solicitações */}
      <div className="p-card" style={{ marginBottom: '1.5rem' }}>
        <div className="p-card-header">
          <div className="p-card-icon navy">📋</div>
          <div className="p-card-title">Minhas solicitações</div>
        </div>
        <div className="p-card-body">
          {solicitacoes.length === 0 ? (
            <div className="empty"><div className="empty-icon">📭</div><p>Nenhuma solicitação ainda</p></div>
          ) : solicitacoes.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px dashed var(--p-border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{s.tipo}</div>
                <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>Solicitado em {s.data}</div>
              </div>
              {statusPill(s.status)}
            </div>
          ))}
        </div>
      </div>

      {/* Avisos e comunicados */}
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
