import { useEffect, useState } from "react";
import { disciplinas, type Disciplina } from "@/data/store";
import { listarMateriais, adicionarVideo, adicionarPdf, removerMaterial, type Material } from "@/lib/materiais";
import type { Perfil } from "@/lib/auth";

interface Props {
  perfil: Perfil | null;
  onToast: (msg: string) => void;
}

const CATEGORIAS: Array<{ id: Disciplina['categoria']; label: string; icon: string }> = [
  { id: 'comum', label: 'Base Comum', icon: '📗' },
  { id: 'tecnica', label: 'Base Técnica', icon: '💻' },
  { id: 'diversificada', label: 'Parte Diversificada', icon: '🧩' },
];

export default function Disciplinas({ perfil, onToast }: Props) {
  const [materiais, setMateriais] = useState<Record<string, Material[]>>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const [tipoNovo, setTipoNovo] = useState<'pdf' | 'video'>('video');
  const [tituloNovo, setTituloNovo] = useState('');
  const [urlNovo, setUrlNovo] = useState('');
  const [arquivoNovo, setArquivoNovo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    disciplinas.forEach(d => {
      listarMateriais(d.nome).then(lista => {
        setMateriais(prev => ({ ...prev, [d.nome]: lista }));
      });
    });
  }, []);

  async function enviarMaterial(nomeDisciplina: string) {
    if (!perfil) return;
    if (!tituloNovo) { onToast('⚠️ Dê um título ao material'); return; }
    setEnviando(true);
    try {
      if (tipoNovo === 'video') {
        if (!urlNovo) { onToast('⚠️ Cole o link do vídeo'); setEnviando(false); return; }
        await adicionarVideo(nomeDisciplina, tituloNovo, urlNovo, perfil.id);
      } else {
        if (!arquivoNovo) { onToast('⚠️ Selecione um arquivo PDF'); setEnviando(false); return; }
        await adicionarPdf(nomeDisciplina, tituloNovo, arquivoNovo, perfil.id);
      }
      const lista = await listarMateriais(nomeDisciplina);
      setMateriais(prev => ({ ...prev, [nomeDisciplina]: lista }));
      setTituloNovo(''); setUrlNovo(''); setArquivoNovo(null);
      onToast('✅ Material adicionado!');
    } catch (e: any) {
      onToast('❌ ' + (e?.message || 'Não foi possível enviar o material.'));
    } finally {
      setEnviando(false);
    }
  }

  async function excluirMaterial(nomeDisciplina: string, id: string) {
    if (!window.confirm('Remover este material?')) return;
    try {
      await removerMaterial(id);
      const lista = await listarMateriais(nomeDisciplina);
      setMateriais(prev => ({ ...prev, [nomeDisciplina]: lista }));
      onToast('🗑️ Material removido.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  function renderCard(d: Disciplina) {
    const lista = materiais[d.nome] || [];
    const souDono = perfil?.disciplina === d.nome;

    return (
      <div key={d.nome} className="p-card">
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
          {d.conteudo.length > 0 && (
            <>
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
            </>
          )}
          {d.atividades.length > 0 && (
            <>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.5rem' }}>
                Atividades
              </div>
              <div style={{ marginBottom: '1rem' }}>
                {d.atividades.map((a, j) => (
                  <span key={j} className="p-badge p-badge-gold" style={{ marginRight: '.35rem', marginBottom: '.35rem', display: 'inline-block' }}>
                    {a}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Materiais: PDFs e vídeo-aulas */}
          <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.5rem', borderTop: '1px dashed var(--p-border)', paddingTop: '.8rem' }}>
            Materiais de apoio
          </div>
          {lista.length === 0 ? (
            <p style={{ fontSize: '.8rem', color: '#9ca3af', marginBottom: souDono ? '.8rem' : 0 }}>Nenhum material adicionado ainda.</p>
          ) : (
            <div style={{ marginBottom: souDono ? '.8rem' : 0 }}>
              {lista.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.4rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                  <span>{m.tipo === 'pdf' ? '📄' : '🎬'}</span>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 0, fontSize: '.85rem', color: 'var(--navy)', textDecoration: 'underline' }}>
                    {m.titulo}
                  </a>
                  {perfil?.id === m.professor_id && (
                    <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => excluirMaterial(d.nome, m.id)}>
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {souDono && (
            <div>
              {aberto === d.nome ? (
                <div style={{ background: 'rgba(26,35,64,.03)', borderRadius: '10px', padding: '.8rem' }}>
                  <div className="form-group">
                    <label>Tipo de material</label>
                    <select value={tipoNovo} onChange={e => setTipoNovo(e.target.value as 'pdf' | 'video')}>
                      <option value="video">🎬 Link de vídeo-aula</option>
                      <option value="pdf">📄 Arquivo PDF</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" placeholder="Ex: Resumo do bimestre" value={tituloNovo} onChange={e => setTituloNovo(e.target.value)} />
                  </div>
                  {tipoNovo === 'video' ? (
                    <div className="form-group">
                      <label>Link do vídeo (YouTube, etc.)</label>
                      <input type="text" placeholder="https://..." value={urlNovo} onChange={e => setUrlNovo(e.target.value)} />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Arquivo PDF</label>
                      <input type="file" accept="application/pdf" onChange={e => setArquivoNovo(e.target.files?.[0] || null)} />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="p-btn p-btn-outline" style={{ flex: 1 }} onClick={() => setAberto(null)}>Cancelar</button>
                    <button className="p-btn p-btn-gold" style={{ flex: 1 }} disabled={enviando} onClick={() => enviarMaterial(d.nome)}>
                      {enviando ? 'Enviando...' : '+ Adicionar'}
                    </button>
                  </div>
                </div>
              ) : (
                <button className="p-btn p-btn-outline" style={{ width: '100%' }} onClick={() => setAberto(d.nome)}>
                  + Adicionar material
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">📘</div>
        <div className="sec-title">
          <h2>Disciplinas</h2>
          <p>Professores, horários, conteúdos e materiais de apoio</p>
        </div>
      </div>

      {CATEGORIAS.map(cat => {
        const itens = disciplinas.filter(d => d.categoria === cat.id);
        if (itens.length === 0) return null;
        return (
          <div key={cat.id} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-h)', fontSize: '1.15rem', color: 'var(--navy)' }}>{cat.label}</h3>
            </div>
            <div className="grid-2">
              {itens.map(d => renderCard(d))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
