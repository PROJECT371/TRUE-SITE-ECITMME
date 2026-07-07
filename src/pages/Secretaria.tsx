import { useEffect, useState } from "react";
import {
  listarAvisos, criarAviso, type AvisoDB,
  listarSolicitacoes, criarSolicitacao, atualizarStatusSolicitacao, removerSolicitacao, type SolicitacaoDB,
} from "@/lib/dados";
import type { Perfil } from "@/lib/auth";

interface Props {
  perfil: Perfil | null;
  onToast: (msg: string) => void;
}

export default function Secretaria({ perfil, onToast }: Props) {
  const [avisos, setAvisos] = useState<AvisoDB[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('comunicados');

  // Painel do secretário: novo aviso
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaCat, setNovaCat] = useState('comunicados');
  const [novaDesc, setNovaDesc] = useState('');
  const [novaPrio, setNovaPrio] = useState('normal');
  const [enviando, setEnviando] = useState(false);

  const ehPedagogico = perfil?.role === 'secretario_pedagogico';
  const ehAdministrativo = perfil?.role === 'secretario_administrativo';
  const podePostar = ehPedagogico || ehAdministrativo;

  const catsPermitidas = ehAdministrativo
    ? [{ id: 'matricula', label: 'Matrícula' }, { id: 'documentos', label: 'Documentos' }]
    : [
        { id: 'comunicados', label: 'Comunicados' },
        { id: 'matricula', label: 'Matrícula' },
        { id: 'documentos', label: 'Documentos' },
        { id: 'pais', label: 'Para Pais' },
      ];

  async function carregar() {
    const [av, sol] = await Promise.all([listarAvisos(), listarSolicitacoes()]);
    setAvisos(av);
    setSolicitacoes(sol);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  const cats = [
    { id: 'comunicados', label: 'Comunicados' },
    { id: 'matricula', label: 'Matrícula' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'pais', label: 'Para Pais' },
  ];

  const filtered = avisos.filter(a => a.categoria === cat);

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

  async function solicitar(tipo: string) {
    try {
      await criarSolicitacao(tipo);
      await carregar();
      onToast(`✅ Solicitação de "${tipo}" enviada!`);
    } catch {
      onToast('❌ Não foi possível enviar a solicitação.');
    }
  }

  async function mudarStatus(id: string, status: SolicitacaoDB['status']) {
    try {
      await atualizarStatusSolicitacao(id, status);
      await carregar();
      onToast('✅ Status atualizado.');
    } catch {
      onToast('❌ Não foi possível atualizar.');
    }
  }

  async function excluirSolicitacao(id: string, tipo: string) {
    if (!window.confirm(`Excluir a solicitação "${tipo}"?`)) return;
    try {
      await removerSolicitacao(id);
      await carregar();
      onToast('🗑️ Solicitação removida.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  async function postarAviso() {
    if (!novoTitulo || !novaDesc) { onToast('⚠️ Preencha título e descrição'); return; }
    setEnviando(true);
    try {
      await criarAviso({
        titulo: novoTitulo,
        categoria: novaCat,
        descricao: novaDesc,
        data: new Date().toISOString().split('T')[0],
        prioridade: novaPrio,
      });
      await carregar();
      setNovoTitulo(''); setNovaDesc('');
      onToast('✅ Aviso publicado!');
    } catch {
      onToast('❌ Não foi possível publicar.');
    } finally {
      setEnviando(false);
    }
  }

  function fmtData(iso: string) {
    if (!iso) return '';
    const [, m, d] = iso.split('-');
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return `${d}/${months[parseInt(m) - 1]}`;
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

      {/* Painel do secretário logado */}
      {podePostar && (
        <div className="p-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--gold)' }}>
          <div className="p-card-header">
            <div className="p-card-icon gold">🗝️</div>
            <div>
              <div className="p-card-title">Painel do Secretário</div>
              <div className="p-card-sub">{ehPedagogico ? 'Secretaria Pedagógica' : 'Secretaria Administrativa'}</div>
            </div>
          </div>
          <div className="p-card-body">
            <h4 style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.6rem' }}>Publicar novo aviso</h4>
            <div className="grid-2">
              <div className="form-group"><label>Título</label><input type="text" placeholder="Ex: Reunião de pais" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} /></div>
              <div className="form-group"><label>Categoria</label>
                <select value={novaCat} onChange={e => setNovaCat(e.target.value)}>
                  {catsPermitidas.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Descrição</label><textarea placeholder="Detalhes do aviso..." value={novaDesc} onChange={e => setNovaDesc(e.target.value)} /></div>
            <div className="form-group"><label>Prioridade</label>
              <select value={novaPrio} onChange={e => setNovaPrio(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="urgente">Urgente</option>
                <option value="info">Informativo</option>
              </select>
            </div>
            <button className="p-btn p-btn-gold" disabled={enviando} onClick={postarAviso}>
              {enviando ? 'Publicando...' : '+ Publicar Aviso'}
            </button>

            {ehPedagogico && (
              <>
                <h4 style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--navy)', margin: '1.4rem 0 .6rem' }}>Gerenciar solicitações</h4>
                {solicitacoes.length === 0 ? (
                  <p style={{ fontSize: '.82rem', color: '#9ca3af' }}>Nenhuma solicitação recebida.</p>
                ) : solicitacoes.map(s => (
                  <div key={s.id} style={{ padding: '.7rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem', gap: '.6rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '.86rem', color: 'var(--navy)' }}>{s.tipo}</div>
                      <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => excluirSolicitacao(s.id, s.tipo)}>
                        Excluir
                      </button>
                    </div>
                    <select
                      value={s.status}
                      onChange={e => mudarStatus(s.id, e.target.value as SolicitacaoDB['status'])}
                      style={{ padding: '.45rem .8rem', borderRadius: '8px', border: '1.5px solid rgba(26,35,64,.15)', fontSize: '.82rem', background: 'var(--white)', color: 'var(--navy2)' }}
                    >
                      <option value="em análise">Em análise</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Nova solicitação (qualquer visitante) */}
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
          <div className="p-card-title">Solicitações</div>
        </div>
        <div className="p-card-body">
          {solicitacoes.length === 0 ? (
            <div className="empty"><div className="empty-icon">📭</div><p>Nenhuma solicitação ainda</p></div>
          ) : solicitacoes.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px dashed var(--p-border)' }}>
              <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{s.tipo}</div>
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

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Carregando avisos...</p>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <p>Nenhum aviso nesta categoria</p>
        </div>
      ) : (
        <div>
          {filtered.map(a => (
            <div key={a.id} className="aviso-card">
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginBottom: '.6rem' }}>
                <PriorBadge p={a.prioridade} />
                <span className="p-badge p-badge-navy">{a.categoria}</span>
                <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: '#9ca3af' }}>{fmtData(a.data)}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-h)', fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '.4rem' }}>{a.titulo}</h3>
              <p style={{ fontSize: '.88rem', color: '#4b5563', lineHeight: 1.6 }}>{a.descricao}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
