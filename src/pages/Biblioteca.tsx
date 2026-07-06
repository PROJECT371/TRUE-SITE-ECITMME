import { useState, useEffect, useCallback } from "react";
import { db, type Livro, type Emprestimo } from "@/lib/supabase";

type Tab = 'acervo' | 'emprestimo' | 'devolucao' | 'admin';

const ADMIN_PASS = 'bibliotecaecitmme';

interface Props {
  onToast: (msg: string) => void;
}

export default function Biblioteca({ onToast }: Props) {
  const [tab, setTab] = useState<Tab>('acervo');
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  function handleTab(t: Tab) {
    if (t === 'admin' && !adminUnlocked) {
      const pwd = window.prompt('🔐 Senha do Administrador:');
      if (pwd === ADMIN_PASS) {
        setAdminUnlocked(true);
        setTab('admin');
      } else if (pwd !== null) {
        onToast('❌ Senha incorreta!');
      }
      return;
    }
    setTab(t);
  }

  return (
    <div className="biblioteca-app">
      {/* App header */}
      <div className="bib-header">
        <div className="bib-logo">📚</div>
        <div>
          <h2 className="bib-title">Biblioteca ECIT</h2>
          <p className="bib-sub">João Da Matta · Mamanguape – PB</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bib-tabs">
        <button className={`bib-tab ${tab === 'acervo' ? 'active' : ''}`} onClick={() => handleTab('acervo')}>
          <span>📖</span>Acervo
        </button>
        <button className={`bib-tab ${tab === 'emprestimo' ? 'active' : ''}`} onClick={() => handleTab('emprestimo')}>
          <span>📋</span>Pegar
        </button>
        <button className={`bib-tab ${tab === 'devolucao' ? 'active' : ''}`} onClick={() => handleTab('devolucao')}>
          <span>↩️</span>Devolver
        </button>
        <button className={`bib-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => handleTab('admin')}>
          <span>⚙️</span>Admin
        </button>
      </div>

      {/* Content */}
      <div className="bib-content">
        {tab === 'acervo'     && <AcervoTab onToast={onToast} />}
        {tab === 'emprestimo' && <EmprestimoTab onToast={onToast} onDone={() => setTab('acervo')} />}
        {tab === 'devolucao'  && <DevolucaoTab onToast={onToast} />}
        {tab === 'admin'      && <AdminTab onToast={onToast} />}
      </div>
    </div>
  );
}

/* ── ACERVO ──────────────────────────────────────────── */
function AcervoTab({ onToast }: { onToast: (m: string) => void }) {
  const [books, setBooks] = useState<Livro[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from('livros').select('*').order('title');
    if (error) { onToast('❌ Erro ao carregar acervo'); }
    else setBooks(data || []);
    setLoading(false);
  }, [onToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="bib-search-wrap">
        <span className="bib-search-icon">🔍</span>
        <input
          type="text"
          className="bib-search"
          placeholder="Pesquisar por título ou autor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="bib-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {loading ? (
        <div className="bib-loading">
          <div className="bib-spinner" />
          <p>Carregando acervo...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bib-empty">
          <span>📭</span>
          <p>{search ? 'Nenhum livro encontrado para esta busca.' : 'O acervo está vazio.'}</p>
        </div>
      ) : (
        <div className="bib-book-list">
          {filtered.map(b => (
            <div key={b.id} className="bib-book-card">
              <div className="bib-book-cover">
                {b.title.charAt(0).toUpperCase()}
              </div>
              <div className="bib-book-info">
                <div className="bib-book-title">{b.title}</div>
                <div className="bib-book-author">✍️ {b.author}</div>
                <div className="bib-book-stock">
                  <span className={`bib-avail ${b.available > 0 ? 'ok' : 'out'}`}>
                    {b.available > 0 ? `✅ ${b.available} disponível${b.available > 1 ? 'is' : ''}` : '❌ Indisponível'}
                  </span>
                  <span className="bib-total">Total: {b.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── EMPRÉSTIMO ──────────────────────────────────────── */
function EmprestimoTab({ onToast, onDone }: { onToast: (m: string) => void; onDone: () => void }) {
  const [books, setBooks] = useState<Livro[]>([]);
  const [nome, setNome] = useState('');
  const [bookId, setBookId] = useState('');
  const [dataDev, setDataDev] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    db.from('livros').select('id, title, available').gt('available', 0).order('title')
      .then(({ data }) => {
        setBooks(data || []);
        if (data && data.length > 0) setBookId(data[0].id);
      });
  }, []);

  async function registrar() {
    if (!nome.trim() || !bookId || !dataDev) {
      onToast('⚠️ Preencha todos os campos!'); return;
    }
    setLoading(true);
    const book = books.find(b => b.id === bookId);
    if (!book) { onToast('❌ Livro não encontrado'); setLoading(false); return; }

    const { error: eEmp } = await db.from('emprestimos').insert([{
      name: nome.trim(), book_id: bookId, book_title: book.title,
      date_due: dataDev, returned: false,
    }]);
    if (eEmp) { onToast('❌ Erro ao registrar empréstimo'); setLoading(false); return; }

    const { error: eUpd } = await db.from('livros')
      .update({ available: book.available - 1 }).eq('id', bookId);
    if (eUpd) { onToast('⚠️ Empréstimo salvo, mas estoque não atualizado'); }
    else { onToast('✅ Empréstimo registrado com sucesso!'); }

    setNome(''); setDataDev('');
    setLoading(false);
    onDone();
  }

  return (
    <div className="bib-form-card">
      <div className="bib-form-header">
        <span className="bib-form-icon">📋</span>
        <div>
          <div className="bib-form-title">Novo Empréstimo</div>
          <div className="bib-form-sub">Preencha os dados abaixo</div>
        </div>
      </div>

      <div className="bib-field">
        <label>👤 Nome do Aluno</label>
        <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
      </div>

      <div className="bib-field">
        <label>📘 Livro</label>
        <select value={bookId} onChange={e => setBookId(e.target.value)}>
          {books.length === 0 && <option>Nenhum livro disponível</option>}
          {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
        </select>
      </div>

      <div className="bib-field">
        <label>📅 Data de Devolução</label>
        <input type="date" value={dataDev} onChange={e => setDataDev(e.target.value)}
          min={new Date().toISOString().split('T')[0]} />
      </div>

      <button className="bib-btn bib-btn-gold" onClick={registrar} disabled={loading}>
        {loading ? '⏳ Registrando...' : '✅ Confirmar Empréstimo'}
      </button>
    </div>
  );
}

/* ── DEVOLUÇÃO ───────────────────────────────────────── */
function DevolucaoTab({ onToast }: { onToast: (m: string) => void }) {
  const [loans, setLoans] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from('emprestimos')
      .select('*').eq('returned', false).order('date_due');
    if (error) onToast('❌ Erro ao carregar empréstimos');
    else setLoans(data || []);
    setLoading(false);
  }, [onToast]);

  useEffect(() => { load(); }, [load]);

  async function devolver(loan: Emprestimo) {
    setProcessing(loan.id);
    const { error: eEmp } = await db.from('emprestimos')
      .update({ returned: true }).eq('id', loan.id);
    if (eEmp) { onToast('❌ Erro na devolução'); setProcessing(null); return; }

    const { data: book } = await db.from('livros')
      .select('available').eq('id', loan.book_id).single();
    if (book) {
      await db.from('livros').update({ available: book.available + 1 }).eq('id', loan.book_id);
    }
    onToast('📚 Livro devolvido ao acervo!');
    setProcessing(null);
    load();
  }

  function isOverdue(dateStr: string) {
    return new Date(dateStr) < new Date();
  }

  if (loading) return (
    <div className="bib-loading"><div className="bib-spinner" /><p>Buscando empréstimos...</p></div>
  );

  if (loans.length === 0) return (
    <div className="bib-empty">
      <span>🎉</span>
      <p>Nenhum empréstimo ativo no momento!</p>
    </div>
  );

  return (
    <div>
      <div className="bib-count-badge">{loans.length} empréstimo{loans.length > 1 ? 's' : ''} ativo{loans.length > 1 ? 's' : ''}</div>
      {loans.map(l => (
        <div key={l.id} className={`bib-loan-card ${isOverdue(l.date_due) ? 'overdue' : ''}`}>
          <div className="bib-loan-top">
            <div className="bib-loan-avatar">{l.name.charAt(0).toUpperCase()}</div>
            <div className="bib-loan-info">
              <div className="bib-loan-name">{l.name}</div>
              <div className="bib-loan-book">📘 {l.book_title}</div>
            </div>
            {isOverdue(l.date_due) && <span className="bib-overdue-tag">ATRASADO</span>}
          </div>
          <div className="bib-loan-meta">
            <span>📅 Prazo: <strong>{new Date(l.date_due + 'T12:00:00').toLocaleDateString('pt-BR')}</strong></span>
          </div>
          <button
            className="bib-btn bib-btn-gold"
            onClick={() => devolver(l)}
            disabled={processing === l.id}
          >
            {processing === l.id ? '⏳ Processando...' : '↩️ Confirmar Devolução'}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ── ADMIN ───────────────────────────────────────────── */
function AdminTab({ onToast }: { onToast: (m: string) => void }) {
  const [books, setBooks] = useState<Livro[]>([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [qtd, setQtd] = useState(1);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    const { data } = await db.from('livros').select('*').order('title');
    setBooks(data || []);
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  async function cadastrar() {
    if (!titulo.trim() || !autor.trim()) { onToast('⚠️ Título e Autor são obrigatórios!'); return; }
    setSaving(true);
    const { error } = await db.from('livros')
      .insert([{ title: titulo.trim(), author: autor.trim(), total: qtd, available: qtd }]);
    if (error) onToast('❌ Erro ao salvar livro');
    else {
      onToast('✅ Livro cadastrado com sucesso!');
      setTitulo(''); setAutor(''); setQtd(1);
      loadBooks();
    }
    setSaving(false);
  }

  async function excluir(id: string, title: string) {
    if (!window.confirm(`Deseja apagar permanentemente "${title}"?`)) return;
    setDeleting(id);
    const { error } = await db.from('livros').delete().eq('id', id);
    if (error) onToast('❌ Erro ao excluir livro');
    else { onToast('🗑️ Livro removido do acervo!'); loadBooks(); }
    setDeleting(null);
  }

  return (
    <div>
      {/* Cadastro */}
      <div className="bib-form-card" style={{ marginBottom: '1.2rem' }}>
        <div className="bib-form-header">
          <span className="bib-form-icon">➕</span>
          <div>
            <div className="bib-form-title">Cadastrar Novo Livro</div>
            <div className="bib-form-sub">Adicione ao banco de dados</div>
          </div>
        </div>
        <div className="bib-field">
          <label>📕 Título</label>
          <input type="text" placeholder="Título do livro" value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <div className="bib-field">
          <label>✍️ Autor</label>
          <input type="text" placeholder="Nome do autor" value={autor} onChange={e => setAutor(e.target.value)} />
        </div>
        <div className="bib-field">
          <label>🔢 Quantidade</label>
          <input type="number" min={1} value={qtd} onChange={e => setQtd(Number(e.target.value))} />
        </div>
        <button className="bib-btn bib-btn-gold" onClick={cadastrar} disabled={saving}>
          {saving ? '⏳ Salvando...' : '💾 Salvar no Banco'}
        </button>
      </div>

      {/* Gerenciar */}
      <div className="bib-form-card">
        <div className="bib-form-header">
          <span className="bib-form-icon">🗑️</span>
          <div>
            <div className="bib-form-title">Gerenciar Acervo</div>
            <div className="bib-form-sub">{books.length} livro{books.length !== 1 ? 's' : ''} cadastrado{books.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        {books.length === 0 ? (
          <div className="bib-empty" style={{ padding: '1.5rem 0' }}>
            <span>📭</span><p>Nenhum livro cadastrado</p>
          </div>
        ) : books.map(b => (
          <div key={b.id} className="bib-admin-row">
            <div className="bib-admin-info">
              <div className="bib-admin-title">{b.title}</div>
              <div className="bib-admin-meta">{b.author} · {b.available}/{b.total} disp.</div>
            </div>
            <button
              className="bib-btn bib-btn-red bib-btn-sm"
              onClick={() => excluir(b.id, b.title)}
              disabled={deleting === b.id}
            >
              {deleting === b.id ? '⏳' : '🗑️'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
