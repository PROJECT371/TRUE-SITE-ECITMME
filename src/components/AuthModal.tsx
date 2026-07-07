import { useState } from "react";
import { cadastrar, entrar } from "@/lib/auth";
import { disciplinas } from "@/data/store";

interface Props {
  onClose: () => void;
  onLogged: (uid: string) => void;
  onToast: (msg: string) => void;
}

export default function AuthModal({ onClose, onLogged, onToast }: Props) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [disciplina, setDisciplina] = useState(disciplinas[0]?.nome || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (!email || !senha) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    try {
      if (modo === 'cadastro') {
        if (!nome) { setError('Informe seu nome.'); setLoading(false); return; }
        const uid = await cadastrar(nome, email, senha, disciplina);
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
          <h3>{modo === 'login' ? 'Entrar' : 'Criar conta de professor(a)'}</h3>
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
                <label>Nome completo</label>
                <input type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
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
