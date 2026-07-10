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

/* ================= Horário de aula (PDF) ================= */
export type HorarioPdfDB = {
  id: string;
  url: string;
  nome_arquivo: string;
  created_at?: string;
};

export async function buscarHorarioAtual(): Promise<HorarioPdfDB | null> {
  const { data, error } = await db
    .from('horario_pdf')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as HorarioPdfDB;
}

export async function enviarHorarioPdf(arquivo: File): Promise<void> {
  const caminho = `horarios/${Date.now()}-${arquivo.name}`;
  const { error: upErr } = await db.storage.from('materiais').upload(caminho, arquivo);
  if (upErr) throw upErr;

  const { data: urlData } = db.storage.from('materiais').getPublicUrl(caminho);

  const { error } = await db.from('horario_pdf').insert({
    url: urlData.publicUrl,
    nome_arquivo: arquivo.name,
  });
  if (error) throw error;
}

export async function removerHorarioPdf(id: string): Promise<void> {
  const { error } = await db.from('horario_pdf').delete().eq('id', id);
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

/* ================= Galeria de fotos ================= */
export type FotoDB = {
  id: string;
  url: string;
  legenda: string | null;
  created_at?: string;
};

export async function listarFotos(): Promise<FotoDB[]> {
  const { data, error } = await db.from('galeria_fotos').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as FotoDB[];
}

export async function enviarFoto(arquivo: File, legenda: string): Promise<void> {
  const caminho = `galeria/${Date.now()}-${arquivo.name}`;
  const { error: upErr } = await db.storage.from('materiais').upload(caminho, arquivo);
  if (upErr) throw upErr;

  const { data: urlData } = db.storage.from('materiais').getPublicUrl(caminho);

  const { error } = await db.from('galeria_fotos').insert({
    url: urlData.publicUrl,
    legenda: legenda || null,
  });
  if (error) throw error;
}

export async function removerFoto(id: string): Promise<void> {
  const { error } = await db.from('galeria_fotos').delete().eq('id', id);
  if (error) throw error;
}
