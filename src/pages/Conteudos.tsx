import { useState } from "react";
import { store } from "@/data/store";

const dotColors = ['#c9993a','#1e6fa0','#2e7d52','#7c3aed','#dc2626','#e8b84b'];

export default function Conteudos() {
  const [serie, setSerie] = useState('1a');
  const list = store.conteudos.filter(c => c.serie === serie);

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">📖</div>
        <div className="sec-title">
          <h2>Assuntos do Bimestre</h2>
          <p>Conteúdos organizados por série e disciplina</p>
        </div>
      </div>

      <div className="tab-row">
        {[['1a','1º Ano'],['2a','2º Ano'],['3a','3º Ano']].map(([v, l]) => (
          <button key={v} className={`p-tab ${serie === v ? 'active' : ''}`} onClick={() => setSerie(v)}>{l}</button>
        ))}
      </div>

      <div>
        {list.map((c, i) => (
          <div key={i} className="content-item">
            <div className="content-dot" style={{ background: dotColors[i % dotColors.length] }} />
            <div className="content-info">
              <div className="content-title">{c.disc}</div>
              <div className="content-meta">{c.prof} · {c.bim}</div>
              <div style={{ marginTop: '.4rem', fontSize: '.82rem', color: '#4b5563' }}>
                {c.conteudo.split(',').map((item, j) => (
                  <span key={j} className="p-badge p-badge-navy" style={{ marginRight: '.3rem', marginBottom: '.3rem' }}>
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>Nenhum conteúdo cadastrado para esta série</p>
          </div>
        )}
      </div>
    </div>
  );
}
