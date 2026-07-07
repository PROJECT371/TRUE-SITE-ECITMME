import { useEffect, useState } from "react";
import { store, disciplinas, addDisciplina, removeDisciplina, CURSOS, ANOS, TURMAS, salaId } from "@/data/store";
import {
  listarEventos, criarEvento, removerEvento, type EventoDB,
  listarProvas, criarProva, removerProva, type ProvaDB,
  listarAvisos, criarAviso, removerAviso, type AvisoDB,
  listarClubes, criarClube, removerClube, type ClubeDB,
  listarAvisosSalas, criarAvisoSala, removerAvisoSala, type AvisoSalaDB,
  listarSolicitacoes, atualizarStatusSolicitacao, removerSolicitacao, type SolicitacaoDB,
  listarHorarios, criarHorario, removerHorario, type HorarioDB,
} from "@/lib/dados";

interface Props {
  onToast: (msg: string) => void;
}

const ADMIN_PASS = 'mylovBelly';

export default function Admin({ onToast }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState('');
  const [adminTab, setAdminTab] = useState('eventos');
  const [error, setError] = useState('');
  const [, forceUpdate] = useState(0);

  // Dados vindos do Supabase
  const [eventosList, setEventosList] = useState<EventoDB[]>([]);
  const [provasList, setProvasList] = useState<ProvaDB[]>([]);
  const [avisosList, setAvisosList] = useState<AvisoDB[]>([]);
  const [clubesList, setClubesList] = useState<ClubeDB[]>([]);
  const [avisosSalasList, setAvisosSalasList] = useState<AvisoSalaDB[]>([]);
  const [solicitacoesList, setSolicitacoesList] = useState<SolicitacaoDB[]>([]);
  const [horariosList, setHorariosList] = useState<HorarioDB[]>([]);

  useEffect(() => {
    listarEventos().then(setEventosList);
    listarProvas().then(setProvasList);
    listarAvisos().then(setAvisosList);
    listarClubes().then(setClubesList);
    listarAvisosSalas().then(setAvisosSalasList);
    listarSolicitacoes().then(setSolicitacoesList);
    listarHorarios().then(setHorariosList);
  }, []);

  // Eventos form
  const [evTitulo, setEvTitulo] = useState('');
  const [evData, setEvData] = useState('');
  const [evHora, setEvHora] = useState('');
  const [evLocal, setEvLocal] = useState('');
  const [evCat, setEvCat] = useState('cultural');
  const [evDesc, setEvDesc] = useState('');
  const [evCor, setEvCor] = useState('#c9993a');

  // Avisos form
  const [avTitulo, setAvTitulo] = useState('');
  const [avCat, setAvCat] = useState('comunicados');
  const [avDesc, setAvDesc] = useState('');
  const [avData, setAvData] = useState('');
  const [avPrio, setAvPrio] = useState('normal');

  // Provas form
  const [pvDisc, setPvDisc] = useState('');
  const [pvTurma, setPvTurma] = useState('1a');
  const [pvData, setPvData] = useState('');
  const [pvHora, setPvHora] = useState('');
  const [pvTipo, setPvTipo] = useState('Prova Bimestral');
  const [pvObs, setPvObs] = useState('');

  // Conteudos form
  const [ctDisc, setCtDisc] = useState('');
  const [ctSerie, setCtSerie] = useState('1a');
  const [ctBim, setCtBim] = useState('1º Bimestre');
  const [ctProf, setCtProf] = useState('');
  const [ctConteudo, setCtConteudo] = useState('');

  // Jogos form
  const [jgA, setJgA] = useState('');
  const [jgB, setJgB] = useState('');
  const [jgData, setJgData] = useState('');
  const [jgHora, setJgHora] = useState('');
  const [jgMod, setJgMod] = useState('Futsal');
  const [jgLocal, setJgLocal] = useState('');

  // Livros form
  const [lvTitulo, setLvTitulo] = useState('');
  const [lvAutor, setLvAutor] = useState('');
  const [lvGenero, setLvGenero] = useState('literatura');
  const [lvQtd, setLvQtd] = useState(1);

  // Disciplinas form
  const [dsNome, setDsNome] = useState('');
  const [dsCat, setDsCat] = useState<'comum' | 'tecnica' | 'diversificada'>('comum');
  const [dsProf, setDsProf] = useState('');
  const [dsHorario, setDsHorario] = useState('');
  const [dsCor, setDsCor] = useState('#c9993a');
  const [dsConteudo, setDsConteudo] = useState('');
  const [dsAtividades, setDsAtividades] = useState('');

  // Clubes form
  const [clNome, setClNome] = useState('');
  const [clProf, setClProf] = useState('');
  const [clHorario, setClHorario] = useState('');
  const [clInteg, setClInteg] = useState(0);

  // Salas form
  const [slCurso, setSlCurso] = useState(CURSOS[0].slug);
  const [slAno, setSlAno] = useState(1);
  const [slTurma, setSlTurma] = useState('A');
  const [slTexto, setSlTexto] = useState('');

  // Horários form
  const [hrCurso, setHrCurso] = useState(CURSOS[0].slug);
  const [hrAno, setHrAno] = useState(1);
  const [hrTurma, setHrTurma] = useState('A');
  const [hrDia, setHrDia] = useState<'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex'>('Seg');
  const [hrHorario, setHrHorario] = useState('');
  const [hrDisciplina, setHrDisciplina] = useState('');
  const [hrSala, setHrSala] = useState('');
  const [hrProfessor, setHrProfessor] = useState('');
  const [hrOrdem, setHrOrdem] = useState(1);

  function checkAdmin() {
    if (pwd === ADMIN_PASS) { setUnlocked(true); setError(''); }
    else setError('Senha incorreta. Tente novamente.');
  }

  async function addEvt() {
    if (!evTitulo || !evData || !evHora || !evLocal) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    try {
      await criarEvento({ titulo: evTitulo, data: evData, hora: evHora, local: evLocal, categoria: evCat, descricao: evDesc, cor: evCor });
      setEventosList(await listarEventos());
      setEvTitulo(''); setEvData(''); setEvHora(''); setEvLocal(''); setEvDesc('');
      onToast('✅ Evento publicado com sucesso!');
    } catch {
      onToast('❌ Não foi possível publicar o evento.');
    }
  }

  async function delEvt(id: string, titulo: string) {
    if (!window.confirm(`Remover o evento "${titulo}"?`)) return;
    try {
      await removerEvento(id);
      setEventosList(await listarEventos());
      onToast('🗑️ Evento removido.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  async function addAviso() {
    if (!avTitulo || !avDesc) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    try {
      await criarAviso({ titulo: avTitulo, categoria: avCat, descricao: avDesc, data: avData || new Date().toISOString().split('T')[0], prioridade: avPrio });
      setAvisosList(await listarAvisos());
      setAvTitulo(''); setAvDesc(''); setAvData('');
      onToast('✅ Aviso publicado com sucesso!');
    } catch {
      onToast('❌ Não foi possível publicar o aviso.');
    }
  }

  async function delAviso(id: string, titulo: string) {
    if (!window.confirm(`Remover o aviso "${titulo}"?`)) return;
    try {
      await removerAviso(id);
      setAvisosList(await listarAvisos());
      onToast('🗑️ Aviso removido.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  async function addProva() {
    if (!pvDisc || !pvData || !pvHora) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    try {
      await criarProva({ disciplina: pvDisc, turma: pvTurma, data: pvData, hora: pvHora, tipo: pvTipo, obs: pvObs });
      setProvasList(await listarProvas());
      setPvDisc(''); setPvData(''); setPvHora(''); setPvObs('');
      onToast('✅ Prova cadastrada com sucesso!');
    } catch {
      onToast('❌ Não foi possível cadastrar a prova.');
    }
  }

  async function delProva(id: string, disc: string) {
    if (!window.confirm(`Remover a prova de "${disc}"?`)) return;
    try {
      await removerProva(id);
      setProvasList(await listarProvas());
      onToast('🗑️ Prova removida.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  function addConteudo() {
    if (!ctDisc || !ctProf || !ctConteudo) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    store.conteudos.push({ disc: ctDisc, serie: ctSerie, bim: ctBim, prof: ctProf, conteudo: ctConteudo });
    setCtDisc(''); setCtProf(''); setCtConteudo('');
    onToast('✅ Conteúdo publicado com sucesso!');
  }

  function addJogo() {
    if (!jgA || !jgB || !jgData) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    store.interclasse.jogos.push({ a: jgA, b: jgB, data: jgData, hora: jgHora, mod: jgMod, local: jgLocal, placar: '–' });
    setJgA(''); setJgB(''); setJgData(''); setJgHora(''); setJgLocal('');
    onToast('✅ Jogo cadastrado com sucesso!');
  }

  function addLivro() {
    if (!lvTitulo || !lvAutor) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    store.livros.push({ titulo: lvTitulo, autor: lvAutor, genero: lvGenero, qtd: lvQtd, disp: lvQtd });
    setLvTitulo(''); setLvAutor(''); setLvQtd(1);
    onToast('✅ Livro cadastrado com sucesso!');
  }

  function addDisc() {
    if (!dsNome || !dsProf) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    addDisciplina({
      nome: dsNome, categoria: dsCat, professor: dsProf, horario: dsHorario, cor: dsCor,
      conteudo: dsConteudo.split(',').map(s => s.trim()).filter(Boolean),
      atividades: dsAtividades.split(',').map(s => s.trim()).filter(Boolean),
    });
    setDsNome(''); setDsProf(''); setDsHorario(''); setDsConteudo(''); setDsAtividades('');
    forceUpdate(n => n + 1);
    onToast('✅ Disciplina cadastrada com sucesso!');
  }
  function delDisc(i: number, nome: string) {
    if (!window.confirm(`Remover a disciplina "${nome}"?`)) return;
    removeDisciplina(i);
    forceUpdate(n => n + 1);
    onToast('🗑️ Disciplina removida.');
  }

  async function addClb() {
    if (!clNome || !clProf) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    try {
      await criarClube({ nome: clNome, professor: clProf, horario: clHorario, integrantes: clInteg });
      setClubesList(await listarClubes());
      setClNome(''); setClProf(''); setClHorario(''); setClInteg(0);
      onToast('✅ Clube cadastrado com sucesso!');
    } catch {
      onToast('❌ Não foi possível cadastrar o clube.');
    }
  }
  async function delClb(id: string, nome: string) {
    if (!window.confirm(`Remover o clube "${nome}"?`)) return;
    try {
      await removerClube(id);
      setClubesList(await listarClubes());
      onToast('🗑️ Clube removido.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  async function setStatusSolic(id: string, status: 'em análise' | 'aprovado' | 'finalizado') {
    try {
      await atualizarStatusSolicitacao(id, status);
      setSolicitacoesList(await listarSolicitacoes());
      onToast('✅ Status atualizado.');
    } catch {
      onToast('❌ Não foi possível atualizar.');
    }
  }
  async function delSolic(id: string, tipo: string) {
    if (!window.confirm(`Excluir a solicitação "${tipo}"?`)) return;
    try {
      await removerSolicitacao(id);
      setSolicitacoesList(await listarSolicitacoes());
      onToast('🗑️ Solicitação removida.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  async function addAvisoSalaForm() {
    if (!slTexto) { onToast('⚠️ Escreva o aviso'); return; }
    try {
      await criarAvisoSala(salaId(slCurso, slAno, slTurma), slTexto);
      setAvisosSalasList(await listarAvisosSalas());
      setSlTexto('');
      onToast('✅ Aviso publicado na turma!');
    } catch {
      onToast('❌ Não foi possível publicar o aviso.');
    }
  }
  async function delAvisoSala(id: string) {
    try {
      await removerAvisoSala(id);
      setAvisosSalasList(await listarAvisosSalas());
      onToast('🗑️ Aviso removido.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  async function addHorario() {
    if (!hrHorario || !hrDisciplina) { onToast('⚠️ Preencha horário e disciplina'); return; }
    try {
      await criarHorario({
        turma_id: salaId(hrCurso, hrAno, hrTurma),
        dia: hrDia,
        horario: hrHorario,
        disciplina: hrDisciplina,
        sala: hrSala || null,
        professor: hrProfessor || null,
        ordem: hrOrdem,
      });
      setHorariosList(await listarHorarios());
      setHrHorario(''); setHrDisciplina(''); setHrSala(''); setHrProfessor('');
      onToast('✅ Aula adicionada ao horário!');
    } catch {
      onToast('❌ Não foi possível adicionar.');
    }
  }

  async function delHorario(id: string) {
    try {
      await removerHorario(id);
      setHorariosList(await listarHorarios());
      onToast('🗑️ Removido do horário.');
    } catch {
      onToast('❌ Não foi possível remover.');
    }
  }

  const adminTabs = [
    { id: 'eventos',    label: '🗓️ Eventos' },
    { id: 'avisos',     label: '🔔 Avisos' },
    { id: 'provas',     label: '📋 Provas' },
    { id: 'horarios',   label: '🗓️ Horários' },
    { id: 'conteudos',  label: '📖 Conteúdos' },
    { id: 'disciplinas', label: '📘 Disciplinas' },
    { id: 'solicitacoes', label: '📝 Solicitações' },
    { id: 'clubes',     label: '🎭 Clubes' },
    { id: 'salas',      label: '🏫 Salas' },
    { id: 'jogos',      label: '🏆 Interclasse' },
    { id: 'livros',     label: '📚 Biblioteca' },
  ];

  const catCores: Record<string, string> = {
    cultural: '#e8b84b', academico: '#2e7d52', social: '#1e6fa0',
    reuniao: '#c9993a', esporte: '#7c3aed',
  };

  if (!unlocked) {
    return (
      <div className="animate-fade-up">
        <div className="sec-header">
          <div className="sec-icon">⚙️</div>
          <div className="sec-title">
            <h2>Painel Administrativo</h2>
            <p>Gerenciamento do portal escolar</p>
          </div>
        </div>
        <div className="admin-lock">
          <div className="admin-lock-icon">🛡️</div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-h)', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '.4rem' }}>Acesso Restrito</h3>
            <p style={{ color: '#6b7280', fontSize: '.9rem' }}>Digite a senha para acessar o painel administrativo</p>
          </div>
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <div className="form-group">
              <label>Senha de Administrador</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkAdmin()}
              />
              {error && <p style={{ color: '#dc2626', fontSize: '.8rem', marginTop: '.3rem' }}>{error}</p>}
            </div>
            <button className="p-btn p-btn-primary" style={{ width: '100%' }} onClick={checkAdmin}>
              🔓 Entrar
            </button>
          </div>
          <p style={{ fontSize: '.75rem', color: '#d1d5db' }}>Acesso restrito à equipe pedagógica</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="sec-header">
        <div className="sec-icon">⚙️</div>
        <div className="sec-title">
          <h2>Painel Administrativo</h2>
          <p>Gerenciamento do portal escolar</p>
        </div>
      </div>

      <div className="admin-nav">
        {adminTabs.map(t => (
          <button key={t.id} className={`admin-nav-item ${adminTab === t.id ? 'active' : ''}`} onClick={() => setAdminTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── EVENTOS ── */}
      {adminTab === 'eventos' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Criar Novo Evento</h3>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Título do Evento</label>
                <input type="text" placeholder="Ex: Festa Junina ECIT 2025" value={evTitulo} onChange={e => setEvTitulo(e.target.value)} />
              </div>
              <div className="form-group"><label>Data</label><input type="date" value={evData} onChange={e => setEvData(e.target.value)} /></div>
              <div className="form-group"><label>Horário</label><input type="time" value={evHora} onChange={e => setEvHora(e.target.value)} /></div>
              <div className="form-group"><label>Local</label><input type="text" placeholder="Ex: Auditório, Pátio, Ginásio..." value={evLocal} onChange={e => setEvLocal(e.target.value)} /></div>
              <div className="form-group"><label>Categoria</label>
                <select value={evCat} onChange={e => { setEvCat(e.target.value); setEvCor(catCores[e.target.value] || '#c9993a'); }}>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="academico">🔬 Acadêmico</option>
                  <option value="social">🌱 Social</option>
                  <option value="reuniao">👨‍👩‍👧 Reunião</option>
                  <option value="esporte">🏆 Esporte</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Descrição</label>
                <textarea placeholder="Detalhes sobre o evento..." value={evDesc} onChange={e => setEvDesc(e.target.value)} />
              </div>
            </div>
            <button className="p-btn p-btn-gold" onClick={addEvt}>🗓️ Publicar Evento</button>
          </div>

          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Eventos Cadastrados ({eventosList.length})
            </h3>
            {eventosList.length === 0 ? (
              <div className="empty"><div className="empty-icon">🗓️</div><p>Nenhum evento cadastrado</p></div>
            ) : eventosList.map(ev => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: ev.cor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.titulo}</div>
                  <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>{ev.data} · {ev.hora} · {ev.local}</div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delEvt(ev.id, ev.titulo)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AVISOS ── */}
      {adminTab === 'avisos' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Cadastrar Aviso</h3>
            <div className="grid-2">
              <div className="form-group"><label>Título</label><input type="text" placeholder="Ex: Reunião de pais" value={avTitulo} onChange={e => setAvTitulo(e.target.value)} /></div>
              <div className="form-group"><label>Categoria</label>
                <select value={avCat} onChange={e => setAvCat(e.target.value)}>
                  <option value="comunicados">Comunicado</option>
                  <option value="matricula">Matrícula</option>
                  <option value="pais">Para pais</option>
                  <option value="documentos">Documento</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Descrição</label><textarea placeholder="Detalhes do aviso..." value={avDesc} onChange={e => setAvDesc(e.target.value)} /></div>
            <div className="grid-2">
              <div className="form-group"><label>Data</label><input type="date" value={avData} onChange={e => setAvData(e.target.value)} /></div>
              <div className="form-group"><label>Prioridade</label>
                <select value={avPrio} onChange={e => setAvPrio(e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="urgente">Urgente</option>
                  <option value="info">Informativo</option>
                </select>
              </div>
            </div>
            <button className="p-btn p-btn-gold" onClick={addAviso}>+ Publicar Aviso</button>
          </div>
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Avisos Cadastrados ({avisosList.length})
            </h3>
            {avisosList.length === 0 ? (
              <div className="empty"><div className="empty-icon">🔔</div><p>Nenhum aviso cadastrado</p></div>
            ) : avisosList.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{a.titulo}</div>
                  <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>{a.categoria} · {a.prioridade}</div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delAviso(a.id, a.titulo)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROVAS ── */}
      {adminTab === 'provas' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Cadastrar Prova</h3>
            <div className="grid-2">
              <div className="form-group"><label>Disciplina</label><input type="text" placeholder="Ex: Matemática" value={pvDisc} onChange={e => setPvDisc(e.target.value)} /></div>
              <div className="form-group"><label>Turma</label>
                <select value={pvTurma} onChange={e => setPvTurma(e.target.value)}>
                  <option value="1a">1º Ano</option>
                  <option value="2a">2º Ano</option>
                  <option value="3a">3º Ano</option>
                </select>
              </div>
              <div className="form-group"><label>Data</label><input type="date" value={pvData} onChange={e => setPvData(e.target.value)} /></div>
              <div className="form-group"><label>Horário</label><input type="time" value={pvHora} onChange={e => setPvHora(e.target.value)} /></div>
              <div className="form-group"><label>Tipo</label>
                <select value={pvTipo} onChange={e => setPvTipo(e.target.value)}>
                  <option>Prova Bimestral</option><option>Prova Mensal</option>
                  <option>Trabalho</option><option>Seminário</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Observações</label><textarea placeholder="Conteúdos que serão cobrados..." value={pvObs} onChange={e => setPvObs(e.target.value)} /></div>
            <button className="p-btn p-btn-gold" onClick={addProva}>+ Cadastrar Prova</button>
          </div>
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Provas Cadastradas ({provasList.length})
            </h3>
            {provasList.length === 0 ? (
              <div className="empty"><div className="empty-icon">📋</div><p>Nenhuma prova cadastrada</p></div>
            ) : provasList.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{p.disciplina}</div>
                  <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>{p.turma} · {p.data} · {p.tipo}</div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delProva(p.id, p.disciplina)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HORÁRIOS ── */}
      {adminTab === 'horarios' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Adicionar Aula ao Horário</h3>
            <div className="grid-3">
              <div className="form-group"><label>Curso</label>
                <select value={hrCurso} onChange={e => setHrCurso(e.target.value)}>
                  {CURSOS.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Ano</label>
                <select value={hrAno} onChange={e => setHrAno(Number(e.target.value))}>
                  {ANOS.map(a => <option key={a} value={a}>{a}º Ano</option>)}
                </select>
              </div>
              <div className="form-group"><label>Turma</label>
                <select value={hrTurma} onChange={e => setHrTurma(e.target.value)}>
                  {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Dia</label>
                <select value={hrDia} onChange={e => setHrDia(e.target.value as typeof hrDia)}>
                  <option value="Seg">Segunda-feira</option>
                  <option value="Ter">Terça-feira</option>
                  <option value="Qua">Quarta-feira</option>
                  <option value="Qui">Quinta-feira</option>
                  <option value="Sex">Sexta-feira</option>
                </select>
              </div>
              <div className="form-group"><label>Horário (texto livre)</label>
                <input type="text" placeholder="Ex: 07:30 - 08:20" value={hrHorario} onChange={e => setHrHorario(e.target.value)} />
              </div>
            </div>
            <div className="form-group"><label>Disciplina</label><input type="text" placeholder="Ex: Matemática" value={hrDisciplina} onChange={e => setHrDisciplina(e.target.value)} /></div>
            <div className="grid-2">
              <div className="form-group"><label>Sala</label><input type="text" placeholder="Ex: Sala 04 - Matemática" value={hrSala} onChange={e => setHrSala(e.target.value)} /></div>
              <div className="form-group"><label>Professor(a)</label><input type="text" placeholder="Ex: Luiz" value={hrProfessor} onChange={e => setHrProfessor(e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Ordem no dia (1, 2, 3...)</label><input type="number" min={1} value={hrOrdem} onChange={e => setHrOrdem(Number(e.target.value))} /></div>
            <button className="p-btn p-btn-gold" onClick={addHorario}>+ Adicionar Aula</button>
          </div>
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Aulas Cadastradas ({horariosList.length})
            </h3>
            {horariosList.length === 0 ? (
              <div className="empty"><div className="empty-icon">🗓️</div><p>Nenhuma aula cadastrada ainda</p></div>
            ) : horariosList.map(h => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h.turma_id} · {h.dia} · {h.horario}</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--navy)' }}>{h.disciplina}</div>
                  <div style={{ fontSize: '.75rem', color: '#6b7280' }}>{h.sala}{h.professor ? ` · ${h.professor}` : ''}</div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delHorario(h.id)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTEÚDOS ── */}
      {adminTab === 'conteudos' && (
        <div className="admin-form">
          <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Publicar Conteúdo Bimestral</h3>
          <div className="grid-2">
            <div className="form-group"><label>Disciplina</label><input type="text" placeholder="Ex: Química" value={ctDisc} onChange={e => setCtDisc(e.target.value)} /></div>
            <div className="form-group"><label>Série</label>
              <select value={ctSerie} onChange={e => setCtSerie(e.target.value)}>
                <option value="1a">1º Ano</option><option value="2a">2º Ano</option><option value="3a">3º Ano</option>
              </select>
            </div>
            <div className="form-group"><label>Bimestre</label>
              <select value={ctBim} onChange={e => setCtBim(e.target.value)}>
                <option>1º Bimestre</option><option>2º Bimestre</option><option>3º Bimestre</option><option>4º Bimestre</option>
              </select>
            </div>
            <div className="form-group"><label>Professor</label><input type="text" placeholder="Nome do professor" value={ctProf} onChange={e => setCtProf(e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Conteúdos (separar por vírgula)</label><textarea placeholder="Funções, Logaritmos, Progressões..." value={ctConteudo} onChange={e => setCtConteudo(e.target.value)} /></div>
          <button className="p-btn p-btn-gold" onClick={addConteudo}>+ Publicar Conteúdo</button>
        </div>
      )}

      {/* ── JOGOS ── */}
      {adminTab === 'jogos' && (
        <div className="admin-form">
          <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Cadastrar Jogo</h3>
          <div className="grid-2">
            <div className="form-group"><label>Time A</label><input type="text" placeholder="Ex: Tubarões do 2ºA" value={jgA} onChange={e => setJgA(e.target.value)} /></div>
            <div className="form-group"><label>Time B</label><input type="text" placeholder="Ex: Leões do 3ºB" value={jgB} onChange={e => setJgB(e.target.value)} /></div>
            <div className="form-group"><label>Data</label><input type="date" value={jgData} onChange={e => setJgData(e.target.value)} /></div>
            <div className="form-group"><label>Horário</label><input type="time" value={jgHora} onChange={e => setJgHora(e.target.value)} /></div>
            <div className="form-group"><label>Modalidade</label>
              <select value={jgMod} onChange={e => setJgMod(e.target.value)}>
                <option>Futsal</option><option>Vôlei</option><option>Basquete</option><option>Handebol</option>
              </select>
            </div>
            <div className="form-group"><label>Local</label><input type="text" placeholder="Ex: Quadra principal" value={jgLocal} onChange={e => setJgLocal(e.target.value)} /></div>
          </div>
          <button className="p-btn p-btn-gold" onClick={addJogo}>+ Cadastrar Jogo</button>
        </div>
      )}

      {/* ── LIVROS ── */}
      {adminTab === 'livros' && (
        <div className="admin-form">
          <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Cadastrar Livro</h3>
          <div className="grid-2">
            <div className="form-group"><label>Título</label><input type="text" placeholder="Título do livro" value={lvTitulo} onChange={e => setLvTitulo(e.target.value)} /></div>
            <div className="form-group"><label>Autor</label><input type="text" placeholder="Nome do autor" value={lvAutor} onChange={e => setLvAutor(e.target.value)} /></div>
            <div className="form-group"><label>Gênero</label>
              <select value={lvGenero} onChange={e => setLvGenero(e.target.value)}>
                <option value="literatura">Literatura</option><option value="ciencias">Ciências</option>
                <option value="historia">História</option><option value="matematica">Matemática</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <div className="form-group"><label>Quantidade</label><input type="number" min={1} value={lvQtd} onChange={e => setLvQtd(Number(e.target.value))} /></div>
          </div>
          <button className="p-btn p-btn-gold" onClick={addLivro}>+ Cadastrar Livro</button>
        </div>
      )}

      {/* ── DISCIPLINAS ── */}
      {adminTab === 'disciplinas' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Cadastrar Disciplina</h3>
            <div className="grid-2">
              <div className="form-group"><label>Nome da Disciplina</label><input type="text" placeholder="Ex: Matemática" value={dsNome} onChange={e => setDsNome(e.target.value)} /></div>
              <div className="form-group"><label>Categoria</label>
                <select value={dsCat} onChange={e => setDsCat(e.target.value as 'comum' | 'tecnica' | 'diversificada')}>
                  <option value="comum">Base Comum</option>
                  <option value="tecnica">Base Técnica</option>
                  <option value="diversificada">Parte Diversificada</option>
                </select>
              </div>
              <div className="form-group"><label>Professor(a)</label><input type="text" placeholder="Ex: Profª. Ana Beatriz" value={dsProf} onChange={e => setDsProf(e.target.value)} /></div>
              <div className="form-group"><label>Horário</label><input type="text" placeholder="Ex: Seg/Qua 07h30" value={dsHorario} onChange={e => setDsHorario(e.target.value)} /></div>
              <div className="form-group"><label>Cor</label><input type="color" value={dsCor} onChange={e => setDsCor(e.target.value)} style={{ height: '42px', padding: '4px' }} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Conteúdo (separar por vírgula)</label><textarea placeholder="Funções, Geometria analítica..." value={dsConteudo} onChange={e => setDsConteudo(e.target.value)} /></div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Atividades (separar por vírgula)</label><textarea placeholder="Trabalho — 08/07, Prova — 15/07" value={dsAtividades} onChange={e => setDsAtividades(e.target.value)} /></div>
            </div>
            <button className="p-btn p-btn-gold" onClick={addDisc}>+ Cadastrar Disciplina</button>
          </div>
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Disciplinas Cadastradas ({disciplinas.length})
            </h3>
            {disciplinas.length === 0 ? (
              <div className="empty"><div className="empty-icon">📘</div><p>Nenhuma disciplina cadastrada</p></div>
            ) : disciplinas.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.cor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{d.nome}</div>
                  <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>{d.professor} · {d.horario}</div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delDisc(i, d.nome)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SOLICITAÇÕES ── */}
      {adminTab === 'solicitacoes' && (
        <div className="admin-form">
          <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
            Solicitações da Secretaria ({solicitacoesList.length})
          </h3>
          {solicitacoesList.length === 0 ? (
            <div className="empty"><div className="empty-icon">📭</div><p>Nenhuma solicitação recebida</p></div>
          ) : solicitacoesList.map(s => (
            <div key={s.id} style={{ padding: '.8rem 0', borderBottom: '1px dashed var(--p-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem', gap: '.6rem' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{s.tipo}</div>
                  <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>
                    {s.aluno_nome ? `👤 ${s.aluno_nome}` : '👤 Visitante (sem login)'}
                  </div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delSolic(s.id, s.tipo)}>
                  Excluir
                </button>
              </div>
              <select
                className="status-select"
                value={s.status}
                onChange={e => setStatusSolic(s.id, e.target.value as 'em análise' | 'aprovado' | 'finalizado')}
                style={{ padding: '.45rem .8rem', borderRadius: '8px', border: '1.5px solid rgba(26,35,64,.15)', fontSize: '.82rem', background: 'var(--white)', color: 'var(--navy2)' }}
              >
                <option value="em análise">Em análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {/* ── CLUBES ── */}
      {adminTab === 'clubes' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Cadastrar Clube</h3>
            <div className="grid-2">
              <div className="form-group"><label>Nome do Clube</label><input type="text" placeholder="Ex: Clube de Robótica" value={clNome} onChange={e => setClNome(e.target.value)} /></div>
              <div className="form-group"><label>Professor Responsável</label><input type="text" placeholder="Nome do professor" value={clProf} onChange={e => setClProf(e.target.value)} /></div>
              <div className="form-group"><label>Horário</label><input type="text" placeholder="Ex: Qui 14h" value={clHorario} onChange={e => setClHorario(e.target.value)} /></div>
              <div className="form-group"><label>Integrantes</label><input type="number" min={0} value={clInteg} onChange={e => setClInteg(Number(e.target.value))} /></div>
            </div>
            <button className="p-btn p-btn-gold" onClick={addClb}>+ Cadastrar Clube</button>
          </div>
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Clubes Cadastrados ({clubesList.length})
            </h3>
            {clubesList.length === 0 ? (
              <div className="empty"><div className="empty-icon">🎭</div><p>Nenhum clube cadastrado</p></div>
            ) : clubesList.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--navy)' }}>{c.nome}</div>
                  <div style={{ fontSize: '.72rem', color: '#9ca3af' }}>{c.professor} · {c.horario} · {c.integrantes} integrantes</div>
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delClb(c.id, c.nome)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SALAS ── */}
      {adminTab === 'salas' && (
        <div>
          <div className="admin-form" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Publicar Aviso para Turma</h3>
            <div className="grid-2">
              <div className="form-group"><label>Curso</label>
                <select value={slCurso} onChange={e => setSlCurso(e.target.value)}>
                  {CURSOS.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Ano</label>
                <select value={slAno} onChange={e => setSlAno(Number(e.target.value))}>
                  {ANOS.map(a => <option key={a} value={a}>{a}º Ano</option>)}
                </select>
              </div>
              <div className="form-group"><label>Turma</label>
                <select value={slTurma} onChange={e => setSlTurma(e.target.value)}>
                  {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Aviso</label><textarea placeholder="Escreva o aviso para esta turma..." value={slTexto} onChange={e => setSlTexto(e.target.value)} /></div>
            </div>
            <button className="p-btn p-btn-gold" onClick={addAvisoSalaForm}>+ Publicar Aviso</button>
          </div>
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>Avisos Publicados</h3>
            {avisosSalasList.length === 0 ? (
              <div className="empty"><div className="empty-icon">🏫</div><p>Nenhum aviso publicado ainda</p></div>
            ) : avisosSalasList.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem 0', borderBottom: '1px dashed var(--p-border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.05em' }}>{a.sala_id}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--navy2)' }}>
                    {a.tipo === 'pdf' ? '📄 ' : a.tipo === 'video' ? '🎬 ' : '🔔 '}{a.texto}
                  </div>
                  {a.professor_nome && (
                    <div style={{ fontSize: '.7rem', color: '#9ca3af' }}>— {a.professor_nome}</div>
                  )}
                </div>
                <button className="p-btn p-btn-outline p-btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626', flexShrink: 0 }} onClick={() => delAvisoSala(a.id)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button className="p-btn p-btn-outline p-btn-sm" onClick={() => { setUnlocked(false); setPwd(''); }}>
          ← Sair
        </button>
      </div>
    </div>
  );
}
