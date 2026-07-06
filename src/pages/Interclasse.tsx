import { useState } from "react";
import { store, fmtDate } from "@/data/store";

export default function Interclasse() {
  const [tab, setTab] = useState('classificacao');

  const posClass = (i: number) => i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : 'pN';

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🏆</div>
        <div className="sec-title">
          <h2>Interclasse 2025</h2>
          <p>Calendário, tabelas e resultados</p>
        </div>
      </div>

      <div className="tab-row">
        <button className={`p-tab ${tab === 'classificacao' ? 'active' : ''}`} onClick={() => setTab('classificacao')}>🏆 Classificação</button>
        <button className={`p-tab ${tab === 'jogos' ? 'active' : ''}`} onClick={() => setTab('jogos')}>📅 Jogos</button>
        <button className={`p-tab ${tab === 'atletas' ? 'active' : ''}`} onClick={() => setTab('atletas')}>⭐ Atletas</button>
      </div>

      {tab === 'classificacao' && (
        <div>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="p-card">
              <div className="p-card-header">
                <div className="p-card-icon gold">🏆</div>
                <div><div className="p-card-title">Tabela de Classificação</div><div className="p-card-sub">Futsal · 2025</div></div>
              </div>
              <div>
                {store.interclasse.times.map((t, i) => (
                  <div key={i} className="rank-item">
                    <div className={`rank-pos ${posClass(i)}`}>{i + 1}</div>
                    <div className="rank-team">{t.nome}</div>
                    <div style={{ display: 'flex', gap: '.8rem', fontSize: '.78rem', color: '#6b7280' }}>
                      <span>{t.v}V</span><span>{t.e}E</span><span>{t.d}D</span>
                    </div>
                    <div className="rank-pts">{t.pts}pts</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-card">
              <div className="p-card-header">
                <div className="p-card-icon teal">📊</div>
                <div><div className="p-card-title">Desempenho de Gols</div><div className="p-card-sub">Gols marcados por time</div></div>
              </div>
              <div className="p-card-body">
                {store.interclasse.times.map((t, i) => (
                  <div key={i} style={{ marginBottom: '.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', marginBottom: '.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{t.nome}</span>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{t.gf} gols</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(t.gf / 20) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'jogos' && (
        <div className="table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Time A</th><th>×</th><th>Time B</th><th>Data</th><th>Hora</th><th>Modalidade</th><th>Local</th>
              </tr>
            </thead>
            <tbody>
              {store.interclasse.jogos.map((j, i) => (
                <tr key={i}>
                  <td><strong>{j.a}</strong></td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-h)', color: 'var(--gold)', fontWeight: 700 }}>×</td>
                  <td><strong>{j.b}</strong></td>
                  <td>{fmtDate(j.data)}</td>
                  <td>{j.hora}</td>
                  <td><span className="p-badge p-badge-teal">{j.mod}</span></td>
                  <td style={{ color: '#6b7280', fontSize: '.82rem' }}>{j.local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'atletas' && (
        <div className="grid-4">
          {store.interclasse.atletas.map((a, i) => (
            <div key={i} className="athlete-card">
              <div className="athlete-avatar">{a.ini}</div>
              <div className="athlete-name">{a.nome}</div>
              <div className="athlete-sport">{a.turma} · {a.esporte}</div>
              <div className="athlete-stat"><strong>{a.stat}</strong></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
