import { useState, useEffect } from "react";
import { store, fmtDate, turmaNome } from "@/data/store";

type Section = string;

interface Props {
  onNavigate: (s: Section) => void;
}

export default function Inicio({ onNavigate }: Props) {
  const today = new Date();
  const dayNames = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const todayName = dayNames[today.getDay()];

  const upcoming = store.provas
    .filter(p => new Date(p.data) >= today)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0];
  const lastAviso = store.avisos[0];
  const todayMenu = store.cardapio.almoco.find(c => c.dia === todayName) || store.cardapio.almoco[0];
  const nextGame = store.interclasse.jogos.find(j => new Date(j.data) >= today) || store.interclasse.jogos[0];
  const upcoming3 = store.provas
    .filter(p => new Date(p.data) >= today)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  return (
    <div className="animate-fade-up">
      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">847</div><div className="stat-label">Alunos Matriculados</div></div>
        <div className="stat-card"><div className="stat-num">62</div><div className="stat-label">Professores</div></div>
        <div className="stat-card"><div className="stat-num">28</div><div className="stat-label">Turmas Ativas</div></div>
        <div className="stat-card"><div className="stat-num">6</div><div className="stat-label">Times no Interclasse</div></div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.2rem' }}>
        ⭐ Painel de Destaques
      </h2>

      {/* Highlights */}
      <div className="highlight-grid">
        <div className="highlight-card hc-gold">
          <div className="hc-label">📋 Próxima Prova</div>
          <div className="hc-value">{upcoming ? upcoming.disc : 'Sem provas agendadas'}</div>
          <div className="hc-sub">{upcoming ? `${turmaNome(upcoming.turma)} · ${fmtDate(upcoming.data)}` : '–'}</div>
        </div>
        <div className="highlight-card hc-navy">
          <div className="hc-label">🔔 Último Aviso</div>
          <div className="hc-value">{lastAviso ? lastAviso.titulo : 'Sem avisos'}</div>
          <div className="hc-sub">{lastAviso ? fmtDate(lastAviso.data) : '–'}</div>
        </div>
        <div className="highlight-card hc-green">
          <div className="hc-label">🍽️ Cardápio Hoje ({todayName})</div>
          <div className="hc-value">{todayMenu.prato}</div>
          <div className="hc-sub">{todayMenu.acomp.split(',').slice(0, 2).join(', ')}</div>
        </div>
        <div className="highlight-card hc-teal">
          <div className="hc-label">🏆 Próximo Jogo</div>
          <div className="hc-value">{nextGame ? `${nextGame.a} × ${nextGame.b}` : '–'}</div>
          <div className="hc-sub">{nextGame ? `${fmtDate(nextGame.data)} · ${nextGame.hora} · ${nextGame.mod}` : '–'}</div>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid-2">
        {/* Provas */}
        <div className="p-card">
          <div className="p-card-header">
            <div className="p-card-icon gold">📅</div>
            <div>
              <div className="p-card-title">Próximas Avaliações</div>
              <div className="p-card-sub">Esta semana</div>
            </div>
          </div>
          <div className="p-card-body">
            {upcoming3.length === 0 ? (
              <div className="empty"><div className="empty-icon">✅</div><p>Nenhuma prova próxima</p></div>
            ) : upcoming3.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.55rem 0', borderBottom: i < upcoming3.length - 1 ? '1px solid var(--p-border)' : 'none' }}>
                <span className="p-badge p-badge-gold">{fmtDate(p.data)}</span>
                <span style={{ fontSize: '.87rem', fontWeight: 600, color: 'var(--navy)' }}>{p.disc}</span>
                <span style={{ fontSize: '.76rem', color: '#9ca3af', marginLeft: 'auto' }}>{turmaNome(p.turma).replace('º Ano','ºAno')}</span>
              </div>
            ))}
          </div>
          <div className="p-card-footer">
            <button className="p-btn p-btn-primary p-btn-sm" onClick={() => onNavigate('provas')}>
              → Ver todas
            </button>
          </div>
        </div>

        {/* Avisos */}
        <div className="p-card">
          <div className="p-card-header">
            <div className="p-card-icon navy">🔔</div>
            <div>
              <div className="p-card-title">Avisos da Secretaria</div>
              <div className="p-card-sub">Comunicados recentes</div>
            </div>
          </div>
          <div className="p-card-body">
            {store.avisos.slice(0, 3).map((a, i) => (
              <div key={i} style={{ padding: '.6rem 0', borderBottom: i < 2 ? '1px solid var(--p-border)' : 'none' }}>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginBottom: '.2rem' }}>
                  <span className={`p-badge ${a.prioridade === 'urgente' ? 'p-badge-red' : a.prioridade === 'info' ? 'p-badge-teal' : 'p-badge-navy'}`}>{a.prioridade}</span>
                  <strong style={{ fontSize: '.87rem', color: 'var(--navy)' }}>{a.titulo}</strong>
                </div>
                <p style={{ fontSize: '.78rem', color: '#6b7280' }}>{a.desc.substring(0, 80)}…</p>
              </div>
            ))}
          </div>
          <div className="p-card-footer">
            <button className="p-btn p-btn-primary p-btn-sm" onClick={() => onNavigate('secretaria')}>
              → Ver todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
