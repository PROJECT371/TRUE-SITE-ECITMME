import { disciplinas } from "@/data/store";

export default function Disciplinas() {
  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">📘</div>
        <div className="sec-title">
          <h2>Disciplinas</h2>
          <p>Professores, horários, conteúdos e atividades</p>
        </div>
      </div>

      <div className="grid-2">
        {disciplinas.map((d, i) => (
          <div key={i} className="p-card">
            <div className="p-card-header">
              <div className="p-card-icon" style={{ background: `${d.cor}1A`, color: d.cor }}>
                {d.nome.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="p-card-title">{d.nome}</div>
                <div className="p-card-sub">{d.professor} · {d.horario}</div>
              </div>
            </div>
            <div className="p-card-body">
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.5rem' }}>
                Conteúdo
              </div>
              <div style={{ marginBottom: '1rem' }}>
                {d.conteudo.map((c, j) => (
                  <span key={j} className="p-badge p-badge-navy" style={{ marginRight: '.35rem', marginBottom: '.35rem', display: 'inline-block' }}>
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.5rem' }}>
                Atividades
              </div>
              <div>
                {d.atividades.map((a, j) => (
                  <span key={j} className="p-badge p-badge-gold" style={{ marginRight: '.35rem', marginBottom: '.35rem', display: 'inline-block' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {disciplinas.length === 0 && (
          <div className="empty"><div className="empty-icon">📘</div><p>Nenhuma disciplina cadastrada</p></div>
        )}
      </div>
    </div>
  );
}
