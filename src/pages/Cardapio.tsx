import { useState } from "react";
import { store } from "@/data/store";

export default function Cardapio() {
  const [meal, setMeal] = useState<'almoco' | 'lanche'>('almoco');
  const items = store.cardapio[meal];

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🍽️</div>
        <div className="sec-title">
          <h2>Cardápio Escolar</h2>
          <p>Alimentação saudável para toda a comunidade</p>
        </div>
      </div>

      <div className="tab-row">
        <button className={`p-tab ${meal === 'almoco' ? 'active' : ''}`} onClick={() => setMeal('almoco')}>🍽️ Almoço</button>
        <button className={`p-tab ${meal === 'lanche' ? 'active' : ''}`} onClick={() => setMeal('lanche')}>🥪 Lanche</button>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {items.map((item, i) => (
          <div key={i} className="food-day">
            <div className="food-day-header">
              <span>{item.dia}</span>
              <span className="p-badge p-badge-gold" style={{ fontSize: '.7rem' }}>
                {item.nut.split('·')[0].trim()}
              </span>
            </div>
            <div className="food-day-body">
              <div className="food-item">
                <span className="food-item-icon">🍲</span>
                <strong style={{ fontSize: '.87rem', color: 'var(--navy)' }}>{item.prato}</strong>
              </div>
              {item.acomp.split(',').map((a, j) => (
                <div key={j} className="food-item">
                  <span className="food-item-icon">✦</span>
                  <span>{a.trim()}</span>
                </div>
              ))}
              <div style={{ marginTop: '.6rem', fontSize: '.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <span>📊</span>{item.nut}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />
      <div className="p-alert p-alert-green">
        <span>🌿</span>
        <div>
          <strong>Alimentação saudável:</strong> Todos os cardápios são elaborados por nutricionistas credenciados pela SEDUC-PB e seguem as normas do PNAE (Programa Nacional de Alimentação Escolar).
        </div>
      </div>
    </div>
  );
}
