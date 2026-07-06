import { CURSOS, ANOS, TURMAS, salaId, avisosSalas } from "@/data/store";

export default function Salas() {
  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🏫</div>
        <div className="sec-title">
          <h2>Salas</h2>
          <p>Avisos organizados por curso, ano e turma</p>
        </div>
      </div>

      {CURSOS.map(curso => (
        <div key={curso.slug} className="p-card" style={{ marginBottom: '1.5rem' }}>
          <div className="p-card-header">
            <div className="p-card-icon teal">📘</div>
            <div className="p-card-title">{curso.nome}</div>
          </div>
          <div className="p-card-body">
            <div className="grid-3">
              {ANOS.flatMap(ano => TURMAS.map(turma => {
                const id = salaId(curso.slug, ano, turma);
                const avisos = avisosSalas[id] || [];
                return (
                  <div key={id} className="content-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="content-title" style={{ marginBottom: '.5rem' }}>{ano}º Ano {turma}</div>
                    {avisos.length === 0 ? (
                      <div style={{ fontSize: '.78rem', color: '#9ca3af' }}>Nenhum aviso</div>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
                        {avisos.map((a, i) => (
                          <li key={i} style={{ fontSize: '.8rem', color: '#4b5563', padding: '.3rem 0', borderTop: i > 0 ? '1px dashed var(--p-border)' : 'none' }}>
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
