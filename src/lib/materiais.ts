import { db } from "@/lib/supabase";

export type Material = {
  id: string;
  disciplina: string;
  tipo: 'pdf' | 'video';
  titulo: string;
  url: string;
  professor_id: string;
  created_at?: string;
};

export async function listarMateriais(disciplina: string): Promise<Material[]> {
  const { data, error } = await db
    .from('materiais')
    .select('*')
    .eq('disciplina', disciplina)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Material[];
}

export async function adicionarVideo(disciplina: string, titulo: string, url: string, professorId: string) {
  const { error } = await db.from('materiais').insert({
    disciplina, tipo: 'video', titulo, url, professor_id: professorId,
  });
  if (error) throw error;
}

export async function adicionarPdf(disciplina: string, titulo: string, arquivo: File, professorId: string) {
  const caminho = `${disciplina}/${Date.now()}-${arquivo.name}`;
  const { error: upErr } = await db.storage.from('materiais').upload(caminho, arquivo);
  if (upErr) throw upErr;

  const { data: urlData } = db.storage.from('materiais').getPublicUrl(caminho);

  const { error } = await db.from('materiais').insert({
    disciplina, tipo: 'pdf', titulo, url: urlData.publicUrl, professor_id: professorId,
  });
  if (error) throw error;
}

export async function removerMaterial(id: string) {
  const { error } = await db.from('materiais').delete().eq('id', id);
  if (error) throw error;
}
