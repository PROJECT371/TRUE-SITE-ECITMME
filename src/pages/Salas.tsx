import { useEffect, useState } from "react";
import { CURSOS, ANOS, TURMAS, salaId } from "@/data/store";
import { listarAvisosSalas, criarAvisoSala, uploadMaterialSala, removerAvisoSala, type AvisoSalaDB } from "@/lib/dados";
import type { Perfil } from "@/lib/auth";

interface Props {
  perfil: Perfil | null;
}

export default function Salas({ perfil }: Props) {
  const [avisos, setAvisos] = useState<AvisoSalaDB[]>([]);
  const [loading, setLoading] = useState(true);

  // Painel do professor
  const [pfCurso, setPfCurso] = useState(CURSOS[0].slug);
  const [pfAno, setPfAno] = useState(ANOS[0]);
  const [pfTurma, setPfTurma] = useState(TURMAS[0]);
  const [pfTipo, setPfTipo] = useState<'aviso' | 'pdf' | 'video'>('aviso');
  const [pfTexto, setPfTexto] = useState('');
  const [pfUrl, setPfUrl] = useState('');
  const [pfArquivo, setPfArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState('');

  const ehProfessor = perfil?.role === 'professor';

  async function carregar() {
    const lista = await listarAvisosSalas();
    setAvisos(lista);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function avisosDaSala(id: string) {
    return avisos.filter(a => a.sala_id === id);
  }

  async function publicar() {
    if (!perfil) return;
    if (!pfTexto) { setMsg('⚠️ Escreva um título/texto'); return; }
    if (pfTipo !== 'aviso' && !pfUrl && !pfArquivo) { setMsg('⚠️ Cole um link ou selecione um arquivo'); return; }
    setEnviando(true);
    setMsg('');
    try {
      const id = salaId(pfCurso, pfAno, pfTurma);
      let url = pfUrl;
      if (pfTipo === 'pdf' && pfArquivo) {
        url = await uploadMaterialSala(id, pfArquivo);
      }
      await criarAvisoSala(id, pfTexto, {
        tipo: pfTipo,
        url: pfTipo === 'aviso' ? undefined : url,
        professorId: perfil.id,
        professorNome: perfil.nome,
      });
      await carregar();
      setPfTexto(''); setPfUrl(''); setPfArquivo(null);
      setMsg('✅ Publicado com sucesso!');
    } catch {
      setMsg('❌ Não foi possível publicar.');
    } finally {
      setEnviando(false);
    }
  }

  async function excluir(id: string) {
    if (!window.confirm('Remover esta publicação?')) return;
    try {
      await removerAvisoSala(id);
      await carregar();
    } catch {
      setMsg('❌ Não foi possível remover.');
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">🏫</div>
        <div className="sec-title">
          <h2>Salas</h2>
          <p>Avisos e materiais organizados por curso, ano e turma</p>
        </div>
      </div>

      {ehProfessor && (
        <div className="p-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--gold)' }}>
          <div className="p-card-header">
            <div className="p-card-icon gold">🗝️</div>
            <div>
              <div className="p-card-title">Painel do Professor</div>
              <div className="p-card-sub">Publicar aviso ou material para uma turma</div>
            </div>
          </div>
          <div className="p-card-body">
            <div className="grid-3">
              <div className="form-group"><label>Curso</label>
                <select value={pfCurso} onChange={e => setPfCurso(e.target.value)}>
                  {CURSOS.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Ano</label>
                <select value={pfAno} onChange={e => setPfAno(Number(e.target.value))}>
                  {ANOS.map(a => <option key={a} value={a}>{a}º Ano</option>)}
                </select>
              </div>
              <div className="form-group"><label>Turma</label>
                <select value={pfTurma} onChange={e => setPfTurma(e.target.value)}>
                  {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select value={pfTipo} onChange={e => setPfTipo(e.target.value as 'aviso' | 'pdf' | 'video')}>
                <option value="aviso">🔔 Aviso (texto)</option>
                <option value="pdf">📄 Material em PDF</option>
                <option value="video">🎬 Link de vídeo-aula</option>
              </select>
            </div>
            <div className="form-group">
              <label>{pfTipo === 'aviso' ? 'Aviso' : 'Título'}</label>
              <textarea
                placeholder={pfTipo === 'aviso' ? 'Escreva o aviso para esta turma...' : 'Ex: Resumo do bimestre'}
                value={pfTexto}
                onChange={e => setPfTexto(e.target.value)}
              />
            </div>
            {pfTipo === 'video' && (
              <div className="form-group">
                <label>Link do vídeo</label>
                <input type="text" placeholder="https://..." value={pfUrl} onChange={e => setPfUrl(e.target.value)} />
              </div>
            )}
            {pfTipo === 'pdf' && (
              <div className="form-group">
                <label>Arquivo PDF</label>
                <input type="file" accept="application/pdf" onChange={e => setPfArquivo(e.target.files?.[0] || null)} />
              </div>
            )}
            {msg && <p style={{ fontSize: '.82rem', color: msg.startsWith('✅') ? '#2e7d52' : '#dc2626', marginBottom: '.6rem' }}>{msg}</p>}
            <button className="p-btn p-btn-gold" disabled={enviando} onClick={publicar}>
              {enviando ? 'Publicando...' : '+ Publicar para a turma'}
            </button>
          </div>
        </div>
      )}

      {loading && <p style={{ color: '#9ca3af' }}>Carregando avisos...</p>}

      {!loading && CURSOS.map(curso => (
        <div key={curso.slug} className="p-card" style={{ marginBottom: '1.5rem' }}>
          <div className="p-card-header">
            <div className="p-card-icon teal">📘</div>
            <div className="p-card-title">{curso.nome}</div>
          </div>
          <div className="p-card-body">
            <div className="grid-3">
              {ANOS.flatMap(ano => TURMAS.map(turma => {
                const id = salaId(curso.slug, ano, turma);
                const lista = avisosDaSala(id);
                return (
                  <div key={id} className="content-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="content-title" style={{ marginBottom: '.5rem' }}>{ano}º Ano {turma}</div>
                    {lista.length === 0 ? (
                      <div style={{ fontSize: '.78rem', color: '#9ca3af' }}>Nenhum aviso</div>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
                        {lista.map((a, i) => (
                          <li key={a.id} style={{ fontSize: '.8rem', color: '#4b5563', padding: '.4rem 0', borderTop: i > 0 ? '1px dashed var(--p-border)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                              <span>{a.tipo === 'pdf' ? '📄' : a.tipo === 'video' ? '🎬' : '🔔'}</span>
                              {a.url ? (
                                <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', textDecoration: 'underline', flex: 1 }}>
                                  {a.texto}
                                </a>
                              ) : (
                                <span style={{ flex: 1 }}>{a.texto}</span>
                              )}
                              {perfil?.id === a.professor_id && (
                                <button
                                  onClick={() => excluir(a.id)}
                                  style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '.75rem', flexShrink: 0 }}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                            {a.professor_nome && (
                              <div style={{ fontSize: '.68rem', color: '#9ca3af', marginTop: '.15rem' }}>— {a.professor_nome}</div>
                            )}
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
