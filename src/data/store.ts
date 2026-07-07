export const store = {
  conteudos: [
    { disc: 'Matemática', serie: '1a', bim: '1º Bimestre', prof: 'Prof. Carlos',   conteudo: 'Conjuntos, Funções, Domínio e Imagem, Função linear' },
    { disc: 'Português',  serie: '1a', bim: '1º Bimestre', prof: 'Profª. Ana',     conteudo: 'Interpretação textual, Ortografia, Figuras de linguagem' },
    { disc: 'Biologia',   serie: '1a', bim: '1º Bimestre', prof: 'Prof. Rafael',   conteudo: 'Célula, Membrana plasmática, Mitose e Meiose' },
    { disc: 'Química',    serie: '2a', bim: '1º Bimestre', prof: 'Profª. Lúcia',   conteudo: 'Ligações químicas, Geometria molecular, Polaridade' },
    { disc: 'Física',     serie: '2a', bim: '1º Bimestre', prof: 'Prof. Diego',    conteudo: 'Cinemática, MRU, MRUV, Queda livre' },
    { disc: 'História',   serie: '2a', bim: '1º Bimestre', prof: 'Prof. Marcos',   conteudo: 'Brasil imperial, Abolição da escravidão, República Velha' },
    { disc: 'Filosofia',  serie: '3a', bim: '1º Bimestre', prof: 'Profª. Clara',   conteudo: 'Ética e política, Contratualismo, Kant e a moral' },
    { disc: 'Sociologia', serie: '3a', bim: '1º Bimestre', prof: 'Prof. João',     conteudo: 'Estrutura social, Classes e mobilidade, Globalização' },
    { disc: 'Inglês',     serie: '3a', bim: '1º Bimestre', prof: 'Profª. Beatriz', conteudo: 'Simple Past, Present Perfect, Reading comprehension' },
  ],
  interclasse: {
    times: [
      { nome: 'Tubarões 2ºA', pts: 12, v: 4, e: 0, d: 0, gf: 18, gc: 4  },
      { nome: 'Leões 3ºB',    pts: 9,  v: 3, e: 0, d: 1, gf: 12, gc: 7  },
      { nome: 'Falcões 1ºA',  pts: 7,  v: 2, e: 1, d: 1, gf: 10, gc: 9  },
      { nome: 'Cobras 3ºA',   pts: 4,  v: 1, e: 1, d: 2, gf: 8,  gc: 12 },
      { nome: 'Panteras 2ºB', pts: 3,  v: 1, e: 0, d: 3, gf: 6,  gc: 14 },
      { nome: 'Raposas 1ºB',  pts: 1,  v: 0, e: 1, d: 3, gf: 5,  gc: 13 },
    ],
    jogos: [
      { a: 'Tubarões 2ºA', b: 'Leões 3ºB',   data: '2025-06-20', hora: '08:00', mod: 'Futsal',   local: 'Quadra principal', placar: '–' },
      { a: 'Falcões 1ºA',  b: 'Cobras 3ºA',  data: '2025-06-20', hora: '10:00', mod: 'Vôlei',    local: 'Quadra coberta',   placar: '–' },
      { a: 'Panteras 2ºB', b: 'Raposas 1ºB', data: '2025-06-21', hora: '08:00', mod: 'Basquete', local: 'Quadra principal', placar: '–' },
      { a: 'Tubarões 2ºA', b: 'Falcões 1ºA', data: '2025-06-21', hora: '10:00', mod: 'Futsal',   local: 'Quadra principal', placar: '–' },
    ],
    atletas: [
      { nome: 'Gabriel S.',  turma: '2ºA', esporte: 'Futsal',   stat: '12 gols',    ini: 'G' },
      { nome: 'Raíssa M.',   turma: '3ºB', esporte: 'Vôlei',    stat: '45 pontos',  ini: 'R' },
      { nome: 'Lucas P.',    turma: '1ºA', esporte: 'Basquete', stat: '87 pts',     ini: 'L' },
      { nome: 'Juliana F.',  turma: '3ºA', esporte: 'Futsal',   stat: '9 gols',     ini: 'J' },
      { nome: 'Thiago N.',   turma: '2ºB', esporte: 'Handebol', stat: '22 gols',    ini: 'T' },
      { nome: 'Fernanda C.', turma: '1ºB', esporte: 'Vôlei',    stat: '38 pontos',  ini: 'F' },
    ],
  },
  livros: [
    { titulo: 'Dom Casmurro',              autor: 'Machado de Assis',  genero: 'literatura', qtd: 3,  disp: 2 },
    { titulo: 'O Cortiço',                 autor: 'Aluísio Azevedo',   genero: 'literatura', qtd: 2,  disp: 1 },
    { titulo: 'Química Orgânica',          autor: 'Solomons & Fryhle', genero: 'ciencias',   qtd: 5,  disp: 4 },
    { titulo: 'Biologia Moderna',          autor: 'Amabis & Martho',   genero: 'ciencias',   qtd: 6,  disp: 5 },
    { titulo: 'História do Brasil',        autor: 'Boris Fausto',      genero: 'historia',   qtd: 4,  disp: 3 },
    { titulo: 'Fundamentos de Matemática', autor: 'Iezzi & Murakami',  genero: 'matematica', qtd: 8,  disp: 6 },
    { titulo: 'A Moreninha',               autor: 'Joaquim Manuel',    genero: 'literatura', qtd: 3,  disp: 2 },
    { titulo: 'Física Conceitual',         autor: 'Paul Hewitt',       genero: 'ciencias',   qtd: 4,  disp: 3 },
    { titulo: 'Atlas Geográfico',          autor: 'IBGE',              genero: 'outros',     qtd: 10, disp: 8 },
    { titulo: 'Ensaio sobre a Cegueira',   autor: 'José Saramago',     genero: 'literatura', qtd: 2,  disp: 0 },
  ],
};

