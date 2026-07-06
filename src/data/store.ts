export const store = {
  provas: [
    { disc: 'Matemática',  turma: '1a', data: '2025-06-10', hora: '07:30', tipo: 'Prova Bimestral', obs: 'Funções e gráficos' },
    { disc: 'Português',   turma: '2a', data: '2025-06-11', hora: '09:00', tipo: 'Prova Mensal',    obs: 'Interpretação textual' },
    { disc: 'Química',     turma: '3a', data: '2025-06-13', hora: '07:30', tipo: 'Prova Bimestral', obs: 'Equilíbrio químico' },
    { disc: 'História',    turma: '1a', data: '2025-06-17', hora: '09:00', tipo: 'Prova Mensal',    obs: 'Brasil colonial' },
    { disc: 'Biologia',    turma: '2a', data: '2025-06-18', hora: '07:30', tipo: 'Trabalho',        obs: 'Genética e hereditariedade' },
    { disc: 'Física',      turma: '3a', data: '2025-06-20', hora: '09:00', tipo: 'Prova Bimestral', obs: 'Eletromagnetismo' },
    { disc: 'Inglês',      turma: '1a', data: '2025-06-24', hora: '11:00', tipo: 'Seminário',       obs: 'Oral presentation' },
  ],
  avisos: [
    { titulo: 'Reunião de Pais e Mestres', cat: 'comunicados', desc: 'Realizada no dia 15/06 às 14h no auditório da escola. Presença obrigatória.', data: '2025-06-03', prioridade: 'urgente' },
    { titulo: 'Matrículas 2026 abertas',   cat: 'matricula',   desc: 'Documentos necessários: certidão de nascimento, comprovante de residência e histórico escolar.', data: '2025-06-01', prioridade: 'info' },
    { titulo: 'Entrega de boletins',       cat: 'documentos',  desc: 'Os boletins do 1º bimestre serão entregues na sexta-feira às 12h.', data: '2025-05-30', prioridade: 'normal' },
    { titulo: 'Passeio cultural',          cat: 'pais',        desc: 'Visita ao museu de Mamanguape no dia 25/06. Autorização até 20/06.', data: '2025-05-28', prioridade: 'normal' },
  ],
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
  cardapio: {
    almoco: [
      { dia: 'Segunda-feira', prato: 'Frango grelhado',   acomp: 'Arroz, feijão, salada mista, suco de tamarindo',          nut: '680 kcal · Proteínas: 42g' },
      { dia: 'Terça-feira',   prato: 'Peixe assado',      acomp: 'Macaxeira cozida, salada de repolho, suco de acerola',     nut: '620 kcal · Ômega-3 alto' },
      { dia: 'Quarta-feira',  prato: 'Carne de sol',      acomp: 'Arroz, feijão verde, farofa, sumo de manga',               nut: '720 kcal · Ferro: alto' },
      { dia: 'Quinta-feira',  prato: 'Frango ensopado',   acomp: 'Macarrão, salada de tomate, suco de caju',                 nut: '650 kcal · Proteínas: 38g' },
      { dia: 'Sexta-feira',   prato: 'Feijão com carne',  acomp: 'Arroz, couve refogada, suco de pitanga',                   nut: '600 kcal · Fibras: alto' },
    ],
    lanche: [
      { dia: 'Segunda-feira', prato: 'Pão de forma com margarina', acomp: 'Leite com achocolatado', nut: '320 kcal' },
      { dia: 'Terça-feira',   prato: 'Tapioca',                    acomp: 'Suco de maracujá',        nut: '280 kcal' },
      { dia: 'Quarta-feira',  prato: 'Mingau de aveia',            acomp: 'Fruta da estação',         nut: '300 kcal' },
      { dia: 'Quinta-feira',  prato: 'Biscoito integral',          acomp: 'Iogurte natural',          nut: '260 kcal' },
      { dia: 'Sexta-feira',   prato: 'Bolo de fubá',               acomp: 'Suco de goiaba',           nut: '350 kcal' },
    ],
  },
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

export type Evento = {
  id: number;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  cat: string;
  desc: string;
  cor: string;
};

let _eventoId = 5;

export const eventos: Evento[] = [
  { id: 1, titulo: 'Festa Junina ECIT 2025',        data: '2025-06-28', hora: '08:00', local: 'Pátio central',     cat: 'cultural',   desc: 'Festa tradicional com quadrilha, comidas típicas, apresentações musicais e brincadeiras para toda a comunidade escolar.', cor: '#e8b84b' },
  { id: 2, titulo: 'Feira de Ciências',              data: '2025-07-10', hora: '08:00', local: 'Ginásio',           cat: 'academico',  desc: 'Exposição dos projetos científicos desenvolvidos pelos alunos durante o 1º semestre. Abertura para a comunidade.', cor: '#2e7d52' },
  { id: 3, titulo: 'Semana do Meio Ambiente',        data: '2025-06-16', hora: '07:30', local: 'Sala de aula',      cat: 'social',     desc: 'Semana de atividades sobre sustentabilidade, reciclagem e preservação ambiental com palestras e atividades práticas.', cor: '#1e6fa0' },
  { id: 4, titulo: 'Reunião de Pais e Mestres',      data: '2025-06-15', hora: '14:00', local: 'Auditório',         cat: 'reuniao',    desc: 'Reunião bimestral para entrega de boletins e discussão sobre o desempenho dos alunos. Presença obrigatória.', cor: '#c9993a' },
  { id: 5, titulo: 'Encerramento do Interclasse',   data: '2025-07-05', hora: '08:00', local: 'Quadra principal',  cat: 'esporte',    desc: 'Finais do Interclasse 2025 com premiação dos campeões e apresentações culturais.', cor: '#7c3aed' },
];

export function addEvento(e: Omit<Evento, 'id'>) {
  _eventoId++;
  eventos.push({ ...e, id: _eventoId });
}

export function removeEvento(id: number) {
  const idx = eventos.findIndex(e => e.id === id);
  if (idx >= 0) eventos.splice(idx, 1);
}

export type Prova     = (typeof store.provas)[number];
export type Aviso     = (typeof store.avisos)[number];
export type Conteudo  = (typeof store.conteudos)[number];
export type Livro     = (typeof store.livros)[number];
export type Time      = (typeof store.interclasse.times)[number];
export type Jogo      = (typeof store.interclasse.jogos)[number];
export type Atleta    = (typeof store.interclasse.atletas)[number];
export type MenuItem  = (typeof store.cardapio.almoco)[number];

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

