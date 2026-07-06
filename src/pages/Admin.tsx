import { useState } from "react";
import { store, eventos, addEvento, removeEvento } from "@/data/store";

interface Props {
  onToast: (msg: string) => void;
}

const ADMIN_PASS = 'mylovBelly';

export default function Admin({ onToast }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState('');
  const [adminTab, setAdminTab] = useState('eventos');
  const [error, setError] = useState('');

  // Eventos form
  const [evTitulo, setEvTitulo] = useState('');
  const [evData, setEvData] = useState('');
  const [evHora, setEvHora] = useState('');
  const [evLocal, setEvLocal] = useState('');
  const [evCat, setEvCat] = useState('cultural');
  const [evDesc, setEvDesc] = useState('');
  const [evCor, setEvCor] = useState('#c9993a');
  const [, forceUpdate] = useState(0);

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

  // Cardapio form
  const [cdDia, setCdDia] = useState('Segunda-feira');
  const [cdTipo, setCdTipo] = useState<'almoco' | 'lanche'>('almoco');
  const [cdPrato, setCdPrato] = useState('');
  const [cdAcomp, setCdAcomp] = useState('');
  const [cdNut, setCdNut] = useState('');

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

  function checkAdmin() {
    if (pwd === ADMIN_PASS) { setUnlocked(true); setError(''); }
    else setError('Senha incorreta. Tente novamente.');
  }

  function addEvt() {
    if (!evTitulo || !evData || !evHora || !evLocal) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    addEvento({ titulo: evTitulo, data: evData, hora: evHora, local: evLocal, cat: evCat, desc: evDesc, cor: evCor });
    setEvTitulo(''); setEvData(''); setEvHora(''); setEvLocal(''); setEvDesc('');
    forceUpdate(n => n + 1);
    onToast('✅ Evento publicado com sucesso!');
  }

  function delEvt(id: number, titulo: string) {
    if (!window.confirm(`Remover o evento "${titulo}"?`)) return;
    removeEvento(id);
    forceUpdate(n => n + 1);
    onToast('🗑️ Evento removido.');
  }

  function addAviso() {
    if (!avTitulo || !avDesc) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    store.avisos.unshift({ titulo: avTitulo, cat: avCat, desc: avDesc, data: avData || new Date().toISOString().split('T')[0], prioridade: avPrio });
    setAvTitulo(''); setAvDesc(''); setAvData('');
    onToast('✅ Aviso publicado com sucesso!');
  }

  function addProva() {
    if (!pvDisc || !pvData || !pvHora) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    store.provas.push({ disc: pvDisc, turma: pvTurma, data: pvData, hora: pvHora, tipo: pvTipo, obs: pvObs });
    setPvDisc(''); setPvData(''); setPvHora(''); setPvObs('');
    onToast('✅ Prova cadastrada com sucesso!');
  }

  function addConteudo() {
    if (!ctDisc || !ctProf || !ctConteudo) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    store.conteudos.push({ disc: ctDisc, serie: ctSerie, bim: ctBim, prof: ctProf, conteudo: ctConteudo });
    setCtDisc(''); setCtProf(''); setCtConteudo('');
    onToast('✅ Conteúdo publicado com sucesso!');
  }

  function addCardapio() {
    if (!cdPrato || !cdAcomp) { onToast('⚠️ Preencha todos os campos obrigatórios'); return; }
    const idx = store.cardapio[cdTipo].findIndex(c => c.dia === cdDia);
    const item = { dia: cdDia, prato: cdPrato, acomp: cdAcomp, nut: cdNut || '–' };
    if (idx >= 0) store.cardapio[cdTipo][idx] = item;
    else store.cardapio[cdTipo].push(item);
    setCdPrato(''); setCdAcomp(''); setCdNut('');
    onToast('✅ Cardápio atualizado com sucesso!');
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

  const adminTabs = [
    { id: 'eventos',    label: '🗓️ Eventos' },
    { id: 'avisos',     label: '🔔 Avisos' },
    { id: 'provas',     label: '📋 Provas' },
    { id: 'conteudos',  label: '📖 Conteúdos' },
    { id: 'cardapio',   label: '🍽️ Cardápio' },
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

          {/* Lista para gerenciar */}
          <div className="admin-form">
            <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1rem', color: 'var(--navy)' }}>
              Eventos Cadastrados ({eventos.length})
            </h3>
            {eventos.length === 0 ? (
              <div className="empty"><div className="empty-icon">🗓️</div><p>Nenhum evento cadastrado</p></div>
            ) : [...eventos].sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime()).map(ev => (
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
        <div className="admin-form">
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
      )}

      {/* ── PROVAS ── */}
      {adminTab === 'provas' && (
        <div className="admin-form">
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

      {/* ── CARDÁPIO ── */}
      {adminTab === 'cardapio' && (
        <div className="admin-form">
          <h3 style={{ fontFamily: 'var(--font-h)', marginBottom: '1.2rem', color: 'var(--navy)' }}>Atualizar Cardápio</h3>
          <div className="grid-2">
            <div className="form-group"><label>Dia da Semana</label>
              <select value={cdDia} onChange={e => setCdDia(e.target.value)}>
                <option>Segunda-feira</option><option>Terça-feira</option>
                <option>Quarta-feira</option><option>Quinta-feira</option><option>Sexta-feira</option>
              </select>
            </div>
            <div className="form-group"><label>Tipo</label>
              <select value={cdTipo} onChange={e => setCdTipo(e.target.value as 'almoco' | 'lanche')}>
                <option value="almoco">Almoço</option><option value="lanche">Lanche</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label>Prato Principal</label><input type="text" placeholder="Ex: Frango grelhado com arroz e feijão" value={cdPrato} onChange={e => setCdPrato(e.target.value)} /></div>
          <div className="form-group"><label>Acompanhamentos</label><input type="text" placeholder="Ex: Salada de tomate, suco de laranja" value={cdAcomp} onChange={e => setCdAcomp(e.target.value)} /></div>
          <div className="form-group"><label>Informação Nutricional</label><input type="text" placeholder="Ex: 650 kcal · Rico em proteínas" value={cdNut} onChange={e => setCdNut(e.target.value)} /></div>
          <button className="p-btn p-btn-gold" onClick={addCardapio}>+ Atualizar Cardápio</button>
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

      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button className="p-btn p-btn-outline p-btn-sm" onClick={() => { setUnlocked(false); setPwd(''); }}>
          ← Sair
        </button>
      </div>
    </div>
  );
}
