import { db } from "@/lib/supabase";

/* ================= Eventos ================= */
export type EventoDB = {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  categoria: string;
  descricao: string;
  cor: string;
};

export async function listarEventos(): Promise<EventoDB[]> {
  const { data, error } = await db.from('eventos').select('*').order('data', { ascending: true });
  if (error || !data) return [];
  return data as EventoDB[];
}

export async function criarEvento(e: Omit<EventoDB, 'id'>) {
  const { error } = await db.from('eventos').insert(e);
  if (error) throw error;
}

export async function removerEvento(id: string) {
  const { error } = await db.from('eventos').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Provas ================= */
export type ProvaDB = {
  id: string;
  disciplina: string;
  turma: string;
  data: string;
  hora: string;
  tipo: string;
  obs: string;
};

export async function listarProvas(): Promise<ProvaDB[]> {
  const { data, error } = await db.from('provas').select('*').order('data', { ascending: true });
  if (error || !data) return [];
  return data as ProvaDB[];
}

export async function criarProva(p: Omit<ProvaDB, 'id'>) {
  const { error } = await db.from('provas').insert(p);
  if (error) throw error;
}

export async function removerProva(id: string) {
  const { error } = await db.from('provas').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Avisos (Secretaria) ================= */
export type AvisoDB = {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  data: string;
  prioridade: string;
};

export async function listarAvisos(): Promise<AvisoDB[]> {
  const { data, error } = await db.from('avisos').select('*').order('data', { ascending: false });
  if (error || !data) return [];
  return data as AvisoDB[];
}

export async function criarAviso(a: Omit<AvisoDB, 'id'>) {
  const { error } = await db.from('avisos').insert(a);
  if (error) throw error;
}

export async function removerAviso(id: string) {
  const { error } = await db.from('avisos').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Clubes ================= */
export type ClubeDB = {
  id: string;
  nome: string;
  professor: string;
  horario: string;
  integrantes: number;
};

export async function listarClubes(): Promise<ClubeDB[]> {
  const { data, error } = await db.from('clubes').select('*').order('nome', { ascending: true });
  if (error || !data) return [];
  return data as ClubeDB[];
}

export async function criarClube(c: Omit<ClubeDB, 'id'>) {
  const { error } = await db.from('clubes').insert(c);
  if (error) throw error;
}

export async function removerClube(id: string) {
  const { error } = await db.from('clubes').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Solicitações (Secretaria) ================= */
export type SolicitacaoDB = {
  id: string;
  tipo: string;
  status: 'em análise' | 'aprovado' | 'finalizado';
  created_at?: string;
};

export async function listarSolicitacoes(): Promise<SolicitacaoDB[]> {
  const { data, error } = await db.from('solicitacoes').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as SolicitacaoDB[];
}

export async function criarSolicitacao(tipo: string) {
  const { error } = await db.from('solicitacoes').insert({ tipo });
  if (error) throw error;
}

export async function atualizarStatusSolicitacao(id: string, status: SolicitacaoDB['status']) {
  const { error } = await db.from('solicitacoes').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function removerSolicitacao(id: string) {
  const { error } = await db.from('solicitacoes').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Avisos por sala ================= */
export type AvisoSalaDB = {
  id: string;
  sala_id: string;
  texto: string;
  created_at?: string;
};

export async function listarAvisosSalas(): Promise<AvisoSalaDB[]> {
  const { data, error } = await db.from('avisos_salas').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as AvisoSalaDB[];
}

export async function criarAvisoSala(salaId: string, texto: string) {
  const { error } = await db.from('avisos_salas').insert({ sala_id: salaId, texto });
  if (error) throw error;
}

export async function removerAvisoSala(id: string) {
  const { error } = await db.from('avisos_salas').delete().eq('id', id);
  if (error) throw error;
}
