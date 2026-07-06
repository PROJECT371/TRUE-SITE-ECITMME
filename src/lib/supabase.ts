import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lvverofpxhfpwpzueqxf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_A-dN4r3iX3q-kqywELQAug_xeTqxbmK';

export const db = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface Livro {
  id: string;
  title: string;
  author: string;
  total: number;
  available: number;
}

export interface Emprestimo {
  id: string;
  name: string;
  book_id: string;
  book_title: string;
  date_due: string;
  returned: boolean;
  created_at?: string;
}
