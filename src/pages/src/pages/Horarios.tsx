import { useEffect, useState } from "react";
import { CURSOS, ANOS, TURMAS, salaId } from "@/data/store";
import { listarHorarios, type HorarioDB } from "@/lib/dados";

const DIAS: Array<HorarioDB['dia']> = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const DIA_NOME: Record<string, string> = {
  Seg: 'Segunda-feira', Ter: 'Terça-feira', Qua: 'Quarta-feira', Qui: 'Quinta-feira', Sex: 'Sexta-feira',
};

export default function Horarios() {
  const [curso, setCurso] = useState(CURSOS[0].slug);
  const [ano, setAno] = useState(ANOS[0]);
  const [turma, setTurma] = useState(TURMAS[0]);
  const [horarios, setHorarios] = useState<HorarioDB[]>([]);
  const [loading, setLoading] = useState(true);

  const turmaId = salaId(curso, ano, turma);

  useEffect(() => {
    setLoading(true);
    listarHorarios(turmaId).then(lista => {
      setHorarios(lista);
      setLoading(false);
    });
  }, [turmaId]);

  function porDia(dia: string) {
    return horarios.filter(h => h.dia === dia);
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🗓️</div>
        <div className="sec-title">
          <h2>Horários de Aula</h2>
          <p>Grade semanal por curso, ano e turma</p>
        </div>
      </div>

      <div className="p-card" style={{ marginBottom: '1.5rem' }}>
        <div className="p-card-body">
          <div className="grid-3">
            <div className="form-group"><label>Curso</label>
              <select value={curso} onChange={e => setCurso(e.target.value)}>
                {CURSOS.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Ano</label>
              <select value={ano} onChange={e => setAno(Number(e.target.value))}>
                {ANOS.map(a => <option key={a} value={a}>{a}º Ano</option>)}
              </select>
            </div>
            <div className="form-group"><label>Turma</label>
              <select value={turma} onChange={e => setTurma(e.target.value)}>
                {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Carregando horário...</p>
      ) : horarios.length === 0 ? (
        <div className="empty"><div className="empty-icon">🗓️</div><p>Nenhum horário cadastrado para essa turma ainda.</p></div>
      ) : (
        <div className="grid-2">
          {DIAS.map(dia => {
            const lista = porDia(dia);
            if (lista.length === 0) return null;
            return (
              <div key={dia} className="p-card">
                <div className="p-card-header">
                  <div className="p-card-icon navy">📅</div>
                  <div className="p-card-title">{DIA_NOME[dia]}</div>
                </div>
                <div className="p-card-body">
                  {lista.map(h => (
                    <div key={h.id} style={{ padding: '.5rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem' }}>
                        <strong style={{ fontSize: '.85rem', color: 'var(--navy)' }}>{h.disciplina}</strong>
                        <span style={{ fontSize: '.75rem', color: '#9ca3af', flexShrink: 0 }}>{h.horario}</span>
                      </div>
                      <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                        {h.sala}{h.professor ? ` · ${h.professor}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
