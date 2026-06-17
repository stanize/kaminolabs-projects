import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProjectStatus = 'active' | 'backburner' | 'assets';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  last_worked_date: string; // date string, e.g. '2026-06-14'
  last_summary: string | null;
  next_step: string | null;
  hours_spent: number | null;
  created_at: string;
}