export type Conteudo  = (typeof store.conteudos)[number];
export type Livro     = (typeof store.livros)[number];
export type Time      = (typeof store.interclasse.times)[number];
export type Jogo      = (typeof store.interclasse.jogos)[number];
export type Atleta    = (typeof store.interclasse.atletas)[number];

export function fmtDate(iso: string) {
  const [, m, d] = iso.split('-');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d}/${months[parseInt(m) - 1]}`;
}

export function turmaNome(t: string) {
  if (t === '1a') return '1º Ano';
  if (t === '2a') return '2º Ano';
  return '3º Ano';
}

/* ================= Disciplinas ================= */
export type Disciplina = {
  nome: string;
  categoria: 'comum' | 'tecnica' | 'diversificada';
  professor: string;
  horario: string;
  cor: string;
  conteudo: string[];
  atividades: string[];
};

const SEM_INFO = 'A definir';

export let disciplinas: Disciplina[] = [
  // Base Comum
  { nome: 'Arte', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#c9993a', conteudo: [], atividades: [] },
  { nome: 'Biologia', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#2e7d52', conteudo: [], atividades: [] },
  { nome: 'Educação Física', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#dc2626', conteudo: [], atividades: [] },
  { nome: 'Filosofia', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#7c3aed', conteudo: [], atividades: [] },
  { nome: 'Física', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#1e6fa0', conteudo: [], atividades: [] },
  { nome: 'Geografia', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#0d9488', conteudo: [], atividades: [] },
  { nome: 'História', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#b45309', conteudo: [], atividades: [] },
  { nome: 'Língua Portuguesa', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#be185d', conteudo: [], atividades: [] },
  { nome: 'Língua Espanhola', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#ea580c', conteudo: [], atividades: [] },
  { nome: 'Língua Inglesa', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#0284c7', conteudo: [], atividades: [] },
  { nome: 'Matemática', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#4338ca', conteudo: [], atividades: [] },
  { nome: 'Química', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#65a30d', conteudo: [], atividades: [] },
  { nome: 'Sociologia', categoria: 'comum', professor: SEM_INFO, horario: SEM_INFO, cor: '#9333ea', conteudo: [], atividades: [] },

  // Base Técnica
  { nome: 'Arquitetura de Hardware', categoria: 'tecnica', professor: SEM_INFO, horario: SEM_INFO, cor: '#0f3e9e', conteudo: [], atividades: [] },
  { nome: 'Sistemas Operacionais', categoria: 'tecnica', professor: SEM_INFO, horario: SEM_INFO, cor: '#0f766e', conteudo: [], atividades: [] },
  { nome: 'Introdução à Informática', categoria: 'tecnica', professor: SEM_INFO, horario: SEM_INFO, cor: '#1d4ed8', conteudo: [], atividades: [] },
  { nome: 'Lógica de Programação', categoria: 'tecnica', professor: SEM_INFO, horario: SEM_INFO, cor: '#7e22ce', conteudo: [], atividades: [] },

  // Parte Diversificada
  { nome: 'Produção de Texto', categoria: 'diversificada', professor: SEM_INFO, horario: SEM_INFO, cor: '#c2410c', conteudo: [], atividades: [] },
  { nome: 'Práticas Integradoras I', categoria: 'diversificada', professor: SEM_INFO, horario: SEM_INFO, cor: '#b91c1c', conteudo: [], atividades: [] },
  { nome: 'Práticas Integradoras II', categoria: 'diversificada', professor: SEM_INFO, horario: SEM_INFO, cor: '#a16207', conteudo: [], atividades: [] },
  { nome: 'Recomposição da Aprendizagem Matemática e Língua Portuguesa', categoria: 'diversificada', professor: SEM_INFO, horario: SEM_INFO, cor: '#15803d', conteudo: [], atividades: [] },
];

export function addDisciplina(d: Disciplina) { disciplinas.push(d); }
export function removeDisciplina(i: number) { disciplinas.splice(i, 1); }

/* ================= Salas por curso, ano e turma ================= */
export const CURSOS = [
  { slug: 'agro', nome: 'Agronegócio' },
  { slug: 'info', nome: 'Informática' },
  { slug: 'jogos', nome: 'Programação de Jogos Digitais' },
];
export const ANOS = [1, 2, 3];
export const TURMAS = ['A', 'B'];

export function salaId(cursoSlug: string, ano: number, turma: string) {
  return `${cursoSlug}${ano}${turma}`;
}

