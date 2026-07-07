import { db } from "@/lib/supabase";

export type Perfil = {
  id: string;
  nome: string;
  role: 'professor';
  disciplina: string | null;
  turma: string | null;
};

export async function cadastrar(nome: string, email: string, senha: string, disciplina: string) {
  const { data, error } = await db.auth.signUp({ email, password: senha });
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) throw new Error('Não foi possível criar a conta.');

  const { error: perr } = await db.from('profiles').insert({
    id: uid,
    nome,
    role: 'professor',
    disciplina,
  });
  if (perr) throw perr;
  return uid;
}

export async function entrar(email: string, senha: string) {
  const { data, error } = await db.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  return data.user;
}

export async function sair() {
  await db.auth.signOut();
}

export async function buscarPerfil(uid: string): Promise<Perfil | null> {
  const { data, error } = await db.from('profiles').select('*').eq('id', uid).maybeSingle();
  if (error || !data) return null;
  return data as Perfil;
}
