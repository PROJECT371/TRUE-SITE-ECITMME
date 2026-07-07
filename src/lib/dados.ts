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
  aluno_nome?: string | null;
  created_at?: string;
};

export async function listarSolicitacoes(): Promise<SolicitacaoDB[]> {
  const { data, error } = await db.from('solicitacoes').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as SolicitacaoDB[];
}

export async function criarSolicitacao(tipo: string, alunoNome?: string) {
  const { error } = await db.from('solicitacoes').insert({ tipo, aluno_nome: alunoNome || null });
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
  tipo: 'aviso' | 'pdf' | 'video';
  texto: string;
  url: string | null;
  professor_id: string | null;
  professor_nome: string | null;
  created_at?: string;
};

export async function listarAvisosSalas(): Promise<AvisoSalaDB[]> {
  const { data, error } = await db.from('avisos_salas').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as AvisoSalaDB[];
}

export async function criarAvisoSala(
  salaId: string,
  texto: string,
  extra?: { tipo?: 'aviso' | 'pdf' | 'video'; url?: string; professorId?: string; professorNome?: string }
) {
  const { error } = await db.from('avisos_salas').insert({
    sala_id: salaId,
    texto,
    tipo: extra?.tipo || 'aviso',
    url: extra?.url || null,
    professor_id: extra?.professorId || null,
    professor_nome: extra?.professorNome || null,
  });
  if (error) throw error;
}

export async function uploadMaterialSala(salaId: string, arquivo: File): Promise<string> {
  const caminho = `salas/${salaId}/${Date.now()}-${arquivo.name}`;
  const { error } = await db.storage.from('materiais').upload(caminho, arquivo);
  if (error) throw error;
  const { data } = db.storage.from('materiais').getPublicUrl(caminho);
  return data.publicUrl;
}

export async function removerAvisoSala(id: string) {
  const { error } = await db.from('avisos_salas').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Horários de aula ================= */
export type HorarioDB = {
  id: string;
  turma_id: string;
  dia: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex';
  horario: string;
  disciplina: string;
  sala: string | null;
  professor: string | null;
  ordem: number;
};

export async function listarHorarios(turmaId?: string): Promise<HorarioDB[]> {
  let query = db.from('horarios').select('*').order('ordem', { ascending: true });
  if (turmaId) query = query.eq('turma_id', turmaId);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as HorarioDB[];
}

export async function criarHorario(h: Omit<HorarioDB, 'id'>) {
  const { error } = await db.from('horarios').insert(h);
  if (error) throw error;
}

export async function removerHorario(id: string) {
  const { error } = await db.from('horarios').delete().eq('id', id);
  if (error) throw error;
}

/* ================= Participação em Clubes ================= */
export type MembroClube = {
  id: string;
  clube_id: string;
  aluno_id: string;
  aluno_nome: string;
};

export async function listarMembrosClube(): Promise<MembroClube[]> {
  const { data, error } = await db.from('clube_membros').select('*');
  if (error || !data) return [];
  return data as MembroClube[];
}

export async function entrarClube(clubeId: string, alunoId: string, alunoNome: string) {
  const { error } = await db.from('clube_membros').insert({ clube_id: clubeId, aluno_id: alunoId, aluno_nome: alunoNome });
  if (error) throw error;
}

export async function sairClube(clubeId: string, alunoId: string) {
  const { error } = await db.from('clube_membros').delete().eq('clube_id', clubeId).eq('aluno_id', alunoId);
  if (error) throw error;
}
