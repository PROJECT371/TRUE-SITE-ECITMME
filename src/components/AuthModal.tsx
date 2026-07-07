import { useState } from "react";
import { cadastrar, entrar, type Cargo } from "@/lib/auth";
import { disciplinas, CURSOS, ANOS, TURMAS, salaId } from "@/data/store";

interface Props {
  onClose: () => void;
  onLogged: (uid: string) => void;
  onToast: (msg: string) => void;
}

const CARGOS: Array<{ id: Cargo; label: string }> = [
  { id: 'aluno', label: 'Aluno(a)' },
  { id: 'professor', label: 'Professor(a)' },
  { id: 'secretario_pedagogico', label: 'Secretário(a) Pedagógico(a)' },
  { id: 'secretario_administrativo', label: 'Secretário(a) Administrativo(a)' },
];

export default function AuthModal({ onClose, onLogged, onToast }: Props) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<Cargo>('aluno');
  const [disciplina, setDisciplina] = useState(disciplinas[0]?.nome || '');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState(CURSOS[0].slug);
  const [ano, setAno] = useState(ANOS[0]);
  const [turma, setTurma] = useState(TURMAS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (!email || !senha) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    try {
      if (modo === 'cadastro') {
        if (!nome) { setError('Informe seu nome.'); setLoading(false); return; }
        if (role === 'aluno' && !matricula) { setError('Informe seu número de matrícula.'); setLoading(false); return; }
        const turmaId = role === 'aluno' ? salaId(curso, ano, turma) : '';
        const uid = await cadastrar(nome, email, senha, role, disciplina, turmaId, matricula);
        onToast('✅ Conta criada com sucesso!');
        onLogged(uid);
        onClose();
      } else {
        const user = await entrar(email, senha);
        if (user) {
          onToast('👋 Bem-vindo(a) de volta!');
          onLogged(user.id);
          onClose();
        }
      }
    } catch (e: any) {
      setError(e?.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : (e?.message || 'Algo deu errado. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{modo === 'login' ? 'Entrar' : 'Criar conta'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tab-row" style={{ marginBottom: '1.2rem' }}>
            <button className={`p-tab ${modo === 'login' ? 'active' : ''}`} onClick={() => setModo('login')}>Já tenho conta</button>
            <button className={`p-tab ${modo === 'cadastro' ? 'active' : ''}`} onClick={() => setModo('cadastro')}>Criar conta</button>
          </div>

          {modo === 'cadastro' && (
            <>
              <div className="form-group">
                <label>Sou</label>
                <select value={role} onChange={e => setRole(e.target.value as Cargo)}>
                  {CARGOS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Nome completo</label>
                <input type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
              </div>

              {role === 'professor' && (
                <div className="form-group">
                  <label>Disciplina que você leciona</label>
                  <select value={disciplina} onChange={e => setDisciplina(e.target.value)}>
                    <optgroup label="Base Comum">
                      {disciplinas.filter(d => d.categoria === 'comum').map(d => <option key={d.nome} value={d.nome}>{d.nome}</option>)}
                    </optgroup>
                    <optgroup label="Base Técnica">
                      {disciplinas.filter(d => d.categoria === 'tecnica').map(d => <option key={d.nome} value={d.nome}>{d.nome}</option>)}
                    </optgroup>
                    <optgroup label="Parte Diversificada">
                      {disciplinas.filter(d => d.categoria === 'diversificada').map(d => <option key={d.nome} value={d.nome}>{d.nome}</option>)}
                    </optgroup>
                  </select>
                </div>
              )}

              {role === 'aluno' && (
                <>
                  <div className="form-group">
                    <label>Número de matrícula</label>
                    <input type="text" placeholder="Ex: 2026001234" value={matricula} onChange={e => setMatricula(e.target.value)} />
                  </div>
                  <div className="grid-3">
                    <div className="form-group">
                      <label>Curso</label>
                      <select value={curso} onChange={e => setCurso(e.target.value)}>
                        {CURSOS.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ano</label>
                      <select value={ano} onChange={e => setAno(Number(e.target.value))}>
                        {ANOS.map(a => <option key={a} value={a}>{a}º</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Turma</label>
                      <select value={turma} onChange={e => setTurma(e.target.value)}>
                        {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-group">
            <label>E-mail</label>
            <input type="email" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: '.8rem' }}>{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="p-btn p-btn-outline" onClick={onClose}>Cancelar</button>
          <button className="p-btn p-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
