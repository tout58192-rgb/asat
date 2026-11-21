import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  url && url.trim().length > 0 && key && key.trim().length > 0,
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!.trim(), key!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
